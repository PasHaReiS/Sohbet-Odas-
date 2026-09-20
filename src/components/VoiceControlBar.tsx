import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Radio, 
  Sparkles,
  Type,
  Maximize2,
  Bell,
  BellOff,
  LogOut
} from 'lucide-react';
import { VoiceMode, FrameStyle, FontFamily } from '../types/voiceRoom';
import { voiceSounds } from '../utils/voiceSounds';

interface VoiceControlBarProps {
  voiceMode: VoiceMode;
  isMuted: boolean;
  isDeafened: boolean;
  isPttActive: boolean;
  soundEffectsEnabled: boolean;
  onToggleSoundEffects: () => void;
  myVolume: number;
  selectedFrame: FrameStyle;
  selectedFont: FontFamily;
  onToggleVoiceMode: (mode: VoiceMode) => void;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onPttStart: () => void;
  onPttEnd: () => void;
  onLeaveRoom?: () => void;
  onSelectFrame: (frame: FrameStyle) => void;
  onSelectFont: (font: FontFamily) => void;
  fontClass: string;
}

export const VoiceControlBar: React.FC<VoiceControlBarProps> = ({
  voiceMode,
  isMuted,
  isDeafened,
  isPttActive,
  soundEffectsEnabled,
  onToggleSoundEffects,
  myVolume,
  selectedFrame,
  selectedFont,
  onToggleVoiceMode,
  onToggleMute,
  onToggleDeafen,
  onPttStart,
  onPttEnd,
  onLeaveRoom,
  onSelectFrame,
  onSelectFont,
  fontClass,
}) => {
  const [showQuickCustomizer, setShowQuickCustomizer] = useState(false);

  // Keyboard shortcut listener:
  // Spacebar for PTT (when in PTT mode)
  // 'M' for toggle Mute (when not typing in an input)
  useEffect(() => {
    let spacePressed = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' && voiceMode === 'ptt' && !spacePressed) {
        e.preventDefault();
        spacePressed = true;
        onPttStart();
      } else if ((e.key === 'm' || e.key === 'M') && !e.repeat) {
        onToggleMute();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space' && voiceMode === 'ptt') {
        e.preventDefault();
        spacePressed = false;
        onPttEnd();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [voiceMode, onPttStart, onPttEnd, onToggleMute]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d1219]/95 backdrop-blur-lg border-t border-amber-500/30 px-3 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Mode Switcher (Open Mic vs Push-to-Talk) & Audio Level */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              id="mode-open-mic-btn"
              onClick={() => {
                onToggleVoiceMode('open');
                voiceSounds.playPttSound(false);
              }}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                voiceMode === 'open'
                  ? 'bg-amber-500 text-[#0b0f14] shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Açık Mikrofon</span>
            </button>

            <button
              id="mode-ptt-btn"
              onClick={() => {
                onToggleVoiceMode('ptt');
                voiceSounds.playPttSound(true);
              }}
              className={`px-3 py-2 min-h-[44px] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                voiceMode === 'ptt'
                  ? 'bg-amber-500 text-[#0b0f14] shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Bas-Konuş (PTT)</span>
            </button>
          </div>

          {/* Real-time Mic Level Gauge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/70 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Mikrofon:</span>
            <div className="w-20 sm:w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 flex items-center">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  isMuted && !isPttActive
                    ? 'w-0'
                    : myVolume > 70 
                      ? 'bg-rose-500' 
                      : myVolume > 40 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-400'
                }`}
                style={{ width: isMuted && !isPttActive ? '0%' : `${Math.min(100, myVolume)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-300 w-7 text-right">
              {isMuted && !isPttActive ? '0%' : `${myVolume}%`}
            </span>
          </div>
        </div>

        {/* Center: Main Primary Voice Action */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
          {voiceMode === 'open' ? (
            /* Open Mic Primary Mute / Unmute Button */
            <button
              id="main-mute-toggle-btn"
              onClick={onToggleMute}
              className={`flex-1 sm:flex-none min-h-[48px] px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg select-none ${
                isMuted
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 ring-2 ring-emerald-400/40 animate-pulse'
              }`}
            >
              {isMuted ? (
                <>
                  <MicOff className="w-5 h-5" />
                  <span>Sessizi Aç [M]</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Sesi Kapat (Sustur) [M]</span>
                </>
              )}
            </button>
          ) : (
            /* Push-To-Talk (PTT) Giant Touch / Click Control */
            <button
              id="ptt-big-button"
              onMouseDown={onPttStart}
              onMouseUp={onPttEnd}
              onTouchStart={(e) => {
                e.preventDefault();
                onPttStart();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                onPttEnd();
              }}
              className={`flex-1 sm:flex-none min-h-[52px] px-8 py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all select-none cursor-pointer border ${
                isPttActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-400/70 shadow-[0_0_30px_rgba(16,185,129,0.7)] scale-[1.02]'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#0b0f14] border-amber-300/50 shadow-amber-900/30 active:scale-95'
              }`}
            >
              <Radio className={`w-5 h-5 ${isPttActive ? 'animate-spin' : ''}`} />
              <span>
                {isPttActive 
                  ? 'YAYINDASIN (KONUŞUYORSUN)...' 
                  : 'BAS VE TUT KONUŞ (SPACE)'}
              </span>
            </button>
          )}

          {/* Deafen Toggle Button */}
          <button
            id="deafen-toggle-btn"
            onClick={onToggleDeafen}
            className={`min-h-[48px] px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isDeafened
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title={isDeafened ? 'Sağırlaştırmayı Kapat (Oda Sesini Aç)' : 'Kulaklığı Kapat (Sağırlaştır)'}
          >
            {isDeafened ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isDeafened ? 'Sesi Aç' : 'Sağırlaştır'}</span>
          </button>
        </div>

        {/* Right: Sound FX Toggle & Quick Frame/Font Personalizer */}
        <div className="flex items-center gap-2">
          {/* Button Sound FX Toggle */}
          <button
            id="control-bar-sound-fx-btn"
            onClick={onToggleSoundEffects}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              soundEffectsEnabled
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border-slate-800'
            }`}
            title={soundEffectsEnabled ? "Buton Tıklama Seslerini Kapat" : "Buton Tıklama Seslerini Aç"}
          >
            {soundEffectsEnabled ? (
              <Bell className="w-4 h-4 text-amber-400" />
            ) : (
              <BellOff className="w-4 h-4 text-rose-400" />
            )}
            <span className="hidden xl:inline">
              {soundEffectsEnabled ? 'Buton Sesi: Açık' : 'Buton Sesi: Kapalı'}
            </span>
          </button>

          <button
            id="quick-customizer-toggle-btn"
            onClick={() => setShowQuickCustomizer(!showQuickCustomizer)}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showQuickCustomizer
                ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Çerçeve & Font</span>
          </button>

          {/* Odadan Ayrıl Butonu */}
          {onLeaveRoom && (
            <button
              id="control-bar-leave-room-btn"
              onClick={onLeaveRoom}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-500/50 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-rose-100 transition-all shadow-md shadow-rose-950/30 cursor-pointer"
              title="Ses Odasından Ayrıl ve Anasayfaya Dön"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline">Odadan Ayrıl</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Personalizer Drawer */}
      {showQuickCustomizer && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Frame selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Çerçeve Tasarımı:
            </span>
            {(['gold', 'neon', 'classic', 'ruby', 'platinum'] as FrameStyle[]).map((frame) => {
              const names = {
                gold: '👑 Altın V.I.P',
                neon: '💎 Safir Neon',
                classic: '🎲 Klasik Casino',
                ruby: '🔥 Yakut Ateşi',
                platinum: '⚡ Platin Elit',
              };
              return (
                <button
                  key={frame}
                  id={`frame-btn-${frame}`}
                  onClick={() => onSelectFrame(frame)}
                  className={`px-2.5 py-1.5 rounded-lg border transition-all ${
                    selectedFrame === frame
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {names[frame]}
                </button>
              );
            })}
          </div>

          {/* Font selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              Yazı Tipi (Font):
            </span>
            {(['cinzel', 'plus-jakarta', 'playfair', 'montserrat', 'orbitron', 'russo'] as FontFamily[]).map((font) => {
              const fontLabels = {
                cinzel: 'Cinzel (Lüks)',
                'plus-jakarta': 'Plus Jakarta',
                playfair: 'Playfair Display',
                montserrat: 'Montserrat',
                orbitron: 'Orbitron',
                russo: 'Russo One',
              };
              return (
                <button
                  key={font}
                  id={`font-btn-${font}`}
                  onClick={() => onSelectFont(font)}
                  className={`px-2 py-1.5 rounded-lg border transition-all text-[11px] ${
                    selectedFont === font
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {fontLabels[font]}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
