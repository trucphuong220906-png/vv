import React, { useState } from 'react';
import { CultureStory } from '../../data/vetvietData';
import { X, MapPin, Play, Pause, Volume2, Sparkles, Feather } from 'lucide-react';
import { playVietnameseMelody } from '../../utils/audioSynth';

interface StoryDetailModalProps {
  story: CultureStory | null;
  onClose: () => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  onClose,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  if (!story) return null;

  const handleToggleSound = () => {
    if (isPlayingAudio) {
      if (stopAudioFn) {
        stopAudioFn();
        setStopAudioFn(null);
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const stop = playVietnameseMelody(story.soundType, () => {
        setIsPlayingAudio(false);
        setStopAudioFn(null);
      });
      setStopAudioFn(() => stop);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden my-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-[#2D1E18] shadow-sm transition-colors"
          aria-label="Đóng chi tiết câu chuyện"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image and title overlay */}
        <div className="relative h-60 sm:h-72 w-full bg-[#2D1E18] overflow-hidden">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2D1E18] via-[#2D1E18]/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#FAF7F2]/80 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#DF6854]" />
              <span>{story.region}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              {story.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/85 italic mt-1 font-serif">
              {story.subtitle}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Audio Player Card */}
          <div className="p-4 rounded-xl bg-white border border-[#4A3728]/10 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSound}
                className="w-11 h-11 rounded-full bg-[#C04A37] text-white flex items-center justify-center hover:bg-[#9C3322] shadow-sm transition-transform active:scale-95"
                aria-label="Nghe giai điệu truyền thống"
              >
                {isPlayingAudio ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
              <div>
                <div className="text-xs font-semibold text-[#2D1E18]">
                  {story.soundName}
                </div>
                <div className="text-[11px] text-[#7A695C]">
                  {isPlayingAudio
                    ? 'Đang tấu khúc ngũ cung cổ truyền...'
                    : 'Nhấn để thưởng thức âm sắc nhạc cụ dân tộc'}
                </div>
              </div>
            </div>
            <Volume2
              className={`w-5 h-5 ${
                isPlayingAudio ? 'text-[#C04A37] animate-pulse' : 'text-[#7A695C]'
              }`}
            />
          </div>

          {/* Full story with drop cap */}
          <div className="text-sm text-[#4A3728] leading-relaxed space-y-4 font-light">
            <p className="first-letter:text-3xl first-letter:font-display first-letter:font-bold first-letter:text-[#C04A37] first-letter:float-left first-letter:mr-2">
              {story.fullStory}
            </p>
          </div>

          {/* Folk Quote */}
          <div className="p-4 rounded-xl bg-[#F3EDE2] border-l-4 border-[#C04A37] text-sm text-[#2D1E18] italic font-serif">
            {story.quote}
          </div>

          {/* Modern Connection */}
          <div className="p-4 rounded-xl bg-white border border-[#4A3728]/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C04A37] mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Chuyển Hóa Thành Quà Tặng Đương Đại</span>
            </div>
            <p className="text-xs text-[#7A695C] leading-relaxed">
              {story.modernConnection}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="text-xs font-bold text-[#2D1E18] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#C04A37]" />
              <span>Dấu ấn di sản nổi bật</span>
            </h4>
            <div className="space-y-2">
              {story.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#7A695C]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C04A37] mt-1.5 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer button */}
          <div className="pt-4 border-t border-[#4A3728]/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#C04A37] text-white text-xs font-medium rounded-lg hover:bg-[#9C3322] transition-colors"
            >
              Đóng câu chuyện
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
