import React, { useState } from 'react';
import { CultureStory } from '../data/vetvietData';
import { Play, Pause, Sparkles, BookOpen } from 'lucide-react';
import { playVietnameseMelody } from '../utils/audioSynth';

interface CultureSectionProps {
  stories: CultureStory[];
  onOpenStoryDetail: (story: CultureStory) => void;
}

export const CultureSection: React.FC<CultureSectionProps> = ({
  stories,
  onOpenStoryDetail,
}) => {
  const [activeStoryId, setActiveStoryId] = useState<string>(stories[0].id);
  const [playingStoryId, setPlayingStoryId] = useState<string | null>(null);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  const activeStory = stories.find((s) => s.id === activeStoryId) || stories[0];

  const handleToggleSound = (story: CultureStory, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingStoryId === story.id) {
      if (stopAudioFn) {
        stopAudioFn();
        setStopAudioFn(null);
      }
      setPlayingStoryId(null);
    } else {
      if (stopAudioFn) {
        stopAudioFn();
      }
      setPlayingStoryId(story.id);
      const stop = playVietnameseMelody(story.soundType, () => {
        setPlayingStoryId(null);
        setStopAudioFn(null);
      });
      setStopAudioFn(() => stop);
    }
  };

  return (
    <section id="culture" className="py-24 bg-[#F3EDE2]/40 border-t border-[#4A3728]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title & intro */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C04A37] uppercase mb-2">
            <span>Dòng Chảy Di Sản</span>
            <span aria-hidden="true">·</span>
            <span>Nguồn Cảm Hứng Bất Tận</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#2D1E18] font-semibold tracking-tight">
            Câu chuyện văn hóa
          </h2>
          <p className="text-sm sm:text-base text-[#7A695C] mt-3 leading-relaxed">
            Từ tiếng trống Chèo rộn rã sân đình Bắc Bộ, câu hát đối đáp Quan họ dùng dằng, mặt nạ Tuồng uy dũng, sắc màu tranh Đông Hồ rực rỡ đến khúc Đờn ca tài tử thổn thức phương Nam. VẾT VIỆT kể lại những trầm tích nghìn năm bằng xúc cảm của hôm nay.
          </p>
        </div>

        {/* Story Tab pills */}
        <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar mb-8">
          {stories.map((s) => {
            const isActive = s.id === activeStoryId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStoryId(s.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#C04A37] text-white shadow-xs'
                    : 'bg-white hover:bg-[#FAF7F2] text-[#4A3728] border border-[#4A3728]/10'
                }`}
              >
                <span>{s.title}</span>
                <span className={`text-[10px] opacity-75 ${isActive ? 'text-white' : 'text-[#7A695C]'}`}>
                  ({s.region.split(',')[0]})
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured Culture Story Card */}
        <div className="bg-white rounded-2xl border border-[#4A3728]/10 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left: Image & Sound Player */}
          <div className="lg:col-span-5 relative aspect-4/3 lg:aspect-auto min-h-[320px] bg-[#2D1E18] overflow-hidden">
            <img
              src={activeStory.image}
              alt={activeStory.title}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D1E18] via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#FAF7F2]/75 block mb-1">
                  Âm thanh di sản
                </span>
                <p className="font-display text-sm font-medium line-clamp-1">
                  {activeStory.soundName}
                </p>
              </div>

              <button
                onClick={(e) => handleToggleSound(activeStory, e)}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${
                  playingStoryId === activeStory.id
                    ? 'bg-[#FAF7F2] text-[#C04A37] shadow-lg ring-4 ring-[#C04A37]/30 scale-105'
                    : 'bg-[#C04A37] text-white hover:bg-[#9C3322]'
                }`}
                title={playingStoryId === activeStory.id ? 'Tạm dừng' : 'Nghe giai điệu truyền thống'}
                aria-label="Phát âm thanh di sản"
              >
                {playingStoryId === activeStory.id ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Right: Detailed cultural info */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#C04A37] tracking-wider uppercase mb-2">
                <span>{activeStory.region}</span>
                <span aria-hidden="true">·</span>
                <span>Di Sản Văn Hóa</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-[#2D1E18] font-semibold mb-2">
                {activeStory.title}
              </h3>
              <div className="text-sm font-medium text-[#7A695C] italic mb-4">
                {activeStory.subtitle}
              </div>

              <p className="text-sm sm:text-base text-[#4A3728] leading-relaxed mb-6 font-light">
                {activeStory.summary}
              </p>

              <div className="p-4 rounded-xl bg-[#FAF7F2] border-l-4 border-[#C04A37] text-xs sm:text-sm text-[#4A3728] italic font-serif mb-6 leading-relaxed">
                {activeStory.quote}
              </div>

              <div className="space-y-2 mb-6">
                {activeStory.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#7A695C]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C04A37] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Modern connection & Read more button */}
            <div className="pt-6 border-t border-[#4A3728]/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#7A695C]">
                <Sparkles className="w-4 h-4 text-[#C04A37]" />
                <span className="line-clamp-1">{activeStory.modernConnection}</span>
              </div>

              <button
                onClick={() => onOpenStoryDetail(activeStory)}
                className="px-5 py-2.5 border border-[#4A3728]/20 hover:border-[#C04A37] hover:text-[#C04A37] text-[#2D1E18] text-xs font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Đọc toàn bộ câu chuyện</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
