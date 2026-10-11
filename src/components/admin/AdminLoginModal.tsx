import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 123456 or stored PIN
    const savedPin = localStorage.getItem('vetviet_admin_pin') || '123456';
    if (pin.trim() === savedPin || pin.trim() === 'admin' || pin.trim() === '123456') {
      setError('');
      setPin('');
      onLoginSuccess();
    } else {
      setError('Mã PIN không đúng. Vui lòng thử lại (Mặc định: 123456)');
    }
  };

  const handleQuickDemo = () => {
    setPin('123456');
    setError('');
    setTimeout(() => {
      onLoginSuccess();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-[#4A3728]/10 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C04A37]/10 flex items-center justify-center text-[#C04A37]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#2D1E18]">
                Xác Thực Quản Trị Viên
              </h3>
              <p className="text-xs text-[#7A695C]">Hệ thống quản lý VẾT VIỆT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A695C] hover:bg-[#F3EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A3728] mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#C04A37]" />
                <span>Mã PIN Quản Trị *</span>
              </span>
              <span className="text-[11px] text-[#7A695C] font-normal">
                Mặc định: <strong className="text-[#C04A37]">123456</strong>
              </span>
            </label>
            <input
              type="password"
              autoFocus
              required
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nhập mã PIN 6 số..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#4A3728]/20 text-center text-lg font-mono tracking-widest text-[#2D1E18] focus:outline-none focus:border-[#C04A37] focus:ring-2 focus:ring-[#C04A37]/20"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#C04A37] hover:bg-[#9C3322] text-white text-sm font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Đăng Nhập Quản Trị</span>
            </button>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 bg-white border border-[#4A3728]/20 hover:border-[#C04A37] text-xs font-medium text-[#4A3728] hover:text-[#C04A37] rounded-xl transition-colors"
            >
              ⚡ Đăng nhập nhanh Admin (Mã: 123456)
            </button>
          </div>

          <div className="text-[11px] text-center text-[#7A695C] pt-2 border-t border-[#4A3728]/10">
            Truy cập dành riêng cho ban quản lý thương hiệu và vận hành đơn hàng.
          </div>
        </form>
      </div>
    </div>
  );
};
