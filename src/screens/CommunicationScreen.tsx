import React, { useRef, useState } from 'react';
import {
  Camera,
  Check,
  CheckCheck,
  Mic,
  Phone,
  Send,
  Smile,
  Square,
  Video,
  X,
} from 'lucide-react';
import { AstronautProfile, FamilyMessage, Language } from '../types';
import { getCopy } from '../i18n';
import { DEMO_PHOTOS, QUICK_EMOJIS, QUICK_FRIENDLY_REPLIES } from '../data/demoData';
import { SafeImage } from '../components/SafeImage';

interface CommunicationScreenProps {
  lang: Language;
  astronaut: AstronautProfile;
  messages: FamilyMessage[];
  onSendMessage: (payload: {
    text: string;
    imageUrl?: string;
    voiceDurationSec?: number;
  }) => void;
  onStartCall: (mode: 'voice' | 'video') => void;
}

export const CommunicationScreen: React.FC<CommunicationScreenProps> = ({
  lang,
  astronaut,
  messages,
  onSendMessage,
  onStartCall,
}) => {
  const t = getCopy(lang);
  const [draft, setDraft] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [confirmation, setConfirmation] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showSentToast = () => {
    setConfirmation(t.messages.sentConfirmation);
    setTimeout(() => setConfirmation(''), 3500);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendMessage({ text: draft.trim() });
    setDraft('');
    setShowEmojiPicker(false);
    showSentToast();
  };

  const handleQuickSend = (text: string) => {
    onSendMessage({ text });
    showSentToast();
  };

  const handleSendSamplePhoto = (imageUrl: string, label: string) => {
    onSendMessage({
      text: label,
      imageUrl,
    });
    setShowPhotoPicker(false);
    showSentToast();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSendMessage({
          text: lang === 'ar' ? 'صورة من العائلة' : 'Family Photo',
          imageUrl: reader.result,
        });
        setShowPhotoPicker(false);
        showSentToast();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleVoice = () => {
    if (!recording) {
      setRecording(true);
      setRecordSeconds(1);
      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecording(false);
      const dur = Math.max(2, recordSeconds);
      setRecordSeconds(0);
      onSendMessage({
        text:
          lang === 'ar'
            ? `رسالة صوتية (${dur} ثواني)`
            : `Voice message (${dur} seconds)`,
        voiceDurationSec: dur,
      });
      showSentToast();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Chat Header with Son's Photo & Big Call Buttons */}
      <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-cyan-300/50 shrink-0">
            <SafeImage
              src={astronaut.avatarUrl}
              alt={lang === 'ar' ? astronaut.nameAr : astronaut.name}
              className="w-full h-full object-cover"
              fallbackTitle={astronaut.name}
            />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
              {t.messages.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-300">{t.messages.simNote}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onStartCall('voice')}
            className="min-h-[56px] px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-base font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span>{t.messages.voiceCallShort}</span>
          </button>
          <button
            type="button"
            onClick={() => onStartCall('video')}
            className="min-h-[56px] px-4 py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-base font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Video className="w-5 h-5" />
            <span>{t.messages.videoCallShort}</span>
          </button>
        </div>
      </section>

      {/* Clear Confirmation Banner */}
      {confirmation && (
        <div
          role="status"
          className="rounded-2xl bg-emerald-500/20 border border-emerald-400/50 px-5 py-3.5 text-lg font-semibold text-emerald-100 flex items-center gap-2.5"
        >
          <Check className="w-6 h-6 text-emerald-300 shrink-0" />
          <span>{confirmation}</span>
        </div>
      )}

      {/* WhatsApp-style Large Message Bubbles */}
      <section className="rounded-3xl bg-[#0B1222] border border-white/15 overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 space-y-4 max-h-[430px] overflow-y-auto">
          {messages.map((msg) => {
            const isFamily = msg.sender === 'family';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isFamily ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[80%] rounded-3xl px-5 py-4 space-y-2 ${
                    isFamily
                      ? 'bg-[#124E3B] border border-emerald-400/40 text-white'
                      : 'bg-[#16223B] border border-white/15 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 text-sm text-slate-200 font-semibold">
                    <span>
                      {isFamily
                        ? lang === 'ar'
                          ? 'أنتِ'
                          : 'You'
                        : lang === 'ar'
                        ? msg.senderNameAr
                        : msg.senderName}
                    </span>
                    <span className="font-mono-tabular text-xs sm:text-sm text-slate-300">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-white/15 max-w-xs">
                      <SafeImage
                        src={msg.imageUrl}
                        alt={msg.text}
                        className="w-full h-44 object-cover"
                        fallbackTitle={msg.text}
                      />
                    </div>
                  )}

                  {msg.voiceDurationSec ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-black/25 px-4 py-3 text-base sm:text-lg font-medium">
                      <Mic className="w-6 h-6 text-emerald-300 shrink-0" />
                      <span>
                        {lang === 'ar'
                          ? `رسالة صوتية مسجلة (${msg.voiceDurationSec} ث)`
                          : `Voice message (${msg.voiceDurationSec}s)`}
                      </span>
                    </div>
                  ) : (
                    <p className="text-lg sm:text-xl leading-relaxed">
                      {lang === 'ar' && msg.textAr ? msg.textAr : msg.text}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-1.5 text-sm text-emerald-200">
                    <CheckCheck className="w-4 h-4" />
                    <span>
                      {msg.status === 'Seen by Family Hub'
                        ? lang === 'ar'
                          ? 'وصلت واتشافت'
                          : 'Delivered & Seen'
                        : lang === 'ar'
                        ? 'تم الإرسال (تجريبي)'
                        : 'Sent (Demo)'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* One-Tap Friendly Messages */}
        <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-[#0E172B] space-y-2.5">
          <p className="text-base font-semibold text-slate-200">
            {t.messages.quickRepliesTitle}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {QUICK_FRIENDLY_REPLIES.map((tpl, idx) => {
              const label = lang === 'ar' ? tpl.ar : tpl.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSend(label)}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-[#182645] hover:bg-[#22355E] border border-cyan-400/30 text-base font-medium text-white transition-colors"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Large Emoji Tray */}
        {showEmojiPicker && (
          <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-[#101B32]">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setDraft((prev) => `${prev}${emoji}`)}
                  className="min-h-[56px] rounded-2xl bg-white/5 hover:bg-white/15 text-3xl flex items-center justify-center"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Optional Photo Attachment Picker */}
        {showPhotoPicker && (
          <div className="px-4 sm:px-6 py-4 border-t border-white/10 bg-[#101B32] space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-white">
                {t.messages.attachSampleTitle}
              </p>
              <button
                type="button"
                onClick={() => setShowPhotoPicker(false)}
                className="min-h-[44px] px-3 rounded-xl bg-white/10 text-sm font-semibold text-white inline-flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>{t.messages.cancel}</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DEMO_PHOTOS.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() =>
                    handleSendSamplePhoto(
                      photo.imageUrl,
                      lang === 'ar' ? photo.titleAr : photo.title
                    )
                  }
                  className="rounded-2xl overflow-hidden border border-white/20 bg-[#0B1222] text-start hover:border-cyan-400 transition-colors"
                >
                  <SafeImage
                    src={photo.imageUrl}
                    alt={lang === 'ar' ? photo.titleAr : photo.title}
                    className="w-full h-24 object-cover"
                    fallbackTitle={photo.title}
                  />
                  <span className="block p-2.5 text-sm font-semibold text-white">
                    {lang === 'ar' ? photo.titleAr : photo.title}
                  </span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[96px] rounded-2xl border-2 border-dashed border-cyan-400/50 bg-cyan-500/10 hover:bg-cyan-500/20 p-4 flex flex-col items-center justify-center gap-2 text-center text-base font-semibold text-cyan-200"
              >
                <Camera className="w-7 h-7" />
                <span>{t.messages.attachDevicePhoto}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Senior-Friendly Composer: Clearly Labeled Buttons + Large Input + Huge Green SEND */}
        <form
          onSubmit={handleSendText}
          className="p-4 sm:p-5 border-t border-white/15 bg-[#080E1B] space-y-3"
        >
          {/* Large Easy-Label Tool Row: Emoji, Photo, Voice */}
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowEmojiPicker((v) => !v);
                setShowPhotoPicker(false);
              }}
              className={`min-h-[56px] px-3 py-2.5 rounded-2xl border text-base font-semibold flex items-center justify-center gap-2 transition-colors ${
                showEmojiPicker
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100'
                  : 'bg-[#121D35] border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Smile className="w-6 h-6 text-amber-300 shrink-0" />
              <span>{t.messages.emojiLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowPhotoPicker((v) => !v);
                setShowEmojiPicker(false);
              }}
              className={`min-h-[56px] px-3 py-2.5 rounded-2xl border text-base font-semibold flex items-center justify-center gap-2 transition-colors ${
                showPhotoPicker
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-100'
                  : 'bg-[#121D35] border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Camera className="w-6 h-6 text-cyan-300 shrink-0" />
              <span>{t.messages.photoLabel}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleVoice}
              className={`min-h-[56px] px-3 py-2.5 rounded-2xl border text-base font-semibold flex items-center justify-center gap-2 transition-colors ${
                recording
                  ? 'bg-red-600 border-red-400 text-white'
                  : 'bg-[#121D35] border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {recording ? (
                <>
                  <Square className="w-5 h-5 shrink-0" />
                  <span className="truncate">
                    {t.messages.stopVoiceLabel} ({recordSeconds}s)
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 text-emerald-300 shrink-0" />
                  <span>{t.messages.voiceLabel}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.messages.inputPlaceholder}
              className="flex-1 min-h-[60px] px-5 py-3 rounded-2xl bg-[#0F182D] border border-white/25 text-lg sm:text-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className="min-h-[60px] px-7 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 text-xl font-bold flex items-center justify-center gap-2.5 transition-colors shrink-0"
            >
              <Send className="w-6 h-6" />
              <span>{t.messages.sendButton}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
