import React from 'react';
import { Product } from '../../data/vetvietData';
import { ShoppingBag, X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D1E18]/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[#4A3728]/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C04A37]" />
              <h3 className="font-display font-semibold text-lg text-[#2D1E18]">
                Giỏ Quà Của Bạn ({totalCount})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#7A695C] hover:bg-[#F3EDE2] transition-colors"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart item list */}
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#F3EDE2] flex items-center justify-center text-[#7A695C] mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h4 className="font-display text-base font-semibold text-[#2D1E18] mb-1">
                  Giỏ quà đang trống
                </h4>
                <p className="text-xs text-[#7A695C] max-w-xs mb-6">
                  Hãy dạo quanh bộ sưu tập và chọn cho mình một món quà mang hồn Việt nhé.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#C04A37] text-white text-xs font-medium rounded-lg hover:bg-[#9C3322] transition-colors"
                >
                  Khám phá sản phẩm
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-xl bg-white border border-[#4A3728]/10 flex gap-3.5 items-center shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover bg-[#F3EDE2]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-[#2D1E18] line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-[#7A695C] mb-2">
                      {item.product.heritageOrigin}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#C04A37] tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-1.5 bg-[#F3EDE2] rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-5 h-5 flex items-center justify-center text-[#4A3728] hover:bg-white rounded transition-colors"
                          aria-label="Giảm số lượng"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-[#2D1E18] w-5 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-5 h-5 flex items-center justify-center text-[#4A3728] hover:bg-white rounded transition-colors"
                          aria-label="Tăng số lượng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-[#7A695C] hover:text-[#C04A37] transition-colors"
                    aria-label="Xóa sản phẩm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#4A3728]/10 bg-white">
              <div className="space-y-2 mb-4 text-xs text-[#7A695C]">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="text-[#2D1E18] font-medium tabular-nums">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Đóng gói giấy Dó & Tag QR Story</span>
                  <span className="text-emerald-700 font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#2D1E18] pt-2 border-t border-[#4A3728]/10">
                  <span>Tổng thanh toán</span>
                  <span className="text-[#C04A37] tabular-nums font-bold text-base">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Tiến hành đặt hàng</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-[11px] text-center text-[#7A695C] mt-2.5">
                Bảo đảm hoàn tiền 100% nếu sản phẩm có lỗi thủ công
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
