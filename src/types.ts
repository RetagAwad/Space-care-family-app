export type Language = 'en' | 'ar';

export type ScreenId =
  | 'dashboard'
  | 'wellness'
  | 'communication'
  | 'timeline'
  | 'assistant'
  | 'notifications'
  | 'memory-box'
  | 'support-hub'
  | 'profile';

export interface FamilyUser {
  id: string;
  name: string;
  nameAr: string;
  relation: string;
  relationAr: string;
  email: string;
  location: string;
  locationAr: string;
  isDemo: boolean;
}

export interface AstronautProfile {
  name: string;
  nameAr: string;
  callsign: string;
  role: string;
  roleAr: string;
  missionName: string;
  missionNameAr: string;
  expedition: string;
  orbitAltitudeKm: number;
  flightDay: number;
  totalDays: number;
  currentPhase: string;
  currentPhaseAr: string;
  lastApprovedUpdate: string;
  lastApprovedUpdateAr: string;
  nextScheduledUpdate: string;
  nextScheduledUpdateAr: string;
  avatarUrl: string;
  heroUrl: string;
}

export interface WellnessMetric {
  id: string;
  category: 'general' | 'sleep' | 'activity' | 'hydration';
  label: string;
  labelAr: string;
  value: string;
  unit: string;
  summary: string;
  summaryAr: string;
  updatedAt: string;
  updatedAtAr: string;
  statusText: string;
  statusTextAr: string;
}

export interface WellnessHistoryItem {
  id: string;
  day: number;
  date: string;
  dateAr: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  sleepHours: number;
  activityMinutes: number;
  aiInsight: string;
  aiInsightAr: string;
}

export interface FamilyMessage {
  id: string;
  sender: 'family' | 'astronaut' | 'liaison';
  senderName: string;
  senderNameAr: string;
  text: string;
  textAr?: string;
  timestamp: string;
  status: 'Queued for Uplink' | 'Delivered to Family Hub' | 'Received';
}

export interface TimelineMilestone {
  id: string;
  flightDay: number;
  date: string;
  dateAr: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'launch' | 'milestone' | 'daily' | 'upcoming';
  status: 'completed' | 'active' | 'upcoming';
}

export type NotificationCategory =
  | 'wellness'
  | 'milestone'
  | 'message'
  | 'announcement'
  | 'emergency';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  titleAr: string;
  body: string;
  bodyAr: string;
  timestamp: string;
  timestampAr: string;
  read: boolean;
  targetScreen: ScreenId;
}

export interface MemoryItem {
  id: string;
  title: string;
  titleAr: string;
  note: string;
  noteAr: string;
  author: string;
  authorAr: string;
  date: string;
  imageUrl?: string;
  type: 'photo' | 'letter' | 'milestone';
}

export interface AssistantChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  mode?: 'live' | 'demo-fallback';
}

export interface NotificationPrefs {
  wellnessUpdates: boolean;
  missionMilestones: boolean;
  familyMessages: boolean;
  emergencyAnnouncements: boolean;
  quietHoursEnabled: boolean;
}
