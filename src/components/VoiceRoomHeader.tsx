import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Share2, 
  ShieldAlert, 
  Settings, 
  Grid2X2, 
  Grid3X3, 
  LayoutGrid,
  Radio, 
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  Users,
  Edit3,
  User,
  LogOut
} from 'lucide-react';
import { RoomSettings, Participant, GridColumns, FontFamily } from '../types/voiceRoom';
import { voiceSounds } from '../utils/voiceSounds';

interface VoiceRoomHeaderProps {
  room: RoomSettings;
  participants: Participant[];
  currentUser: Participant;
  soundEffectsEnabled: boolean;
  onToggleSoundEffects: () => void;
  onToggleLock: () => void;
  onOpenInvite: () => void;
  onOpenSettings: () => void;
  onOpenBlacklist: () => void;
  onOpenEditName?: () => void;
  onLeaveRoom?: () => void;
  onChangeGrid: (cols: GridColumns) => void;
  onChangeFont: (font: FontFamily) => void;
  fontClass: string;
}

export const VoiceRoomHeader: React.FC<VoiceRoomHeaderProps> = ({
  room,
  participants,
  currentUser,
  soundEffectsEnabled,
  onToggleSoundEffects,
  onToggleLock,
  onOpenInvite,
  onOpenSettings,
  onOpenBlacklist,
  onOpenEditName,
  onLeaveRoom,
  onChangeGrid,
  fontClass,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Active room timer: starts from 00:00 and increments indefinitely
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - room.createdAt) / 1000));
      setElapsedSeconds(diffSec);
    }, 1000);
    return () => clearInterval(interval);
  }, [room.createdAt]);

  const formatTimer = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const speakingCount = participants.filter(p => p.isSpeaking && !p.isMuted).length;
  const canModerate = currentUser.role === 'owner' || currentUser.role === 'admin';

  return (
    <header className="w-full bg-[#0d1219]/90 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Room Title, Status Badges & Elapsed Timer */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-950/40 border border-amber-500/40 text-amber-400 shadow-inner">
            <Radio className="w-5 h-5 animate-pulse text-amber-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#0d1219] animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#0d1219]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-base md:text-lg font-bold tracking-wide text-amber-100 ${fontClass}`}>
                {room.name}
              </h1>
              {room.isLocked ? (
                <span 
                  id="room-locked-badge"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-950/60 text-rose-400 border border-rose-500/40"
                  title="Oda Kilitli: Sadece yetkililer veya davet linki olanlar girebilir"
                >
                  <Lock className="w-3 h-3" />
                  KİLİTLİ
                </span>
              ) : (
                <span 
                  id="room-open-badge"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                >
                  <Unlock className="w-3 h-3" />
                  AÇIK
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              {/* Indefinite Timer Counter */}
              <div 
                id="voice-room-timer"
                className="flex items-center gap-1.5 font-mono text-amber-300/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
                title="Aktif Oda Süresi"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Süre:</span>
                <span className="font-bold">{formatTimer(elapsedSeconds)}</span>
              </div>

              {/* Participant Count */}
              <div className="flex items-center gap-1 text-slate-300">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>{participants.length} / {room.maxParticipants} VIP</span>
              </div>

              {/* Active Speaking Indicator */}
              {speakingCount > 0 && (
                <div className="hidden sm:flex items-center gap-1 text-emerald-400 font-medium">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  <span>{speakingCount} kişi konuşuyor</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Controls (Lock, Grid Switcher, Invite, DSP Settings, Blacklist) */}
        <div className="flex items-center gap-2">
          {/* Grid Layout Switcher (2'li vs 3'lü) */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800">
            <button
              id="grid-2-col-btn"
              onClick={() => onChangeGrid(2)}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                room.gridColumns === 2 
                  ? 'bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="2'li Izgara Sıralaması"
            >
              <Grid2X2 className="w-4 h-4" />
              <span className="hidden md:inline">2'li</span>
            </button>
            <button
              id="grid-3-col-btn"
              onClick={() => onChangeGrid(3)}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                room.gridColumns === 3 
                  ? 'bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="3'lü Izgara Sıralaması"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden md:inline">3'lü</span>
            </button>
            <button
              id="grid-4-col-btn"
              onClick={() => onChangeGrid(4)}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                room.gridColumns === 4 
                  ? 'bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/40' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="4'lü Izgara Sıralaması (Kompakt)"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">4'lü</span>
            </button>
          </div>

          {/* Admin Lock / Unlock Toggle */}
          {canModerate && (
            <button
              id="toggle-room-lock-btn"
              onClick={() => {
                voiceSounds.playLockSound();
                onToggleLock();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                room.isLocked
                  ? 'bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 border-rose-600/50 shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={room.isLocked ? "Odayı Herkese Aç (Kilidi Kaldır)" : "Odayı Kilitle"}
            >
              {room.isLocked ? <Lock className="w-3.5 h-3.5 text-rose-400" /> : <Unlock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{room.isLocked ? 'Kilidi Aç' : 'Odayı Kilitle'}</span>
            </button>
          )}

          {/* Invite Link Modal Button */}
          <button
            id="open-invite-modal-btn"
            onClick={onOpenInvite}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
            title="Şifresiz Davet Linki Üret & Paylaş"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Davet Linki</span>
          </button>

          {/* Blacklist (Kara Liste) Button for Admins */}
          {canModerate && (
            <button
              id="open-blacklist-modal-btn"
              onClick={onOpenBlacklist}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 transition-colors"
              title="Kara Liste & Yasaklı Kullanıcılar"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Kara Liste</span>
            </button>
          )}

          {/* Current User Name Profile / Quick Edit */}
          {onOpenEditName && (
            <button
              id="header-edit-my-name-btn"
              onClick={onOpenEditName}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-amber-500/30 flex items-center gap-1.5 transition-colors shadow-sm"
              title="İsminizi Değiştirin"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-amber-200 max-w-[90px] truncate">{currentUser.name}</span>
              <Edit3 className="w-3 h-3 text-slate-400" />
            </button>
          )}

          {/* Button Sound Effects Toggle (Buton Sesi Aç/Kapat) */}
          <button
            id="toggle-sound-effects-btn"
            onClick={onToggleSoundEffects}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              soundEffectsEnabled
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={soundEffectsEnabled ? "Buton ve Arayüz Seslerini Kapat" : "Buton ve Arayüz Seslerini Aç"}
          >
            {soundEffectsEnabled ? (
              <Bell className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <BellOff className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="hidden sm:inline">
              {soundEffectsEnabled ? 'Buton Sesi: Açık' : 'Buton Sesi: Kapalı'}
            </span>
          </button>

          {/* DSP & Room Customization Settings */}
          <button
            id="open-dsp-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Ses ve DSP Ayarları / Görünüm"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Odadan Ayrıl & Anasayfaya Dön Butonu */}
          {onLeaveRoom && (
            <button
              id="leave-room-header-btn"
              onClick={onLeaveRoom}
              className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-rose-200 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ml-1"
              title="Ses Odasından Ayrıl ve Anasayfaya Dön"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Odadan Ayrıl</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
