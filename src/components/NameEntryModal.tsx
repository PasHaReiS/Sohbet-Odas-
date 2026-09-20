import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  ArrowRight, 
  X,
  Crown,
  UserCheck
} from 'lucide-react';
import { voiceSounds } from '../utils/voiceSounds';

interface NameEntryModalProps {
  isOpen: boolean;
  isInitialEntry: boolean; // true if first entering the room, false if changing name inside room
  currentName?: string;
  onConfirm: (name: string, rememberMember: boolean) => void;
  onClose?: () => void;
  fontClass: string;
}

export const NameEntryModal: React.FC<NameEntryModalProps> = ({
  isOpen,
  isInitialEntry,
  currentName = '',
  onConfirm,
  onClose,
  fontClass,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [rememberMember, setRememberMember] = useState(true);
  const [error, setError] = useState('');
  const [isRegisteredMember, setIsRegisteredMember] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Check if user has a registered member name in storage
    try {
      const savedRegisteredName = localStorage.getItem('royal_vip_member_name');
      if (savedRegisteredName && savedRegisteredName.trim().length > 0) {
        setIsRegisteredMember(true);
        // If registered member, prefill with their registered name
        setNameInput(currentName || savedRegisteredName.trim());
      } else {
        // Not a registered member: name MUST come blank as requested!
        setIsRegisteredMember(false);
        setNameInput(isInitialEntry ? '' : (currentName || ''));
      }
    } catch {
      setIsRegisteredMember(false);
      setNameInput(isInitialEntry ? '' : (currentName || ''));
    }
    setError('');
  }, [isOpen, isInitialEntry, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();

    // Strict validation: cannot be empty!
    if (!trimmed) {
      setError('İsim alanı boş geçilemez! Lütfen geçerli bir isim veya takma ad yazınız.');
      return;
    }

    if (trimmed.length < 2) {
      setError('İsim en az 2 karakterden oluşmalıdır.');
      return;
    }

    if (trimmed.length > 30) {
      setError('İsim en fazla 30 karakter olabilir.');
      return;
    }

    setError('');
    voiceSounds.playPttSound(true);
    onConfirm(trimmed, rememberMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-[#0e141d] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              {isRegisteredMember ? <Crown className="w-5 h-5 text-amber-300" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2 ${fontClass}`}>
                <span>{isInitialEntry ? 'Salona Giriş & İsim Belirleme' : 'İsmini Değiştir'}</span>
                {isRegisteredMember && (
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    Kayıtlı Üye
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isInitialEntry 
                  ? 'Ses odasına katılmadan önce masada görünecek isminizi giriniz.'
                  : 'Yeni isminiz salondaki diğer katılımcılara anında yansıtılacaktır.'}
              </p>
            </div>
          </div>

          {!isInitialEntry && onClose && (
            <button
              id="close-name-modal-btn"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Member Status Badge */}
          {isRegisteredMember ? (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  Kayıtlı VIP üye profiliniz algılandı. İsminiz otomatik olarak kutuya aktarıldı.
                </span>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  id="switch-to-guest-btn"
                  onClick={() => {
                    localStorage.removeItem('royal_vip_member_name');
                    setIsRegisteredMember(false);
                    setNameInput('');
                  }}
                  className="text-[11px] text-amber-400/80 hover:text-amber-300 underline underline-offset-2"
                >
                  Farklı / Misafir olarak gir (Kayıtlı ismi sıfırla)
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <span>
                Kayıtlı üye değilsiniz (Misafir). Lütfen masada görünecek VIP isminizi giriniz.
              </span>
            </div>
          )}

          {/* Validation Error */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input field */}
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Görünecek İsim / VIP Takma Ad (Zorunlu):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {nameInput.trim().length} / 30
              </span>
            </label>
            <input
              id="user-name-input"
              type="text"
              required
              autoFocus
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError('');
              }}
              placeholder={isRegisteredMember ? "Kayıtlı isminiz..." : "İsminizi yazınız (örn: Kerem Royal)..."}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/30 text-white placeholder-slate-500 text-sm transition-all outline-none"
            />
          </div>

          {/* Remember member checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              id="remember-member-checkbox"
              type="checkbox"
              checked={rememberMember}
              onChange={(e) => setRememberMember(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500/40 cursor-pointer accent-amber-500"
            />
            <label htmlFor="remember-member-checkbox" className="text-xs text-slate-300 select-none cursor-pointer">
              Beni bu cihazda kayıtlı üye olarak hatırla (Bir sonraki girişte otomatik hazır gelsin)
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-800">
            {!isInitialEntry && onClose && (
              <button
                type="button"
                id="cancel-name-change-btn"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Vazgeç
              </button>
            )}

            <button
              type="submit"
              id="confirm-name-btn"
              disabled={!nameInput.trim()}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                nameInput.trim()
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-900/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isInitialEntry ? (
                <>
                  <span>Salona Giriş Yap</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>İsmi Güncelle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
