import React from 'react';
import { Mail, Phone, Heart } from 'lucide-react';

interface FooterProps {
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenAdmin }) => {
  return (
    <footer className="bg-[#FAF7F2] text-[#4A3728] border-t border-[#4A3728]/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <a href="#hero" className="inline-block mb-3">
              <span className="font-display font-bold text-2xl sm:text-3xl text-[#C04A37]">
                VẾT VIỆT
              </span>
            </a>
            <p className="font-serif italic text-base text-[#2D1E18] mb-4">
              “Một chút Việt, một chút thương”
            </p>
            <p className="text-xs sm:text-sm text-[#7A695C] leading-relaxed max-w-sm mb-6">
              Thương hiệu quà lưu niệm văn hóa Việt Nam hiện đại. Chúng tôi chắt lọc tinh hoa từ hát Tuồng, Chèo, Quan họ, Đông Hồ và Đờn ca tài tử thành những món quà mang hơi thở thời đại.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3EDE2] hover:bg-[#C04A37] hover:text-white flex items-center justify-center text-xs font-semibold text-[#4A3728] transition-colors"
                aria-label="Vết Việt trên Facebook"
              >
                FB
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3EDE2] hover:bg-[#C04A37] hover:text-white flex items-center justify-center text-xs font-semibold text-[#4A3728] transition-colors"
                aria-label="Vết Việt trên Instagram"
              >
                IG
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3EDE2] hover:bg-[#C04A37] hover:text-white flex items-center justify-center text-xs font-semibold text-[#4A3728] transition-colors"
                aria-label="Vết Việt trên TikTok"
              >
                TT
              </a>
              <a
                href="https://behance.net"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#F3EDE2] hover:bg-[#C04A37] hover:text-white flex items-center justify-center text-xs font-semibold text-[#4A3728] transition-colors"
                aria-label="Vết Việt trên Behance"
              >
                BE
              </a>
            </div>
          </div>

          {/* Column 2: Khám Phá */}
          <div>
            <h4 className="text-xs font-bold text-[#2D1E18] tracking-widest uppercase mb-4">
              Khám Phá
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#7A695C]">
              <li>
                <a href="#hero" className="hover:text-[#C04A37] transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#C04A37] transition-colors">
                  Sản phẩm nổi bật
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-[#C04A37] transition-colors">
                  Câu chuyện thương hiệu
                </a>
              </li>
              <li>
                <a href="#culture" className="hover:text-[#C04A37] transition-colors">
                  Di sản văn hóa Việt
                </a>
              </li>
              <li>
                <a href="#qr-story" className="hover:text-[#C04A37] transition-colors">
                  Trải nghiệm QR Story
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Bộ Sưu Tập */}
          <div>
            <h4 className="text-xs font-bold text-[#2D1E18] tracking-widest uppercase mb-4">
              Bộ Sưu Tập
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#7A695C]">
              <li>
                <a href="#products" className="hover:text-[#C04A37] transition-colors">
                  Móc khóa đồng thủ công
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#C04A37] transition-colors">
                  Postcard giấy Dó ép điệp
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#C04A37] transition-colors">
                  Bookmark kim loại khắc laser
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#C04A37] transition-colors">
                  Túi Tote vải Canvas mộc
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#C04A37] transition-colors">
                  Sticker chống nước dân gian
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Thông Tin Liên Hệ */}
          <div>
            <h4 className="text-xs font-bold text-[#2D1E18] tracking-widest uppercase mb-4">
              Thông Tin Liên Hệ
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#7A695C]">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C04A37] shrink-0" />
                <a href="mailto:vetviet.vn" className="hover:text-[#C04A37] transition-colors">
                  vetviet.vn
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C04A37] shrink-0" />
                <a href="tel:0344381763" className="hover:text-[#C04A37] transition-colors font-medium">
                  0344381763
                </a>
              </div>
              <button
                onClick={onOpenContact}
                className="mt-2 text-xs font-semibold text-[#C04A37] hover:underline flex items-center gap-1"
              >
                Gửi tin nhắn trực tiếp →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#4A3728]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A695C]">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} VẾT VIỆT. Tự hào thiết kế và sản xuất tại Việt Nam</span>
            <Heart className="w-3.5 h-3.5 text-[#C04A37] fill-[#C04A37] inline ml-1" />
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-[#2D1E18] transition-colors cursor-pointer">
              Chính sách bảo hành sản phẩm
            </span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#2D1E18] transition-colors cursor-pointer">
              Vận chuyển & Đổi trả
            </span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-[#2D1E18] transition-colors cursor-pointer">
              Bảo mật thông tin
            </span>
            {onOpenAdmin && (
              <>
                <span aria-hidden="true">·</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#C04A37] transition-colors font-semibold flex items-center gap-1"
                >
                  <span>Quản trị viên</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
