import React from 'react';
import { ArrowRight, QrCode, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreProducts: () => void;
  onExploreQrStory: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreProducts, onExploreQrStory }) => {
  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-do-paper">
      {/* Decorative ambient gradients */}
      <div className="absolute top-12 right-0 -mr-24 w-96 h-96 rounded-full bg-[#C04A37]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 w-80 h-80 rounded-full bg-[#4A3728]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Category / Subtitle kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C04A37] uppercase mb-4">
              <span>Quà Lưu Niệm Đương Đại</span>
              <span aria-hidden="true">·</span>
              <span>Nghệ Thuật Truyền Thống</span>
              <span aria-hidden="true">·</span>
              <span>Chế Tác Thủ Công</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#2D1E18] font-semibold leading-[1.15] tracking-tight mb-6">
              Một chút Việt,
              <br />
              <span className="italic font-normal text-[#C04A37]">một chút thương.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#7A695C] leading-relaxed max-w-xl mb-8 font-light">
              VẾT VIỆT là thương hiệu quà lưu niệm lấy cảm hứng từ văn hóa, nghệ thuật và những nét đẹp truyền thống Việt Nam — biến di sản nghìn năm thành những vật phẩm tối giản, tinh tế và gần gũi dành cho người trẻ cùng du khách bốn phương.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreProducts}
                className="px-7 py-3.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 group whitespace-nowrap"
              >
                <span>Khám phá sản phẩm</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreQrStory}
                className="px-6 py-3.5 border border-[#4A3728]/25 hover:border-[#C04A37] text-[#2D1E18] hover:text-[#C04A37] bg-white/70 hover:bg-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                <QrCode className="w-4 h-4 text-[#C04A37]" />
                <span>Trải nghiệm QR Story</span>
              </button>
            </div>

            {/* Highlights row */}
            <div className="mt-10 pt-8 border-t border-[#4A3728]/10 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#7A695C]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C04A37]" />
                <span>Giấy Dó xơ tự nhiên</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C04A37]" />
                <span>Đồng thau & Men gốm thủ công</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C04A37]" />
                <span>Mỗi món quà đều có QR Story</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#4A3728]/10 bg-[#F3EDE2] group">
                <img
                  src="/assets/hero_vet_viet_souvenirs.jpg"
                  alt="Bộ sưu tập quà lưu niệm văn hóa Việt Nam hiện đại của Vết Việt"
                  className="w-full h-[400px] sm:h-[480px] object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1E18]/85 via-[#2D1E18]/25 to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-[#FAF7F2]/80 uppercase tracking-widest mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#DF6854]" />
                    <span>Bộ Sưu Tập Mới 2026</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-medium leading-snug">
                    Dấu ấn di sản thu nhỏ trong lòng bàn tay
                  </h3>
                  <p className="text-xs text-[#FAF7F2]/80 mt-1 line-clamp-1">
                    Đàn Kìm (22k) · Đàn Cò (22k) · Combo Cặp Đôi (40k/cặp)
                  </p>
                </div>
              </div>

              {/* Floating aesthetic badge */}
              <div className="absolute -bottom-5 -left-5 bg-[#FAF7F2] p-3 rounded-xl border border-[#4A3728]/15 shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#C04A37] flex items-center justify-center text-white font-display font-bold text-sm shadow-xs">
                  VẾT
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#2D1E18]">100% Bản Sắc Việt</div>
                  <div className="text-[11px] text-[#7A695C]">Thiết kế tối giản & trẻ trung</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
