import React, { useState } from 'react';
import { Gift, ArrowRight, Send, Check, PackageCheck } from 'lucide-react';

interface CallToActionProps {
  onExploreProducts: () => void;
  onOpenContact: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({
  onExploreProducts,
  onOpenContact,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 2000);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#2D1E18] text-[#FAF7F2]">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#C04A37]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#DF6854]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#DF6854] uppercase mb-4">
            <Gift className="w-4 h-4" />
            <span>Hộp Quà Di Sản</span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-6">
            “Mang một mảnh Việt về nhà.”
          </h2>

          <p className="text-base sm:text-lg text-[#FAF7F2]/80 leading-relaxed font-light mb-10 max-w-2xl mx-auto">
            Dù là món quà gửi tặng bạn bè quốc tế, lưu giữ kỷ niệm sau chuyến đi xuyên Việt hay đặt trên góc bàn làm việc mỗi ngày — VẾT VIỆT luôn gói ghém trọn vẹn sự tinh tế và tình yêu non nước.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button
              onClick={onExploreProducts}
              className="px-8 py-4 bg-[#C04A37] hover:bg-[#9C3322] text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
            >
              <span>Chọn quà lưu niệm ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenContact}
              className="px-7 py-4 border border-[#FAF7F2]/25 hover:border-[#DF6854] text-[#FAF7F2] hover:text-[#DF6854] bg-[#FAF7F2]/5 hover:bg-[#FAF7F2]/10 text-sm font-medium rounded-xl transition-colors"
            >
              Đặt hộp quà doanh nghiệp / Sự kiện
            </button>
          </div>

          {/* Newsletter registration */}
          <div className="max-w-md mx-auto pt-8 border-t border-[#FAF7F2]/10">
            <div className="text-xs text-[#FAF7F2]/70 mb-3">
              Đăng ký nhận tuyển tập bưu thiếp số & câu chuyện văn hóa mỗi tháng:
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                required
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 text-sm text-white placeholder-[#FAF7F2]/40 focus:outline-none focus:border-[#DF6854]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã nhận!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Eco and Delivery guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#FAF7F2]/60">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#DF6854]" />
              <span>Đóng gói giấy Dó thủ công bảo vệ môi trường</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DF6854]" />
              <span>Giao hàng hỏa tốc sân bay & khách sạn trong 2h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
