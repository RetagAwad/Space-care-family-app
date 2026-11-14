import React, { useMemo, useState } from 'react';
import { Activity, BookOpen, Info, Search } from 'lucide-react';
import { Language, WellnessHistoryItem, WellnessMetric } from '../types';
import { getCopy } from '../i18n';

interface WellnessScreenProps {
  lang: Language;
  metrics: WellnessMetric[];
  history: WellnessHistoryItem[];
  onExplain: (title: string, details: string) => void;
}

export const WellnessScreen: React.FC<WellnessScreenProps> = ({
  lang,
  metrics,
  history,
  onExplain,
}) => {
  const t = getCopy(lang);
  const [search, setSearch] = useState('');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const chartItems = useMemo(() => [...history].reverse(), [history]);
  const activePoint = chartItems[selectedDayIndex] ?? chartItems[chartItems.length - 1];

  const filteredHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return history;
    return history.filter((item) =>
      `${item.title} ${item.titleAr} ${item.summary} ${item.summaryAr} ${item.date}`
        .toLowerCase()
        .includes(q)
    );
  }, [history, search]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
          {t.wellness.title}
        </h1>
        <p className="text-sm text-slate-300">
          {lang === 'ar'
            ? 'ملخصات عافية يومية مبسطة ومعتمدة لعائلة القائدة ليلى المنصوري.'
            : 'Approved daily family-friendly wellness summaries for Cmdr. Layla El-Mansouri.'}
        </p>
      </div>

      {/* Mandatory Non-Diagnostic & Demo Disclaimer */}
      <div className="rounded-2xl bg-[#0D162A] border border-amber-400/30 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-semibold text-amber-200">{t.wellness.disclaimerTitle}</p>
          <p className="text-slate-300 leading-relaxed">{t.wellness.disclaimerBody}</p>
        </div>
      </div>

      {/* 4 Approved Wellness Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <article
            key={metric.id}
            className="rounded-2xl bg-[#0C1425] border border-white/10 p-5 flex flex-col justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                <span>{lang === 'ar' ? metric.statusTextAr : metric.statusText}</span>
                <span className="font-mono-tabular">
                  {lang === 'ar' ? metric.updatedAtAr : metric.updatedAt}
                </span>
              </div>
              <h2 className="text-sm font-semibold text-slate-200">
                {lang === 'ar' ? metric.labelAr : metric.label}
              </h2>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white font-mono-tabular">
                {metric.value}
              </span>
              <span className="text-xs text-cyan-300 font-mono-tabular">{metric.unit}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar' ? metric.summaryAr : metric.summary}
            </p>
          </article>
        ))}
      </div>

      {/* Interactive SVG Sleep & Exercise Rhythm Chart */}
      <section className="rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-300" />
              <span>{t.wellness.trendTitle}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'اضغطي على أي يوم لعرض القراءة التفصيلية.'
                : 'Select any flight day below to inspect the approved summary point.'}
            </p>
          </div>

          {activePoint && (
            <div className="flex items-center gap-4 text-xs font-mono-tabular bg-[#070C17] border border-white/10 rounded-xl px-3.5 py-2">
              <span className="text-slate-300">Day {activePoint.day}</span>
              <span className="text-cyan-300">
                {t.wellness.sleepLabel}: {activePoint.sleepHours.toFixed(1)}h
              </span>
              <span className="text-indigo-300">
                {t.wellness.activityLabel}: {activePoint.activityMinutes}m
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-44 pt-4 px-2 border-b border-white/10">
          {chartItems.map((item, idx) => {
            const sleepHeightPct = Math.min(100, Math.round((item.sleepHours / 9) * 100));
            const actHeightPct = Math.min(100, Math.round((item.activityMinutes / 160) * 100));
            const isSelected = idx === selectedDayIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`flex flex-col items-center justify-end gap-2 h-full rounded-xl p-2 transition-colors ${
                  isSelected ? 'bg-white/[0.06] ring-1 ring-cyan-400/40' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="w-full flex items-end justify-center gap-1.5 h-28">
                  <div
                    className="w-3 sm:w-4 rounded-t-md bg-cyan-400/85 transition-all"
                    style={{ height: `${sleepHeightPct}%` }}
                    title={`${item.sleepHours}h sleep`}
                  />
                  <div
                    className="w-3 sm:w-4 rounded-t-md bg-indigo-400/80 transition-all"
                    style={{ height: `${actHeightPct}%` }}
                    title={`${item.activityMinutes}m activity`}
                  />
                </div>
                <span className="text-xs font-mono-tabular text-slate-300">D{item.day}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-400/85 inline-block" />
            {t.wellness.sleepLabel}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-indigo-400/80 inline-block" />
            {t.wellness.activityLabel}
          </span>
        </div>
      </section>

      {/* Searchable Health Update History */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-white">
            {t.wellness.historyTitle}
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.wellness.searchPlaceholder}
              className="w-full min-h-[44px] ps-10 pe-4 py-2 rounded-xl bg-[#0C1425] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-[#0C1425] border border-white/10 p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono-tabular text-cyan-300">
                  {lang === 'ar' ? item.dateAr : item.date}
                </span>
                <span className="text-xs font-mono-tabular text-slate-400">
                  {item.sleepHours.toFixed(1)}h · {item.activityMinutes} min
                </span>
              </div>

              <h3 className="text-base font-semibold text-white">
                {lang === 'ar' ? item.titleAr : item.title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {lang === 'ar' ? item.summaryAr : item.summary}
              </p>

              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-indigo-200/90">
                  {lang === 'ar' ? item.aiInsightAr : item.aiInsight}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onExplain(
                      lang === 'ar' ? item.titleAr : item.title,
                      lang === 'ar' ? item.summaryAr : item.summary
                    )
                  }
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t.wellness.explainBtn}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
