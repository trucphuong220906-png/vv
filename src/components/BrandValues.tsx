import React from 'react';
import { Compass, Sparkles, Feather } from 'lucide-react';

export const BrandValues: React.FC = () => {
  return (
    <section id="story" className="py-20 bg-[#F3EDE2]/60 border-y border-[#4A3728]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#C04A37] tracking-widest uppercase mb-3">
            Triết Lý Thương Hiệu
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#2D1E18] font-semibold leading-tight tracking-tight mb-5">
            “VẾT VIỆT lưu giữ những câu chuyện văn hóa Việt qua từng món quà nhỏ.”
          </h2>
          <p className="text-base text-[#7A695C] leading-relaxed">
            Chúng tôi tin rằng văn hóa dân tộc không phải là thứ nằm yên sau mặt kính bảo tàng. Văn hóa sống động nhất khi được chạm vào, được đồng hành cùng giới trẻ mỗi ngày và theo chân du khách quốc tế trở về sau những chuyến lữ hành.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="p-8 rounded-xl bg-[#FAF7F2] border border-[#4A3728]/10 shadow-xs hover:border-[#C04A37]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#C04A37]/10 flex items-center justify-center text-[#C04A37] mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[#2D1E18] mb-2.5">
              01. Hồn Di Sản Đích Thực
            </h3>
            <p className="text-sm text-[#7A695C] leading-relaxed">
              Mỗi sản phẩm đều xuất phát từ nghiên cứu cặn kẽ về lịch sử, tích tuồng, làn điệu dân ca và mỹ thuật dân gian Việt Nam từ Bắc vào Nam.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-8 rounded-xl bg-[#FAF7F2] border border-[#4A3728]/10 shadow-xs hover:border-[#C04A37]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#C04A37]/10 flex items-center justify-center text-[#C04A37] mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[#2D1E18] mb-2.5">
              02. Thị Giác Đương Đại
            </h3>
            <p className="text-sm text-[#7A695C] leading-relaxed">
              Từ bỏ những khuôn mẫu cũ kỹ, VẾT VIỆT ứng dụng ngôn ngữ thiết kế tối giản, bảng màu đỏ gạch - be ấm và đường nét typography hiện đại.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-8 rounded-xl bg-[#FAF7F2] border border-[#4A3728]/10 shadow-xs hover:border-[#C04A37]/40 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#C04A37]/10 flex items-center justify-center text-[#C04A37] mb-5">
              <Feather className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-[#2D1E18] mb-2.5">
              03. Mỗi Món Quà Là Một Điểm Chạm
            </h3>
            <p className="text-sm text-[#7A695C] leading-relaxed">
              Không chỉ là vật trang trí vô tri, với hệ thống QR Story đi kèm, người sở hữu có thể nghe âm thanh, đọc điển tích và cảm nhận linh hồn người nghệ nhân.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
