import React, { useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  Compass,
  Globe,
  Heart,
  HeartHandshake,
  Home,
  MessageSquareHeart,
  Sparkles,
  User,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AppNotification,
  AssistantChatMessage,
  FamilyMessage,
  FamilyUser,
  Language,
  MemoryItem,
  NotificationPrefs,
  ScreenId,
} from './types';
import {
  DEMO_ASTRONAUT,
  DEMO_MEMORIES,
  DEMO_MESSAGES,
  DEMO_NOTIFICATIONS,
  DEMO_PREFS,
  DEMO_TIMELINE,
  DEMO_WELLNESS_HISTORY,
  DEMO_WELLNESS_METRICS,
} from './data/demoData';
import { getCopy } from './i18n';
import { BrandMark } from './components/BrandMark';
import { ExplainModal } from './components/ExplainModal';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { WellnessScreen } from './screens/WellnessScreen';
import { CommunicationScreen } from './screens/CommunicationScreen';
import { TimelineScreen } from './screens/TimelineScreen';
import { AssistantScreen } from './screens/AssistantScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { MemoryBoxScreen } from './screens/MemoryBoxScreen';
import { SupportHubScreen } from './screens/SupportHubScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const STORAGE_KEY = 'space_care_family_connect_v1';

interface StoredState {
  user: FamilyUser | null;
  lang: Language;
  messages: FamilyMessage[];
  notifications: AppNotification[];
  memories: MemoryItem[];
  prefs: NotificationPrefs;
  assistantChat: AssistantChatMessage[];
}

function getInitialAssistantMessages(lang: Language): AssistantChatMessage[] {
  return [
    {
      id: 'ai-welcome',
      role: 'assistant',
      text:
        lang === 'ar'
          ? 'مرحباً بكِ في مساعد عائلة SPACE CARE. يمكنني تبسيط تحديثات العافية المعتمدة، وشرح محطات المهمة، وتوضيح الحياة اليومية في المدار استناداً إلى بيانات العرض التجريبية.'
          : 'Welcome to the SPACE CARE Family Assistant. I can help explain approved wellness summaries, upcoming mission milestones, and everyday life in orbit using our demo mission information.',
      timestamp: 'Now',
    },
  ];
}

function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredState>;
      const lang: Language = parsed.lang === 'ar' ? 'ar' : 'en';
      return {
        user: parsed.user ?? null,
        lang,
        messages: Array.isArray(parsed.messages) ? parsed.messages : DEMO_MESSAGES,
        notifications: Array.isArray(parsed.notifications)
          ? parsed.notifications
          : DEMO_NOTIFICATIONS,
        memories: Array.isArray(parsed.memories) ? parsed.memories : DEMO_MEMORIES,
        prefs: parsed.prefs ?? DEMO_PREFS,
        assistantChat:
          Array.isArray(parsed.assistantChat) && parsed.assistantChat.length > 0
            ? parsed.assistantChat
            : getInitialAssistantMessages(lang),
      };
    }
  } catch {
    // Ignore storage read errors
  }

  return {
    user: null,
    lang: 'en',
    messages: DEMO_MESSAGES,
    notifications: DEMO_NOTIFICATIONS,
    memories: DEMO_MEMORIES,
    prefs: DEMO_PREFS,
    assistantChat: getInitialAssistantMessages('en'),
  };
}

