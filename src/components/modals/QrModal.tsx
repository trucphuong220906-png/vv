import React, { useState } from 'react';
import { Product } from '../../data/vetvietData';
import { X, QrCode, Play, Pause, Volume2, Sparkles } from 'lucide-react';
import { playVietnameseMelody } from '../../utils/audioSynth';

interface QrModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ product, onClose }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  if (!product) return null;

  const { qrStory } = product;

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
        product.category === 'keychain'
          ? 'cheo'
          : product.category === 'bookmark'
          ? 'dantranh'
          : product.category === 'postcard'
          ? 'dongho'
          : 'danbau';

      const stop = playVietnameseMelody(soundType, () => {
        setIsPlayingAudio(false);
        setStopAudioFn(null);
      });
      setStopAudioFn(() => stop);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-lg w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden my-8 relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#7A695C] hover:bg-[#F3EDE2] transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* QR Simulation Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-white border border-[#4A3728]/10 shadow-xs mb-3">
            <QrCode className="w-16 h-16 text-[#C04A37]" />
          </div>
          <div className="text-[11px] font-semibold text-[#C04A37] uppercase tracking-wider">
            {qrStory.region} · {qrStory.folkArt}
          </div>
          <h3 className="font-display text-xl font-bold text-[#2D1E18] mt-1">
            {qrStory.title}
          </h3>
          <p className="text-xs text-[#7A695C] mt-0.5">
            Dành cho sản phẩm: <strong>{product.name}</strong>
          </p>
        </div>

        {/* Audio Player */}
        <div className="p-3.5 rounded-xl bg-white border border-[#4A3728]/10 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSound}
              className="w-10 h-10 rounded-full bg-[#C04A37] text-white flex items-center justify-center hover:bg-[#9C3322] shadow-xs transition-transform active:scale-95"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
            <div>
              <div className="text-xs font-semibold text-[#2D1E18]">
                {qrStory.audioTitle}
              </div>
              <div className="text-[10px] text-[#7A695C]">
                {isPlayingAudio
                  ? 'Đang tấu khúc cổ nhạc...'
                  : `Thời lượng: ${qrStory.audioDuration}`}
              </div>
            </div>
          </div>
          <Volume2
            className={`w-4 h-4 ${
              isPlayingAudio ? 'text-[#C04A37] animate-pulse' : 'text-[#7A695C]'
            }`}
          />
        </div>

        {/* Story content */}
        <p className="text-xs text-[#4A3728] leading-relaxed mb-4">
          {qrStory.storyContent}
        </p>

        {/* Folk quote */}
        <div className="p-3 bg-[#F3EDE2] rounded-lg border-l-2 border-[#C04A37] text-xs font-serif italic text-[#4A3728] mb-4">
          {qrStory.folkQuote}
        </div>

        {/* Fun fact */}
        <div className="text-[11px] text-[#7A695C] bg-white p-3 rounded-lg border border-[#4A3728]/10 flex items-start gap-2 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#C04A37] shrink-0 mt-0.5" />
          <span>
            <strong>Góc thú vị:</strong> {qrStory.funFact}
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#C04A37] text-white text-xs font-semibold rounded-lg hover:bg-[#9C3322] transition-colors"
        >
          Đóng cửa sổ
        </button>
      </div>
    </div>
  );
};
