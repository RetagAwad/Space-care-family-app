import React from 'react';
import { Globe, LogOut, RotateCcw, Shield, UserCheck } from 'lucide-react';
import { AstronautProfile, FamilyUser, Language, NotificationPrefs } from '../types';
import { getCopy } from '../i18n';
import { SafeImage } from '../components/SafeImage';

interface ProfileScreenProps {
  lang: Language;
  user: FamilyUser;
  astronaut: AstronautProfile;
  prefs: NotificationPrefs;
  onChangeLang: (lang: Language) => void;
  onUpdatePref: (key: keyof NotificationPrefs) => void;
  onResetDemo: () => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  lang,
  user,
  astronaut,
  prefs,
  onChangeLang,
  onUpdatePref,
  onResetDemo,
  onSignOut,
}) => {
  const t = getCopy(lang);

  const prefItems: Array<{ key: keyof NotificationPrefs; label: string; labelAr: string }> = [
    {
      key: 'wellnessUpdates',
      label: 'New approved wellness updates',
      labelAr: 'تحديثات العافية المعتمدة الجديدة',
    },
    {
      key: 'missionMilestones',
      label: 'Mission milestones & orbital events',
      labelAr: 'محطات المهمة والأحداث المدارية',
    },
    {
      key: 'familyMessages',
      label: 'Family channel messages',
      labelAr: 'رسائل قناة العائلة',
    },
    {
      key: 'emergencyAnnouncements',
      label: 'Official emergency information notices',
      labelAr: 'إشعارات الطوارئ الرسمية',
    },
    {
      key: 'quietHoursEnabled',
      label: 'Mute non-urgent alerts overnight (23:00 – 07:00)',
      labelAr: 'تفعيل ساعات الهدوء الليلية (23:00 – 07:00)',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
        {t.profile.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Family Profile & Linked Astronaut */}
        <section className="lg:col-span-5 rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/25 border border-blue-400/35 flex items-center justify-center text-cyan-200 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">
                {lang === 'ar' ? user.nameAr : user.name}
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'ar' ? user.relationAr : user.relation}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="text-xs font-medium text-cyan-300">{t.profile.linkedAstronaut}</p>
            <div className="flex items-center gap-3.5 rounded-2xl bg-[#080E1B] border border-white/10 p-3.5">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <SafeImage
                  src={astronaut.avatarUrl}
                  alt={astronaut.name}
                  className="w-full h-full object-cover"
                  fallbackTitle={astronaut.name}
                />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold text-white truncate">
                  {lang === 'ar' ? astronaut.nameAr : astronaut.name}
                </p>
                <p className="text-xs text-slate-300 truncate">
                  {lang === 'ar' ? astronaut.missionNameAr : astronaut.missionName}
                </p>
                <p className="text-xs font-mono-tabular text-cyan-300">
                  {astronaut.callsign} · {astronaut.expedition}
                </p>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <p className="text-xs font-medium text-slate-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-300" />
              <span>{t.profile.language}</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChangeLang('en')}
                className={`min-h-[44px] rounded-xl text-sm font-medium border transition-colors ${
                  lang === 'en'
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                    : 'bg-[#080E1B] border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('ar')}
                className={`min-h-[44px] rounded-xl text-sm font-medium border transition-colors ${
                  lang === 'ar'
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                    : 'bg-[#080E1B] border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                العربية
              </button>
            </div>
          </div>
        </section>

        {/* Preferences, Privacy & About */}
        <section className="lg:col-span-7 rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 space-y-6">
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-white">{t.profile.notifications}</h2>
            <div className="divide-y divide-white/10">
              {prefItems.map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-3 cursor-pointer min-h-[48px]"
                >
                  <span className="text-sm text-slate-200">
                    {lang === 'ar' ? item.labelAr : item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={prefs[item.key]}
                    onChange={() => onUpdatePref(item.key)}
                    className="w-5 h-5 rounded border-white/25 bg-[#070C17] text-cyan-400 focus:ring-cyan-400 shrink-0"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-300" />
              <span>{t.profile.aboutTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.profile.aboutBody}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onResetDemo}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-200 inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.profile.resetDemo}</span>
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/30 text-xs font-semibold text-rose-200 inline-flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.profile.signOut}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
