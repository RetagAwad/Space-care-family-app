import React, { useState } from 'react';
import { Send, ShieldAlert, Sparkles } from 'lucide-react';
import { AssistantChatMessage, Language } from '../types';
import { getCopy } from '../i18n';

interface AssistantScreenProps {
  lang: Language;
  messages: AssistantChatMessage[];
  loading: boolean;
  onAsk: (question: string) => void;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  lang,
  messages,
  loading,
  onAsk,
}) => {
  const t = getCopy(lang);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onAsk(input.trim());
    setInput('');
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-cyan-300 shrink-0" />
          <span>{t.assistant.title}</span>
        </h1>
        <p className="text-sm text-slate-300">{t.assistant.subtitle}</p>
      </div>

      {/* Non-Diagnostic Guardrail Notice */}
      <div className="rounded-2xl bg-[#0D1629] border border-cyan-400/20 px-4 py-3 flex items-start gap-2.5 text-xs text-slate-300">
        <ShieldAlert className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
        <span>{t.assistant.guardrailNote}</span>
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl bg-[#0C1425] border border-white/10 overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-4 max-h-[440px] overflow-y-auto">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[90%] sm:max-w-[78%] rounded-2xl px-4 py-3 space-y-1.5 ${
                    isUser
                      ? 'bg-blue-600/25 border border-blue-400/30 text-white'
                      : 'bg-[#080E1B] border border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
                    <span className="font-medium text-cyan-300">
                      {isUser
                        ? lang === 'ar'
                          ? 'أنتِ'
                          : 'You'
                        : lang === 'ar'
                        ? 'مساعد SPACE CARE'
                        : 'SPACE CARE Assistant'}
                    </span>
                    <span className="font-mono-tabular">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start" aria-live="polite">
              <div className="rounded-2xl px-4 py-3 bg-[#080E1B] border border-white/10 text-xs text-cyan-300">
                {lang === 'ar' ? 'جاري إعداد الإجابة...' : 'Preparing reassuring explanation...'}
              </div>
            </div>
          )}
        </div>

        {/* Starter Questions */}
        <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-[#080E1B] space-y-2">
          <p className="text-xs text-slate-400">{t.assistant.starterLabel}</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {t.assistant.starters.map((starter, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => onAsk(starter)}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-xs text-slate-200 whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
              >
                {starter}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 border-t border-white/10 bg-[#070C17] flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.assistant.inputPlaceholder}
            className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0C1425] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="min-h-[46px] px-4 sm:px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.assistant.sendBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
