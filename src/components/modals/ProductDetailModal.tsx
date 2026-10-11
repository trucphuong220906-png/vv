import React, { useState } from 'react';
import { Product } from '../../data/vetvietData';
import {
  X,
  QrCode,
  Play,
  Pause,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  Sparkles,
} from 'lucide-react';
import { playVietnameseMelody } from '../../utils/audioSynth';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleToggleSound = () => {
    if (isPlayingAudio) {
      if (stopAudioFn) {
        stopAudioFn();
        setStopAudioFn(null);
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const soundType =
        product.id === 'sp-dankim'
          ? 'dantranh'
          : product.id === 'sp-danco'
          ? 'danbau'
          : 'dantranh';

      const stop = playVietnameseMelody(soundType, () => {
        setIsPlayingAudio(false);
        setStopAudioFn(null);
      });
      setStopAudioFn(() => stop);
    }
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-3xl w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden my-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#2D1E18] shadow-sm transition-colors"
          aria-label="Đóng chi tiết sản phẩm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Image */}
          <div className="md:col-span-6 bg-[#F3EDE2] relative aspect-square md:aspect-auto min-h-[300px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-semibold text-[#C04A37] border border-[#4A3728]/10">
              {product.heritageOrigin}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7A695C] mb-2">
                <span>{product.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Chế tác thủ công Việt Nam</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#2D1E18] leading-snug mb-3">
                {product.name}
              </h3>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-[#C04A37] tabular-nums">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#7A695C]/60 line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#4A3728] leading-relaxed mb-5">
                {product.description}
              </p>

              {/* Material & Dimensions */}
              <div className="space-y-2 py-3 border-y border-[#4A3728]/10 text-xs mb-5">
                <div className="flex justify-between">
                  <span className="text-[#7A695C]">Chất liệu:</span>
                  <span className="font-medium text-[#2D1E18] text-right">
                    {product.material}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A695C]">Kích thước:</span>
                  <span className="font-medium text-[#2D1E18]">
                    {product.dimensions}
                  </span>
                </div>
              </div>

              {/* QR Story banner */}
              <div className="p-3.5 rounded-xl bg-white border border-[#4A3728]/10 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C04A37]">
                    <QrCode className="w-4 h-4" />
                    <span>Đi kèm QR Story: {product.qrStory.folkArt}</span>
                  </div>
                  <button
                    onClick={handleToggleSound}
                    className="text-[11px] font-medium text-[#2D1E18] hover:text-[#C04A37] flex items-center gap-1 bg-[#F3EDE2] px-2 py-1 rounded"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-3 h-3 text-[#C04A37]" />
                        <span>Dừng nghe</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-[#C04A37]" />
                        <span>Nghe thanh âm</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-[#7A695C] italic">
                  {product.qrStory.folkQuote}
                </p>
              </div>
            </div>

            {/* Quantity and Add to cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#F3EDE2] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A3728] hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold tabular-nums text-[#2D1E18]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A3728] hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isAdded}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#C04A37] hover:bg-[#9C3322] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã thêm vào giỏ!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Thêm vào giỏ hàng</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A695C]">
                <Sparkles className="w-3 h-3 text-[#C04A37]" />
                <span>Bao gói hộp quà thủ công & thiệp ghi lời chúc theo yêu cầu</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
