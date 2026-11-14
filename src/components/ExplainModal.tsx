import React from 'react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  explanation: string;
  loading: boolean;
  mode?: 'live' | 'demo-fallback';
  lang: Language;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  title,
  explanation,
  loading,
  mode,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explain-modal-title"
    >
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-[#0D1526] border border-white/15 shadow-2xl overflow-hidden">
        <div className="sm:hidden w-10 h-1.5 bg-slate-600 rounded-full mx-auto mt-3" />
        <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center shrink-0 text-cyan-300">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-cyan-300 font-medium">
                {lang === 'ar' ? 'شرح المهمة بالذكاء الاصطناعي' : 'AI Mission Explainer'}
              </p>
              <h3 id="explain-modal-title" className="text-base font-semibold text-white truncate">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {loading ? (
            <div className="space-y-2.5 py-4" aria-live="polite">
              <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
            </div>
          ) : (
            <p className="text-sm sm:text-base leading-relaxed text-slate-200 whitespace-pre-line">
              {explanation}
            </p>
          )}

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {lang === 'ar'
                ? 'شرح مبسّط لأغراض التوضيح العائلي بناءً على بيانات العرض فقط، ولا يُعد تشخيصاً طبياً.'
                : 'Plain-language family explanation based on simulated demo information only. Not a medical diagnosis.'}
              {mode === 'demo-fallback' &&
                (lang === 'ar' ? ' · وضع الشرح التجريبي المحلي' : ' · Local fallback mode')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors"
          >
            {lang === 'ar' ? 'حسناً، فهمت' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
