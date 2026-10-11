import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShoppingBag, Menu, X, ShieldCheck } from 'lucide-react';
import { playVietnameseMelody } from '../utils/audioSynth';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenContact,
  onOpenAdmin,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [stopAudioFn, setStopAudioFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTraditionalAudio = () => {
    if (isAudioMuted) {
      setIsAudioMuted(false);
      const stop = playVietnameseMelody('dantranh', () => {
        setIsAudioMuted(true);
      });
      setStopAudioFn(() => stop);
    } else {
      setIsAudioMuted(true);
      if (stopAudioFn) {
        stopAudioFn();
        setStopAudioFn(null);
      }
    }
  };

  const navLinks = [
    { label: 'Trang chủ', href: '#hero' },
    { label: 'Sản phẩm', href: '#products' },
    { label: 'Câu chuyện', href: '#story' },
    { label: 'Văn hóa Việt', href: '#culture' },
    { label: 'QR Story', href: '#qr-story' },
    { label: 'Liên hệ', href: '#contact', onClick: onOpenContact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs border-b border-[#2D1E18]/10 py-3.5'
          : 'bg-[#FAF7F2]/80 backdrop-blur-xs border-b border-[#2D1E18]/5 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="group flex items-center gap-2.5 focus-visible:outline-none">
            <span className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#C04A37] group-hover:text-[#9C3322] transition-colors">
              VẾT VIỆT
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#C04A37]/40" />
            <span className="hidden md:inline-block text-xs font-medium tracking-wider text-[#7A695C] uppercase">
              Một chút Việt, một chút thương
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A3728]">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className="hover:text-[#C04A37] transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C04A37] hover:after:w-full after:transition-all after:duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right actions: Audio, Cart, Admin button, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Synth Toggle */}
            <button
              onClick={toggleTraditionalAudio}
              className={`p-2.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                isAudioMuted
                  ? 'text-[#7A695C] hover:text-[#2D1E18] hover:bg-[#F3EDE2]'
                  : 'bg-[#C04A37]/15 text-[#C04A37] ring-1 ring-[#C04A37]/30'
              }`}
              title={isAudioMuted ? 'Nghe thanh âm nhạc cụ dân tộc' : 'Tắt âm thanh'}
              aria-label="Thanh âm nhạc cụ dân tộc"
            >
              {isAudioMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse text-[#C04A37]" />
                  <span className="hidden xl:inline text-xs font-sans">Đang tấu Đàn Tranh</span>
                </>
              )}
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-[#2D1E18] hover:bg-[#F3EDE2] transition-colors duration-200 focus-visible:outline-none"
              aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}
            >
              <ShoppingBag className="w-5 h-5 text-[#2D1E18]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C04A37] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#4A3728]/15 hover:border-[#C04A37] text-[#4A3728] hover:text-[#C04A37] bg-white/60 hover:bg-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Đăng nhập trang quản trị Admin"
              >
                <ShieldCheck className="w-4 h-4 text-[#C04A37]" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Mobile Menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#2D1E18] hover:bg-[#F3EDE2] transition-colors"
              aria-label="Mở danh mục điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#FAF7F2] border-b border-[#2D1E18]/10 shadow-lg px-6 py-6 space-y-4 animate-fadeIn">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
              }}
              className="block text-base font-medium text-[#2D1E18] hover:text-[#C04A37] py-2 border-b border-[#2D1E18]/5"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full py-3 bg-[#C04A37] text-white rounded-lg text-sm font-semibold hover:bg-[#9C3322] transition-colors shadow-sm"
            >
              Liên hệ tư vấn quà tặng
            </button>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 bg-white border border-[#4A3728]/20 text-[#4A3728] rounded-lg text-xs font-semibold hover:border-[#C04A37] transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#C04A37]" />
                <span>Trang Quản Trị Viên (Admin)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
