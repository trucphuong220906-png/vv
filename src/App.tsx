/**
 * VẾT VIỆT – Một Chút Việt, Một Chút Thương
 * Contemporary Vietnamese Cultural Souvenirs & Gifts
 * Full-Stack Storefront & Shared Backend Persistent Admin Portal
 */

import { useState, useEffect, useCallback } from 'react';
import { PRODUCTS, CULTURE_STORIES, Product, CultureStory } from './data/vetvietData';
import { Order, ContactInquiry, OrderStatus, PaymentStatus, InquiryStatus } from './types/adminTypes';
import * as api from './services/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BrandValues } from './components/BrandValues';
import { ProductsSection } from './components/ProductsSection';
import { CultureSection } from './components/CultureSection';
import { QrShowcase } from './components/QrShowcase';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

// Modals & Drawers
import { CartDrawer, CartItem } from './components/modals/CartDrawer';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { StoryDetailModal } from './components/modals/StoryDetailModal';
import { QrModal } from './components/modals/QrModal';
import { ContactModal } from './components/modals/ContactModal';

// Admin Components
import { AdminPortal } from './components/admin/AdminPortal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { LayoutDashboard } from 'lucide-react';

export default function App() {
  // Storefront & Admin Synchronized State with Real Backend Storage
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('vetviet_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (parsed.some((p) => p.id === 'sp-dankim')) {
          return parsed;
        }
      }
      return PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  const [cultureStories, setCultureStories] = useState<CultureStory[]>(() => {
    try {
      const saved = localStorage.getItem('vetviet_stories');
      return saved ? JSON.parse(saved) : CULTURE_STORIES;
    } catch {
      return CULTURE_STORIES;
    }
  });

  // Real orders from shared backend database
  const [orders, setOrders] = useState<Order[]>([]);
  // Real contact inquiries from shared backend database
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('vetviet_admin_session') === 'true';
  });
  const [isAdminViewActive, setIsAdminViewActive] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);

  // Sync data with shared backend API
  const syncWithBackend = useCallback(async () => {
    try {
      const [fetchedOrders, fetchedInquiries] = await Promise.all([
        api.fetchOrders(),
        api.fetchInquiries(),
      ]);
      setOrders(fetchedOrders);
      setInquiries(fetchedInquiries);
    } catch (err) {
      console.error('Error syncing with backend database:', err);
    }
  }, []);

  // Initial fetch and remove any stale localStorage mock data
  useEffect(() => {
    try {
      localStorage.removeItem('vetviet_orders');
      localStorage.removeItem('vetviet_inquiries');
    } catch {
      // ignore
    }
    syncWithBackend();
  }, [syncWithBackend]);

  // Periodic polling so Admin updates immediately when any customer places an order
  useEffect(() => {
    const timer = setInterval(() => {
      // Sync every 4 seconds
      syncWithBackend();
    }, 4000);
    return () => clearInterval(timer);
  }, [syncWithBackend]);

  // Product and culture persistence
  useEffect(() => {
    try {
      localStorage.setItem('vetviet_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('vetviet_stories', JSON.stringify(cultureStories));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }, [cultureStories]);

  // Shopping Cart State (Empty by default)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedStoryForDetail, setSelectedStoryForDetail] = useState<CultureStory | null>(null);
  const [selectedProductForQr, setSelectedProductForQr] = useState<Product | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Cart Management
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  // Real Order Creation (Customer -> Backend Database -> Admin)
  const handleOrderCreated = async (savedOrder: Order) => {
    try {
      // Immediately refresh orders from backend database
      const updated = await api.fetchOrders();
      setOrders(updated);
    } catch (err) {
      console.error('Failed to sync orders after creation:', err);
      // Fallback local update
      setOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)]);
    }
  };

  // Order Status Updates from Admin
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    newPaymentStatus?: PaymentStatus
  ) => {
    try {
      await api.updateOrderStatus(orderId, newStatus, newPaymentStatus);
      const updated = await api.fetchOrders();
      setOrders(updated);
    } catch (err) {
      console.error('Failed to update order status on server:', err);
      // Fallback local update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId || o.code === orderId
            ? { ...o, orderStatus: newStatus, status: newStatus, ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}) }
            : o
        )
      );
    }
  };

  // Order Deletion from Admin
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await api.deleteOrder(orderId);
      const updated = await api.fetchOrders();
      setOrders(updated);
    } catch (err) {
      console.error('Failed to delete order on server:', err);
      setOrders((prev) => prev.filter((o) => o.id !== orderId && o.code !== orderId));
    }
  };

  // Real Inquiry Creation (Customer -> Backend Database -> Admin)
  const handleInquiryCreated = async (newInquiry: ContactInquiry) => {
    try {
      await api.createInquiry(newInquiry);
      const updated = await api.fetchInquiries();
      setInquiries(updated);
    } catch (err) {
      console.error('Failed to create inquiry on server:', err);
      setInquiries((prev) => [newInquiry, ...prev]);
    }
  };

  // Inquiry Status Updates from Admin
  const handleUpdateInquiryStatus = async (
    id: string,
    status: InquiryStatus,
    adminNote?: string
  ) => {
    try {
      await api.updateInquiryStatus(id, status, adminNote);
      const updated = await api.fetchInquiries();
      setInquiries(updated);
    } catch (err) {
      console.error('Failed to update inquiry status on server:', err);
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status, adminNote } : i))
      );
    }
  };

  // Inquiry Deletion from Admin
  const handleDeleteInquiry = async (id: string) => {
    try {
      await api.deleteInquiry(id);
      const updated = await api.fetchInquiries();
      setInquiries(updated);
    } catch (err) {
      console.error('Failed to delete inquiry on server:', err);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // Reset Actions
  const handleClearOrders = async () => {
    try {
      await api.clearAllOrders();
      setOrders([]);
    } catch (err) {
      console.error('Failed to clear orders on server:', err);
      setOrders([]);
    }
  };

  const handleClearInquiries = async () => {
    try {
      await api.clearAllInquiries();
      setInquiries([]);
    } catch (err) {
      console.error('Failed to clear inquiries on server:', err);
      setInquiries([]);
    }
  };

  const handleResetDefaultData = async () => {
    await Promise.all([handleClearOrders(), handleClearInquiries()]);
    localStorage.removeItem('vetviet_products');
    localStorage.removeItem('vetviet_stories');
    setProducts(PRODUCTS);
    setCultureStories(CULTURE_STORIES);
  };

  const handleOpenAdminTrigger = () => {
    syncWithBackend();
    if (isAdminLoggedIn) {
      setIsAdminViewActive(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('vetviet_admin_session', 'true');
    setIsAdminLoginModalOpen(false);
    setIsAdminViewActive(true);
    // Refresh latest data from backend on login
    syncWithBackend();
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('vetviet_admin_session');
    setIsAdminViewActive(false);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToQrStory = () => {
    const el = document.getElementById('qr-story');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // If Admin View is active, render the Admin Portal with shared backend data
  if (isAdminViewActive) {
    return (
      <AdminPortal
        products={products}
        orders={orders}
        inquiries={inquiries}
        cultureStories={cultureStories}
        onUpdateProducts={setProducts}
        onUpdateOrders={setOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onUpdateInquiries={setInquiries}
        onUpdateInquiryStatus={handleUpdateInquiryStatus}
        onDeleteInquiry={handleDeleteInquiry}
        onUpdateCultureStories={setCultureStories}
        onCloseAdmin={() => setIsAdminViewActive(false)}
        onLogout={handleLogout}
        onResetDefaultData={handleResetDefaultData}
        onClearOrders={handleClearOrders}
        onClearInquiries={handleClearInquiries}
        onRefreshData={syncWithBackend}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D1E18] flex flex-col font-sans selection:bg-[#C04A37]/20 selection:text-[#C04A37]">
      {/* Admin Quick Access Bar if logged in */}
      {isAdminLoggedIn && (
        <div className="bg-[#2D1E18] text-[#FAF7F2] py-2 px-4 text-xs flex items-center justify-between border-b border-[#4A3728]/30 sticky top-0 z-50 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">
              Bạn đang đăng nhập với tư cách <strong>Quản Trị Viên (Admin)</strong> · Cơ sở dữ liệu trực tuyến kết nối
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminViewActive(true)}
              className="px-2.5 py-1 bg-[#C04A37] hover:bg-[#9C3322] text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <LayoutDashboard className="w-3 h-3" />
              <span>Mở Trang Quản Trị</span>
            </button>
            <button
              onClick={handleLogout}
              className="text-[#FAF7F2]/70 hover:text-white text-[11px] underline"
            >
              Thoát
            </button>
          </div>
        </div>
      )}

      {/* Sticky Navigation Header */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onExploreProducts={scrollToProducts}
          onExploreQrStory={scrollToQrStory}
        />

        <BrandValues />

        <ProductsSection
          products={products}
          onSelectProduct={(p) => setSelectedProductForDetail(p)}
          onOpenQrModal={(p) => setSelectedProductForQr(p)}
          onAddToCart={(p) => handleAddToCart(p, 1)}
        />

        <CultureSection
          stories={cultureStories}
          onOpenStoryDetail={(s) => setSelectedStoryForDetail(s)}
        />

        <QrShowcase products={products} />

        <CallToAction
          onExploreProducts={scrollToProducts}
          onOpenContact={() => setIsContactOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
        onOrderCreated={handleOrderCreated}
      />

      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart}
      />

      <StoryDetailModal
        story={selectedStoryForDetail}
        onClose={() => setSelectedStoryForDetail(null)}
      />

      <QrModal
        product={selectedProductForQr}
        onClose={() => setSelectedProductForQr(null)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onInquiryCreated={handleInquiryCreated}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
