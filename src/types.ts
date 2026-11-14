export type Language = 'en' | 'ar';

export type ScreenId = 'home' | 'messages' | 'updates' | 'profile';

export interface FamilyUser {
  id: string;
  name: string;
  nameAr: string;
  relation: string;
  relationAr: string;
  email: string;
  isDemo: boolean;
}

export interface AstronautProfile {
  name: string;
  nameAr: string;
  missionLabel: string;
  missionLabelAr: string;
  flightDay: number;
  totalDays: number;
  latestUpdateTitle: string;
  latestUpdateTitleAr: string;
  latestUpdateText: string;
  latestUpdateTextAr: string;
  latestUpdateTime: string;
  latestUpdateTimeAr: string;
  nextCallWindow: string;
  nextCallWindowAr: string;
  avatarUrl: string;
  heroUrl: string;
}

export interface FamilyMessage {
  id: string;
  sender: 'family' | 'astronaut';
  senderName: string;
  senderNameAr: string;
  text: string;
  textAr?: string;
  timestamp: string;
  status: 'Sent (Demo)' | 'Seen by Family Hub';
  imageUrl?: string;
  voiceDurationSec?: number;
}

export interface SimpleMissionUpdate {
  id: string;
  date: string;
  dateAr: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  kind: 'wellness' | 'milestone' | 'call';
  isNew?: boolean;
}

export interface FamilyPhoto {
  id: string;
  title: string;
  titleAr: string;
  caption: string;
  captionAr: string;
  imageUrl: string;
}

export interface NotificationPrefs {
  messageSounds: boolean;
  missionAlerts: boolean;
}
