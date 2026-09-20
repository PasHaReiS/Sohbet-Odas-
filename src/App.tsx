import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RoomSettings, 
  Participant, 
  BannedUser, 
  GridColumns, 
  VoiceMode, 
  FrameStyle, 
  FontFamily 
} from './types/voiceRoom';
import { INITIAL_PARTICIPANTS, INITIAL_BANNED_USERS } from './data/mockParticipants';
import { audioDspService } from './utils/audioDspEngine';
import { voiceSounds } from './utils/voiceSounds';
import { VoiceRoomHeader } from './components/VoiceRoomHeader';
import { ParticipantCard } from './components/ParticipantCard';
import { VoiceControlBar } from './components/VoiceControlBar';
import { DspSettingsModal } from './components/DspSettingsModal';
import { BlacklistModal } from './components/BlacklistModal';
import { InviteModal } from './components/InviteModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { JoinWithPasswordModal } from './components/JoinWithPasswordModal';
import { NameEntryModal } from './components/NameEntryModal';
import { VoiceRoomLobby } from './components/VoiceRoomLobby';
import { Plus, Shield, CheckCircle2, User, LogOut, Users } from 'lucide-react';

const DEFAULT_ROOMS: RoomSettings[] = [
  {
    id: 'room-ses-odasi-1',
    name: 'Ses Odası',
    roomPassword: '123',
    inviteToken: 'vip-token-ses-1',
    isLocked: false,
    createdAt: Date.now() - 340000,
    maxParticipants: 50,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    volumeNormalization: true,
    backgroundAudioKeepAlive: true,
    selectedFrame: 'gold',
    selectedFont: 'cinzel',
    gridColumns: 3,
  },
  {
    id: 'room-ses-odasi-2',
    name: 'Ses Odası #2',
    roomPassword: '123',
    inviteToken: 'vip-token-ses-2',
    isLocked: false,
    createdAt: Date.now() - 120000,
    maxParticipants: 50,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    volumeNormalization: true,
    backgroundAudioKeepAlive: true,
    selectedFrame: 'neon',
    selectedFont: 'cinzel',
    gridColumns: 3,
  },
  {
    id: 'room-ses-odasi-3',
    name: 'Ses Odası #3 (VIP Özel)',
    roomPassword: '123',
    inviteToken: 'vip-token-ses-3',
    isLocked: true, // Initially locked for admin unlock test from outside
    createdAt: Date.now() - 50000,
    maxParticipants: 50,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    volumeNormalization: true,
    backgroundAudioKeepAlive: true,
    selectedFrame: 'ruby',
    selectedFont: 'cinzel',
    gridColumns: 3,
  },
];

