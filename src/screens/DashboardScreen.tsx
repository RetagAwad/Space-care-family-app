import React from 'react';
import { MessageSquare, Phone, Video, ChevronRight } from 'lucide-react';
import { AstronautProfile, Language, ScreenId } from '../types';
import { getCopy } from '../i18n';
import { SafeImage } from '../components/SafeImage';

interface DashboardScreenProps {
  lang: Language;
  astronaut: AstronautProfile;
  onNavigate: (screen: ScreenId) => void;
  onStartCall: (mode: 'voice' | 'video') => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  lang,
  astronaut,
  onNavigate,
  onStartCall,
}) => {
  const t = getCopy(lang);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Large Son Profile Photo, Name & Warm Greeting */}
      <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-2 border-cyan-300/60 shadow-xl bg-[#080E1B]">
          <SafeImage
            src={astronaut.avatarUrl}
            alt={lang === 'ar' ? astronaut.nameAr : astronaut.name}
            className="w-full h-full object-cover"
            fallbackTitle={astronaut.name}
          />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
            {lang === 'ar' ? astronaut.nameAr : astronaut.name}
          </h1>
          <p className="text-base sm:text-lg text-cyan-300 font-medium">
            {lang === 'ar' ? astronaut.missionLabelAr : astronaut.missionLabel}
          </p>
        </div>

        <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-xl">
          {t.home.greeting} {t.home.promptAction}
        </p>
      </section>

      {/* ONLY THREE LARGE BUTTONS */}
      <section className="space-y-3.5" aria-label="Main actions">
        <button
          type="button"
          onClick={() => onNavigate('messages')}
          className="w-full min-h-[68px] py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold flex items-center justify-center gap-3.5 shadow-lg transition-colors"
        >
          <MessageSquare className="w-7 h-7 shrink-0" />
          <span>{t.home.btnMessage}</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => onStartCall('voice')}
            className="w-full min-h-[68px] py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-colors"
          >
            <Phone className="w-7 h-7 shrink-0" />
            <span>{t.home.btnVoiceCall}</span>
          </button>

          <button
            type="button"
            onClick={() => onStartCall('video')}
            className="w-full min-h-[68px] py-4 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-colors"
          >
            <Video className="w-7 h-7 shrink-0" />
            <span>{t.home.btnVideoCall}</span>
          </button>
        </div>
      </section>

      {/* ONE SIMPLE CARD: "Your loved one's latest update" */}
      <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 sm:p-7 space-y-4">
        <div className="space-y-1">
          <p className="text-sm sm:text-base text-cyan-300 font-medium">
            {lang === 'ar' ? astronaut.latestUpdateTimeAr : astronaut.latestUpdateTime}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar' ? astronaut.latestUpdateTitleAr : astronaut.latestUpdateTitle}
          </h2>
        </div>

        <p className="text-lg sm:text-xl text-slate-100 leading-relaxed">
          {lang === 'ar' ? astronaut.latestUpdateTextAr : astronaut.latestUpdateText}
        </p>

        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-slate-300">{t.demoNotice}</p>
          <button
            type="button"
            onClick={() => onNavigate('updates')}
            className="min-h-[52px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-base font-semibold text-white inline-flex items-center justify-center gap-2 shrink-0 transition-colors"
          >
            <span>{t.home.seeAllUpdates}</span>
            <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </section>
    </div>
  );
};
