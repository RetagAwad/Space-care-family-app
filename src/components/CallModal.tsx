import React, { useEffect, useState } from 'react';
import { Mic, MicOff, PhoneOff, Video, VideoOff, Volume2, VolumeX } from 'lucide-react';
import { AstronautProfile, Language } from '../types';
import { getCopy } from '../i18n';
import { SafeImage } from './SafeImage';

interface CallModalProps {
  isOpen: boolean;
  mode: 'voice' | 'video';
  lang: Language;
  astronaut: AstronautProfile;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  mode,
  lang,
  astronaut,
  onClose,
}) => {
  const t = getCopy(lang);
  const [seconds, setSeconds] = useState(0);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(mode === 'video');
  const [speakerOn, setSpeakerOn] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      setConnected(false);
      return;
    }

    setCameraOn(mode === 'video');
    const connectTimer = setTimeout(() => setConnected(true), 1500);
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-[#050914] flex flex-col justify-between p-5 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'video' ? t.call.videoTitle : t.call.voiceTitle}
    >
      {/* Top Clear Simulation Notice */}
      <div className="max-w-xl mx-auto w-full space-y-3 text-center">
        <div className="rounded-2xl bg-amber-500/15 border border-amber-400/40 px-4 py-3 text-sm sm:text-base font-medium text-amber-100">
          {t.call.simBanner}
        </div>
        <p className="text-base sm:text-lg font-semibold text-cyan-300">
          {mode === 'video' ? t.call.videoTitle : t.call.voiceTitle}
        </p>
      </div>

      {/* Center Large Astronaut Son Photo & Call State */}
      <div className="max-w-lg mx-auto w-full flex flex-col items-center text-center space-y-5 my-auto py-4">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-emerald-400/60 shadow-2xl bg-[#0D1628]">
          {mode === 'video' && cameraOn ? (
            <SafeImage
              src={astronaut.avatarUrl}
              alt={lang === 'ar' ? astronaut.nameAr : astronaut.name}
              className="w-full h-full object-cover"
              fallbackTitle={astronaut.name}
            />
          ) : (
            <SafeImage
              src={astronaut.avatarUrl}
              alt={lang === 'ar' ? astronaut.nameAr : astronaut.name}
              className="w-full h-full object-cover opacity-90"
              fallbackTitle={astronaut.name}
            />
          )}
        </div>

        <div className="space-y-1.5">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            {lang === 'ar' ? astronaut.nameAr : astronaut.name}
          </h2>
          <p className="text-xl font-medium text-emerald-300 font-mono-tabular">
            {connected ? `${t.call.connected} · ${mins}:${secs}` : t.call.ringing}
          </p>
        </div>
      </div>

      {/* Bottom Large Easy-Tap Call Controls */}
      <div className="max-w-lg mx-auto w-full space-y-4">
        <div className={`grid gap-3 ${mode === 'video' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className={`min-h-[64px] px-3 py-3 rounded-2xl border text-base font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors ${
              muted
                ? 'bg-amber-500/20 border-amber-400 text-amber-100'
                : 'bg-[#0F192E] border-white/20 text-white hover:bg-white/10'
            }`}
          >
            {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            <span className="text-sm">{muted ? t.call.muteOn : t.call.muteOff}</span>
          </button>

          {mode === 'video' && (
            <button
              type="button"
              onClick={() => setCameraOn((c) => !c)}
              className={`min-h-[64px] px-3 py-3 rounded-2xl border text-base font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors ${
                !cameraOn
                  ? 'bg-amber-500/20 border-amber-400 text-amber-100'
                  : 'bg-[#0F192E] border-white/20 text-white hover:bg-white/10'
              }`}
            >
              {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              <span className="text-sm">{cameraOn ? t.call.camOn : t.call.camOff}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setSpeakerOn((s) => !s)}
            className={`min-h-[64px] px-3 py-3 rounded-2xl border text-base font-semibold flex flex-col items-center justify-center gap-1.5 transition-colors ${
              speakerOn
                ? 'bg-[#0F192E] border-cyan-400/50 text-cyan-100 hover:bg-white/10'
                : 'bg-[#0F192E] border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            {speakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            <span className="text-sm">{t.call.speaker}</span>
          </button>
        </div>

        {/* Very Large Red END CALL Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[68px] py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xl font-bold flex items-center justify-center gap-3 shadow-xl transition-colors"
        >
          <PhoneOff className="w-7 h-7" />
          <span>{t.call.endCall}</span>
        </button>
      </div>
    </div>
  );
};
