import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Order, ContactInquiry, DashboardStats, TopProductSales } from '../types/adminTypes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistent storage file paths
const DATA_DIR = path.resolve(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to safely read JSON file
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf8');
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

// Helper to safely write JSON file
function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Clean initialization - zero mock data
let inMemoryOrders: Order[] = readJsonFile<Order[]>(ORDERS_FILE, []);
let inMemoryInquiries: ContactInquiry[] = readJsonFile<ContactInquiry[]>(INQUIRIES_FILE, []);

// Date comparison helpers
function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isCurrentMonth(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth()
  );
}

// ================= ORDERS OPERATIONS =================

export function getAllOrders(): Order[] {
  // Always refresh from disk
  inMemoryOrders = readJsonFile<Order[]>(ORDERS_FILE, inMemoryOrders);
  return [...inMemoryOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createOrder(data: Partial<Order>): Order {
  // Refresh current from disk first
  inMemoryOrders = readJsonFile<Order[]>(ORDERS_FILE, inMemoryOrders);

  const code = data.code || data.orderId || 'VV-' + Math.floor(100000 + Math.random() * 900000);
  const id = data.id || 'ord-' + Date.now();
  const items = data.items || data.products || [];
  const quantity = data.quantity || items.reduce((s, i) => s + (i.quantity || 1), 0);
  const calculatedItemsTotal = items.reduce(
    (s, i) => s + ((i.price || (i as any).product?.price || 0) * (i.quantity || 1)),
    0
  );
  const totalPrice = Number(data.totalPrice ?? data.totalAmount ?? calculatedItemsTotal) || 0;
  const orderStatus = data.orderStatus || data.status || 'pending';
  const paymentMethod = data.paymentMethod || 'cod';
  const paymentStatus = data.paymentStatus || (orderStatus === 'completed' ? 'paid' : (paymentMethod === 'bank' ? 'paid' : 'pending'));
  const phone = (data.phoneNumber || data.phone || '').trim();
  const address = (data.shippingAddress || data.address || '').trim();

  const newOrder: Order = {
    id,
    orderId: code,
    code,
    customerName: data.customerName || 'Khách vãng lai',
    phoneNumber: phone,
    phone,
    shippingAddress: address,
    address,
    notes: data.notes || '',
    paymentMethod,
    paymentStatus,
    orderStatus,
    status: orderStatus,
    products: items,
    items,
    quantity,
    totalPrice,
    totalAmount: totalPrice,
    createdAt: data.createdAt || new Date().toISOString(),
  };

  inMemoryOrders.unshift(newOrder);
  writeJsonFile(ORDERS_FILE, inMemoryOrders);
  console.log('[DB] Order successfully stored to disk:', newOrder.code, newOrder.customerName, newOrder.totalPrice);
  return newOrder;
}

export function updateOrderStatus(
  orderId: string,
  newStatus: Order['orderStatus'],
  newPaymentStatus?: Order['paymentStatus']
): Order | null {
  inMemoryOrders = readJsonFile<Order[]>(ORDERS_FILE, inMemoryOrders);
  const order = inMemoryOrders.find(
    (o) => o.id === orderId || o.code === orderId || o.orderId === orderId
  );
  if (!order) return null;

  order.orderStatus = newStatus;
  order.status = newStatus;
  if (newPaymentStatus) {
    order.paymentStatus = newPaymentStatus;
  } else if (newStatus === 'completed') {
    order.paymentStatus = 'paid';
  }

  writeJsonFile(ORDERS_FILE, inMemoryOrders);
  return order;
}

export function deleteOrder(orderId: string): boolean {
  inMemoryOrders = readJsonFile<Order[]>(ORDERS_FILE, inMemoryOrders);
  const initialLength = inMemoryOrders.length;
  inMemoryOrders = inMemoryOrders.filter(
    (o) => o.id !== orderId && o.code !== orderId && o.orderId !== orderId
  );
  if (inMemoryOrders.length !== initialLength) {
    writeJsonFile(ORDERS_FILE, inMemoryOrders);
    return true;
  }
  return false;
}

export function clearAllOrders(): void {
  inMemoryOrders = [];
  writeJsonFile(ORDERS_FILE, inMemoryOrders);
}

// ================= INQUIRIES OPERATIONS =================

export function getAllInquiries(): ContactInquiry[] {
  inMemoryInquiries = readJsonFile<ContactInquiry[]>(INQUIRIES_FILE, inMemoryInquiries);
  return [...inMemoryInquiries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createInquiry(data: Partial<ContactInquiry>): ContactInquiry {
  inMemoryInquiries = readJsonFile<ContactInquiry[]>(INQUIRIES_FILE, inMemoryInquiries);
  const newInquiry: ContactInquiry = {
    id: data.id || 'inq-' + Date.now(),
    name: data.name || '',
    email: data.email || '',
    type: data.type || 'gift-inquiry',
    message: data.message || '',
    status: data.status || 'unread',
    adminNote: data.adminNote || '',
    createdAt: data.createdAt || new Date().toISOString(),
  };

  inMemoryInquiries.unshift(newInquiry);
  writeJsonFile(INQUIRIES_FILE, inMemoryInquiries);
  return newInquiry;
}

export function updateInquiryStatus(
  inquiryId: string,
  newStatus: ContactInquiry['status'],
  adminNote?: string
): ContactInquiry | null {
  inMemoryInquiries = readJsonFile<ContactInquiry[]>(INQUIRIES_FILE, inMemoryInquiries);
  const inquiry = inMemoryInquiries.find((i) => i.id === inquiryId);
  if (!inquiry) return null;

  inquiry.status = newStatus;
  if (adminNote !== undefined) {
    inquiry.adminNote = adminNote;
  }

  writeJsonFile(INQUIRIES_FILE, inMemoryInquiries);
  return inquiry;
}

export function deleteInquiry(inquiryId: string): boolean {
  inMemoryInquiries = readJsonFile<ContactInquiry[]>(INQUIRIES_FILE, inMemoryInquiries);
  const initialLength = inMemoryInquiries.length;
  inMemoryInquiries = inMemoryInquiries.filter((i) => i.id !== inquiryId);
  if (inMemoryInquiries.length !== initialLength) {
    writeJsonFile(INQUIRIES_FILE, inMemoryInquiries);
    return true;
  }
  return false;
}

export function clearAllInquiries(): void {
  inMemoryInquiries = [];
  writeJsonFile(INQUIRIES_FILE, inMemoryInquiries);
}

// ================= DASHBOARD STATISTICS =================

export function getDashboardStats(): DashboardStats {
  inMemoryOrders = readJsonFile<Order[]>(ORDERS_FILE, inMemoryOrders);
  const orders = inMemoryOrders;

  // Requirement: Tổng doanh thu = tổng totalPrice của các đơn hàng thực tế có orderStatus = completed
  const completedOrdersList = orders.filter(
    (o) => o.orderStatus === 'completed' || o.status === 'completed'
  );

  const totalRevenue = completedOrdersList.reduce(
    (sum, o) => sum + (o.totalPrice || o.totalAmount || 0),
    0
  );

  const totalOrders = orders.length;

  const processingOrders = orders.filter((o) => {
    const st = o.orderStatus || o.status;
    return st === 'pending' || st === 'processing';
  }).length;

  const completedOrders = completedOrdersList.length;

  const shippingOrders = orders.filter(
    (o) => (o.orderStatus || o.status) === 'shipping'
  ).length;

  const cancelledOrders = orders.filter(
    (o) => (o.orderStatus || o.status) === 'cancelled'
  ).length;

  // Doanh thu hôm nay = tổng đơn completed được tạo trong ngày hôm nay
  const todayRevenue = completedOrdersList
    .filter((o) => isToday(o.createdAt))
    .reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);

  // Doanh thu tháng = tổng đơn completed trong tháng hiện tại
  const monthRevenue = completedOrdersList
    .filter((o) => isCurrentMonth(o.createdAt))
    .reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);

  // Top sản phẩm bán chạy tính toán hoàn toàn từ đơn hàng thực tế
  const productSalesMap = new Map<string, TopProductSales>();

  for (const ord of orders) {
    // Only count non-cancelled orders for product popularity
    if ((ord.orderStatus || ord.status) === 'cancelled') continue;

    const items = ord.products || ord.items || [];
    for (const item of items) {
      if (!item.product) continue;
      const pid = item.product.id;
      const existing = productSalesMap.get(pid);
      if (existing) {
        existing.soldCount += item.quantity || 1;
        existing.totalRevenue += (item.price || item.product.price || 0) * (item.quantity || 1);
      } else {
        productSalesMap.set(pid, {
          product: item.product,
          soldCount: item.quantity || 1,
          totalRevenue: (item.price || item.product.price || 0) * (item.quantity || 1),
        });
      }
    }
  }

  const topSellingProducts = Array.from(productSalesMap.values()).sort(
    (a, b) => b.soldCount - a.soldCount
  );

  return {
    totalRevenue,
    totalOrders,
    processingOrders,
    completedOrders,
    shippingOrders,
    cancelledOrders,
    todayRevenue,
    monthRevenue,
    topSellingProducts,
  };
}
