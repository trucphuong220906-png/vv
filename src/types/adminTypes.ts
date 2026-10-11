import { Product } from '../data/vetvietData';

export type OrderStatus = 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid';

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderId: string; // e.g. "VV-849102"
  code: string;    // synonymous with orderId
  customerName: string;
  phoneNumber: string;
  phone?: string;  // alias for phoneNumber
  shippingAddress: string;
  address?: string; // alias for shippingAddress
  notes?: string;
  paymentMethod: 'cod' | 'bank';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  status: OrderStatus; // synonymous with orderStatus
  products: OrderItem[];
  items: OrderItem[];  // synonymous with products
  quantity: number;    // sum of all item quantities
  totalPrice: number;  // total monetary amount
  totalAmount: number; // synonymous with totalPrice
  createdAt: string;   // ISO timestamp
}

export type InquiryType = 'gift-inquiry' | 'corporate' | 'custom' | 'feedback';
export type InquiryStatus = 'unread' | 'read' | 'replied';

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  type: InquiryType;
  message: string;
  createdAt: string;
  status: InquiryStatus;
  adminNote?: string;
}

export interface TopProductSales {
  product: Product;
  soldCount: number;
  totalRevenue: number;
}

export interface DashboardStats {
  totalRevenue: number;     // sum of totalPrice of orders with orderStatus === 'completed'
  totalOrders: number;      // total count of real orders
  processingOrders: number; // count of orders with status 'pending' | 'processing'
  completedOrders: number;  // count of orders with status 'completed'
  shippingOrders: number;   // count of orders with status 'shipping'
  cancelledOrders: number;  // count of orders with status 'cancelled'
  todayRevenue: number;     // sum of completed orders created today
  monthRevenue: number;     // sum of completed orders created in the current month
  topSellingProducts: TopProductSales[]; // derived strictly from real orders
}
