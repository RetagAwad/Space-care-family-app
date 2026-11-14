import React from 'react';
import { BookOpen, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { getCopy } from '../i18n';
import { SUPPORT_HUB_ARTICLES } from '../data/demoData';

interface SupportHubScreenProps {
  lang: Language;
  onExplain: (title: string, details: string) => void;
}

export const SupportHubScreen: React.FC<SupportHubScreenProps> = ({ lang, onExplain }) => {
  const t = getCopy(lang);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <HeartHandshake className="w-6 h-6 text-cyan-300" />
          <span>{t.supportHub.title}</span>
        </h1>
        <p className="text-sm text-slate-300">{t.supportHub.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SUPPORT_HUB_ARTICLES.map((article) => {
          const title = lang === 'ar' ? article.titleAr : article.title;
          const summary = lang === 'ar' ? article.summaryAr : article.summary;
          return (
            <article
              key={article.id}
              className="rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-cyan-300">
                  <span>{lang === 'ar' ? article.categoryAr : article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">
                    {lang === 'ar' ? article.readTimeAr : article.readTime}
                  </span>
                </div>
                <h2 className="font-display text-lg font-semibold text-white leading-snug">
                  {title}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
              </div>

              <button
                type="button"
                onClick={() => onExplain(title, summary)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-cyan-200 inline-flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تلخيص مبسّط' : 'Explain Simply'}</span>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
};
