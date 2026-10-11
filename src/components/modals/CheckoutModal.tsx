import React, { useState } from 'react';
import { CartItem } from './CartDrawer';
import { Order } from '../../types/adminTypes';
import { createOrder as apiCreateOrder } from '../../services/api';
import {
  X,
  CircleCheck,
  User,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  QrCode,
  AlertCircle,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
  onOrderCreated?: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  onOrderCreated,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim() || !shippingAddress.trim()) {
      setSubmitError('Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const code = 'VV-' + Math.floor(100000 + Math.random() * 900000);
    setOrderCode(code);

    const orderItems = items.map((i) => ({
      product: i.product,
      quantity: i.quantity,
      price: i.product.price,
    }));
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderId: code,
      code,
      customerName: fullName.trim(),
      phone: phoneNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      address: shippingAddress.trim(),
      shippingAddress: shippingAddress.trim(),
      notes: orderNotes.trim(),
      paymentMethod,
      paymentStatus: paymentMethod === 'bank' ? 'paid' : 'pending',
      orderStatus: 'pending',
      status: 'pending',
      products: orderItems,
      items: orderItems,
      quantity: totalQty,
      totalPrice: totalAmount,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Direct call to backend POST /api/orders
      const savedOrder = await apiCreateOrder(newOrder);
      console.log('[Checkout] Order persisted successfully via POST /api/orders:', savedOrder);

      // 2. Notify parent App to refresh state immediately
      if (onOrderCreated) {
        await onOrderCreated(savedOrder);
      }

      setIsSuccess(true);
      onOrderSuccess();
    } catch (err: any) {
      console.error('Error creating order in modal:', err);
      setSubmitError(
        err.message || 'Không thể kết nối đến máy chủ để lưu đơn hàng. Vui lòng thử lại!'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-xl w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden my-8">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-[#4A3728]/10 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-[#C04A37]">
              VẾT VIỆT
            </span>
            <span className="text-xs text-[#7A695C]">· Hoàn tất đơn hàng</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A695C] hover:bg-[#F3EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order success confirmation */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CircleCheck className="w-9 h-9" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#2D1E18]">
              Đặt Hàng Thành Công!
            </h3>
            <p className="text-sm text-[#7A695C] max-w-md mx-auto leading-relaxed">
              Cảm ơn bạn đã lựa chọn <strong>VẾT VIỆT</strong> để mang một mảnh di sản về nhà. Mã đơn hàng của bạn là{' '}
              <span className="font-mono font-bold text-[#C04A37] text-base">
                {orderCode}
              </span>
              .
            </p>

            <div className="p-4 rounded-xl bg-white border border-[#4A3728]/10 text-left text-xs space-y-2 text-[#4A3728]">
              <div className="flex justify-between">
                <span className="text-[#7A695C]">Người nhận:</span>
                <span className="font-semibold">
                  {fullName} - {phoneNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A695C]">Địa chỉ giao:</span>
                <span className="font-semibold">{shippingAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A695C]">Phương thức:</span>
                <span className="font-semibold">
                  {paymentMethod === 'cod'
                    ? 'Thanh toán tiền mặt (COD)'
                    : 'Chuyển khoản VietQR'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#4A3728]/10 text-sm">
                <span className="font-semibold">Tổng tiền thanh toán:</span>
                <span className="font-bold text-[#C04A37]">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#7A695C] italic">
              Đơn hàng sẽ được bọc giấy Dó cẩn thận và liên hệ xác nhận trong vòng 15 phút.
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-[#C04A37] text-white text-sm font-semibold rounded-xl hover:bg-[#9C3322] transition-colors"
            >
              Tiếp tục dạo xem quà Việt
            </button>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Quick summary banner */}
            <div className="p-3.5 rounded-xl bg-white border border-[#4A3728]/10 flex items-center justify-between text-xs">
              <span className="text-[#7A695C]">
                Số lượng món quà:{' '}
                <strong>{items.reduce((s, i) => s + i.quantity, 0)}</strong>
              </span>
              <span className="font-semibold text-[#C04A37] text-sm tabular-nums">
                {formatPrice(totalAmount)}
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#4A3728] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C04A37]" />
                  <span>Họ và tên người nhận *</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#4A3728]/20 text-sm text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3728] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C04A37]" />
                  <span>Số điện thoại liên hệ *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Ví dụ: 0912 345 678"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#4A3728]/20 text-sm text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3728] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C04A37]" />
                  <span>Địa chỉ nhận hàng (Khách sạn / Nhà riêng) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Số nhà, đường phố, phường/xã, quận/huyện, tỉnh/thành..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#4A3728]/20 text-sm text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A3728] mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#C04A37]" />
                  <span>Ghi chú đơn hàng (Tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ví dụ: Gói quà tặng, viết thiệp chúc mừng, giao trước 17h..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#4A3728]/20 text-sm text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-[#4A3728] mb-2">
                Phương thức thanh toán
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#C04A37] bg-white ring-1 ring-[#C04A37]'
                      : 'border-[#4A3728]/15 bg-white/50 text-[#7A695C]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#C04A37]" />
                  <div>
                    <div className="text-xs font-semibold text-[#2D1E18]">COD</div>
                    <div className="text-[10px] text-[#7A695C]">
                      Trả tiền khi nhận hàng
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-[#C04A37] bg-white ring-1 ring-[#C04A37]'
                      : 'border-[#4A3728]/15 bg-white/50 text-[#7A695C]'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#C04A37]" />
                  <div>
                    <div className="text-xs font-semibold text-[#2D1E18]">VietQR</div>
                    <div className="text-[10px] text-[#7A695C]">
                      Quét mã chuyển khoản
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Đang tạo đơn...' : 'Xác nhận đặt hàng'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
