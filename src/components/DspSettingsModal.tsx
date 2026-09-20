import React from 'react';
import { 
  X, 
  Volume2, 
  Sliders, 
  Radio, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Check, 
  Lock,
  Zap,
  Bell,
  BellOff
} from 'lucide-react';
import { RoomSettings, FrameStyle, FontFamily } from '../types/voiceRoom';

interface DspSettingsModalProps {
  room: RoomSettings;
  soundEffectsEnabled: boolean;
  onToggleSoundEffects: () => void;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDsp: (settings: Partial<RoomSettings>) => void;
  fontClass: string;
}

export const DspSettingsModal: React.FC<DspSettingsModalProps> = ({
  room,
  soundEffectsEnabled,
  onToggleSoundEffects,
  isOpen,
  onClose,
  onUpdateDsp,
  fontClass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl bg-[#0e141d] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold text-amber-100 ${fontClass}`}>
                Gelişmiş Ses ve DSP İyileştirmeleri
              </h2>
              <p className="text-xs text-slate-400">
                WebRTC & Web Audio filtreleri, donanım seviyesi gürültü önleme ve arka plan kalıcılığı
              </p>
            </div>
          </div>
          <button
            id="close-dsp-settings-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section 1: DSP Hardware Filters */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-amber-400 mb-3 flex items-center gap-1.5">
              <Radio className="w-4 h-4" />
              WebRTC Dijital Sinyal İşleme (DSP)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Echo Cancellation (AEC) */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>AEC - Yankı Önleme</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Hoparlörden çıkan sesin mikrofona geri dönmesini ve eko yapmasını donanımsal engeller.
                  </p>
                </div>
                <button
                  id="toggle-aec-btn"
                  onClick={() => onUpdateDsp({ echoCancellation: !room.echoCancellation })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    room.echoCancellation ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>

              {/* Noise Suppression */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span>Gürültü Engelleme (Noise Suppression)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Klavye tıkırtısı, klima ve ortam gürültüsünü filtreleyip yalnızca insan sesini iletir.
                  </p>
                </div>
                <button
                  id="toggle-noise-suppression-btn"
                  onClick={() => onUpdateDsp({ noiseSuppression: !room.noiseSuppression })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    room.noiseSuppression ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>

              {/* Automatic Gain Control (AGC) */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>AGC - Otomatik Kazanç Denetimi</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Mikrofona uzaklığa göre giriş kazancını anlık modüle eder.
                  </p>
                </div>
                <button
                  id="toggle-agc-btn"
                  onClick={() => onUpdateDsp({ autoGainControl: !room.autoGainControl })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    room.autoGainControl ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>

              {/* Volume Normalization (Compressor) */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-sky-400" />
                    <span>Ses Dengeleme (Compressor)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Kısık sesle konuşanları yükseltir, bağıranların ses patlamasını yumuşatarak dengeler.
                  </p>
                </div>
                <button
                  id="toggle-volume-norm-btn"
                  onClick={() => onUpdateDsp({ volumeNormalization: !room.volumeNormalization })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    room.volumeNormalization ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Background Audio & WebRTC Keep-Alive */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-amber-200 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Arka Planda Çalışma (Keep-Alive & Background Audio)</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Kullanıcı başka bir sekmeye geçtiğinde veya mobil cihaz ekranı kilitlendiğinde, tarayıcının ses bağlantısını dondurmasını önleyen özel taşıyıcı sinyal modu.
                </p>
              </div>
              <button
                id="toggle-keepalive-btn"
                onClick={() => onUpdateDsp({ backgroundAudioKeepAlive: !room.backgroundAudioKeepAlive })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${
                  room.backgroundAudioKeepAlive ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
              </button>
            </div>
          </div>

          {/* Section 3: UI Button Audio Feedback */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  {soundEffectsEnabled ? (
                    <Bell className="w-4 h-4 text-amber-400" />
                  ) : (
                    <BellOff className="w-4 h-4 text-rose-400" />
                  )}
                  <span>Arayüz ve Buton Tıklama Sesleri (Audio Feedback)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Mikrofon açma/kapatma, PTT basma/bırakma, odaya katılma ve buton tıklamalarında duyulan akustik bildirim tonlarını açar veya tamamen kapatır.
                </p>
              </div>
              <button
                id="toggle-dsp-sound-effects-btn"
                onClick={onToggleSoundEffects}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${
                  soundEffectsEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
                title={soundEffectsEnabled ? 'Buton Seslerini Kapat' : 'Buton Seslerini Aç'}
              >
                <span className="w-4 h-4 rounded-full bg-slate-950 shadow-md transform transition-transform" />
              </button>
            </div>
          </div>

          {/* Section 4: Room Security Info */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Zorunlu Oda Şifresi:
              </span>
              <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                {room.roomPassword}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Bu şifre odaya doğrudan katılmak isteyenler için zorunludur. Davet linki ile katılanlar şifreyi otomatik bypass eder.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button
            id="close-dsp-modal-confirm-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors"
          >
            Tamam ve Uygula
          </button>
        </div>
      </div>
    </div>
  );
};
