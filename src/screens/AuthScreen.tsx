import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Globe } from 'lucide-react';
import { FamilyUser, Language } from '../types';
import { getCopy } from '../i18n';
import { DEMO_ASTRONAUT, DEMO_USER } from '../data/demoData';
import { BrandMark } from '../components/BrandMark';
import { SafeImage } from '../components/SafeImage';

interface AuthScreenProps {
  lang: Language;
  onToggleLang: () => void;
  onLogin: (user: FamilyUser, remember: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  lang,
  onToggleLang,
  onLogin,
}) => {
  const t = getCopy(lang);
  const [email, setEmail] = useState('amina.family@spacecare.demo');
  const [password, setPassword] = useState('Family2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError(
        lang === 'ar'
          ? 'من فضلك اكتبي البريد الإلكتروني بشكل صحيح.'
          : 'Please enter a valid email address.'
      );
      return;
    }
    if (password.trim().length < 4) {
      setError(
        lang === 'ar'
          ? 'من فضلك اكتبي كلمة المرور.'
          : 'Please enter your password.'
      );
      return;
    }
    onLogin({ ...DEMO_USER, email: email.trim() }, rememberMe);
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070B16] text-white flex flex-col"
    >
      {/* Top Bar with Big Language Switch */}
      <header className="w-full max-w-4xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark size="md" />
          <div>
            <span className="font-display text-lg font-bold text-white block leading-tight">
              {t.brand}
            </span>
            <span className="text-sm font-medium text-cyan-300 block leading-tight">
              {t.subBrand}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleLang}
          className="min-h-[56px] px-5 py-3 rounded-2xl bg-[#111B33] hover:bg-[#192747] border border-cyan-400/40 text-base font-bold text-white flex items-center gap-2.5 shrink-0"
        >
          <Globe className="w-5 h-5 text-cyan-300" />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-5 py-6 flex flex-col justify-center gap-6">
        {/* Warm Welcome Card with Son's Photo & Huge 1-Tap Demo Button */}
        <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 sm:p-8 space-y-6 text-center">
          <div className="w-32 h-32 sm:w-36 sm:h-36 mx-auto rounded-3xl overflow-hidden border-2 border-cyan-300/60 shadow-xl bg-[#091020]">
            <SafeImage
              src={DEMO_ASTRONAUT.avatarUrl}
              alt={lang === 'ar' ? DEMO_ASTRONAUT.nameAr : DEMO_ASTRONAUT.name}
              className="w-full h-full object-cover"
              fallbackTitle={DEMO_ASTRONAUT.name}
            />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {t.auth.welcomeTitle}
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
              {t.auth.welcomeBody}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onLogin(DEMO_USER, true)}
            className="w-full max-w-lg mx-auto min-h-[64px] py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-colors"
          >
            <span>{t.auth.demoButton}</span>
            <ArrowRight className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          </button>

          <p className="text-sm text-slate-300">{t.demoNotice}</p>
        </section>

        {/* Simple Family Email Sign-In */}
        <section className="rounded-3xl bg-[#0E172B] border border-white/15 p-6 sm:p-8 space-y-5">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-200 text-center">
            {t.auth.orSignIn}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
            <label className="block space-y-2">
              <span className="text-base font-medium text-slate-200 block">
                {t.auth.emailLabel}
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-[#070B16] border border-white/25 text-lg text-white focus:outline-none focus:border-cyan-400"
              />
            </label>

            <div className="space-y-2">
              <label className="block space-y-2">
                <span className="text-base font-medium text-slate-200 block">
                  {t.auth.passwordLabel}
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-[#070B16] border border-white/25 text-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="min-h-[48px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-base font-medium text-cyan-200 inline-flex items-center gap-2"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                <span>{showPassword ? t.auth.hidePassword : t.auth.showPassword}</span>
              </button>
            </div>

            <label className="flex items-center gap-3 min-h-[52px] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-6 h-6 rounded border-white/30 bg-[#070B16] text-cyan-400"
              />
              <span className="text-base text-slate-200">{t.auth.rememberMe}</span>
            </label>

            {error && (
              <p className="text-base text-rose-200 bg-rose-500/20 border border-rose-400/40 rounded-2xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[60px] py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold transition-colors"
            >
              {t.auth.signInButton}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};