export default function App() {
  // Navigation view: 'lobby' (Anasayfa) vs 'room' (Ses Odası İçi)
  const [currentView, setCurrentView] = useState<'lobby' | 'room'>('lobby');

  // Rooms collection with persistent storage
  const [rooms, setRooms] = useState<RoomSettings[]>(() => {
    try {
      const saved = localStorage.getItem('royal_all_voice_rooms');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_ROOMS;
  });

  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  // Currently active room object
  const room = (activeRoomId ? rooms.find(r => r.id === activeRoomId) : null) || rooms[0] || DEFAULT_ROOMS[0];

  const setRoom = (updated: RoomSettings | ((prev: RoomSettings) => RoomSettings)) => {
    setRooms(prev => {
      const current = (activeRoomId ? prev.find(r => r.id === activeRoomId) : null) || prev[0] || DEFAULT_ROOMS[0];
      const nextRoom = typeof updated === 'function' ? updated(current) : updated;
      const exists = prev.some(r => r.id === nextRoom.id);
      const newRooms = exists 
        ? prev.map(r => r.id === nextRoom.id ? nextRoom : r)
        : [nextRoom, ...prev];
      setActiveRoomId(nextRoom.id);
      return newRooms;
    });
  };

  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      const savedName = localStorage.getItem('royal_vip_member_name');
      if (savedName && savedName.trim().length > 0) {
        return INITIAL_PARTICIPANTS.map(p => p.isSelf ? { ...p, name: savedName.trim() } : p);
      }
    } catch {}
    return INITIAL_PARTICIPANTS;
  });
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>(INITIAL_BANNED_USERS);

  // User Voice State
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('open');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isDeafened, setIsDeafened] = useState<boolean>(false);
  const [isPttActive, setIsPttActive] = useState<boolean>(false);
  const [myVolume, setMyVolume] = useState<number>(0);

  // Modals
  const [showDspModal, setShowDspModal] = useState<boolean>(false);
  const [showBlacklistModal, setShowBlacklistModal] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showJoinPasswordModal, setShowJoinPasswordModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Room Entrance & Name Edit Modal
  const [showNameEntryModal, setShowNameEntryModal] = useState<boolean>(true);
  const [isInitialEntry, setIsInitialEntry] = useState<boolean>(true);

  // Sound effects feedback state (button click sounds)
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState<boolean>(() => voiceSounds.soundEffectsEnabled);

  const currentUser = participants.find(p => p.isSelf) || participants[0];

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const handleToggleSoundEffects = useCallback(() => {
    const next = voiceSounds.toggleSoundEffects();
    setSoundEffectsEnabled(next);
    showToast(next ? 'Buton ve arayüz sesleri açıldı' : 'Buton ve arayüz sesleri kapatıldı (Sessiz mod)');
  }, [showToast]);

  const handleOpenEditName = useCallback(() => {
    setIsInitialEntry(false);
    setShowNameEntryModal(true);
  }, []);

  const handleConfirmName = useCallback((newName: string, remember: boolean) => {
    try {
      if (remember) {
        localStorage.setItem('royal_vip_member_name', newName);
      } else {
        localStorage.removeItem('royal_vip_member_name');
      }
    } catch {}

    setParticipants(prev => prev.map(p => p.isSelf ? { ...p, name: newName } : p));
    setShowNameEntryModal(false);

    if (isInitialEntry) {
      showToast(`Hoş geldiniz, ${newName}! Salona giriş yaptınız.`);
      voiceSounds.playJoinSound();
    } else {
      showToast(`İsminiz başarıyla "${newName}" olarak güncellendi.`);
    }
  }, [isInitialEntry, showToast]);

  // Save room configuration to storage
  useEffect(() => {
    localStorage.setItem('royal_voice_room_config', JSON.stringify(room));
  }, [room]);

  // Persist all rooms collection
  useEffect(() => {
    try {
      localStorage.setItem('royal_all_voice_rooms', JSON.stringify(rooms));
    } catch {}
  }, [rooms]);

  // Initialize Audio DSP Engine on component mount
  useEffect(() => {
    // Setup Volume change listener for local user
    audioDspService.setOnVolumeChange((vol, isSpeaking) => {
      setMyVolume(vol);

      setParticipants(prev => prev.map(p => {
        if (p.isSelf) {
          const speaking = isSpeaking && !p.isMuted;
          return {
            ...p,
            audioLevel: speaking ? vol : 0,
            isSpeaking: speaking,
          };
        }
        return p;
      }));
    });

    // Start background carrier & DSP
    audioDspService.startMicrophone({
      echoCancellation: room.echoCancellation,
      noiseSuppression: room.noiseSuppression,
      autoGainControl: room.autoGainControl,
      volumeNormalization: room.volumeNormalization,
      backgroundAudioKeepAlive: room.backgroundAudioKeepAlive,
    });

    return () => {
      audioDspService.destroy();
    };
  }, []);

  // Sync DSP updates to service
  useEffect(() => {
    audioDspService.updateDspConfig({
      echoCancellation: room.echoCancellation,
      noiseSuppression: room.noiseSuppression,
      autoGainControl: room.autoGainControl,
      volumeNormalization: room.volumeNormalization,
      backgroundAudioKeepAlive: room.backgroundAudioKeepAlive,
    });
  }, [
    room.echoCancellation,
    room.noiseSuppression,
    room.autoGainControl,
    room.volumeNormalization,
    room.backgroundAudioKeepAlive,
  ]);

  // Check URL parameters for bypass invite link:
  // e.g. ?room=...&token=...&bypass=true
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const isBypass = urlParams.get('bypass') === 'true';
      const token = urlParams.get('token');
      if (isBypass || token === room.inviteToken) {
        showToast('VIP Davet Linki ile Şifresiz Doğrudan Katıldınız (Bypass Aktif)!');
        voiceSounds.playJoinSound();
      }
    }
  }, [room.inviteToken, showToast]);

  // Voice Mode Actions
  const handleToggleVoiceMode = (mode: VoiceMode) => {
    setVoiceMode(mode);
    if (mode === 'ptt') {
      // PTT default is muted until button/space is held
      setIsMuted(true);
      setIsPttActive(false);
      audioDspService.setMuted(true);
      updateSelfMuteState(true);
      showToast('Bas-Konuş (PTT) Modu Aktif: [SPACE] tuşunu veya ekrandaki butonu basılı tutun.');
    } else {
      showToast('Açık Mikrofon Modu Aktif: Sesi açıp kapatmak için [M] tuşunu kullanabilirsiniz.');
    }
  };

  const updateSelfMuteState = (muted: boolean) => {
    setParticipants(prev => prev.map(p => {
      if (p.isSelf) {
        return {
          ...p,
          isMuted: muted,
          isSpeaking: muted ? false : p.isSpeaking,
          audioLevel: muted ? 0 : p.audioLevel,
        };
      }
      return p;
    }));
  };

  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioDspService.setMuted(newMuted);
    updateSelfMuteState(newMuted);
    voiceSounds.playMuteSound(newMuted);
    showToast(newMuted ? 'Mikrofonunuz Susturuldu (Muted).' : 'Mikrofonunuz Açıldı (Canlı Yayındasınız).');
  }, [isMuted, showToast]);

  const handleToggleDeafen = () => {
    const newDeaf = !isDeafened;
    setIsDeafened(newDeaf);
    if (newDeaf && !isMuted) {
      // Auto-mute when deafened
      setIsMuted(true);
      audioDspService.setMuted(true);
      updateSelfMuteState(true);
    }
    voiceSounds.playMuteSound(newDeaf);
    showToast(newDeaf ? 'Kulaklık Kapatıldı (Sağırlaştırıldı).' : 'Kulaklık Açıldı (Oda Sesi Dinleniyor).');
  };

  const handlePttStart = useCallback(() => {
    if (voiceMode !== 'ptt') return;
    setIsPttActive(true);
    setIsMuted(false);
    audioDspService.setMuted(false);
    updateSelfMuteState(false);
    voiceSounds.playPttSound(true);
  }, [voiceMode]);

  const handlePttEnd = useCallback(() => {
    if (voiceMode !== 'ptt') return;
    setIsPttActive(false);
    setIsMuted(true);
    audioDspService.setMuted(true);
    updateSelfMuteState(true);
    voiceSounds.playPttSound(false);
  }, [voiceMode]);

  // Moderation Handlers
  const handleKickParticipant = (id: string) => {
    const target = participants.find(p => p.id === id);
    if (!target) return;
    setParticipants(prev => prev.filter(p => p.id !== id));
    showToast(`${target.name} odadan atıldı (Kicked).`);
  };

  const handleBanParticipant = (id: string) => {
    const target = participants.find(p => p.id === id);
    if (!target) return;

    // Add to Blacklist
    const newBan: BannedUser = {
      id: `ban-${Date.now()}`,
      name: target.name,
      avatar: target.avatar,
      bannedAt: 'Az önce',
      bannedBy: currentUser.name,
      reason: 'Oda kurallarına uymama / Yetkili kararı',
    };

    setBannedUsers(prev => [newBan, ...prev]);
    setParticipants(prev => prev.filter(p => p.id !== id));
    showToast(`${target.name} odadan yasaklandı ve Kara Listeye eklendi (Banned).`);
  };

  const handleUnbanUser = (userId: string) => {
    const banned = bannedUsers.find(b => b.id === userId);
    if (!banned) return;
    setBannedUsers(prev => prev.filter(b => b.id !== userId));
    showToast(`${banned.name} kullanıcısının yasağı kaldırıldı.`);
  };

  const handleToggleParticipantMute = (id: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const nextMuted = !p.isMuted;
        voiceSounds.playMuteSound(nextMuted);
        return {
          ...p,
          isMuted: nextMuted,
          isSpeaking: nextMuted ? false : p.isSpeaking,
          audioLevel: nextMuted ? 0 : p.audioLevel,
        };
      }
      return p;
    }));
  };

  const handleToggleMuteAuthority = (id: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        const nextAuth = !p.canMuteOthers;
        showToast(`${p.name} kullanıcısına ${nextAuth ? 'Susturma Yetkisi Verildi.' : 'Susturma Yetkisi Geri Alındı.'}`);
        return {
          ...p,
          canMuteOthers: nextAuth,
          role: nextAuth && p.role === 'guest' ? 'moderator' : p.role,
        };
      }
      return p;
    }));
  };

  // Lock Room Toggle (from inside room)
  const handleToggleLock = () => {
    const nextLocked = !room.isLocked;
    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, isLocked: nextLocked } : r));
    voiceSounds.playLockSound();
    showToast(nextLocked ? 'Oda Kilitlendi! Girişler durduruldu.' : 'Oda Kilidi Açıldı! Yeni katılımcılar gelebilir.');
  };

  // Admin Lock/Unlock room from outside (Lobby)
  const handleToggleLockRoomFromOutside = (roomId: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        const nextLock = !r.isLocked;
        voiceSounds.playLockSound();
        showToast(
          nextLock 
            ? `"${r.name}" odası dışarıdan kilitlendi (Admin).` 
            : `"${r.name}" odasının kilidi dışarıdan açıldı (Admin).`
        );
        return { ...r, isLocked: nextLock };
      }
      return r;
    }));
  };

  // Delete room from outside (Lobby)
  const handleDeleteRoomFromOutside = (roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    const roomName = targetRoom ? targetRoom.name : 'Ses Odası';

    const updatedRooms = rooms.filter(r => r.id !== roomId);
    setRooms(updatedRooms);
    try {
      localStorage.setItem('royal_all_voice_rooms', JSON.stringify(updatedRooms));
    } catch {}

    // If deleted room was the currently active room, reset to null
    if (activeRoomId === roomId) {
      setActiveRoomId(null);
    }

    voiceSounds.playDeleteSound();
    showToast(`"${roomName}" ses odası dışarıdan başarıyla silindi.`);
  };

  // Leave active room and return to voice room homepage / lobby
  const handleLeaveRoom = () => {
    if (isPttActive) {
      setIsPttActive(false);
    }
    setIsMuted(true);
    audioDspService.setMuted(true);
    voiceSounds.playLeaveSound();
    const leavingRoomName = room ? room.name : 'Ses Odası';
    setActiveRoomId(null);
    setCurrentView('lobby');
    showToast(`"${leavingRoomName}" odasından ayrıldınız. Ses odası anasayfasına dönüldü.`);
  };

  // Join room from lobby
  const handleJoinRoomFromLobby = (targetRoom: RoomSettings) => {
    setActiveRoomId(targetRoom.id);
    const isAdminUser = currentUser.role === 'owner' || currentUser.role === 'admin' || currentUser.role === 'moderator';
    if (targetRoom.isLocked && !isAdminUser) {
      setShowJoinPasswordModal(true);
    } else {
      setCurrentView('room');
      voiceSounds.playJoinSound();
      showToast(`"${targetRoom.name}" odasına katıldınız.`);
    }
  };

  // Customizations
  const handleSelectFrame = (frame: FrameStyle) => {
    setRoom(prev => ({ ...prev, selectedFrame: frame }));
    showToast(`VIP Çerçeve Değiştirildi: ${frame.toUpperCase()}`);
  };

  const handleSelectFont = (font: FontFamily) => {
    setRoom(prev => ({ ...prev, selectedFont: font }));
    showToast(`Yazı Tipi Değiştirildi: ${font}`);
  };

  const handleChangeGrid = (cols: GridColumns) => {
    setRoom(prev => ({ ...prev, gridColumns: cols }));
  };

  // Create New Room (Lüks VIP Temalı WebRTC Ses Odası Kurulumu)
  const handleCreateRoom = (data: {
    name: string;
    roomPassword: string;
    maxParticipants: number;
    selectedFrame: FrameStyle;
    selectedFont: FontFamily;
  }) => {
    const newRoom: RoomSettings = {
      id: `room-${Date.now()}`,
      name: data.name || 'Ses Odası',
      roomPassword: data.roomPassword,
      inviteToken: `token-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now(),
      maxParticipants: data.maxParticipants,
      selectedFrame: data.selectedFrame,
      selectedFont: data.selectedFont,
      isLocked: false,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      volumeNormalization: true,
      backgroundAudioKeepAlive: true,
      gridColumns: 3,
    };

    setRooms(prev => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    setShowCreateModal(false);
    setCurrentView('room');
    voiceSounds.playJoinSound();
    showToast(`"${newRoom.name}" başarıyla oluşturuldu ve odaya katıldınız!`);
  };

  // Font class resolver
  const getFontClass = (f: FontFamily): string => {
    switch (f) {
      case 'cinzel':
        return 'font-cinzel';
      case 'playfair':
        return 'font-playfair';
      case 'montserrat':
        return 'font-montserrat';
      case 'orbitron':
        return 'font-orbitron';
      case 'russo':
        return 'font-russo';
      case 'plus-jakarta':
      default:
        return 'font-plus-jakarta';
    }
  };

  const currentFontClass = getFontClass(room.selectedFont);

  // If in Lobby (Ses Odası Anasayfası) view:
  if (currentView === 'lobby') {
    return (
      <div className={`min-h-screen bg-[#070a0e] text-slate-100 ${currentFontClass}`}>
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/50 text-amber-200 text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Lobby Homepage */}
        <VoiceRoomLobby
          rooms={rooms}
          currentUserId={currentUser.id}
          currentUser={currentUser}
          activeRoomId={null}
          soundEffectsEnabled={soundEffectsEnabled}
          onToggleSoundEffects={handleToggleSoundEffects}
          onOpenCreateRoom={() => setShowCreateModal(true)}
          onJoinRoom={handleJoinRoomFromLobby}
          onToggleLockRoomFromOutside={handleToggleLockRoomFromOutside}
          onDeleteRoomFromOutside={handleDeleteRoomFromOutside}
          onOpenEditName={handleOpenEditName}
          fontClass={currentFontClass}
        />

        {/* Modals needed in lobby */}
        <CreateRoomModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateRoom={handleCreateRoom}
          fontClass={currentFontClass}
        />

        <JoinWithPasswordModal
          room={room}
          isOpen={showJoinPasswordModal}
          onClose={() => setShowJoinPasswordModal(false)}
          onJoinSuccess={() => {
            setShowJoinPasswordModal(false);
            setCurrentView('room');
            showToast(`"${room.name}" odasına başarıyla katıldınız!`);
            voiceSounds.playJoinSound();
          }}
          fontClass={currentFontClass}
        />

        <NameEntryModal
          isOpen={showNameEntryModal}
          isInitialEntry={isInitialEntry}
          currentName={currentUser?.name}
          onConfirm={handleConfirmName}
          onClose={() => setShowNameEntryModal(false)}
          fontClass={currentFontClass}
        />
      </div>
    );
  }

  // Active Voice Room View (Ses Odası İçi - Yeni Oda Kur butonu kaldırıldı, Odadan Ayrıl eklendi)
  return (
    <div className={`min-h-screen bg-[#070a0e] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-neutral-950 pb-28 ${currentFontClass}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/50 text-amber-200 text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar with Leave Room action */}
      <VoiceRoomHeader
        room={room}
        participants={participants}
        currentUser={currentUser}
        soundEffectsEnabled={soundEffectsEnabled}
        onToggleSoundEffects={handleToggleSoundEffects}
        onToggleLock={handleToggleLock}
        onOpenInvite={() => setShowInviteModal(true)}
        onOpenSettings={() => setShowDspModal(true)}
        onOpenBlacklist={() => setShowBlacklistModal(true)}
        onOpenEditName={handleOpenEditName}
        onLeaveRoom={handleLeaveRoom}
        onChangeGrid={handleChangeGrid}
        onChangeFont={handleSelectFont}
        fontClass={currentFontClass}
      />

      {/* Main Voice Room Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5">
        {/* Top Info Bar: Status & Leave Room Button (No Create Room button inside room) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-[#0c1219]/60 border border-slate-800/80 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Güvenlik: Zorunlu Şifre & Şifresiz Davet Bypass Aktif</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">
              DSP: AEC, AGC, Gürültü Filtreleme & Keep-Alive Açık
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Odadan Ayrıl & Anasayfaya Dön Butonu (Oda içerisinde yeni oda butonu bulunmaz) */}
            <button
              id="leave-room-topbar-btn"
              onClick={handleLeaveRoom}
              className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Ses Odasından Ayrıl ve Ses Odası Anasayfasına Geri Dön"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Odadan Ayrıl (Anasayfa)</span>
            </button>

            <button
              id="test-join-password-btn"
              onClick={() => setShowJoinPasswordModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              title="Şifre veya Bypass Giriş Testi"
            >
              <span>Şifre Testi</span>
            </button>

            <button
              id="test-name-entry-btn"
              onClick={() => {
                setIsInitialEntry(true);
                setShowNameEntryModal(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors flex items-center gap-1"
              title="Odaya Giriş İsim Ekranını Test Et"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Giriş İsim Ekranı</span>
            </button>

            <button
              id="invite-room-topbar-btn"
              onClick={() => setShowInviteModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-colors flex items-center gap-1.5"
              title="Arkadaşlarını Odaya Davet Et"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Davet Et ({participants.length}/{room.maxParticipants || 50})</span>
            </button>
          </div>
        </div>

        {/* Empty Room Notice - Confirms to user that room is completely empty without bots */}
        {participants.length <= 1 && (
          <div className="mb-3 px-4 py-3 rounded-xl bg-slate-900/80 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                <strong className="text-amber-300 font-semibold">Oda Boş:</strong> Şu an bu ses odasında yalnızca siz varsınız. Herhangi bir bot veya sahte katılımcı bulunmaz.
              </span>
            </div>
            <button
              id="invite-empty-room-btn"
              onClick={() => setShowInviteModal(true)}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Davet Linki Al</span>
            </button>
          </div>
        )}

        {/* 12-50 Participant Luxury Casino Grid with Strict Column Enforcements */}
        <div
          id="participants-grid"
          className={`grid gap-2 sm:gap-2.5 transition-all ${
            room.gridColumns === 2
              ? 'grid-cols-2'
              : room.gridColumns === 4
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3'
          }`}
        >
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              currentUser={currentUser}
              globalFrame={room.selectedFrame}
              fontClass={currentFontClass}
              onKick={handleKickParticipant}
              onBan={handleBanParticipant}
              onToggleMute={handleToggleParticipantMute}
              onToggleMuteAuthority={handleToggleMuteAuthority}
              onEditName={handleOpenEditName}
            />
          ))}
        </div>
      </main>

      {/* Floating Bottom Voice Control Bar */}
      <VoiceControlBar
        voiceMode={voiceMode}
        isMuted={isMuted}
        isDeafened={isDeafened}
        isPttActive={isPttActive}
        soundEffectsEnabled={soundEffectsEnabled}
        onToggleSoundEffects={handleToggleSoundEffects}
        myVolume={myVolume}
        selectedFrame={room.selectedFrame}
        selectedFont={room.selectedFont}
        onToggleVoiceMode={handleToggleVoiceMode}
        onToggleMute={handleToggleMute}
        onToggleDeafen={handleToggleDeafen}
        onPttStart={handlePttStart}
        onPttEnd={handlePttEnd}
        onLeaveRoom={handleLeaveRoom}
        onSelectFrame={handleSelectFrame}
        onSelectFont={handleSelectFont}
        fontClass={currentFontClass}
      />

      {/* DSP Settings Modal */}
      <DspSettingsModal
        room={room}
        soundEffectsEnabled={soundEffectsEnabled}
        onToggleSoundEffects={handleToggleSoundEffects}
        isOpen={showDspModal}
        onClose={() => setShowDspModal(false)}
        onUpdateDsp={(updated) => setRoom(prev => ({ ...prev, ...updated }))}
        fontClass={currentFontClass}
      />

      {/* Blacklist Modal */}
      <BlacklistModal
        bannedUsers={bannedUsers}
        isOpen={showBlacklistModal}
        onClose={() => setShowBlacklistModal(false)}
        onUnban={handleUnbanUser}
        fontClass={currentFontClass}
      />

      {/* Invite Modal (Bypass Link) */}
      <InviteModal
        room={room}
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        fontClass={currentFontClass}
      />

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
        fontClass={currentFontClass}
      />

      {/* Join with Password / Bypass Modal */}
      <JoinWithPasswordModal
        room={room}
        isOpen={showJoinPasswordModal}
        onClose={() => setShowJoinPasswordModal(false)}
        onJoinSuccess={() => {
          setShowJoinPasswordModal(false);
          showToast('Odaya Başarıyla Katıldınız!');
          voiceSounds.playJoinSound();
        }}
        fontClass={currentFontClass}
      />

      {/* Name Entry Modal (Initial entrance + in-room name change) */}
      <NameEntryModal
        isOpen={showNameEntryModal}
        isInitialEntry={isInitialEntry}
        currentName={currentUser?.name}
        onConfirm={handleConfirmName}
        onClose={() => setShowNameEntryModal(false)}
        fontClass={currentFontClass}
      />
    </div>
  );
}
