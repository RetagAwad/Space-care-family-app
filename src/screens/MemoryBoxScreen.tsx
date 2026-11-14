import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { Language, MemoryItem } from '../types';
import { getCopy } from '../i18n';
import { SafeImage } from '../components/SafeImage';

interface MemoryBoxScreenProps {
  lang: Language;
  memories: MemoryItem[];
  onAddMemory: (title: string, note: string) => void;
}

export const MemoryBoxScreen: React.FC<MemoryBoxScreenProps> = ({
  lang,
  memories,
  onAddMemory,
}) => {
  const t = getCopy(lang);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !note.trim()) return;
    onAddMemory(title.trim(), note.trim());
    setTitle('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Heart className="w-6 h-6 text-cyan-300" />
          <span>{t.memoryBox.title}</span>
        </h1>
        <p className="text-sm text-slate-300">{t.memoryBox.subtitle}</p>
      </div>

      {/* Add New Memory Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-[#0C1425] border border-white/10 p-5 sm:p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-white">{t.memoryBox.addTitle}</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.memoryBox.titlePlaceholder}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#070C17] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.memoryBox.notePlaceholder}
            className="w-full px-4 py-2.5 rounded-xl bg-[#070C17] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <button
          type="submit"
          disabled={!title.trim() || !note.trim()}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 text-slate-950 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.memoryBox.saveBtn}</span>
        </button>
      </form>

      {/* Saved Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {memories.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl bg-[#0C1425] border border-white/10 overflow-hidden flex flex-col"
          >
            {item.imageUrl && (
              <div className="h-44 w-full overflow-hidden bg-[#080E1B]">
                <SafeImage
                  src={item.imageUrl}
                  alt={lang === 'ar' ? item.titleAr : item.title}
                  className="w-full h-full object-cover"
                  fallbackTitle={lang === 'ar' ? item.titleAr : item.title}
                />
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-slate-400 font-mono-tabular">
                  {item.date} · {lang === 'ar' ? item.authorAr : item.author}
                </p>
                <h3 className="text-base font-semibold text-white">
                  {lang === 'ar' ? item.titleAr : item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {lang === 'ar' ? item.noteAr : item.note}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
