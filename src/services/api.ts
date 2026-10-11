import { Order, ContactInquiry, DashboardStats, OrderStatus, PaymentStatus, InquiryStatus } from '../types/adminTypes';

const API_BASE = '/api';

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch orders from server:', err);
    return [];
  }
}

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    throw new Error(`Failed to create order: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  paymentStatus?: PaymentStatus
): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, orderStatus: status, paymentStatus }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update order status: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function deleteOrder(orderId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete order: HTTP ${res.status}`);
  }
  const data = await res.json();
  return !!data.success;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      shippingOrders: 0,
      cancelledOrders: 0,
      todayRevenue: 0,
      monthRevenue: 0,
      topSellingProducts: [],
    };
  }
}

export async function fetchInquiries(): Promise<ContactInquiry[]> {
  try {
    const res = await fetch(`${API_BASE}/inquiries`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch inquiries from server:', err);
    return [];
  }
}

export async function createInquiry(data: Partial<ContactInquiry>): Promise<ContactInquiry> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to submit inquiry: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
  adminNote?: string
): Promise<ContactInquiry> {
  const res = await fetch(`${API_BASE}/inquiries/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminNote }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update inquiry status: HTTP ${res.status}`);
  }
  return await res.json();
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/inquiries/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete inquiry: HTTP ${res.status}`);
  }
  const data = await res.json();
  return !!data.success;
}

export async function clearAllOrders(): Promise<void> {
  await fetch(`${API_BASE}/admin/clear-orders`, { method: 'POST' });
}

export async function clearAllInquiries(): Promise<void> {
  await fetch(`${API_BASE}/admin/clear-inquiries`, { method: 'POST' });
}
