import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Globe, ShieldCheck, Users } from 'lucide-react';
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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('nadia.family@spacecare.demo');
  const [password, setPassword] = useState('ArtemisFamily2026');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [missionCode, setMissionCode] = useState('EXP74-CAIRO');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError(
        lang === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صحيح.'
          : 'Please enter a valid family email address.'
      );
      return;
    }

    if (password.trim().length < 6) {
      setError(
        lang === 'ar'
          ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    if (mode === 'register') {
      if (!name.trim() || !relation.trim()) {
        setError(
          lang === 'ar'
            ? 'يرجى إدخال الاسم الكامل وصلة القرابة.'
            : 'Please enter your full name and relationship to the astronaut.'
        );
        return;
      }
      onLogin(
        {
          id: `fam-${Date.now()}`,
          name: name.trim(),
          nameAr: name.trim(),
          relation: relation.trim(),
          relationAr: relation.trim(),
          email: email.trim(),
          location: 'Cairo, Egypt',
          locationAr: 'القاهرة، مصر',
          isDemo: true,
        },
        rememberMe
      );
      return;
    }

    onLogin(
      {
        ...DEMO_USER,
        email: email.trim(),
      },
      rememberMe
    );
  };

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#060A13] text-slate-100 flex flex-col"
    >
      {/* Top compact bar */}
      <header className="w-full max-w-6xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BrandMark size="md" />
          <div className="leading-tight">
            <span className="font-display font-bold tracking-tight text-base text-white block">
              {t.brand}
            </span>
            <span className="text-[11px] font-medium tracking-wider text-cyan-300 block">
              {t.subBrand}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleLang}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
        >
          <Globe className="w-4 h-4 text-cyan-300" />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </header>

      {/* Main split layout: desktop 2-column, mobile vertical stack */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-5 py-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Onboarding Hero */}
        <section className="lg:col-span-6 flex flex-col justify-between rounded-3xl overflow-hidden border border-white/10 bg-[#0B1222]">
          <div className="relative h-56 sm:h-72 lg:h-80 w-full overflow-hidden">
            <SafeImage
              src={DEMO_ASTRONAUT.heroUrl}
              alt="Earth horizon seen from orbital cupola"
              className="w-full h-full object-cover"
              fallbackTitle="Artemis Orbital Endurance"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1222] via-[#0B1222]/45 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-3 text-xs text-slate-300">
              <span>{DEMO_ASTRONAUT.missionName}</span>
              <span className="font-mono-tabular text-cyan-300">
                {lang === 'ar' ? `اليوم ${DEMO_ASTRONAUT.flightDay}` : `Day ${DEMO_ASTRONAUT.flightDay}`}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-medium text-cyan-300">
                {t.tagline}
              </p>
              <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white text-balance">
                {t.auth.welcomeTitle}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {t.auth.welcomeSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'ملخصات عافية معتمدة ومبسطة للعائلات دون تشخيص طبي'
                    : 'Approved family-safe wellness summaries with clear non-diagnostic guidance'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  {lang === 'ar'
                    ? 'محتوى تجريبي واضح يربط العائلات برسائل الدعم والذكريات'
                    : 'Interactive demo messaging, timeline milestones, and Memory Box'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Authentication & Demo Judge Access */}
        <section className="lg:col-span-6 flex flex-col justify-center rounded-3xl border border-white/10 bg-[#0C1425]/90 p-6 sm:p-8 space-y-6">
          {/* Instant Demo Access for NASA Judges */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-indigo-600/20 border border-cyan-400/30 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs text-cyan-200">
              <span className="font-semibold">{t.demoBadge}</span>
              <span className="font-mono-tabular text-slate-300">EXP-74 · Cairo</span>
            </div>
            <button
              type="button"
              onClick={() => onLogin(DEMO_USER, true)}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/15"
            >
              <span>{t.auth.demoCta}</span>
              <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
            <p className="text-xs text-slate-300 text-center">{t.auth.demoSub}</p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`min-h-[44px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                mode === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.auth.signInTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`min-h-[44px] rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                mode === 'register'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.auth.registerTab}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-300">{t.auth.nameLabel}</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'ar' ? 'نادية المنصوري' : 'Nadia El-Mansouri'}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#070C17] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-300">{t.auth.relationLabel}</span>
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder={lang === 'ar' ? 'أخت / زوجة / والد' : 'Sister / Spouse / Parent'}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#070C17] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </label>
              </div>
            )}

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">{t.auth.emailLabel}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#070C17] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-slate-300">{t.auth.passwordLabel}</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 pe-12 rounded-xl bg-[#070C17] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 end-0 min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            {mode === 'register' && (
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-slate-300">{t.auth.astronautCodeLabel}</span>
                <input
                  type="text"
                  value={missionCode}
                  onChange={(e) => setMissionCode(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#070C17] border border-white/15 text-sm font-mono-tabular text-cyan-200 focus:outline-none focus:border-cyan-400"
                />
              </label>
            )}

            <label className="flex items-center gap-2.5 cursor-pointer select-none min-h-[44px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/25 bg-[#070C17] text-cyan-400 focus:ring-cyan-400"
              />
              <span className="text-xs sm:text-sm text-slate-300">{t.auth.rememberMe}</span>
            </label>

            {error && (
              <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              {mode === 'login' ? t.auth.signInBtn : t.auth.registerBtn}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center pt-2 border-t border-white/10">
            {t.auth.builtFor}
          </p>
        </section>
      </main>
    </div>
  );
};
