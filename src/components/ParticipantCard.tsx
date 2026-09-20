import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  MoreVertical, 
  Shield, 
  ShieldCheck, 
  UserMinus, 
  Ban, 
  Crown, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { Participant, FrameStyle } from '../types/voiceRoom';
import { voiceSounds } from '../utils/voiceSounds';

interface ParticipantCardProps {
  participant: Participant;
  currentUser: Participant;
  globalFrame: FrameStyle;
  fontClass: string;
  onKick: (id: string) => void;
  onBan: (id: string) => void;
  onToggleMute: (id: string) => void;
  onToggleMuteAuthority: (id: string) => void;
  onEditName?: () => void;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  currentUser,
  globalFrame,
  fontClass,
  onKick,
  onBan,
  onToggleMute,
  onToggleMuteAuthority,
  onEditName,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Frame resolution
  const frame: FrameStyle = participant.frameStyle || globalFrame;

  // Compact sleek frame styling
  const getFrameClasses = (f: FrameStyle, isSpeaking: boolean) => {
    switch (f) {
      case 'gold':
        return {
          wrapper: isSpeaking 
            ? 'ring-2 ring-amber-400 border-amber-400/90 shadow-[0_0_14px_rgba(245,158,11,0.5)]' 
            : 'border-amber-500/35 hover:border-amber-400/60 shadow-[0_0_8px_rgba(245,158,11,0.1)]',
          avatarBorder: 'border-2 border-amber-400',
          accentColor: 'text-amber-400',
        };
      case 'neon':
        return {
          wrapper: isSpeaking 
            ? 'ring-2 ring-cyan-400 border-cyan-400/90 shadow-[0_0_14px_rgba(6,182,212,0.5)]' 
            : 'border-cyan-500/35 hover:border-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.1)]',
          avatarBorder: 'border-2 border-cyan-400',
          accentColor: 'text-cyan-400',
        };
      case 'classic':
        return {
          wrapper: isSpeaking 
            ? 'ring-2 ring-emerald-400 border-emerald-400/90 shadow-[0_0_14px_rgba(16,185,129,0.5)]' 
            : 'border-emerald-600/35 hover:border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.1)]',
          avatarBorder: 'border-2 border-emerald-400',
          accentColor: 'text-emerald-400',
        };
      case 'ruby':
        return {
          wrapper: isSpeaking 
            ? 'ring-2 ring-rose-500 border-rose-500/90 shadow-[0_0_14px_rgba(244,63,94,0.5)]' 
            : 'border-rose-500/35 hover:border-rose-400/60 shadow-[0_0_8px_rgba(244,63,94,0.1)]',
          avatarBorder: 'border-2 border-rose-500',
          accentColor: 'text-rose-400',
        };
      case 'platinum':
      default:
        return {
          wrapper: isSpeaking 
            ? 'ring-2 ring-slate-200 border-slate-200/90 shadow-[0_0_14px_rgba(226,232,240,0.4)]' 
            : 'border-slate-600/35 hover:border-slate-400/60 shadow-[0_0_8px_rgba(203,213,225,0.1)]',
          avatarBorder: 'border-2 border-slate-300',
          accentColor: 'text-slate-200',
        };
    }
  };

  const isSpeakingNow = participant.isSpeaking && !participant.isMuted;
  const frameTheme = getFrameClasses(frame, isSpeakingNow);

  // Compact role icon (User requested hiding text labels like "oda kurucusu", "admin", "moderatör")
  const getRoleIcon = (role: Participant['role']) => {
    switch (role) {
      case 'owner':
        return (
          <span title="Oda Kurucusu" className="p-0.5 rounded bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
            <Crown className="w-3 h-3 text-amber-400" />
          </span>
        );
      case 'admin':
        return (
          <span title="Admin" className="p-0.5 rounded bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
            <Shield className="w-3 h-3 text-sky-400" />
          </span>
        );
      case 'moderator':
        return (
          <span title="Moderatör" className="p-0.5 rounded bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
          </span>
        );
      case 'vip':
        return (
          <span title="VIP Oyuncu" className="p-0.5 rounded bg-slate-900/80 border border-slate-700/50 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-purple-400" />
          </span>
        );
      default:
        return null;
    }
  };

  const roleIcon = getRoleIcon(participant.role);

  // Moderation check
  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';
  const canActOnThisUser = (isOwnerOrAdmin || currentUser.canMuteOthers) && !participant.isSelf && participant.role !== 'owner';

