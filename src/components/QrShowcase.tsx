import React, { useState } from 'react';
import { Product } from '../data/vetvietData';
import { QrCode, CheckCircle2, Headphones, Compass, Play, Pause, Volume2 } from 'lucide-react';
import { playVietnameseMelody } from '../utils/audioSynth';

interface QrShowcaseProps {
  products: Product[];
}

export const QrShowcase: React.FC<QrShowcaseProps> = ({ products }) => {
  const showcaseProducts = products.slice(0, 4);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  const selectedProduct = showcaseProducts[selectedIndex] || showcaseProducts[0];
  const { qrStory } = selectedProduct;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (stopAudioFn) {
        stopAudioFn();
        setStopAudioFn(null);
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const soundType =
        selectedProduct.id === 'sp-dankim'
          ? 'dantranh'
          : selectedProduct.id === 'sp-danco'
          ? 'danbau'
          : 'dantranh';

      const stop = playVietnameseMelody(soundType, () => {
        setIsPlayingAudio(false);
        setStopAudioFn(null);
      });
      setStopAudioFn(() => stop);
    }
  };

  const handleSelectProduct = (idx: number) => {
    if (isPlayingAudio && stopAudioFn) {
      stopAudioFn();
      setIsPlayingAudio(false);
    }
    setSelectedIndex(idx);
  };

  return (
    <section id="qr-story" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title & Description */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-[#C04A37] uppercase mb-3">
          <QrCode className="w-4 h-4 text-[#C04A37]" />
          <span>Tính Năng Độc Quyền</span>
          <span aria-hidden="true">·</span>
          <span>Cầu Nối Công Nghệ & Di Sản</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl text-[#2D1E18] font-semibold tracking-tight mb-4">
          QR Story — Mỗi món quà là một câu chuyện sống động
        </h2>
        <p className="text-sm sm:text-base text-[#7A695C] leading-relaxed">
          Đằng sau mỗi tag sản phẩm của VẾT VIỆT là một mã QR duy nhất. Chỉ cần dùng camera điện thoại quét nhẹ, bạn sẽ mở ra cả một thế giới hình ảnh, thanh âm nhạc cụ truyền thống và những sự thật văn hóa kỳ thú.
        </p>
      </div>

      {/* Grid: Selector & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Product Selector & Benefit list */}
        <div className="lg:col-span-6 space-y-6">
          <h3 className="font-display text-xl font-semibold text-[#2D1E18]">
            Chọn mẫu sản phẩm để mô phỏng quét mã:
          </h3>

          <div className="space-y-3">
            {showcaseProducts.map((p, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProduct(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FAF7F2] border-[#C04A37] ring-1 ring-[#C04A37] shadow-sm'
                      : 'bg-white border-[#4A3728]/10 hover:border-[#4A3728]/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#4A3728]/10"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-[#2D1E18] line-clamp-1">{p.name}</h4>
                      <p className="text-xs text-[#7A695C]">{p.heritageOrigin}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-[#C04A37] bg-[#C04A37]/10 px-2 py-0.5 rounded">
                      Quét thử
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C04A37]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Benefits info box */}
          <div className="p-6 rounded-2xl bg-[#F3EDE2]/60 border border-[#4A3728]/10 mt-6 space-y-3">
            <h4 className="text-xs font-bold text-[#4A3728] uppercase tracking-wider">
              Khách hàng nhận được gì khi quét QR?
            </h4>
            <ul className="text-xs text-[#7A695C] space-y-2">
              <li className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-[#C04A37]" />
                <span>Thanh âm ghi âm nhạc cụ dân tộc chuẩn phòng thu.</span>
              </li>
              <li className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#C04A37]" />
                <span>Nguồn gốc vùng miền và câu chuyện lịch sử ngắn gọn, dễ hiểu.</span>
              </li>
              <li className="flex items-center gap-2">
                <QrCode className="w-3.5 h-3.5 text-[#C04A37]" />
                <span>Hỗ trợ song ngữ Việt - Anh dành cho khách du lịch quốc tế.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Interactive Mobile Phone Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-[#2D1E18] rounded-[40px] p-3.5 shadow-2xl border-4 border-[#4A3728]/30">
            {/* Dynamic island / top notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#2D1E18] rounded-full z-20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#18181B] mr-2" />
              <div className="w-10 h-1 bg-[#18181B] rounded-full" />
            </div>

            {/* Inner Phone Screen */}
            <div className="bg-[#FAF7F2] rounded-[32px] overflow-hidden text-[#2D1E18] min-h-[580px] flex flex-col justify-between pt-8 pb-5 px-5 relative">
              <div>
                {/* Header bar inside phone */}
                <div className="flex items-center justify-between border-b border-[#4A3728]/10 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-xs text-[#C04A37]">VẾT VIỆT</span>
                    <span className="text-[10px] text-[#7A695C]">· QR Story</span>
                  </div>
                  <span className="text-[10px] text-[#7A695C] bg-[#F3EDE2] px-2 py-0.5 rounded-full font-mono">
                    VERIFIED
                  </span>
                </div>

                {/* Story metadata & title */}
                <div className="text-[10px] font-semibold text-[#C04A37] uppercase tracking-wider mb-1">
                  {qrStory.region}
                </div>
                <h4 className="font-display text-lg font-bold text-[#2D1E18] leading-tight mb-2">
                  {qrStory.title}
                </h4>

                {/* Audio player card inside phone */}
                <div className="p-3.5 rounded-xl bg-[#F3EDE2] border border-[#4A3728]/10 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToggleAudio}
                      className="w-10 h-10 rounded-full bg-[#C04A37] text-white flex items-center justify-center shadow-xs hover:bg-[#9C3322] transition-colors"
                      aria-label="Phát nhạc trên điện thoại"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>
                    <div>
                      <div className="text-xs font-semibold text-[#2D1E18] line-clamp-1">
                        {qrStory.audioTitle}
                      </div>
                      <div className="text-[10px] text-[#7A695C]">
                        {isPlayingAudio ? 'Đang phát thanh âm...' : `Thời lượng ${qrStory.audioDuration}`}
                      </div>
                    </div>
                  </div>
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-[#C04A37] animate-pulse' : 'text-[#7A695C]'}`} />
                </div>

                {/* Content inside phone */}
                <p className="text-xs text-[#4A3728] leading-relaxed mb-3">
                  {qrStory.storyContent}
                </p>

                {/* Folk Quote inside phone */}
                <div className="p-3 bg-white rounded-lg border-l-2 border-[#C04A37] text-[11px] font-serif italic text-[#4A3728] mb-3">
                  {qrStory.folkQuote}
                </div>

                {/* Fun fact inside phone */}
                <div className="text-[11px] text-[#7A695C] bg-[#F3EDE2]/60 p-2.5 rounded-lg border border-[#4A3728]/10">
                  <span className="font-bold text-[#4A3728]">Góc thú vị: </span>
                  {qrStory.funFact}
                </div>
              </div>

              {/* Phone Footer */}
              <div className="pt-3 border-t border-[#4A3728]/10 flex items-center justify-between text-[10px] text-[#7A695C]">
                <span>Thương hiệu VẾT VIỆT</span>
                <span className="text-[#C04A37] font-medium">vietvet.vn/story</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
