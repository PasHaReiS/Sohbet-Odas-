export type FrameStyle = 'gold' | 'neon' | 'classic' | 'ruby' | 'platinum';

export type FontFamily = 'cinzel' | 'plus-jakarta' | 'playfair' | 'montserrat' | 'orbitron' | 'russo';

export type GridColumns = 2 | 3 | 4;

export type VoiceMode = 'open' | 'ptt';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'moderator' | 'vip' | 'guest';
  isSelf: boolean;
  isMuted: boolean;
  isDeafened?: boolean;
  isSpeaking: boolean;
  audioLevel: number; // 0 - 100
  canMuteOthers: boolean;
  frameStyle?: FrameStyle;
  chipsBadge?: string;
  joinedAt: string;
  ping: number;
}

export interface BannedUser {
  id: string;
  name: string;
  avatar: string;
  bannedAt: string;
  bannedBy: string;
  reason: string;
}

export interface RoomSettings {
  id: string;
  name: string;
  roomPassword: string; // Mandatory password
  inviteToken: string;
  isLocked: boolean;
  createdAt: number;
  maxParticipants: number;
  // DSP audio settings
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  volumeNormalization: boolean;
  backgroundAudioKeepAlive: boolean;
  // UI Customizations
  selectedFrame: FrameStyle;
  selectedFont: FontFamily;
  gridColumns: GridColumns;
}
