import React, { useState } from 'react';
import { CheckCheck, Info, Megaphone, Send } from 'lucide-react';
import { FamilyMessage, FamilyUser, Language } from '../types';
import { getCopy } from '../i18n';
import { QUICK_MESSAGE_TEMPLATES } from '../data/demoData';

interface CommunicationScreenProps {
  lang: Language;
  user: FamilyUser;
  messages: FamilyMessage[];
  onSendMessage: (text: string) => void;
}

export const CommunicationScreen: React.FC<CommunicationScreenProps> = ({
  lang,
  user,
  messages,
  onSendMessage,
}) => {
  const t = getCopy(lang);
  const [tab, setTab] = useState<'chat' | 'announcements'>('chat');
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage(draft.trim());
    setDraft('');
  };

  const announcements = [
    {
      id: 'ann-1',
      date: lang === 'ar' ? 'اليوم · مركز القاهرة' : 'Today · Cairo Liaison Desk',
      title:
        lang === 'ar'
          ? 'تأكيد نافذة المكالمة المرئية يوم السبت'
          : 'Saturday Family Video Window Confirmed',
      body:
        lang === 'ar'
          ? 'نافذة الاتصال العائلي الخاصة بالبعثة 74 مؤكدة الساعة 19:00 بتوقيت القاهرة لمدة 20 دقيقة.'
          : 'Expedition 74 private family video conference is confirmed for Saturday at 19:00 Cairo Time (20-minute slot).',
    },
    {
      id: 'ann-2',
      date: lang === 'ar' ? 'قبل 3 أيام · الدعم الأرضي' : '3 days ago · Ground Support',
      title:
        lang === 'ar'
          ? 'جدول تجميع رسائل العائلة المدارية'
          : 'Orbital Text Bundle Uplinks Twice Daily',
      body:
        lang === 'ar'
          ? 'تُرسل الرسائل النصية المعتمدة في دفعتين يومياً عند الساعة 08:00 و 20:00 بالتوقيت العالمي.'
          : 'Approved family text notes are bundled into morning and evening uplinks at 08:00 and 20:00 UTC.',
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.communication.title}
          </h1>
        </div>

        {/* Segmented tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0C1425] border border-white/10 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setTab('chat')}
            className={`min-h-[44px] px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              tab === 'chat' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.communication.chatTab}
          </button>
          <button
            type="button"
            onClick={() => setTab('announcements')}
            className={`min-h-[44px] px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              tab === 'announcements'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.communication.announcementsTab}
          </button>
        </div>
      </div>

      {/* Infrastructure clarity notice */}
      <div className="rounded-2xl bg-[#0D1629] border border-cyan-400/20 px-4 py-3 flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
        <span>{t.communication.infraNotice}</span>
      </div>

      {tab === 'announcements' ? (
        <div className="space-y-3">
          {announcements.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl bg-[#0C1425] border border-white/10 p-5 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <Megaphone className="w-4 h-4" />
                <span>{item.date}</span>
              </div>
              <h2 className="text-base font-semibold text-white">{item.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#0C1425] border border-white/10 overflow-hidden flex flex-col">
          {/* Message History */}
          <div className="p-4 sm:p-6 space-y-4 max-h-[460px] overflow-y-auto">
            {messages.map((msg) => {
              const isFamily = msg.sender === 'family';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isFamily ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[75%] rounded-2xl px-4 py-3 space-y-1.5 ${
                      isFamily
                        ? 'bg-blue-600/25 border border-blue-400/30 text-white'
                        : msg.sender === 'liaison'
                        ? 'bg-white/[0.04] border border-white/10 text-slate-200'
                        : 'bg-cyan-500/15 border border-cyan-400/25 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[11px] text-slate-400">
                      <span className="font-medium text-cyan-200">
                        {isFamily
                          ? lang === 'ar'
                            ? user.nameAr
                            : user.name
                          : lang === 'ar'
                          ? msg.senderNameAr
                          : msg.senderName}
                      </span>
                      <span className="font-mono-tabular">{msg.timestamp}</span>
                    </div>

                    <p className="text-sm leading-relaxed">
                      {lang === 'ar' && msg.textAr ? msg.textAr : msg.text}
                    </p>

                    <div className="flex items-center justify-end gap-1 text-[11px] text-slate-400">
                      <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{msg.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Supportive Templates */}
          <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-[#080E1B] space-y-2">
            <p className="text-xs text-slate-400">{t.communication.templatesLabel}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {QUICK_MESSAGE_TEMPLATES.map((tpl, idx) => {
                const text = lang === 'ar' ? tpl.ar : tpl.en;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setDraft(text)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 text-xs text-slate-200 whitespace-nowrap shrink-0 transition-colors"
                  >
                    {text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 border-t border-white/10 bg-[#070C17] flex items-center gap-3"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.communication.inputPlaceholder}
              className="flex-1 min-h-[46px] px-4 py-2.5 rounded-xl bg-[#0C1425] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="min-h-[46px] px-4 sm:px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm flex items-center gap-2 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t.communication.sendBtn}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
