import React, { useState } from 'react';
import { X, Share2, Copy, Check, ShieldCheck, Link2, QrCode } from 'lucide-react';
import { RoomSettings } from '../types/voiceRoom';

interface InviteModalProps {
  room: RoomSettings;
  isOpen: boolean;
  onClose: () => void;
  fontClass: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  room,
  isOpen,
  onClose,
  fontClass,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate realistic invite link containing room ID and secure bypass token
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://royal-casino.app';
  const inviteUrl = `${origin}/?room=${room.id}&token=${room.inviteToken}&bypass=true`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(inviteUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-[#0e141d] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-amber-950/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold text-amber-100 ${fontClass}`}>
                Oda Davet Linki & Bypass
              </h2>
              <p className="text-xs text-slate-400">
                Şifre sormadan doğrudan giriş sağlayan VIP davet bağlantısı
              </p>
            </div>
          </div>
          <button
            id="close-invite-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200">
              <span className="font-bold block text-emerald-100 mb-0.5">Şifresiz Doğrudan Katılım (Bypass):</span>
              Bu davet linki odaya özel şifrelenmiş VIP token taşır. Linki alan misafirler oda şifresi girmek zorunda kalmadan odaya bağlanır.
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-amber-400" />
              Paylaşılabilir VIP Davet Linki:
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2">
              <input
                id="invite-link-input"
                type="text"
                readOnly
                value={inviteUrl}
                className="bg-transparent text-xs text-slate-300 flex-1 outline-none font-mono px-1 select-all"
              />
              <button
                id="copy-invite-link-btn"
                onClick={handleCopy}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'Kopyala'}</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-amber-400" />
              VIP Token Kimliği:
            </span>
            <span className="font-mono text-amber-300 font-semibold bg-slate-800 px-2 py-0.5 rounded">
              {room.inviteToken}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
