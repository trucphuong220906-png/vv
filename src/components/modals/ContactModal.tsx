import React, { useState } from 'react';
import { X, Globe, Mail, Phone, CircleCheck, Send } from 'lucide-react';
import { ContactInquiry, InquiryType } from '../../types/adminTypes';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquiryCreated?: (inquiry: ContactInquiry) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onInquiryCreated,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactType, setContactType] = useState<InquiryType>('gift-inquiry');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newInquiry: ContactInquiry = {
      id: 'inq-' + Date.now(),
      name,
      email,
      type: contactType,
      message,
      createdAt: new Date().toISOString(),
      status: 'unread',
    };

    setIsSuccess(true);
    if (onInquiryCreated) {
      onInquiryCreated(newInquiry);
    }

    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1E18]/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-2xl w-full border border-[#4A3728]/15 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 border-b border-[#4A3728]/10 flex items-center justify-between bg-white">
          <div>
            <span className="font-display font-bold text-lg text-[#C04A37]">
              VẾT VIỆT
            </span>
            <span className="text-xs text-[#7A695C] ml-2">
              · Không gian kết nối di sản
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A695C] hover:bg-[#F3EDE2] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left: Contact Info */}
          <div className="md:col-span-5 bg-[#F3EDE2] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#4A3728]/10">
            <div>
              <h3 className="font-display font-semibold text-base text-[#2D1E18] mb-4">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-4 text-xs text-[#4A3728]">
                <div className="p-3.5 rounded-xl bg-white/70 border border-[#4A3728]/10 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#C04A37]" />
                    <span className="font-semibold text-[#2D1E18]">Hỗ trợ: Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#C04A37]" />
                    <a
                      href="mailto:vetviet.vn"
                      className="hover:underline text-[#C04A37] font-medium"
                    >
                      vetviet.vn
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C04A37]" />
                    <a
                      href="tel:0344381763"
                      className="hover:underline text-[#C04A37] font-medium"
                    >
                      0344381763
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-lg bg-white/70 text-[11px] text-[#7A695C] italic">
              Nhận thiết kế riêng cho sự kiện văn hóa, đám cưới truyền thống và quà tặng doanh nghiệp quốc tế.
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:col-span-7 p-6">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 space-y-3">
                <CircleCheck className="w-12 h-12 text-emerald-600" />
                <h4 className="font-display text-lg font-bold text-[#2D1E18]">
                  Đã Gửi Thành Công!
                </h4>
                <p className="text-xs text-[#7A695C] max-w-xs">
                  VẾT VIỆT đã nhận được tin nhắn và sẽ phản hồi qua email của bạn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] mb-1">
                    Nội dung liên hệ
                  </label>
                  <select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value as InquiryType)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-xs text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                  >
                    <option value="gift-inquiry">Tư vấn chọn quà lưu niệm</option>
                    <option value="corporate">Hộp quà doanh nghiệp / Sự kiện</option>
                    <option value="custom">Gia công khắc tên & thiết kế riêng</option>
                    <option value="feedback">Góp ý & hợp tác văn hóa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] mb-1">
                    Họ và tên bạn *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Hà My"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-xs text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] mb-1">
                    Email liên hệ *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hamy@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-xs text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A3728] mb-1">
                    Lời nhắn *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hãy chia sẻ mong muốn hoặc yêu cầu đặt quà của bạn..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-[#4A3728]/20 text-xs text-[#2D1E18] focus:outline-none focus:border-[#C04A37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#C04A37] hover:bg-[#9C3322] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi lời nhắn</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