export default function App() {
  const initial = loadStoredState();

  const [user, setUser] = useState<FamilyUser | null>(initial.user);
  const [rememberSession, setRememberSession] = useState<boolean>(Boolean(initial.user));
  const [lang, setLang] = useState<Language>(initial.lang);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');

  const [messages, setMessages] = useState<FamilyMessage[]>(initial.messages);
  const [notifications, setNotifications] = useState<AppNotification[]>(initial.notifications);
  const [memories, setMemories] = useState<MemoryItem[]>(initial.memories);
  const [prefs, setPrefs] = useState<NotificationPrefs>(initial.prefs);
  const [assistantChat, setAssistantChat] = useState<AssistantChatMessage[]>(
    initial.assistantChat
  );
  const [assistantLoading, setAssistantLoading] = useState(false);

  const [explainState, setExplainState] = useState<{
    open: boolean;
    title: string;
    explanation: string;
    loading: boolean;
    mode?: 'live' | 'demo-fallback';
  }>({
    open: false,
    title: '',
    explanation: '',
    loading: false,
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    try {
      const payload: StoredState = {
        user: rememberSession ? user : null,
        lang,
        messages,
        notifications,
        memories,
        prefs,
        assistantChat,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write errors
    }
  }, [user, rememberSession, lang, messages, notifications, memories, prefs, assistantChat]);

  const t = getCopy(lang);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogin = (loggedUser: FamilyUser, remember: boolean) => {
    setRememberSession(remember);
    setUser(loggedUser);
    setActiveScreen('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setRememberSession(false);
  };

  const handleResetDemo = () => {
    setMessages(DEMO_MESSAGES);
    setNotifications(DEMO_NOTIFICATIONS);
    setMemories(DEMO_MEMORIES);
    setPrefs(DEMO_PREFS);
    setAssistantChat(getInitialAssistantMessages(lang));
  };

  const handleSendMessage = (text: string) => {
    if (!user) return;
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const outgoing: FamilyMessage = {
      id: `msg-${Date.now()}`,
      sender: 'family',
      senderName: user.name,
      senderNameAr: user.nameAr,
      text,
      timestamp: `${nowLabel} Cairo`,
      status: 'Queued for Uplink',
    };

    setMessages((prev) => [...prev, outgoing]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === outgoing.id ? { ...m, status: 'Delivered to Family Hub' } : m
        )
      );

      const liaisonReply: FamilyMessage = {
        id: `msg-ack-${Date.now()}`,
        sender: 'liaison',
        senderName: 'Family Support Liaison · Simulated Hub',
        senderNameAr: 'منسق دعم العائلات · مركز المحاكاة',
        text:
          lang === 'ar'
            ? 'تم حفظ رسالتكِ في حزمة الإرسال المجدولة القادمة للقائدة ليلى (محاكاة تجريبية).'
            : 'Your supportive note has been queued into the next scheduled family uplink bundle for Cmdr. Layla (local simulation).',
        timestamp: `${nowLabel} Cairo`,
        status: 'Delivered to Family Hub',
      };
      setMessages((prev) => [...prev, liaisonReply]);
    }, 650);
  };

  const handleAskAssistant = async (question: string) => {
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: AssistantChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: question,
      timestamp: nowLabel,
    };

    const nextHistory = [...assistantChat, userMsg];
    setAssistantChat(nextHistory);
    setAssistantLoading(true);

    const missionContext = `Astronaut: ${DEMO_ASTRONAUT.name} (${DEMO_ASTRONAUT.callsign})
Mission: ${DEMO_ASTRONAUT.missionName}, Flight Day ${DEMO_ASTRONAUT.flightDay} of ${DEMO_ASTRONAUT.totalDays}.
Current Phase: ${DEMO_ASTRONAUT.currentPhase}.
Last Approved Update: ${DEMO_ASTRONAUT.lastApprovedUpdate}.
Next Scheduled Update: ${DEMO_ASTRONAUT.nextScheduledUpdate}.
Latest Wellness Summary (Demo): General Wellness Steady; Sleep 7-day avg 7h 20m (Circadian Synced); Activity 135 min/day (ARED & treadmill); Hydration 2.4 L logged.`;

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          history: nextHistory.slice(-6),
          lang,
          missionContext,
        }),
      });
      const data = await res.json();
      const replyMsg: AssistantChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Unable to load assistant reply right now.',
        timestamp: nowLabel,
        mode: data.mode,
      };
      setAssistantChat((prev) => [...prev, replyMsg]);
    } catch {
      setAssistantChat((prev) => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          role: 'assistant',
          text:
            lang === 'ar'
              ? 'تعذر الاتصال بالمساعد مؤقتاً. يرجى المحاولة مرة أخرى.'
              : 'Could not reach the assistant right now. Please try again in a moment.',
          timestamp: nowLabel,
          mode: 'demo-fallback',
        },
      ]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleExplainWithAI = async (title: string, details: string) => {
    setExplainState({
      open: true,
      title,
      explanation: '',
      loading: true,
    });

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, details, lang }),
      });
      const data = await res.json();
      setExplainState({
        open: true,
        title,
        explanation: data.explanation,
        loading: false,
        mode: data.mode,
      });
    } catch {
      setExplainState({
        open: true,
        title,
        explanation:
          lang === 'ar'
            ? 'يوضح هذا التحديث خطوة روتينية لدعم راحة رائد الفضاء في الجاذبية الصغرى بناءً على بيانات العرض التجريبية.'
            : 'This update summarizes a routine orbital support activity in microgravity based on simulated demo data.',
        loading: false,
        mode: 'demo-fallback',
      });
    }
  };

  const handleToggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleOpenNotification = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setActiveScreen(notif.targetScreen);
  };

  const handleAddMemory = (title: string, note: string) => {
    if (!user) return;
    const item: MemoryItem = {
      id: `mem-${Date.now()}`,
      title,
      titleAr: title,
      note,
      noteAr: note,
      author: user.name,
      authorAr: user.nameAr,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      type: 'letter',
    };
    setMemories((prev) => [item, ...prev]);
  };

  if (!user) {
    return (
      <AuthScreen
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
        onLogin={handleLogin}
      />
    );
  }

  const desktopNavItems: Array<{
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home },
    { id: 'wellness', label: t.nav.wellness, icon: Activity },
    { id: 'communication', label: t.nav.communication, icon: MessageSquareHeart },
    { id: 'timeline', label: t.nav.timeline, icon: Compass },
    { id: 'assistant', label: t.nav.assistant, icon: Sparkles },
    {
      id: 'notifications',
      label: t.nav.notifications,
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'memory-box', label: t.nav.memoryBox, icon: Heart },
    { id: 'support-hub', label: t.nav.supportHub, icon: HeartHandshake },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  const mobileTabs: Array<{
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home },
    { id: 'wellness', label: t.nav.wellness, icon: Activity },
    { id: 'communication', label: t.nav.communication, icon: MessageSquareHeart },
    { id: 'timeline', label: t.nav.timeline, icon: Compass },
    { id: 'assistant', label: t.nav.assistant, icon: Sparkles },
  ];

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#060A13] text-slate-100 flex flex-col lg:flex-row"
    >
      {/* Desktop Left Navigation Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-e border-white/10 bg-[#080D1A] sticky top-0 h-screen p-4 justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 pt-1">
            <BrandMark size="md" />
            <div className="leading-tight min-w-0">
              <span className="font-display font-bold text-sm text-white block truncate">
                {t.brand}
              </span>
              <span className="text-[11px] font-medium tracking-wider text-cyan-300 block truncate">
                {t.subBrand}
              </span>
            </div>
          </div>

          <nav className="space-y-1" aria-label="Main navigation">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center justify-between gap-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && (
                    <span className="font-mono-tabular text-xs font-semibold text-cyan-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
            className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-200 flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4 text-cyan-300" />
            <span>{lang === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Compact Sticky Top Bar (52px height to stay within 15% mobile sticky cap) */}
        <header className="lg:hidden sticky top-0 z-30 h-[54px] px-4 bg-[#080D1A]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveScreen('dashboard')}
            className="flex items-center gap-2.5 min-w-0"
          >
            <BrandMark size="sm" />
            <span className="font-display font-bold text-sm text-white truncate">
              {t.brand}
            </span>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/5"
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('notifications')}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-200 hover:bg-white/5"
              aria-label={t.nav.notifications}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 end-2 text-[10px] font-mono-tabular font-bold text-cyan-300">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen('profile')}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-200 hover:bg-white/5"
              aria-label={t.nav.profile}
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeScreen === 'dashboard' && (
                <DashboardScreen
                  lang={lang}
                  user={user}
                  astronaut={DEMO_ASTRONAUT}
                  metrics={DEMO_WELLNESS_METRICS}
                  notifications={notifications}
                  milestones={DEMO_TIMELINE}
                  onNavigate={setActiveScreen}
                  onOpenNotification={handleOpenNotification}
                />
              )}

              {activeScreen === 'wellness' && (
                <WellnessScreen
                  lang={lang}
                  metrics={DEMO_WELLNESS_METRICS}
                  history={DEMO_WELLNESS_HISTORY}
                  onExplain={handleExplainWithAI}
                />
              )}

              {activeScreen === 'communication' && (
                <CommunicationScreen
                  lang={lang}
                  user={user}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                />
              )}

              {activeScreen === 'timeline' && (
                <TimelineScreen
                  lang={lang}
                  milestones={DEMO_TIMELINE}
                  onExplain={handleExplainWithAI}
                />
              )}

              {activeScreen === 'assistant' && (
                <AssistantScreen
                  lang={lang}
                  messages={assistantChat}
                  loading={assistantLoading}
                  onAsk={handleAskAssistant}
                />
              )}

              {activeScreen === 'notifications' && (
                <NotificationsScreen
                  lang={lang}
                  notifications={notifications}
                  onToggleRead={handleToggleNotificationRead}
                  onMarkAllRead={() =>
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
                  }
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'memory-box' && (
                <MemoryBoxScreen
                  lang={lang}
                  memories={memories}
                  onAddMemory={handleAddMemory}
                />
              )}

              {activeScreen === 'support-hub' && (
                <SupportHubScreen lang={lang} onExplain={handleExplainWithAI} />
              )}

              {activeScreen === 'profile' && (
                <ProfileScreen
                  lang={lang}
                  user={user}
                  astronaut={DEMO_ASTRONAUT}
                  prefs={prefs}
                  onChangeLang={setLang}
                  onUpdatePref={(key) =>
                    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  onResetDemo={handleResetDemo}
                  onSignOut={handleSignOut}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Fixed Bottom Tab Bar (64px height) */}
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#080D1A]/95 backdrop-blur-md border-t border-white/10 grid grid-cols-5 items-center px-1"
        >
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveScreen(tab.id)}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                  isActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-tight truncate max-w-[64px]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Mission Explainer Modal */}
      <ExplainModal
        isOpen={explainState.open}
        onClose={() => setExplainState((prev) => ({ ...prev, open: false }))}
        title={explainState.title}
        explanation={explainState.explanation}
        loading={explainState.loading}
        mode={explainState.mode}
        lang={lang}
      />
    </div>
  );
}
