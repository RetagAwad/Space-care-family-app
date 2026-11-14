import React, { useState } from 'react';
import { Check, Globe, LogOut, RotateCcw } from 'lucide-react';
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
  const [resetNotice, setResetNotice] = useState(false);

  const handleReset = () => {
    onResetDemo();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
        {t.profile.title}
      </h1>

      {/* Family Member & Son Card */}
      <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 space-y-5">
        <div className="space-y-1">
          <p className="text-sm sm:text-base text-cyan-300 font-semibold">
            {t.profile.familyLabel}
          </p>
          <p className="text-2xl font-bold text-white">
            {lang === 'ar' ? user.nameAr : user.name}
          </p>
          <p className="text-lg text-slate-200">
            {lang === 'ar' ? user.relationAr : user.relation}
          </p>
        </div>

        <div className="pt-4 border-t border-white/15 space-y-3">
          <p className="text-sm sm:text-base text-cyan-300 font-semibold">
            {t.profile.sonLabel}
          </p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border border-cyan-300/50 shrink-0">
              <SafeImage
                src={astronaut.avatarUrl}
                alt={lang === 'ar' ? astronaut.nameAr : astronaut.name}
                className="w-full h-full object-cover"
                fallbackTitle={astronaut.name}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-white">
                {lang === 'ar' ? astronaut.nameAr : astronaut.name}
              </p>
              <p className="text-base sm:text-lg text-slate-200">
                {lang === 'ar' ? astronaut.missionLabelAr : astronaut.missionLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Large Easy Language Switch */}
      <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <Globe className="w-6 h-6 text-cyan-300" />
          <span>{t.profile.languageTitle}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeLang('en')}
            className={`min-h-[60px] px-5 py-3 rounded-2xl border text-xl font-bold transition-colors ${
              lang === 'en'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-[#080D1A] text-white border-white/20 hover:bg-white/10'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onChangeLang('ar')}
            className={`min-h-[60px] px-5 py-3 rounded-2xl border text-xl font-bold transition-colors ${
              lang === 'ar'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-[#080D1A] text-white border-white/20 hover:bg-white/10'
            }`}
          >
            العربية (مصر)
          </button>
        </div>
      </section>

      {/* Simple Sound & Alert Switches */}
      <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 space-y-4">
        <h2 className="text-xl font-bold text-white">{t.profile.alertsTitle}</h2>

        <div className="divide-y divide-white/15">
          <label className="flex items-center justify-between gap-4 py-3.5 cursor-pointer min-h-[60px]">
            <span className="text-lg text-slate-100">{t.profile.soundAlerts}</span>
            <input
              type="checkbox"
              checked={prefs.messageSounds}
              onChange={() => onUpdatePref('messageSounds')}
              className="w-7 h-7 rounded border-white/30 bg-[#070B16] text-emerald-400 shrink-0"
            />
          </label>

          <label className="flex items-center justify-between gap-4 py-3.5 cursor-pointer min-h-[60px]">
            <span className="text-lg text-slate-100">{t.profile.missionAlerts}</span>
            <input
              type="checkbox"
              checked={prefs.missionAlerts}
              onChange={() => onUpdatePref('missionAlerts')}
              className="w-7 h-7 rounded border-white/30 bg-[#070B16] text-emerald-400 shrink-0"
            />
          </label>
        </div>
      </section>

      {resetNotice && (
        <div
          role="status"
          className="rounded-2xl bg-emerald-500/20 border border-emerald-400/50 px-5 py-3.5 text-lg font-semibold text-emerald-100 flex items-center gap-2.5"
        >
          <Check className="w-6 h-6 text-emerald-300 shrink-0" />
          <span>{t.profile.resetDone}</span>
        </div>
      )}

      {/* Large Reset & Sign Out Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          type="button"
          onClick={handleReset}
          className="min-h-[60px] px-5 py-3.5 rounded-2xl bg-[#111B33] hover:bg-[#192747] border border-white/20 text-lg font-bold text-white flex items-center justify-center gap-2.5 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{t.profile.resetButton}</span>
        </button>

        <button
          type="button"
          onClick={onSignOut}
          className="min-h-[60px] px-5 py-3.5 rounded-2xl bg-red-600/20 hover:bg-red-600/35 border border-red-400/40 text-lg font-bold text-red-100 flex items-center justify-center gap-2.5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>{t.profile.signOutButton}</span>
        </button>
      </div>
    </div>
  );
};