  return (
    <div
      id={`participant-${participant.id}`}
      className={`relative group bg-[#0e141d]/95 backdrop-blur-sm rounded-xl p-2 sm:p-2.5 border transition-all duration-200 flex flex-col justify-between overflow-visible min-h-[125px] sm:min-h-[135px] ${frameTheme.wrapper}`}
    >
      {/* Top compact bar: Subtle minimal role icon + chip badge (NO role text labels as requested) */}
      <div className="flex items-center justify-between gap-1.5 h-4 mb-1">
        <div className="flex items-center gap-1">
          {/* Only subtle icon if present, no text label */}
          {roleIcon}

          {participant.chipsBadge && (
            <span className="text-[9px] font-mono font-medium px-1 py-0.2 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/20 truncate max-w-[80px]">
              {participant.chipsBadge}
            </span>
          )}
        </div>

        {/* Action Menu button or Edit Self Name button */}
        {participant.isSelf && onEditName ? (
          <button
            id={`edit-self-name-btn-${participant.id}`}
            onClick={onEditName}
            className="p-0.5 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
            title="İsmini Değiştir"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        ) : canActOnThisUser ? (
          <div className="relative">
            <button
              id={`menu-btn-${participant.id}`}
              onClick={() => setShowMenu(!showMenu)}
              className="p-0.5 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
              title="Yönetim Menüsü"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowMenu(false)} 
                />
                <div className="absolute right-0 top-6 w-44 bg-[#131b26] border border-amber-500/30 rounded-lg shadow-2xl z-40 py-1 text-xs">
                  <button
                    id={`action-mute-${participant.id}`}
                    onClick={() => {
                      onToggleMute(participant.id);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-amber-500/20 flex items-center gap-2"
                  >
                    {participant.isMuted ? (
                      <>
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Sesi Aç (Unmute)</span>
                      </>
                    ) : (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sustur (Mute)</span>
                      </>
                    )}
                  </button>

                  {isOwnerOrAdmin && (
                    <button
                      id={`action-delegate-mute-${participant.id}`}
                      onClick={() => {
                        onToggleMuteAuthority(participant.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-amber-500/20 flex items-center gap-2 border-t border-slate-800"
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>{participant.canMuteOthers ? 'Yetkiyi Geri Al' : 'Susturma Yetkisi Ver'}</span>
                    </button>
                  )}

                  {isOwnerOrAdmin && (
                    <button
                      id={`action-kick-${participant.id}`}
                      onClick={() => {
                        voiceSounds.playBanSound();
                        onKick(participant.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-amber-300 hover:bg-amber-500/20 flex items-center gap-2 border-t border-slate-800"
                    >
                      <UserMinus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Odadan At (Kick)</span>
                    </button>
                  )}

                  {isOwnerOrAdmin && (
                    <button
                      id={`action-ban-${participant.id}`}
                      onClick={() => {
                        voiceSounds.playBanSound();
                        onBan(participant.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 border-t border-slate-800"
                    >
                      <Ban className="w-3.5 h-3.5 text-rose-400" />
                      <span>Yasakla (Ban)</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Center: Scaled-down Compact Avatar & Name */}
      <div className="flex flex-col items-center justify-center my-0.5">
        <div className="relative">
          {/* Speaking ripple */}
          {isSpeakingNow && (
            <>
              <span className="absolute -inset-1.5 rounded-full bg-emerald-500/30 animate-ping" />
              <span className="absolute -inset-0.5 rounded-full bg-emerald-400/40 blur-xs animate-pulse" />
            </>
          )}

          {/* Scaled-down compact avatar (w-12 h-12 / w-13 h-13) */}
          <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden ${frameTheme.avatarBorder}`}>
            <img 
              src={participant.avatar} 
              alt={participant.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />
          </div>

          {/* Mute badge */}
          <div 
            className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shadow-md border text-[9px] ${
              participant.isMuted 
                ? 'bg-rose-900/90 text-rose-200 border-rose-500' 
                : isSpeakingNow 
                  ? 'bg-emerald-600 text-white border-emerald-400' 
                  : 'bg-slate-800 text-slate-300 border-slate-600'
            }`}
          >
            {participant.isMuted ? <MicOff className="w-2.5 h-2.5" /> : <Mic className="w-2.5 h-2.5" />}
          </div>

          {/* Mute delegation badge */}
          {participant.canMuteOthers && participant.role !== 'owner' && (
            <div 
              className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full bg-amber-500 text-[#0b0f14] flex items-center justify-center shadow border border-amber-300"
              title="Moderatör Yetkili"
            >
              <Shield className="w-2.5 h-2.5" />
            </div>
          )}
        </div>

        {/* Compact User Name */}
        <div className="mt-1 text-center w-full px-1">
          <div className="flex items-center justify-center gap-1">
            <span className={`text-xs sm:text-[13px] font-bold text-slate-100 truncate max-w-[110px] sm:max-w-[130px] ${fontClass}`}>
              {participant.name}
            </span>
            {participant.isSelf && (
              <button
                type="button"
                id={`edit-my-name-badge-${participant.id}`}
                onClick={onEditName}
                className="text-[9px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 px-1 py-0.2 rounded border border-amber-500/30 flex items-center gap-0.5 cursor-pointer transition-colors"
                title="İsminizi Değiştirmek İçin Tıklayın"
              >
                <span>Sen</span>
                <Edit3 className="w-2.5 h-2.5 text-amber-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Compact Real-time Decibel Audio Level Meter */}
      <div className="mt-1 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-0.5">
          <span className="flex items-center gap-1 truncate">
            <span className={`w-1.5 h-1.5 rounded-full ${isSpeakingNow ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="truncate">{isSpeakingNow ? 'Konuşuyor' : participant.isMuted ? 'Sessiz' : 'Dinliyor'}</span>
          </span>
          <span className="font-mono text-[9px]">{participant.isMuted ? '0 dB' : `${participant.audioLevel}%`}</span>
        </div>

        {/* 8-bar Equalizer */}
        <div className="flex items-end justify-between gap-0.5 h-2 px-1 bg-slate-900/90 rounded py-0.5 border border-slate-800/80">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((barIdx) => {
            const barThreshold = barIdx * 12;
            const isActive = isSpeakingNow && participant.audioLevel >= barThreshold;
            const barColor = barIdx > 6 ? 'bg-rose-500' : barIdx > 4 ? 'bg-amber-400' : 'bg-emerald-400';

            return (
              <span
                key={barIdx}
                className={`flex-1 rounded-xs transition-all duration-75 ${
                  isActive ? `${barColor} h-full` : 'bg-slate-800/50 h-0.5'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
