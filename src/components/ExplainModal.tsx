import React from 'react';
import { X, BookOpen, Info } from 'lucide-react';
import { Language } from '../types';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  explanation: string;
  loading: boolean;
  lang: Language;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  isOpen,
  onClose,
  title,
  explanation,
  loading,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explain-modal-title"
    >
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#0E172B] border border-white/20 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-white/15">
          <div className="flex items-center gap-3 min-w-0">
            <BookOpen className="w-6 h-6 text-cyan-300 shrink-0" />
            <h3 id="explain-modal-title" className="text-xl font-bold text-white truncate">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <p className="text-lg text-cyan-200 py-4" aria-live="polite">
              {lang === 'ar' ? 'بنجهزلك شرح بسيط...' : 'Preparing a simple explanation...'}
            </p>
          ) : (
            <p className="text-lg sm:text-xl leading-relaxed text-slate-100 whitespace-pre-line">
              {explanation}
            </p>
          )}

          <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 text-sm sm:text-base text-slate-300">
            <Info className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
            <span>
              {lang === 'ar'
                ? 'ده شرح بسيط للتوضيح العائلي من بيانات العرض التجريبية ومش تشخيص طبي.'
                : 'Simple explanation from demo data for family comfort. Not medical advice.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full min-h-[60px] py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xl transition-colors"
          >
            {lang === 'ar' ? 'تمام، فهمت' : 'OK, Got It'}
          </button>
        </div>
      </div>
    </div>
  );
};
