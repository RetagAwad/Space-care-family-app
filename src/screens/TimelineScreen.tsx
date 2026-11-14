import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, Rocket, Search } from 'lucide-react';
import { Language, TimelineMilestone } from '../types';
import { getCopy } from '../i18n';

interface TimelineScreenProps {
  lang: Language;
  milestones: TimelineMilestone[];
  onExplain: (title: string, details: string) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  lang,
  milestones,
  onExplain,
}) => {
  const t = getCopy(lang);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active' | 'upcoming'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return milestones.filter((m) => {
      if (filter !== 'all' && m.status !== filter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return `${m.title} ${m.titleAr} ${m.description} ${m.descriptionAr} ${m.flightDay}`
        .toLowerCase()
        .includes(q);
    });
  }, [milestones, filter, search]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
          {t.timeline.title}
        </h1>
        <p className="text-sm text-slate-300">{t.timeline.subtitle}</p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0C1425] border border-white/10 overflow-x-auto">
          {(['all', 'completed', 'active', 'upcoming'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === key
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.timeline.filters[key]}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.timeline.searchPlaceholder}
            className="w-full min-h-[44px] ps-10 pe-4 py-2 rounded-xl bg-[#0C1425] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Interactive Space Connection Timeline */}
      <div className="relative space-y-4 ps-6 sm:ps-8 before:absolute before:start-2.5 sm:before:start-3.5 before:top-3 before:bottom-3 before:w-px before:bg-white/15">
        {filtered.map((item) => {
          const isCompleted = item.status === 'completed';
          const isActive = item.status === 'active';
          return (
            <article
              key={item.id}
              className={`relative rounded-2xl p-5 border transition-colors ${
                isActive
                  ? 'bg-[#101C33] border-cyan-400/40'
                  : 'bg-[#0C1425] border-white/10'
              }`}
            >
              {/* Timeline node icon */}
              <div
                className={`absolute -start-[27px] sm:-start-[31px] top-6 w-6 h-6 rounded-full flex items-center justify-center border ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                    : isCompleted
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-[#0C1425] text-slate-400 border-white/25'
                }`}
              >
                {isActive ? (
                  <Rocket className="w-3.5 h-3.5" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Clock className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-mono-tabular text-cyan-300">
                    {lang === 'ar' ? item.dateAr : item.date}
                  </span>
                  <span className="text-slate-400 font-mono-tabular">
                    FD-{item.flightDay} · {t.timeline.filters[item.status]}
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-semibold text-white">
                  {lang === 'ar' ? item.titleAr : item.title}
                </h2>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {lang === 'ar' ? item.descriptionAr : item.description}
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      onExplain(
                        lang === 'ar' ? item.titleAr : item.title,
                        lang === 'ar' ? item.descriptionAr : item.description
                      )
                    }
                    className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-cyan-200 inline-flex items-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{t.timeline.explainBtn}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
