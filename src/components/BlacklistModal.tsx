import React from 'react';
import { X, ShieldAlert, UserCheck, Ban } from 'lucide-react';
import { BannedUser } from '../types/voiceRoom';

interface BlacklistModalProps {
  bannedUsers: BannedUser[];
  isOpen: boolean;
  onClose: () => void;
  onUnban: (userId: string) => void;
  fontClass: string;
}

export const BlacklistModal: React.FC<BlacklistModalProps> = ({
  bannedUsers,
  isOpen,
  onClose,
  onUnban,
  fontClass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-lg bg-[#0e141d] border border-rose-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-500/20 bg-rose-950/20">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold text-rose-100 ${fontClass}`}>
                Oda Kara Listesi (Blacklist)
              </h2>
              <p className="text-xs text-slate-400">
                Yasaklanan kullanıcılar ve moderasyon işlem kaydı
              </p>
            </div>
          </div>
          <button
            id="close-blacklist-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3">
          {bannedUsers.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Ban className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">Kara listede yasaklanmış kimse bulunmuyor.</p>
              <p className="text-xs text-slate-500 mt-1">Oda kurallarını ihlal edenler buraya eklenir.</p>
            </div>
          ) : (
            bannedUsers.map((user) => (
              <div
                key={user.id}
                id={`banned-user-${user.id}`}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/30 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-rose-500/50"
                  />
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">{user.name}</div>
                    <div className="text-xs text-rose-400/90 mt-0.5">
                      Gerekçe: {user.reason}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Yasaklayan: {user.bannedBy} • {user.bannedAt}
                    </div>
                  </div>
                </div>

                <button
                  id={`unban-btn-${user.id}`}
                  onClick={() => onUnban(user.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Yasağı Kaldır ve Odaya Giriş İzni Ver"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Yasağı Kaldır</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center text-xs text-slate-400">
          <span>Toplam {bannedUsers.length} yasaklı kullanıcı</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
