import React, { useState } from 'react';
import { 
  Radio, 
  Plus, 
  Lock, 
  Unlock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  Copy, 
  Check, 
  Crown, 
  Bell, 
  BellOff, 
  Edit3, 
  User, 
  Sliders, 
  ShieldAlert,
  DoorOpen,
  Headphones,
  Trash2
} from 'lucide-react';
import { RoomSettings, Participant } from '../types/voiceRoom';
import { voiceSounds } from '../utils/voiceSounds';

interface VoiceRoomLobbyProps {
  rooms: RoomSettings[];
  currentUserId: string;
  currentUser: Participant;
  activeRoomId: string | null;
  soundEffectsEnabled: boolean;
  onToggleSoundEffects: () => void;
  onOpenCreateRoom: () => void;
  onJoinRoom: (room: RoomSettings) => void;
  onToggleLockRoomFromOutside: (roomId: string) => void;
  onDeleteRoomFromOutside: (roomId: string) => void;
  onOpenEditName: () => void;
  fontClass: string;
}

export const VoiceRoomLobby: React.FC<VoiceRoomLobbyProps> = ({
  rooms,
  currentUser,
  activeRoomId,
  soundEffectsEnabled,
  onToggleSoundEffects,
  onOpenCreateRoom,
  onJoinRoom,
  onToggleLockRoomFromOutside,
  onDeleteRoomFromOutside,
  onOpenEditName,
  fontClass,
}) => {
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomToDelete, setRoomToDelete] = useState<RoomSettings | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Admin capability check: owner, admin, or moderator
  const isAdmin = currentUser.role === 'owner' || currentUser.role === 'admin' || currentUser.role === 'moderator';

  const handleCopyInvite = (e: React.MouseEvent, room: RoomSettings) => {
    e.stopPropagation();
    const url = `${window.location.origin}?invite=${room.inviteToken || 'vip-bypass'}`;
    navigator.clipboard.writeText(url);
    setCopiedRoomId(room.id);
    voiceSounds.playPttSound(true);
    setTimeout(() => {
      setCopiedRoomId(null);
    }, 2500);
  };

  const filteredRooms = rooms.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen bg-[#070a0e] text-slate-100 flex flex-col ${fontClass}`}>
      {/* Lobby Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0a0f17]/95 border-b border-amber-500/20 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-amber-100 tracking-wide">
                  Royal VIP WebRTC Ses Odaları
                </h1>
                <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-sans font-semibold">
                  Lobi / Anasayfa
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                50 Kişilik VIP Masalar • WebRTC Düşük Gecikme • DSP Filtreleme
              </p>
            </div>
          </div>

          {/* User Status & Actions */}
          <div className="flex items-center gap-2">
            {/* User Profile / Name edit */}
            <button
              id="lobby-user-profile-btn"
              onClick={onOpenEditName}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-amber-500/30 flex items-center gap-2 transition-all shadow-sm"
              title="İsminizi Değiştirin"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-[10px]">
                <User className="w-3 h-3" />
              </div>
              <span className="font-bold text-amber-200 max-w-[100px] truncate">{currentUser.name}</span>
              <Edit3 className="w-3 h-3 text-slate-400 hover:text-amber-300" />
            </button>

            {/* Sound FX Toggle */}
            <button
              id="lobby-toggle-sound-fx-btn"
              onClick={onToggleSoundEffects}
              className={`p-2 rounded-xl border text-xs transition-colors ${
                soundEffectsEnabled
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title={soundEffectsEnabled ? "Buton Seslerini Kapat" : "Buton Seslerini Aç"}
            >
              {soundEffectsEnabled ? (
                <Bell className="w-4 h-4 text-amber-400" />
              ) : (
                <BellOff className="w-4 h-4 text-rose-400" />
              )}
            </button>

            {/* Create Room Button in Lobby */}
            <button
              id="lobby-create-room-btn"
              onClick={onOpenCreateRoom}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-900/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ses Odası Oluştur</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Quick Stats Section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 pb-4">
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0d141e] via-[#101824] to-[#0d141e] border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Crown className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Ses Odası Anasayfası
              </span>
              {isAdmin && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Dışarıdan Kilitleme Yetkisi Aktif
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Canlı WebRTC Ses Odaları Listesi
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Odalara katılabilir, admin yetkinizle odaları dışarıdan kilitleyebilir veya yeni lüks VIP ses odası kurabilirsiniz.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Oda ara (Örn: Ses Odası)..."
              className="w-full md:w-60 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-full bg-amber-500/5 blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Room Cards Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Headphones className="w-4 h-4 text-amber-400" />
            <span>Aktif Odalar ({filteredRooms.length})</span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Adminler odaları dışarıdaki kilit butonundan anında kilitleyebilir</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((roomItem) => {
            const isCurrentActiveRoom = activeRoomId === roomItem.id;

            return (
              <div
                key={roomItem.id}
                className={`relative rounded-2xl bg-[#0d131c] border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  roomItem.isLocked
                    ? 'border-rose-500/30 hover:border-rose-500/50 shadow-[0_4px_20px_rgba(244,63,94,0.08)]'
                    : 'border-amber-500/30 hover:border-amber-500/50 shadow-[0_4px_20px_rgba(245,158,11,0.08)]'
                }`}
              >
                {/* Top Banner of Card */}
                <div className="p-4 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-transparent">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        roomItem.isLocked
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                          : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      }`}>
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{roomItem.name}</span>
                          {isCurrentActiveRoom && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                              Şu an Buradasınız
                            </span>
                          )}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono">
                          ID: {roomItem.id}
                        </p>
                      </div>
                    </div>

                    {/* Lock Status Badge & Delete Button */}
                    <div className="flex items-center gap-1.5">
                      {roomItem.isLocked ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[10px] font-semibold flex items-center gap-1">
                          <Lock className="w-3 h-3 text-rose-400" />
                          Kilitli
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold flex items-center gap-1">
                          <Unlock className="w-3 h-3 text-emerald-400" />
                          Açık
                        </span>
                      )}

                      {/* Odayı Dışarıdan Sil Butonu */}
                      <button
                        id={`delete-room-header-btn-${roomItem.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(roomItem.id);
                        }}
                        className="p-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/70 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition-colors cursor-pointer"
                        title="Odayı Dışarıdan Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-3 flex-1 text-xs">
                  {/* Participant Capacity */}
                  <div>
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Kapasite:</span>
                      </span>
                      <span className="font-bold text-slate-200 flex items-center gap-1.5">
                        <span>{isCurrentActiveRoom ? 1 : 0} / {roomItem.maxParticipants || 50} Katılımcı</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isCurrentActiveRoom ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/80 text-slate-400 border border-slate-700/50'}`}>
                          {isCurrentActiveRoom ? 'Şu An Odadasınız' : 'Boş Oda'}
                        </span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCurrentActiveRoom 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                            : 'bg-slate-700'
                        }`}
                        style={{ width: `${((isCurrentActiveRoom ? 1 : 0) / (roomItem.maxParticipants || 50)) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Room features pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-emerald-400" />
                      <span>WebRTC DSP Aktif</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>VIP Masa</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-sky-400" />
                      <span>Zorunlu Şifre</span>
                    </span>
                  </div>
                </div>

                {/* Card Action Controls: Join, Copy, Admin Lock, Delete from Outside */}
                <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex flex-col gap-2">
                  {confirmDeleteId === roomItem.id ? (
                    <div className="p-2.5 bg-rose-950/70 border border-rose-500/50 rounded-xl flex items-center justify-between gap-2 animate-in fade-in duration-150">
                      <div className="flex items-center gap-1.5 text-xs text-rose-200 font-semibold">
                        <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Oda silinsin mi?</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`cancel-inline-delete-${roomItem.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                        >
                          Vazgeç
                        </button>
                        <button
                          id={`confirm-inline-delete-${roomItem.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRoomFromOutside(roomItem.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950 border border-rose-400 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Evet, Sil</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Join Room Button */}
                      <button
                        id={`join-room-btn-${roomItem.id}`}
                        onClick={() => onJoinRoom(roomItem)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCurrentActiveRoom
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-900/30'
                        }`}
                      >
                        <DoorOpen className="w-4 h-4" />
                        <span>{isCurrentActiveRoom ? 'Salona Geri Dön' : 'Odaya Katıl'}</span>
                      </button>

                      {/* Copy Invite Link */}
                      <button
                        id={`copy-invite-btn-${roomItem.id}`}
                        onClick={(e) => handleCopyInvite(e, roomItem)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors cursor-pointer"
                        title="Oda Davet Linkini Kopyala (Bypass)"
                      >
                        {copiedRoomId === roomItem.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      {/* Odayı Dışarıdan Sil Butonu */}
                      <button
                        id={`delete-room-action-${roomItem.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(roomItem.id);
                        }}
                        className="px-2.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/70 text-rose-400 hover:text-rose-200 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                        title="Odayı Dışarıdan Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-[11px] font-semibold">Sil</span>
                      </button>
                    </div>
                  )}

                  {/* ADMIN: Lock / Unlock from the outside! */}
                  {isAdmin && (
                    <button
                      id={`admin-toggle-lock-btn-${roomItem.id}`}
                      onClick={() => onToggleLockRoomFromOutside(roomItem.id)}
                      className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        roomItem.isLocked
                          ? 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/40 shadow-sm'
                          : 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border-rose-500/40 shadow-sm'
                      }`}
                      title={roomItem.isLocked ? "Odanın Kilidini Dışarıdan Kaldır" : "Odayı Dışarıdan Kilitle"}
                    >
                      {roomItem.isLocked ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kilidi Dışarıdan Aç (Admin)</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-rose-400" />
                          <span>Odayı Dışarıdan Kilitle (Admin)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRooms.length === 0 && (
            <div className="col-span-full py-12 px-4 text-center rounded-2xl bg-[#0c1219]/60 border border-slate-800 flex flex-col items-center justify-center">
              <Radio className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-slate-200 mb-1">Hiç Ses Odası Bulunamadı</h3>
              <p className="text-xs text-slate-400 mb-4 max-w-sm">
                {searchQuery ? 'Aramanıza uygun ses odası bulunamadı.' : 'Henüz mevcut bir ses odası bulunmuyor. Yeni bir oda kurabilirsiniz.'}
              </p>
              <button
                id="empty-create-room-btn"
                onClick={onOpenCreateRoom}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Ses Odası Kur</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Odayı Dışarıdan Silme Onay Modalı */}
      {roomToDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0c1219] border border-rose-500/40 p-5 shadow-2xl shadow-rose-950/40 text-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Ses Odasını Sil</h3>
                <p className="text-xs text-rose-300">Bu işlem odayı dışarıdan tamamen silecektir.</p>
              </div>
            </div>

            <div className="bg-slate-900/70 rounded-xl p-3.5 border border-slate-800 mb-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Oda Adı:</span>
                <span className="font-semibold text-white">{roomToDelete.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Oda ID:</span>
                <span className="font-mono text-slate-400">{roomToDelete.id}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Kapasite:</span>
                <span className="text-amber-300">{roomToDelete.maxParticipants || 50} Katılımcı</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              <strong className="text-rose-400 font-semibold">"{roomToDelete.name}"</strong> odasını ve tüm yapılandırmasını dışarıdan silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                id="cancel-delete-room-btn"
                onClick={() => setRoomToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                id="confirm-delete-room-btn"
                onClick={() => {
                  onDeleteRoomFromOutside(roomToDelete.id);
                  setRoomToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 border border-rose-500 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Evet, Odayı Sil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
