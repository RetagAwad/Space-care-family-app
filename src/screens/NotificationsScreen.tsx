import React, { useMemo, useState } from 'react';
import { Bell, Check, ChevronRight, ShieldCheck } from 'lucide-react';
import { AppNotification, Language, NotificationCategory, ScreenId } from '../types';
import { getCopy } from '../i18n';

interface NotificationsScreenProps {
  lang: Language;
  notifications: AppNotification[];
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  lang,
  notifications,
  onToggleRead,
  onMarkAllRead,
  onNavigate,
}) => {
  const t = getCopy(lang);
  const [category, setCategory] = useState<'all' | NotificationCategory>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    if (category === 'all') return notifications;
    return notifications.filter((n) => n.category === category);
  }, [notifications, category]);

  const categories: Array<'all' | NotificationCategory> = [
    'all',
    'wellness',
    'milestone',
    'message',
    'announcement',
    'emergency',
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.notifications.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono-tabular">
            {unreadCount} {t.notifications.unread}
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 disabled:opacity-40 text-xs font-medium text-cyan-200 inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>{t.notifications.markAllRead}</span>
        </button>
      </div>

      {/* Official Emergency Information Center */}
      <section className="rounded-2xl bg-[#0D1629] border border-blue-400/30 p-4 sm:p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-white">
            {t.notifications.emergencyBannerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.notifications.emergencyBannerBody}
          </p>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              category === cat
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                : 'bg-[#0C1425] text-slate-300 border border-white/10 hover:text-white'
            }`}
          >
            {t.notifications.categories[cat]}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className={`rounded-2xl p-4 sm:p-5 border transition-colors ${
              item.read
                ? 'bg-[#0C1425] border-white/10'
                : 'bg-[#101C33] border-cyan-400/35'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <Bell className={`w-3.5 h-3.5 ${item.read ? 'text-slate-400' : 'text-cyan-300'}`} />
                  <span className={item.read ? 'text-slate-400' : 'text-cyan-300 font-semibold'}>
                    {t.notifications.categories[item.category]}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{lang === 'ar' ? item.timestampAr : item.timestamp}</span>
                  {!item.read && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-200 font-medium">
                        {lang === 'ar' ? 'غير مقروء' : 'Unread'}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-base font-semibold text-white">
                  {lang === 'ar' ? item.titleAr : item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {lang === 'ar' ? item.bodyAr : item.body}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleRead(item.id)}
                  className="min-h-[42px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-slate-200 whitespace-nowrap"
                >
                  {item.read
                    ? lang === 'ar'
                      ? 'تحديد كغير مقروء'
                      : 'Mark unread'
                    : lang === 'ar'
                    ? 'تحديد كمقروء'
                    : 'Mark read'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(item.targetScreen)}
                  className="min-h-[42px] px-3 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-xs font-medium text-cyan-200 inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{lang === 'ar' ? 'فتح' : 'Open'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
