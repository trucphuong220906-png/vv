import React, { useState } from 'react';
import { Product, CultureStory, PRODUCTS, CULTURE_STORIES } from '../../data/vetvietData';
import { Order, OrderStatus, PaymentStatus, ContactInquiry, InquiryStatus } from '../../types/adminTypes';
import {
  BarChart3,
  Package,
  ShoppingBag,
  Sparkles,
  Mail,
  Settings,
  ArrowLeft,
  LogOut,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Tag,
  Music,
  ExternalLink,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  FileText,
  Phone,
  MapPin,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { playVietnameseMelody } from '../../utils/audioSynth';

interface AdminPortalProps {
  products: Product[];
  orders: Order[];
  inquiries: ContactInquiry[];
  cultureStories: CultureStory[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<void>;
  onDeleteOrder?: (orderId: string) => Promise<void>;
  onUpdateInquiries: (inquiries: ContactInquiry[]) => void;
  onUpdateInquiryStatus?: (id: string, status: InquiryStatus, note?: string) => Promise<void>;
  onDeleteInquiry?: (id: string) => Promise<void>;
  onUpdateCultureStories: (stories: CultureStory[]) => void;
  onCloseAdmin: () => void;
  onLogout: () => void;
  onResetDefaultData: () => void;
  onClearOrders?: () => Promise<void>;
  onClearInquiries?: () => Promise<void>;
  onRefreshData?: () => Promise<void>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  orders,
  inquiries,
  cultureStories,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateInquiries,
  onUpdateInquiryStatus,
  onDeleteInquiry,
  onUpdateCultureStories,
  onCloseAdmin,
  onLogout,
  onResetDefaultData,
  onClearOrders,
  onClearInquiries,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'stories' | 'inquiries' | 'settings'>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search & Filter States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);

  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Settings State
  const [newPin, setNewPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  // Audio testing in admin
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  // Helper date functions
  const isToday = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  const isCurrentMonth = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  };

  // ================= 100% REAL DASHBOARD CALCULATIONS (NO MOCK DATA) =================
  // 1. Đơn hoàn thành
  const completedOrdersList = orders.filter(
    (o) => (o.orderStatus || o.status) === 'completed'
  );

  // 2. Tổng doanh thu = tổng totalPrice của các đơn hàng thực tế có orderStatus = completed
  const totalRevenue = completedOrdersList.reduce(
    (sum, o) => sum + (o.totalPrice || o.totalAmount || 0),
    0
  );

  // 3. Tổng đơn hàng = số order thực tế
  const totalOrdersCount = orders.length;

  // 4. Đơn đang xử lý = số order có status pending/processing
  const processingOrdersCount = orders.filter((o) => {
    const st = o.orderStatus || o.status;
    return st === 'pending' || st === 'processing';
  }).length;

  // 5. Đơn hoàn thành = số order có status completed
  const completedOrdersCount = completedOrdersList.length;

  // 6. Doanh thu hôm nay = tổng đơn completed được tạo trong ngày hôm nay
  const todayRevenue = completedOrdersList
    .filter((o) => isToday(o.createdAt))
    .reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);

  // 7. Doanh thu tháng = tổng đơn completed trong tháng hiện tại
  const monthRevenue = completedOrdersList
    .filter((o) => isCurrentMonth(o.createdAt))
    .reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);

  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'unread').length;

  // 8. Top sản phẩm bán chạy (tính toán hoàn toàn từ các đơn hàng thực)
  const productSalesMap = new Map<string, { product: Product; soldCount: number; revenue: number }>();
  for (const ord of orders) {
    if ((ord.orderStatus || ord.status) === 'cancelled') continue;
    const items = ord.products || ord.items || [];
    for (const item of items) {
      if (!item.product) continue;
      const pid = item.product.id;
      const existing = productSalesMap.get(pid);
      const qty = item.quantity || 1;
      const price = item.price || item.product.price || 0;
      if (existing) {
        existing.soldCount += qty;
        existing.revenue += price * qty;
      } else {
        productSalesMap.set(pid, {
          product: item.product,
          soldCount: qty,
          revenue: price * qty,
        });
      }
    }
  }
  const topSellingProducts = Array.from(productSalesMap.values()).sort(
    (a, b) => b.soldCount - a.soldCount
  );

  // Order Management Handlers with Shared Backend Sync
  const handleUpdateOrderStatusState = async (orderId: string, newStatus: OrderStatus) => {
    if (onUpdateOrderStatus) {
      await onUpdateOrderStatus(orderId, newStatus);
    } else {
      const updated = orders.map((o) =>
        o.id === orderId || o.code === orderId
          ? { ...o, status: newStatus, orderStatus: newStatus }
          : o
      );
      onUpdateOrders(updated);
    }
    if (selectedOrderForDetail?.id === orderId || selectedOrderForDetail?.code === orderId) {
      setSelectedOrderForDetail((prev) =>
        prev ? { ...prev, status: newStatus, orderStatus: newStatus } : null
      );
    }
  };

  const handleDeleteOrderState = async (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này khỏi cơ sở dữ liệu?')) {
      if (onDeleteOrder) {
        await onDeleteOrder(orderId);
      } else {
        const updated = orders.filter((o) => o.id !== orderId && o.code !== orderId);
        onUpdateOrders(updated);
      }
      if (selectedOrderForDetail?.id === orderId || selectedOrderForDetail?.code === orderId) {
        setSelectedOrderForDetail(null);
      }
    }
  };

  // Product Management Handlers
  const handleToggleProductStock = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, inStock: !p.inStock } : p
    );
    onUpdateProducts(updated);
  };

  const handleToggleProductFeatured = (productId: string) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, featured: !p.featured } : p
    );
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const updated = products.filter((p) => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: 'sp-' + Date.now().toString().slice(-4),
      name: '',
      category: 'keychain',
      categoryLabel: 'Móc Khóa',
      price: 85000,
      originalPrice: 100000,
      image: '/assets/product_keychain_tuong.jpg',
      description: '',
      storySnippet: '',
      heritageOrigin: 'Nghệ Thuật Cổ Truyền Việt Nam',
      material: 'Đồng thau / Giấy Dó / Vải Canvas',
      dimensions: 'Chuẩn lưu niệm',
      inStock: true,
      featured: true,
      tags: ['Thủ công', 'Mới ra mắt'],
      qrStory: {
        title: 'Câu Chuyện Di Sản Tinh Tuyển',
        folkArt: 'Nghệ Thuật Dân Gian',
        region: 'Việt Nam',
        audioTitle: 'Thanh âm nhạc khí cổ truyền',
        audioDuration: '02:30',
        storyContent: 'Tích truyện lịch sử và ý nghĩa văn hóa ẩn sau mỗi nét tạo hình...',
        folkQuote: '“Nét xưa lưu lại, tình người bền lâu.”',
        funFact: 'Sản phẩm được chế tác hoàn toàn bởi nghệ nhân bản địa.',
      },
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;

    const exists = products.find((p) => p.id === editingProduct.id);
    let updated: Product[];
    if (exists) {
      updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    } else {
      updated = [editingProduct, ...products];
    }
    onUpdateProducts(updated);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Inquiry Handlers
  const handleUpdateInquiryStatusState = async (inquiryId: string, status: 'unread' | 'read' | 'replied') => {
    if (onUpdateInquiryStatus) {
      await onUpdateInquiryStatus(inquiryId, status);
    } else {
      const updated = inquiries.map((i) => (i.id === inquiryId ? { ...i, status } : i));
      onUpdateInquiries(updated);
    }
  };

  const handleDeleteInquiryState = async (inquiryId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thư liên hệ này?')) {
      if (onDeleteInquiry) {
        await onDeleteInquiry(inquiryId);
      } else {
        const updated = inquiries.filter((i) => i.id !== inquiryId);
        onUpdateInquiries(updated);
      }
    }
  };

  // Pin Change Handler
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      localStorage.setItem('vetviet_admin_pin', newPin.trim());
      setPinChangeMsg('Đã đổi mã PIN quản trị thành công!');
      setNewPin('');
      setTimeout(() => setPinChangeMsg(''), 3000);
    } else {
      setPinChangeMsg('Mã PIN cần tối thiểu 4 ký tự');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const code = (o.code || o.orderId || o.id || '').toLowerCase();
    const customer = (o.customerName || '').toLowerCase();
    const phone = (o.phoneNumber || o.phone || '');
    const search = orderSearch.toLowerCase();
    const matchesSearch = code.includes(search) || customer.includes(search) || phone.includes(search);
    const status = o.orderStatus || o.status || 'pending';
    const matchesStatus = orderStatusFilter === 'all' || status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.heritageOrigin.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#2D1E18] flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-[#2D1E18] text-[#FAF7F2] sticky top-0 z-40 border-b border-[#4A3728]/30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-xl sm:text-2xl text-[#DF6854] tracking-tight">
                VẾT VIỆT
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-[#FAF7F2]/10 text-xs font-mono text-[#FAF7F2]/80 border border-[#FAF7F2]/15">
                ADMIN PORTAL
              </span>
            </div>

            {/* Quick Actions: Storefront, Refresh & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              {onRefreshData && (
                <button
                  onClick={async () => {
                    if (isRefreshing) return;
                    setIsRefreshing(true);
                    try {
                      await onRefreshData();
                    } finally {
                      setTimeout(() => setIsRefreshing(false), 500);
                    }
                  }}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  title="Tải lại đơn hàng và số liệu mới nhất từ máy chủ"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#DF6854]' : ''}`} />
                  <span className="hidden sm:inline">{isRefreshing ? 'Đang đồng bộ...' : '↻ Làm Mới'}</span>
                </button>
              )}

              <button
                onClick={onCloseAdmin}
                className="px-3.5 py-1.5 bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                title="Quay lại giao diện khách hàng"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem Cửa Hàng</span>
              </button>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                title="Đăng xuất khỏi trang quản trị"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar pt-1 pb-2 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-[#C04A37] text-white shadow-xs'
                  : 'text-[#FAF7F2]/70 hover:text-white hover:bg-[#FAF7F2]/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Tổng Quan & Doanh Thu</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap relative ${
                activeTab === 'orders'
                  ? 'bg-[#C04A37] text-white shadow-xs'
                  : 'text-[#FAF7F2]/70 hover:text-white hover:bg-[#FAF7F2]/5'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Đơn Hàng</span>
              {processingOrdersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#DF6854] text-white rounded-full text-[10px] font-bold">
                  {processingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-[#C04A37] text-white shadow-xs'
                  : 'text-[#FAF7F2]/70 hover:text-white hover:bg-[#FAF7F2]/5'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Sản Phẩm ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stories')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'stories'
                  ? 'bg-[#C04A37] text-white shadow-xs'
                  : 'text-[#FAF7F2]/70 hover:text-white hover:bg-[#FAF7F2]/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Di Sản & QR Story ({cultureStories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-[#C04A37] text-white shadow-xs'
                  : 'text-[#FAF7F2]/70 hover:text-white hover:bg-[#FAF7F2]/5'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Liên Hệ & Đặt Sỉ</span>
              {unreadInquiriesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px] font-bold">
                  {unreadInquiriesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-[#C04A37] text-white shadow-xs'
                  : 'text-[#FAF7F2]/70 hover:text-white hover:bg-[#FAF7F2]/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Cài Đặt & Dữ Liệu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top 6 Metrics according to Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Metric 1: Tổng Doanh Thu (Completed) */}
              <div className="p-5 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#7A695C] font-medium uppercase tracking-wider">
                    Tổng Doanh Thu (Hoàn Tất)
                  </div>
                  <div className="text-2xl font-bold font-display text-[#C04A37] mt-1 tabular-nums">
                    {formatPrice(totalRevenue)}
                  </div>
                  <div className="text-[11px] mt-1 flex items-center gap-1">
                    {totalRevenue > 0 ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-medium">
                          Ghi nhận từ {completedOrdersCount} đơn hoàn thành
                        </span>
                      </>
                    ) : (
                      <span className="text-[#7A695C]">0₫ · Chưa có đơn hoàn thành</span>
                    )}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#C04A37]/10 text-[#C04A37] flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              {/* Metric 2: Doanh Thu Hôm Nay */}
              <div className="p-5 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#7A695C] font-medium uppercase tracking-wider">
                    Doanh Thu Hôm Nay
                  </div>
                  <div className="text-2xl font-bold font-display text-[#2D1E18] mt-1 tabular-nums">
                    {formatPrice(todayRevenue)}
                  </div>
                  <div className="text-[11px] text-[#7A695C] mt-1">
                    {todayRevenue > 0
                      ? 'Đơn hoàn thành trong ngày hôm nay'
                      : 'Chưa có đơn hoàn tất hôm nay'}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              {/* Metric 3: Doanh Thu Tháng Này */}
              <div className="p-5 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#7A695C] font-medium uppercase tracking-wider">
                    Doanh Thu Tháng Này
                  </div>
                  <div className="text-2xl font-bold font-display text-[#2D1E18] mt-1 tabular-nums">
                    {formatPrice(monthRevenue)}
                  </div>
                  <div className="text-[11px] text-[#7A695C] mt-1">
                    Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* Metric 4: Tổng Đơn Hàng Thực Tế */}
              <div className="p-5 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#7A695C] font-medium uppercase tracking-wider">
                    Tổng Số Đơn Hàng
                  </div>
                  <div className="text-2xl font-bold font-display text-[#2D1E18] mt-1 tabular-nums">
                    {totalOrdersCount}
                  </div>
                  <div className="text-[11px] text-[#7A695C] mt-1">
                    {totalOrdersCount === 0
                      ? '0 đơn hàng trong cơ sở dữ liệu'
                      : `${completedOrdersCount} hoàn tất · ${processingOrdersCount} đang xử lý`}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              {/* Metric 5: Đơn Đang Xử Lý */}
              <div className="p-5 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#7A695C] font-medium uppercase tracking-wider">
                    Đơn Đang Xử Lý
                  </div>
                  <div className="text-2xl font-bold font-display text-amber-700 mt-1 tabular-nums">
                    {processingOrdersCount}
                  </div>
                  <div className="text-[11px] text-[#7A695C] mt-1">
                    Đơn chờ duyệt và chuẩn bị đóng gói
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {/* Metric 6: Đơn Hoàn Thành */}
              <div className="p-5 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#7A695C] font-medium uppercase tracking-wider">
                    Đơn Hoàn Thành
                  </div>
                  <div className="text-2xl font-bold font-display text-emerald-700 mt-1 tabular-nums">
                    {completedOrdersCount}
                  </div>
                  <div className="text-[11px] text-emerald-600 mt-1">
                    Khách đã nhận quà & thanh toán đủ
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Pending Orders Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Pending Orders requiring action */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#2D1E18]">
                      Đơn Hàng Gần Đây Cần Xử Lý
                    </h3>
                    <p className="text-xs text-[#7A695C]">
                      Dữ liệu thực tế được lưu vào cơ sở dữ liệu dùng chung
                    </p>
                  </div>
                  {orders.length > 0 && (
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#C04A37] hover:underline"
                    >
                      Xem tất cả ({orders.length}) →
                    </button>
                  )}
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-3 bg-[#FAF7F2] rounded-xl border border-[#4A3728]/10">
                    <div className="w-12 h-12 rounded-2xl bg-white text-[#7A695C] mx-auto flex items-center justify-center shadow-2xs border border-[#4A3728]/10">
                      <Package className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <h4 className="font-display font-semibold text-sm text-[#2D1E18]">
                      Cơ Sở Dữ Liệu Sạch (0 Đơn Hàng Ảo)
                    </h4>
                    <p className="text-xs text-[#7A695C] max-w-md mx-auto leading-relaxed">
                      Hệ thống đang kết nối với cơ sở dữ liệu server thực tế. Khi khách hàng đặt đơn trên website, thông tin sẽ được lưu tức thì và bảng điều khiển này sẽ tự động cập nhật.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#4A3728]/10">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-[#C04A37]">
                              {order.code || order.orderId || order.id}
                            </span>
                            <span className="text-xs font-semibold text-[#2D1E18]">
                              {order.customerName || 'Khách hàng'}
                            </span>
                            <span className="text-[11px] text-[#7A695C]">· {order.phoneNumber || order.phone || ''}</span>
                          </div>
                          <div className="text-xs text-[#7A695C] mt-1">
                            {(order.items || order.products || []).reduce((s, i) => s + (i.quantity || 1), 0)} món quà · {formatPrice(order.totalAmount || order.totalPrice || 0)} · {order.paymentMethod === 'cod' ? 'COD' : 'VietQR'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              (order.orderStatus || order.status) === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : (order.orderStatus || order.status) === 'shipping'
                                ? 'bg-blue-100 text-blue-800'
                                : (order.orderStatus || order.status) === 'processing'
                                ? 'bg-purple-100 text-purple-800'
                                : (order.orderStatus || order.status) === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {(order.orderStatus || order.status) === 'completed'
                              ? 'Hoàn thành'
                              : (order.orderStatus || order.status) === 'shipping'
                              ? 'Đang giao'
                              : (order.orderStatus || order.status) === 'processing'
                              ? 'Đang đóng gói'
                              : (order.orderStatus || order.status) === 'cancelled'
                              ? 'Đã hủy'
                              : 'Chờ xử lý'}
                          </span>

                          <button
                            onClick={() => {
                              setSelectedOrderForDetail(order);
                              setActiveTab('orders');
                            }}
                            className="p-1.5 rounded-lg bg-[#F4EFE6] hover:bg-[#C04A37] hover:text-white text-[#4A3728] transition-colors"
                            title="Xem chi tiết đơn"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Shortcuts & Top Selling Products from Real Orders */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs">
                  <h4 className="font-display font-bold text-base text-[#2D1E18] mb-3">
                    Thao Tác Nhanh
                  </h4>
                  <div className="space-y-2.5">
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full py-2.5 px-3.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm Sản Phẩm Quà Tặng Mới</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="w-full py-2.5 px-3.5 bg-[#F4EFE6] hover:bg-[#FAF7F2] text-[#4A3728] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-[#4A3728]/15 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[#C04A37]" />
                      <span>Hộp Thư Liên Hệ ({inquiries.length})</span>
                    </button>

                    <button
                      onClick={onCloseAdmin}
                      className="w-full py-2.5 px-3.5 bg-white hover:bg-[#F4EFE6] text-[#4A3728] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-[#4A3728]/15 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-[#C04A37]" />
                      <span>Xem Trước Cửa Hàng (Storefront)</span>
                    </button>
                  </div>
                </div>

                {/* Top Selling Products - strictly based on real orders */}
                <div className="p-6 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs">
                  <h4 className="font-display font-bold text-base text-[#2D1E18] mb-3 flex items-center justify-between">
                    <span>Sản Phẩm Bán Chạy</span>
                    <span className="text-[11px] font-normal text-[#7A695C]">Từ đơn thực tế</span>
                  </h4>
                  {topSellingProducts.length === 0 ? (
                    <div className="p-4 bg-[#FAF7F2] rounded-xl text-center text-xs text-[#7A695C]">
                      Chưa có đơn hàng nào được đặt. Khi khách mua quà, danh sách sản phẩm bán chạy sẽ tự động xếp hạng tại đây.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topSellingProducts.slice(0, 5).map((item, idx) => (
                        <div key={item.product.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5 max-w-[70%]">
                            <span className="w-5 h-5 rounded-full bg-[#FAF7F2] text-[#C04A37] font-bold text-[11px] flex items-center justify-center shrink-0 border border-[#4A3728]/10">
                              {idx + 1}
                            </span>
                            <span className="truncate text-[#2D1E18] font-medium">{item.product.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-[#C04A37] tabular-nums">{item.soldCount} đã bán</span>
                            <div className="text-[10px] text-[#7A695C] tabular-nums">{formatPrice(item.revenue)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Breakdown */}
                <div className="p-6 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs">
                  <h4 className="font-display font-bold text-base text-[#2D1E18] mb-3">
                    Phân Bổ Danh Mục Quà Tặng
                  </h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { label: 'Móc Khóa Lẻ (22k)', count: products.filter((p) => p.category === 'keychain').length },
                      { label: 'Combo Cặp Đôi (40k)', count: products.filter((p) => p.category === 'combo').length },
                    ].map((cat) => (
                      <div key={cat.label} className="flex items-center justify-between text-[#7A695C]">
                        <span>{cat.label}</span>
                        <span className="font-semibold text-[#2D1E18]">{cat.count} mẫu</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ORDERS MANAGEMENT ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D1E18]">
                  Quản Lý Đơn Hàng ({filteredOrders.length})
                </h2>
                <p className="text-xs text-[#7A695C]">
                  Theo dõi, đóng gói và cập nhật tiến độ giao quà cho khách hàng
                </p>
              </div>

              {/* Status Filters and Refresh Button */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {onRefreshData && (
                  <button
                    onClick={async () => {
                      if (isRefreshing) return;
                      setIsRefreshing(true);
                      try {
                        await onRefreshData();
                      } finally {
                        setTimeout(() => setIsRefreshing(false), 500);
                      }
                    }}
                    disabled={isRefreshing}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors bg-[#FAF7F2] hover:bg-[#F3EDE2] text-[#C04A37] border border-[#C04A37]/30 flex items-center gap-1.5 shadow-2xs mr-1"
                    title="Gọi lại GET /api/orders để tải danh sách mới nhất"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>↻ Làm mới</span>
                  </button>
                )}
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'pending', label: 'Chờ xử lý' },
                  { key: 'processing', label: 'Đang gói' },
                  { key: 'shipping', label: 'Đang giao' },
                  { key: 'completed', label: 'Hoàn tất' },
                  { key: 'cancelled', label: 'Đã hủy' },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setOrderStatusFilter(st.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      orderStatusFilter === st.key
                        ? 'bg-[#C04A37] text-white shadow-xs'
                        : 'bg-white text-[#7A695C] hover:bg-[#FAF7F2] border border-[#4A3728]/10'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A695C]" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Tìm kiếm theo mã đơn (VV-...), tên khách hàng, số điện thoại..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#4A3728]/15 text-xs text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
              />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#4A3728]/10 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#4A3728]">
                  <thead className="bg-[#FAF7F2] border-b border-[#4A3728]/10 text-[#7A695C] uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Mã Đơn</th>
                      <th className="py-3.5 px-4 font-semibold">Khách Hàng</th>
                      <th className="py-3.5 px-4 font-semibold">Địa Chỉ & Ghi Chú</th>
                      <th className="py-3.5 px-4 font-semibold">Món Quà</th>
                      <th className="py-3.5 px-4 font-semibold">Tổng Tiền</th>
                      <th className="py-3.5 px-4 font-semibold">Trạng Thái</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A3728]/10">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#7A695C]">
                          Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id || order.code} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#C04A37]">
                            {order.code || order.orderId || order.id}
                            <div className="text-[10px] text-[#7A695C] font-normal">
                              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-[#2D1E18]">
                            <div>{order.customerName || 'Khách hàng'}</div>
                            <div className="text-[11px] text-[#7A695C] font-mono">
                              {order.phoneNumber || order.phone || ''}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="line-clamp-1 text-[#2D1E18]">
                              {order.shippingAddress || order.address || 'Tại cửa hàng'}
                            </div>
                            {order.notes && (
                              <div className="text-[10px] text-amber-700 italic line-clamp-1">
                                “{order.notes}”
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-[#2D1E18]">
                              {(order.items || order.products || []).reduce((s, i) => s + (i.quantity || 1), 0)} món
                            </span>
                            <div className="text-[10px] text-[#7A695C] line-clamp-1">
                              {(order.items || order.products || []).map((i) => `${i.product?.name || 'Món quà'} (x${i.quantity || 1})`).join(', ')}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-[#C04A37] tabular-nums whitespace-nowrap">
                            {formatPrice(order.totalAmount || order.totalPrice || 0)}
                            <div className="text-[10px] text-[#7A695C] font-normal">
                              {order.paymentMethod === 'cod' ? 'Tiền mặt COD' : 'VietQR'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={order.orderStatus || order.status}
                              onChange={(e) => handleUpdateOrderStatusState(order.id, e.target.value as OrderStatus)}
                              className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border focus:outline-none ${
                                (order.orderStatus || order.status) === 'completed'
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                  : (order.orderStatus || order.status) === 'shipping'
                                  ? 'bg-blue-50 border-blue-300 text-blue-800'
                                  : (order.orderStatus || order.status) === 'processing'
                                  ? 'bg-purple-50 border-purple-300 text-purple-800'
                                  : (order.orderStatus || order.status) === 'cancelled'
                                  ? 'bg-red-50 border-red-300 text-red-800'
                                  : 'bg-amber-50 border-amber-300 text-amber-800'
                              }`}
                            >
                              <option value="pending">Chờ xử lý</option>
                              <option value="processing">Đang đóng gói</option>
                              <option value="shipping">Đang giao hàng</option>
                              <option value="completed">Đã hoàn tất</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedOrderForDetail(order)}
                              className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#C04A37] hover:text-white text-[#4A3728] transition-colors mr-1"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteOrderState(order.id)}
                              className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-red-600 hover:text-white text-red-500 transition-colors"
                              title="Xóa đơn hàng"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Detail for Order */}
            {selectedOrderForDetail && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
                <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden my-8 p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#4A3728]/10 pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#C04A37]">
                        Chi Tiết Đơn Hàng: {selectedOrderForDetail.code}
                      </span>
                      <div className="text-[11px] text-[#7A695C]">
                        Ngày đặt: {new Date(selectedOrderForDetail.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrderForDetail(null)}
                      className="p-1 text-[#7A695C] hover:bg-[#F4EFE6] rounded-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-[#4A3728]/10 text-xs space-y-1.5">
                    <div><strong>Người nhận:</strong> {selectedOrderForDetail.customerName || 'Khách hàng'} ({selectedOrderForDetail.phoneNumber || selectedOrderForDetail.phone || 'Chưa cung cấp'})</div>
                    <div><strong>Địa chỉ:</strong> {selectedOrderForDetail.shippingAddress || selectedOrderForDetail.address || 'Tại cửa hàng'}</div>
                    <div><strong>Phương thức thanh toán:</strong> {selectedOrderForDetail.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận hàng (COD)' : 'Chuyển khoản VietQR'}</div>
                    {selectedOrderForDetail.notes && (
                      <div className="text-amber-800 italic"><strong>Lời nhắn khách dặn:</strong> “{selectedOrderForDetail.notes}”</div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-[#2D1E18] uppercase tracking-wider mb-2">
                      Danh Sách Món Quà:
                    </h4>
                    <div className="space-y-2">
                      {(selectedOrderForDetail.items || selectedOrderForDetail.products || []).map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-[#4A3728]/10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <img src={item.product?.image || '/assets/product_keychain_tuong.jpg'} alt={item.product?.name || 'Món quà'} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <div className="font-semibold text-[#2D1E18]">{item.product?.name || 'Món quà lưu niệm'}</div>
                              <div className="text-[11px] text-[#7A695C]">Số lượng: {item.quantity} · {formatPrice(item.price || item.product?.price || 0)}/món</div>
                            </div>
                          </div>
                          <span className="font-semibold text-[#C04A37] tabular-nums">
                            {formatPrice((item.price || item.product?.price || 0) * (item.quantity || 1))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#4A3728]/10 flex items-center justify-between text-sm">
                    <span className="font-semibold">Tổng thanh toán:</span>
                    <span className="font-bold text-[#C04A37] text-base tabular-nums">
                      {formatPrice(selectedOrderForDetail.totalAmount || selectedOrderForDetail.totalPrice || 0)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="flex-1 py-2.5 bg-white border border-[#4A3728]/20 hover:border-[#C04A37] text-xs font-semibold rounded-xl text-[#4A3728]"
                    >
                      In Phiếu Đơn Hàng
                    </button>
                    <button
                      onClick={() => setSelectedOrderForDetail(null)}
                      className="flex-1 py-2.5 bg-[#C04A37] text-white text-xs font-semibold rounded-xl hover:bg-[#9C3322]"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: PRODUCTS MANAGEMENT ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#2D1E18]">
                  Quản Lý Sản Phẩm Quà Tặng ({products.length})
                </h2>
                <p className="text-xs text-[#7A695C]">
                  Thêm mới, sửa giá, chất liệu, cập nhật tồn kho và nội dung QR Story
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="px-4 py-2.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Món Quà Mới</span>
              </button>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A695C]" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm theo tên, chất liệu, tích di sản..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#4A3728]/15 text-xs text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { key: 'all', label: 'Tất cả' },
                  { key: 'keychain', label: 'Móc Khóa (22k)' },
                  { key: 'combo', label: 'Combo Cặp (40k)' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setProductCategoryFilter(cat.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      productCategoryFilter === cat.key
                        ? 'bg-[#C04A37] text-white shadow-xs'
                        : 'bg-white text-[#7A695C] hover:bg-[#FAF7F2] border border-[#4A3728]/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-xl border border-[#4A3728]/10 shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-[#F3EDE2]/40">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-[#FAF7F2]/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-semibold text-[#C04A37] border border-[#4A3728]/10">
                      {p.heritageOrigin}
                    </span>
                    <span
                      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.inStock
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {p.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#7A695C] mb-1">
                        <span>{p.categoryLabel}</span>
                        <span>·</span>
                        <span>{p.material.split(',')[0]}</span>
                      </div>
                      <h4 className="font-display font-semibold text-sm text-[#2D1E18] line-clamp-1">
                        {p.name}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-bold text-[#C04A37] tabular-nums">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-[11px] text-[#7A695C]/60 line-through tabular-nums">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#4A3728]/10 flex items-center justify-between text-xs">
                      {/* Stock Toggle */}
                      <button
                        onClick={() => handleToggleProductStock(p.id)}
                        className={`text-[11px] px-2 py-1 rounded font-medium transition-colors ${
                          p.inStock
                            ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-red-700 bg-red-50 hover:bg-red-100'
                        }`}
                      >
                        {p.inStock ? '✓ Đang mở bán' : '✕ Tạm hết'}
                      </button>

                      {/* Edit / Delete Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingProduct({ ...p });
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-[#7A695C] hover:bg-[#F4EFE6] hover:text-[#C04A37] transition-colors"
                          title="Sửa sản phẩm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-[#7A695C] hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Add / Edit Product */}
            {isProductModalOpen && editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
                <div className="bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden my-8 p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#4A3728]/10 pb-3">
                    <h3 className="font-display font-bold text-base text-[#2D1E18]">
                      {products.find((p) => p.id === editingProduct.id)
                        ? 'Chỉnh Sửa Thông Tin Sản Phẩm'
                        : 'Thêm Món Quà Văn Hóa Mới'}
                    </h3>
                    <button
                      onClick={() => setIsProductModalOpen(false)}
                      className="p-1 text-[#7A695C] hover:bg-[#F4EFE6] rounded-lg"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#4A3728] mb-1">
                          Tên sản phẩm *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#4A3728] mb-1">
                          Danh mục *
                        </label>
                        <select
                          value={editingProduct.category}
                          onChange={(e) => {
                            const cat = e.target.value as Product['category'];
                            const labels: Record<string, string> = {
                              keychain: 'Móc Khóa',
                              postcard: 'Postcard',
                              bookmark: 'Bookmark',
                              totebag: 'Tote Bag',
                              sticker: 'Sticker',
                            };
                            setEditingProduct({
                              ...editingProduct,
                              category: cat,
                              categoryLabel: labels[cat] || 'Khác',
                            });
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                        >
                          <option value="keychain">Móc Khóa Đồng Thau</option>
                          <option value="postcard">Postcard Giấy Dó</option>
                          <option value="bookmark">Bookmark Kim Loại</option>
                          <option value="totebag">Túi Canvas Mộc</option>
                          <option value="sticker">Sticker Vinyl</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-[#4A3728] mb-1">
                          Giá bán (VNĐ) *
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#4A3728] mb-1">
                          Giá gốc niêm yết (VNĐ)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.originalPrice || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#4A3728] mb-1">
                          Xuất xứ di sản *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.heritageOrigin}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, heritageOrigin: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#4A3728] mb-1">
                          Chất liệu chế tác *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.material}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, material: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#4A3728] mb-1">
                          Kích thước sản phẩm *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.dimensions}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, dimensions: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#4A3728] mb-1">
                        Đường dẫn hình ảnh (Ảnh lưu trữ hoặc URL) *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.image}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, image: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                      />
                      <div className="flex gap-2 mt-1.5 overflow-x-auto pb-1">
                        {[
                          '/assets/product_keychain_tuong.jpg',
                          '/assets/product_dongho_postcard.jpg',
                          '/assets/product_tote_folk_art.jpg',
                          '/assets/hero_vet_viet_souvenirs.jpg',
                          '/assets/culture_folk_arts.jpg',
                        ].map((imgUrl) => (
                          <button
                            type="button"
                            key={imgUrl}
                            onClick={() => setEditingProduct({ ...editingProduct, image: imgUrl })}
                            className="px-2 py-0.5 rounded bg-white border border-[#4A3728]/20 text-[10px] text-[#7A695C] hover:border-[#C04A37]"
                          >
                            Ảnh mẫu {imgUrl.split('_')[1]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#4A3728] mb-1">
                        Mô tả câu chuyện sản phẩm
                      </label>
                      <textarea
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                      />
                    </div>

                    {/* QR Story settings */}
                    <div className="p-3.5 rounded-xl bg-white border border-[#4A3728]/15 space-y-2.5">
                      <div className="font-semibold text-[#C04A37] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Nội dung QR Story kèm theo</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          placeholder="Tiêu đề QR Story..."
                          value={editingProduct.qrStory?.title || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              qrStory: { ...editingProduct.qrStory, title: e.target.value },
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#4A3728]/15 text-[#2D1E18]"
                        />
                        <input
                          type="text"
                          placeholder="Làn điệu / Nghệ thuật dân gian..."
                          value={editingProduct.qrStory?.folkArt || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              qrStory: { ...editingProduct.qrStory, folkArt: e.target.value },
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#4A3728]/15 text-[#2D1E18]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Câu ca dao / Trích dẫn văn hóa..."
                        value={editingProduct.qrStory?.folkQuote || ''}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            qrStory: { ...editingProduct.qrStory, folkQuote: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#4A3728]/15 text-[#2D1E18]"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsProductModalOpen(false)}
                        className="flex-1 py-2.5 bg-white border border-[#4A3728]/20 text-[#4A3728] font-semibold rounded-xl"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-[#C04A37] hover:bg-[#9C3322] text-white font-semibold rounded-xl"
                      >
                        Lưu Sản Phẩm
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: CULTURE & QR STORIES ================= */}
        {activeTab === 'stories' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2D1E18]">
                Dòng Chảy Di Sản & Hệ Thống QR Story
              </h2>
              <p className="text-xs text-[#7A695C]">
                Quản lý các loại hình nghệ thuật dân gian, âm sắc ngũ cung và câu chuyện truyền thừa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cultureStories.map((story) => (
                <div
                  key={story.id}
                  className="p-5 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-[#4A3728]/10"
                    />
                    <div>
                      <div className="text-[11px] font-semibold text-[#C04A37] uppercase tracking-wider">
                        {story.region}
                      </div>
                      <h4 className="font-display font-bold text-base text-[#2D1E18]">
                        {story.title}
                      </h4>
                      <p className="text-xs text-[#7A695C] italic line-clamp-1">{story.subtitle}</p>
                      <p className="text-xs text-[#4A3728] mt-1.5 line-clamp-2">{story.summary}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#4A3728]/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-[#C04A37]" />
                      <span className="font-medium text-[#2D1E18]">{story.soundName}</span>
                    </div>

                    <button
                      onClick={() => {
                        setPlayingStoryId(story.id);
                        playVietnameseMelody(story.soundType, () => setPlayingStoryId(null));
                      }}
                      className="px-2.5 py-1 bg-[#C04A37] text-white rounded-lg text-[11px] font-medium hover:bg-[#9C3322] transition-colors"
                    >
                      {playingStoryId === story.id ? 'Đang tấu...' : 'Thử âm sắc'}
                    </button>
                  </div>

                  <div className="text-[11px] text-[#7A695C] italic font-serif border-l-2 border-[#C04A37] pl-3">
                    {story.quote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: INQUIRIES & CONTACTS ================= */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2D1E18]">
                Hộp Thư Liên Hệ & Yêu Cầu Đặt Sỉ ({inquiries.length})
              </h2>
              <p className="text-xs text-[#7A695C]">
                Tin nhắn gửi từ khách hàng, đơn vị sự kiện và doanh nghiệp đặt quà lưu niệm
              </p>
            </div>

            {inquiries.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#4A3728]/10 text-xs text-[#7A695C]">
                Chưa có thư liên hệ nào. Khi khách hàng gửi tin nhắn từ hộp thư liên hệ ngoài trang chủ, nội dung sẽ lập tức hiện tại đây!
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-5 rounded-2xl bg-white border transition-all ${
                      inq.status === 'unread'
                        ? 'border-[#C04A37] shadow-sm ring-1 ring-[#C04A37]/20'
                        : 'border-[#4A3728]/10 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-[#2D1E18]">
                          {inq.name}
                        </span>
                        <span className="text-xs text-[#7A695C]">· {inq.email}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            inq.type === 'corporate'
                              ? 'bg-purple-100 text-purple-800'
                              : inq.type === 'custom'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inq.type === 'corporate'
                            ? 'Quà Doanh Nghiệp'
                            : inq.type === 'custom'
                            ? 'Khắc Tên Riêng'
                            : inq.type === 'feedback'
                            ? 'Góp Ý'
                            : 'Tư Vấn Quà'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#7A695C]">
                          {new Date(inq.createdAt).toLocaleString('vi-VN')}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateInquiryStatusState(
                              inq.id,
                              inq.status === 'read' ? 'unread' : 'read'
                            )
                          }
                          className="px-2 py-0.5 rounded text-[10px] border border-[#4A3728]/20 text-[#4A3728] hover:bg-[#FAF7F2]"
                        >
                          {inq.status === 'unread' ? 'Đánh dấu đã đọc' : 'Đã đọc ✓'}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A3728] bg-[#FAF7F2] p-3 rounded-xl border border-[#4A3728]/10 leading-relaxed">
                      {inq.message}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#4A3728]/10">
                      <a
                        href={`mailto:${inq.email}?subject=VẾT VIỆT - Phản hồi yêu cầu của ${encodeURIComponent(inq.name)}`}
                        className="text-[#C04A37] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Gửi email phản hồi trực tiếp</span>
                      </a>

                      <button
                        onClick={() => handleDeleteInquiryState(inq.id)}
                        className="text-red-500 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa thư</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 6: SETTINGS & DATA RESET ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl animate-fadeIn">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#2D1E18]">
                Cài Đặt Hệ Thống & Đồng Bộ Dữ Liệu
              </h2>
              <p className="text-xs text-[#7A695C]">
                Quản lý bảo mật truy cập, sao lưu và khôi phục dữ liệu gốc
              </p>
            </div>

            {/* Change Admin PIN */}
            <div className="p-6 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs space-y-4">
              <h4 className="font-display font-bold text-base text-[#2D1E18] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#C04A37]" />
                <span>Đổi Mã PIN Đăng Nhập Quản Trị</span>
              </h4>
              <p className="text-xs text-[#7A695C]">
                Mã PIN mặc định là <strong>123456</strong>. Bạn có thể cập nhật mã PIN mới để bảo vệ quyền truy cập.
              </p>

              <form onSubmit={handleChangePin} className="space-y-3">
                <input
                  type="password"
                  placeholder="Nhập mã PIN mới (tối thiểu 4 ký tự)..."
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#4A3728]/20 text-sm focus:outline-none focus:border-[#C04A37]"
                />

                {pinChangeMsg && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{pinChangeMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Cập Nhật Mã PIN
                </button>
              </form>
            </div>

            {/* Clear Orders & Reset Revenue */}
            <div className="p-6 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs space-y-4">
              <h4 className="font-display font-bold text-base text-[#2D1E18] flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-[#C04A37]" />
                <span>Xóa Trắng Đơn Hàng & Đưa Doanh Số Về 0₫</span>
              </h4>
              <p className="text-xs text-[#7A695C]">
                Xóa sạch mọi đơn hàng trong cơ sở dữ liệu server để đưa bảng thống kê doanh thu và đơn hàng về 0₫ sạch hoàn toàn.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={async () => {
                    if (window.confirm('Xác nhận xóa trắng toàn bộ đơn hàng trong cơ sở dữ liệu và đưa doanh số về 0₫?')) {
                      if (onClearOrders) {
                        await onClearOrders();
                      } else {
                        onUpdateOrders([]);
                      }
                      alert('Đã xóa sạch đơn hàng trên server, doanh số hiện tại là 0₫!');
                    }
                  }}
                  className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-red-50 border border-[#4A3728]/20 hover:border-red-300 text-red-600 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Hết Đơn Hàng ({orders.length} đơn)</span>
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Xác nhận xóa sạch toàn bộ thư liên hệ trong cơ sở dữ liệu?')) {
                      if (onClearInquiries) {
                        await onClearInquiries();
                      } else {
                        onUpdateInquiries([]);
                      }
                      alert('Đã dọn sạch hộp thư liên hệ trên server!');
                    }
                  }}
                  className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-red-50 border border-[#4A3728]/20 hover:border-red-300 text-red-600 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Hết Thư Liên Hệ ({inquiries.length} thư)</span>
                </button>
              </div>
            </div>

            {/* Reset to Default Data */}
            <div className="p-6 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs space-y-4">
              <h4 className="font-display font-bold text-base text-red-700 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Khôi Phục Danh Mục Sản Phẩm Ban Đầu</span>
              </h4>
              <p className="text-xs text-[#7A695C]">
                Khôi phục lại 8 mẫu quà lưu niệm gốc của VẾT VIỆT nếu bạn muốn hoàn tác các chỉnh sửa sản phẩm.
              </p>

              <button
                onClick={() => {
                  if (window.confirm('Khôi phục danh mục sản phẩm gốc của VẾT VIỆT?')) {
                    onResetDefaultData();
                    alert('Đã đưa danh mục về ban đầu (giữ doanh số 0₫)!');
                  }
                }}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi Phục Sản Phẩm Gốc</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
