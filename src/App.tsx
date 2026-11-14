import React, { useEffect, useState } from 'react';
import { Calendar, Globe, Home, MessageSquare, User } from 'lucide-react';
import {
  FamilyMessage,
  FamilyUser,
  Language,
  NotificationPrefs,
  ScreenId,
} from './types';
import {
  DEMO_ASTRONAUT,
  DEMO_MESSAGES,
  DEMO_PHOTOS,
  DEMO_PREFS,
  DEMO_UPDATES,
} from './data/demoData';
import { getCopy } from './i18n';
import { BrandMark } from './components/BrandMark';
import { ExplainModal } from './components/ExplainModal';
import { CallModal } from './components/CallModal';
import { AuthScreen } from './screens/AuthScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { CommunicationScreen } from './screens/CommunicationScreen';
import { MissionUpdatesScreen } from './screens/MissionUpdatesScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const STORAGE_KEY = 'space_care_senior_family_v2';

interface StoredState {
  user: FamilyUser | null;
  lang: Language;
  messages: FamilyMessage[];
  prefs: NotificationPrefs;
}

function loadStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredState>;
      return {
        user: parsed.user ?? null,
        lang: parsed.lang === 'ar' ? 'ar' : 'en',
        messages: Array.isArray(parsed.messages) ? parsed.messages : DEMO_MESSAGES,
        prefs: parsed.prefs ?? DEMO_PREFS,
      };
    }
  } catch {
    // Ignore storage read errors
  }

  return {
    user: null,
    lang: 'en',
    messages: DEMO_MESSAGES,
    prefs: DEMO_PREFS,
  };
}

export default function App() {
  const initial = loadStoredState();

  const [user, setUser] = useState<FamilyUser | null>(initial.user);
  const [rememberSession, setRememberSession] = useState<boolean>(Boolean(initial.user));
  const [lang, setLang] = useState<Language>(initial.lang);
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [messages, setMessages] = useState<FamilyMessage[]>(initial.messages);
  const [prefs, setPrefs] = useState<NotificationPrefs>(initial.prefs);

  const [callState, setCallState] = useState<{
    open: boolean;
    mode: 'voice' | 'video';
  }>({
    open: false,
    mode: 'voice',
  });

  const [explainState, setExplainState] = useState<{
    open: boolean;
    title: string;
    explanation: string;
    loading: boolean;
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
        prefs,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write errors
    }
  }, [user, rememberSession, lang, messages, prefs]);

  const t = getCopy(lang);

  const handleLogin = (loggedUser: FamilyUser, remember: boolean) => {
    setRememberSession(remember);
    setUser(loggedUser);
    setActiveScreen('home');
  };

  const handleSignOut = () => {
    setUser(null);
    setRememberSession(false);
  };

  const handleResetDemo = () => {
    setMessages(DEMO_MESSAGES);
    setPrefs(DEMO_PREFS);
  };

  const handleSendMessage = (payload: {
    text: string;
    imageUrl?: string;
    voiceDurationSec?: number;
  }) => {
    if (!user) return;
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMsg: FamilyMessage = {
      id: `msg-${Date.now()}`,
      sender: 'family',
      senderName: user.name,
      senderNameAr: user.nameAr,
      text: payload.text,
      timestamp: nowLabel,
      status: 'Sent (Demo)',
      imageUrl: payload.imageUrl,
      voiceDurationSec: payload.voiceDurationSec,
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'Seen by Family Hub' } : m
        )
      );
    }, 800);
  };

  const handleExplainSimple = async (title: string, details: string) => {
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
      });
    } catch {
      setExplainState({
        open: true,
        title,
        explanation:
          lang === 'ar'
            ? 'الخبر ده معناه إن كل حاجة ماشية بشكل طبيعي ومنتظم في يوم طارق.'
            : 'This simply means Tarek is following his normal daily routine smoothly.',
        loading: false,
      });
    }
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

  const navItems: Array<{
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'messages', label: t.nav.messages, icon: MessageSquare },
    { id: 'updates', label: t.nav.updates, icon: Calendar },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070B16] text-white flex flex-col lg:flex-row"
    >
      {/* Desktop Simple 4-Item Navigation Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:shrink-0 border-e border-white/15 bg-[#0A1020] sticky top-0 h-screen p-5 justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <BrandMark size="md" />
            <div>
              <span className="font-display font-bold text-lg text-white block leading-tight">
                {t.brand}
              </span>
              <span className="text-sm font-medium text-cyan-300 block leading-tight">
                {t.subBrand}
              </span>
            </div>
          </div>

          <nav className="space-y-2.5" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveScreen(item.id)}
                  className={`w-full min-h-[60px] px-4 py-3 rounded-2xl flex items-center gap-3.5 text-lg font-bold transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-[#10192F] text-white hover:bg-[#172544] border border-white/10'
                  }`}
                >
                  <Icon className="w-6 h-6 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
          className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-[#111B33] hover:bg-[#192747] border border-cyan-400/40 text-base font-bold text-white flex items-center justify-center gap-2.5"
        >
          <Globe className="w-5 h-5 text-cyan-300" />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Simple Header with Easy Language Button */}
        <header className="lg:hidden sticky top-0 z-30 h-[62px] px-4 bg-[#0A1020]/95 backdrop-blur-md border-b border-white/15 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-2.5 min-h-[48px]"
          >
            <BrandMark size="sm" />
            <span className="font-display font-bold text-lg text-white">
              {t.brand}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
            className="min-h-[48px] px-4 py-2 rounded-xl bg-[#131F3A] border border-cyan-400/40 text-base font-bold text-white flex items-center gap-2"
          >
            <Globe className="w-5 h-5 text-cyan-300" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </header>

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6 pb-28 lg:pb-12">
          {activeScreen === 'home' && (
            <DashboardScreen
              lang={lang}
              astronaut={DEMO_ASTRONAUT}
              onNavigate={setActiveScreen}
              onStartCall={(mode) => setCallState({ open: true, mode })}
            />
          )}

          {activeScreen === 'messages' && (
            <CommunicationScreen
              lang={lang}
              astronaut={DEMO_ASTRONAUT}
              messages={messages}
              onSendMessage={handleSendMessage}
              onStartCall={(mode) => setCallState({ open: true, mode })}
            />
          )}

          {activeScreen === 'updates' && (
            <MissionUpdatesScreen
              lang={lang}
              updates={DEMO_UPDATES}
              photos={DEMO_PHOTOS}
              onExplain={handleExplainSimple}
            />
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
        </main>

        {/* Mobile Simple 4-Item Bottom Navigation Bar */}
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-[72px] bg-[#0A1020] border-t border-white/20 grid grid-cols-4 items-center px-1.5"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveScreen(item.id)}
                className={`min-h-[58px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors px-1 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="text-xs font-bold truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Simulated Voice & Video Call Overlay */}
      <CallModal
        isOpen={callState.open}
        mode={callState.mode}
        lang={lang}
        astronaut={DEMO_ASTRONAUT}
        onClose={() => setCallState((prev) => ({ ...prev, open: false }))}
      />

      {/* Simple Plain-Language Explanation Modal */}
      <ExplainModal
        isOpen={explainState.open}
        onClose={() => setExplainState((prev) => ({ ...prev, open: false }))}
        title={explainState.title}
        explanation={explainState.explanation}
        loading={explainState.loading}
        lang={lang}
      />
    </div>
  );
}
