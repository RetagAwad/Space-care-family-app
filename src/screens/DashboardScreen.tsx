import React from 'react';
import {
  Activity,
  Bell,
  BookOpen,
  CalendarClock,
  ChevronRight,
  Compass,
  HeartHandshake,
  Image as ImageIcon,
  MessageSquareHeart,
  Sparkles,
} from 'lucide-react';
import {
  AppNotification,
  AstronautProfile,
  FamilyUser,
  Language,
  ScreenId,
  TimelineMilestone,
  WellnessMetric,
} from '../types';
import { getCopy } from '../i18n';
import { SafeImage } from '../components/SafeImage';

interface DashboardScreenProps {
  lang: Language;
  user: FamilyUser;
  astronaut: AstronautProfile;
  metrics: WellnessMetric[];
  notifications: AppNotification[];
  milestones: TimelineMilestone[];
  onNavigate: (screen: ScreenId) => void;
  onOpenNotification: (notif: AppNotification) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  lang,
  user,
  astronaut,
  metrics,
  notifications,
  milestones,
  onNavigate,
  onOpenNotification,
}) => {
  const t = getCopy(lang);
  const progressPct = Math.round((astronaut.flightDay / astronaut.totalDays) * 1000) / 10;
  const generalMetric = metrics[0];
  const sleepMetric = metrics[1];
  const nextMilestone = milestones.find((m) => m.status === 'upcoming') ?? milestones[0];
  const recentNotifs = notifications.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Simulated Data Transparency Strip */}
      <div className="rounded-2xl bg-[#0D1629] border border-cyan-400/20 px-4 py-3 flex items-center justify-between gap-3 text-xs text-slate-300">
        <span>
          <strong className="text-cyan-300 font-semibold">{t.demoBadge}</strong>
          <span className="mx-2 text-slate-500">·</span>
          <span>{t.demoNotice}</span>
        </span>
      </div>

      {/* Main Hero Grid: Astronaut Profile & Mission Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <section className="lg:col-span-8 rounded-3xl overflow-hidden bg-[#0C1425] border border-white/10 flex flex-col justify-between">
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <SafeImage
              src={astronaut.heroUrl}
              alt="Orbital cupola horizon"
              className="w-full h-full object-cover"
              fallbackTitle={astronaut.missionName}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C1425] via-[#0C1425]/55 to-transparent" />
            <div className="absolute bottom-3 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-200">
              <span>{lang === 'ar' ? astronaut.missionNameAr : astronaut.missionName}</span>
              <span className="font-mono-tabular text-cyan-300">
                {astronaut.callsign} · {astronaut.orbitAltitudeKm} km LEO
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-cyan-400/30 shrink-0 bg-[#080E1A]">
                <SafeImage
                  src={astronaut.avatarUrl}
                  alt={astronaut.name}
                  className="w-full h-full object-cover"
                  fallbackTitle={astronaut.name}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-xs text-cyan-300 font-medium">
                  {lang === 'ar'
                    ? `مرحباً ${user.nameAr} · ${user.relationAr}`
                    : `Welcome, ${user.name} · ${user.relation}`}
                </p>
                <h1 className="font-display text-xl sm:text-2xl font-bold text-white truncate">
                  {lang === 'ar' ? astronaut.nameAr : astronaut.name}
                </h1>
                <p className="text-sm text-slate-300">
                  {lang === 'ar' ? astronaut.currentPhaseAr : astronaut.currentPhase}
                </p>
              </div>
            </div>

            {/* Mission Progress Indicator */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-300 font-medium">{t.dashboard.missionProgress}</span>
                <span className="font-mono-tabular text-cyan-300 font-semibold">
                  {t.dashboard.flightDay} {astronaut.flightDay} {t.dashboard.of} {astronaut.totalDays} ({progressPct}%)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-400 transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Right Update Timing & Quick Actions */}
        <section className="lg:col-span-4 rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5 text-cyan-300" />
                {t.dashboard.lastUpdate}
              </span>
              <p className="text-sm font-medium text-white font-mono-tabular">
                {lang === 'ar' ? astronaut.lastApprovedUpdateAr : astronaut.lastApprovedUpdate}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                {t.dashboard.nextUpdate}
              </span>
              <p className="text-sm font-medium text-cyan-200 font-mono-tabular">
                {lang === 'ar' ? astronaut.nextScheduledUpdateAr : astronaut.nextScheduledUpdate}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <p className="text-xs font-medium text-slate-400">{t.dashboard.quickActions}</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('communication')}
                className="min-h-[44px] px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageSquareHeart className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.nav.communication}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('assistant')}
                className="min-h-[44px] px-3 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.nav.assistant}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('memory-box')}
                className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <ImageIcon className="w-4 h-4 shrink-0 text-indigo-300" />
                <span className="truncate">{t.nav.memoryBox}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('support-hub')}
                className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <HeartHandshake className="w-4 h-4 shrink-0 text-cyan-300" />
                <span className="truncate">{t.nav.supportHub}</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Middle 2-Column Section: Latest Approved Wellness & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Latest Approved Wellness */}
        <section className="lg:col-span-6 rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-cyan-300" />
              <h2 className="font-display text-lg font-semibold text-white">
                {t.dashboard.latestWellness}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('wellness')}
              className="min-h-[44px] px-3 text-xs font-medium text-cyan-300 hover:text-cyan-200 flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>{t.dashboard.viewAllWellness}</span>
              <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[generalMetric, sleepMetric].map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-[#080E1B] border border-white/10 p-4 space-y-1.5"
              >
                <p className="text-xs text-slate-400">{lang === 'ar' ? item.labelAr : item.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white font-mono-tabular">
                    {item.value}
                  </span>
                  <span className="text-xs text-cyan-300">{item.unit}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ar' ? item.summaryAr : item.summary}
                </p>
              </div>
            ))}
          </div>

          {/* Upcoming Mission Connection */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs text-slate-400">
                {t.dashboard.upcomingMilestone} ·{' '}
                {lang === 'ar' ? nextMilestone.dateAr : nextMilestone.date}
              </span>
              <p className="text-sm font-medium text-white truncate">
                {lang === 'ar' ? nextMilestone.titleAr : nextMilestone.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('timeline')}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-200 whitespace-nowrap shrink-0"
            >
              {t.dashboard.openTimeline}
            </button>
          </div>
        </section>

        {/* Recent Family Alerts */}
        <section className="lg:col-span-6 rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-blue-400" />
              <h2 className="font-display text-lg font-semibold text-white">
                {t.dashboard.recentAlerts}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('notifications')}
              className="min-h-[44px] px-3 text-xs font-medium text-cyan-300 hover:text-cyan-200 flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>{t.dashboard.viewAllAlerts}</span>
              <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="divide-y divide-white/10">
            {recentNotifs.map((notif) => (
              <button
                key={notif.id}
                type="button"
                onClick={() => onOpenNotification(notif)}
                className="w-full text-start py-3.5 first:pt-1 last:pb-1 flex items-start justify-between gap-3 hover:bg-white/[0.02] rounded-xl px-2 transition-colors min-h-[56px]"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className={notif.read ? 'text-slate-400' : 'text-cyan-300 font-semibold'}>
                      {notif.read
                        ? lang === 'ar'
                          ? 'مقروء'
                          : 'Read'
                        : lang === 'ar'
                        ? 'جديد'
                        : 'New'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{lang === 'ar' ? notif.timestampAr : notif.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {lang === 'ar' ? notif.titleAr : notif.title}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {lang === 'ar' ? notif.bodyAr : notif.body}
                  </p>
                </div>
                <BookOpen className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
