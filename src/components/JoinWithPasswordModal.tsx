import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { RoomSettings } from '../types/voiceRoom';

interface JoinWithPasswordModalProps {
  room: RoomSettings;
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: () => void;
  fontClass: string;
}

export const JoinWithPasswordModal: React.FC<JoinWithPasswordModalProps> = ({
  room,
  isOpen,
  onClose,
  onJoinSuccess,
  fontClass,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === room.roomPassword) {
      setError('');
      onJoinSuccess();
    } else {
      setError('Hatalı oda şifresi! Lütfen tekrar deneyiniz veya davet linki isteyiniz.');
    }
  };

  const handleBypassJoin = () => {
    // Davet linki ile bypass girişi
    setError('');
    onJoinSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-[#0e141d] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-amber-500/20 bg-amber-950/20 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className={`text-lg font-bold text-amber-100 ${fontClass}`}>
            Oda Şifresi Gereklidir
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            "{room.name}" odasına katılmak için oda şifresini girin veya VIP davet linkini kullanın.
          </p>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Oda Şifresi:</span>
              </label>
              <input
                id="join-password-input"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Şifreyi giriniz"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-300 placeholder-slate-500 outline-none focus:border-amber-400 font-mono text-sm"
              />
            </div>

            <button
              id="submit-join-password-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Unlock className="w-4 h-4" />
              <span>Şifre ile Odaya Giriş Yap</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-[#0e141d] text-[11px] text-slate-500 font-medium">
              VEYA
            </span>
          </div>

          {/* Bypass Button */}
          <button
            id="join-via-bypass-link-btn"
            type="button"
            onClick={handleBypassJoin}
            className="w-full py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>VIP Davet Linki ile Katıl (Şifresiz Bypass)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
