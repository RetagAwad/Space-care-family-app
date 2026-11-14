import React from 'react';
import { BookOpen, Calendar, Heart, Info } from 'lucide-react';
import { FamilyPhoto, Language, SimpleMissionUpdate } from '../types';
import { getCopy } from '../i18n';
import { SafeImage } from '../components/SafeImage';

interface MissionUpdatesScreenProps {
  lang: Language;
  updates: SimpleMissionUpdate[];
  photos: FamilyPhoto[];
  onExplain: (title: string, details: string) => void;
}

export const MissionUpdatesScreen: React.FC<MissionUpdatesScreenProps> = ({
  lang,
  updates,
  photos,
  onExplain,
}) => {
  const t = getCopy(lang);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1.5">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
          {t.updates.title}
        </h1>
        <p className="text-lg sm:text-xl text-slate-200">{t.updates.subtitle}</p>
      </div>

      {/* Clear Demo Disclaimer */}
      <div className="rounded-2xl bg-[#0E172B] border border-amber-400/35 p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
        <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
          {t.updates.disclaimer}
        </p>
      </div>

      {/* Simple, Readable Mission & Wellness Cards */}
      <div className="space-y-4">
        {updates.map((item) => {
          const title = lang === 'ar' ? item.titleAr : item.title;
          const summary = lang === 'ar' ? item.summaryAr : item.summary;
          return (
            <article
              key={item.id}
              className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-base">
                <span className="text-cyan-300 font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{lang === 'ar' ? item.dateAr : item.date}</span>
                </span>
                {item.isNew && (
                  <span className="text-emerald-300 font-bold">{t.updates.newBadge}</span>
                )}
              </div>

              <h2 className="font-display text-2xl font-bold text-white">{title}</h2>

              <p className="text-lg sm:text-xl text-slate-100 leading-relaxed">{summary}</p>

              <button
                type="button"
                onClick={() => onExplain(title, summary)}
                className="min-h-[56px] px-5 py-3 rounded-2xl bg-[#16233E] hover:bg-[#1E3054] border border-cyan-400/40 text-base sm:text-lg font-semibold text-cyan-100 inline-flex items-center gap-2.5 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-cyan-300" />
                <span>{t.updates.explainButton}</span>
              </button>
            </article>
          );
        })}
      </div>

      {/* Shared Family Photos */}
      <section className="space-y-4 pt-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Heart className="w-6 h-6 text-cyan-300" />
          <span>{t.updates.photosTitle}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {photos.map((photo) => (
            <article
              key={photo.id}
              className="rounded-3xl bg-[#0E172B] border border-white/15 overflow-hidden"
            >
              <div className="h-52 w-full">
                <SafeImage
                  src={photo.imageUrl}
                  alt={lang === 'ar' ? photo.titleAr : photo.title}
                  className="w-full h-full object-cover"
                  fallbackTitle={photo.title}
                />
              </div>
              <div className="p-5 space-y-1.5">
                <h3 className="text-xl font-bold text-white">
                  {lang === 'ar' ? photo.titleAr : photo.title}
                </h3>
                <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
                  {lang === 'ar' ? photo.captionAr : photo.caption}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
