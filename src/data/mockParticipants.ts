import { Participant, BannedUser } from '../types/voiceRoom';

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'user-self',
    name: 'Kullanıcı',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'owner',
    isSelf: true,
    isMuted: true,
    isSpeaking: false,
    audioLevel: 0,
    canMuteOthers: true,
    frameStyle: 'gold',
    chipsBadge: '👑 Oda Sahibi',
    joinedAt: 'Şimdi',
    ping: 18,
  }
];

export const INITIAL_BANNED_USERS: BannedUser[] = [];

