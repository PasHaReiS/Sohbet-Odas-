import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Lock, 
  Sparkles, 
  Radio, 
  Type, 
  Users, 
  AlertCircle 
} from 'lucide-react';
import { RoomSettings, FrameStyle, FontFamily } from '../types/voiceRoom';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (settings: {
    name: string;
    roomPassword: string;
    maxParticipants: number;
    selectedFrame: FrameStyle;
    selectedFont: FontFamily;
  }) => void;
  fontClass: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  fontClass,
}) => {
  const [name, setName] = useState('Ses Odası');
  const [roomPassword, setRoomPassword] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [selectedFrame, setSelectedFrame] = useState<FrameStyle>('gold');
  const [selectedFont, setSelectedFont] = useState<FontFamily>('cinzel');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Lütfen bir oda adı giriniz.');
      return;
    }
    // Mandatory Password enforcement
    if (!roomPassword.trim()) {
      setError('Zorunlu Güvenlik Kuralı: Şifresiz oda oluşturulamaz! Lütfen bir oda şifresi belirleyin.');
      return;
    }

    setError('');
    onCreateRoom({
      name: name.trim(),
      roomPassword: roomPassword.trim(),
      maxParticipants,
      selectedFrame,
      selectedFont,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-[#0e141d] border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-500/20 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold text-amber-100 ${fontClass}`}>
                Lüks VIP Temalı WebRTC Ses Odası Kurulumu
              </h2>
              <p className="text-xs text-slate-400">
                Lüks VIP temalı WebRTC ses odası kurulumu ve güvenlik yapılandırması
              </p>
            </div>
          </div>
          <button
            id="close-create-room-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Room Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Oda Başlığı:
            </label>
            <input
              id="create-room-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ses Odası"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors text-sm"
            />
          </div>

          {/* Mandatory Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Zorunlu Oda Şifresi:</span>
              </label>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                ZORUNLU ALAN
              </span>
            </div>
            <input
              id="create-room-password-input"
              type="text"
              required
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              placeholder="Şifresiz oda kurulamaz (Örn: Royal777)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 placeholder-slate-500 outline-none focus:border-amber-400 font-mono transition-colors text-sm"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              * Not: Davet linki ürettiğinizde misafirler bu şifreyi girmeden bypass ile odaya katılabilir.
            </p>
          </div>

          {/* Max Participants */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Maksimum Katılımcı (12-50 VIP Koltuk):</span>
              </label>
              <span className="text-xs font-bold text-amber-300 font-mono">
                {maxParticipants} Kişi
              </span>
            </div>
            <input
              id="create-room-capacity-range"
              type="range"
              min={12}
              max={50}
              step={1}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Default Frame Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Varsayılan VIP Çerçeve Teması:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {[
                { id: 'gold', label: 'Altın V.I.P' },
                { id: 'neon', label: 'Safir Neon' },
                { id: 'classic', label: 'Zümrüt Klasik' },
                { id: 'ruby', label: 'Yakut Ateşi' },
                { id: 'platinum', label: 'Platin Elit' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFrame(f.id as FrameStyle)}
                  className={`p-2 rounded-lg text-xs font-medium border text-center transition-all ${
                    selectedFrame === f.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-amber-400" />
              Tipografi / Yazı Karakteri:
            </label>
            <select
              id="create-room-font-select"
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value as FontFamily)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs outline-none focus:border-amber-500"
            >
              <option value="cinzel">Cinzel (Roman Lüks Casino)</option>
              <option value="plus-jakarta">Plus Jakarta Sans (Modern Sade)</option>
              <option value="playfair">Playfair Display (Boutique VIP)</option>
              <option value="montserrat">Montserrat (Geometrik Net)</option>
              <option value="orbitron">Orbitron (Cyber Neon)</option>
              <option value="russo">Russo One (Turnuva E-Spor)</option>
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              İptal
            </button>
            <button
              id="submit-create-room-btn"
              type="submit"
              className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Odayı Başlat</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
