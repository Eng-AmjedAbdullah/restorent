import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Globe,
  Lock,
  Mail,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Store,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { t, language, toggleLanguage, direction, setCurrentPage, showToast } = useApp();
  const [email, setEmail] = useState('sultan.dosari@restoraintel.sa');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(language === 'ar' ? 'تم تسجيل الدخول بنجاح إلى منصة RestoraIntel' : 'Successfully logged in to RestoraIntel');
    setCurrentPage('dashboard');
  };

  const setDemoRole = (roleEmail: string, roleName: string) => {
    setEmail(roleEmail);
    showToast(language === 'ar' ? `تم تحميل بيانات تجريبية: ${roleName}` : `Loaded demo profile: ${roleName}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#08131F] text-slate-100 flex flex-col justify-between select-none">
      {/* Top Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#142334]">
        <div className="flex items-center gap-3">
          <div className="shrink-0 flex items-center justify-center">
            <img
              src="/logo-mark.png"
              alt="RestoraIntel"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
              className="w-10 h-10 object-contain drop-shadow-[0_2px_12px_rgba(78,222,227,0.35)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-white tracking-tight">
              Restora<span className="text-[#4edee3]">Intel</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#4edee3]/15 text-[#4edee3] border border-[#34abb1]/40">
              {t.login.badge}
            </span>
          </div>
        </div>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#182F48] bg-[#0C1A2A] hover:bg-[#10243B] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#4edee3]" />
          <span>{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
        </button>
      </header>

      {/* Main Grid: Form Left/Right + Hero Banner */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-5xl bg-[#0C1A2A] border border-[#182F48] rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Form Column */}
          <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4edee3]/15 border border-[#34abb1]/40 text-[#4edee3] text-xs font-semibold mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تسجيل الدخول الموحد والمصادقة البيومترية' : 'Enterprise SSO & Biometrics'}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {t.login.welcome}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-2 leading-relaxed">
                {t.login.description}
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t.login.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute inset-y-0 start-3.5 my-auto pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-[#08131F] border border-[#182F48] text-sm text-white ps-10 pe-3.5 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#34abb1] focus:border-transparent transition-all"
                      placeholder={t.login.emailPlaceholder}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {t.login.passwordLabel}
                    </label>
                    <span className="text-xs text-[#4edee3] hover:underline cursor-pointer">
                      {t.login.forgotPassword}
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute inset-y-0 start-3.5 my-auto pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-[#08131F] border border-[#182F48] text-sm text-white ps-10 pe-3.5 py-2.5 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#34abb1] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded border-[#182F48] bg-[#08131F] text-[#34abb1] focus:ring-[#34abb1]"
                    />
                    <span>{t.login.rememberMe}</span>
                  </label>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Store className="w-3.5 h-3.5 text-[#4edee3]" />
                    <span>{language === 'ar' ? 'فرع وادي الدواسر (WAD-01)' : 'Wadi Al-Dawasir Branch (WAD-01)'}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full mt-2 bg-gradient-to-r from-[#2c777c] via-[#34abb1] to-[#4edee3] hover:from-[#1e5458] hover:via-[#2c777c] hover:to-[#34abb1] text-white font-bold shadow-md shadow-[#2c777c]/30 border border-[#4edee3]/40"
                  icon={direction === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  iconPosition="end"
                >
                  {t.login.signInBtn}
                </Button>
              </form>

              {/* Quick Persona Switcher for Presentation Prototype */}
              <div className="mt-6 pt-5 border-t border-[#182F48]">
                <p className="text-[11px] font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#4edee3]" />
                  <span>{language === 'ar' ? 'أدوار تجريبية سريعة للعرض والتقييم:' : 'Quick Demo Personas for Review:'}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDemoRole('sultan.dosari@restoraintel.sa', language === 'ar' ? 'مدير العمليات' : 'Operations Director')}
                    className="text-start p-2 rounded-lg bg-[#08131F] border border-[#182F48] hover:border-[#4edee3]/60 transition-colors cursor-pointer"
                  >
                    <p className="text-[11px] font-bold text-white">
                      {language === 'ar' ? 'سلطان الدوسري' : 'Sultan Al-Dawsari'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {language === 'ar' ? 'مدير العمليات والتشغيل' : 'Operations & Floor Director'}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoRole('chef.khalid@restoraintel.sa', language === 'ar' ? 'الشيف التنفيذي' : 'Executive Chef')}
                    className="text-start p-2 rounded-lg bg-[#08131F] border border-[#182F48] hover:border-[#4edee3]/60 transition-colors cursor-pointer"
                  >
                    <p className="text-[11px] font-bold text-white">
                      {language === 'ar' ? 'الشيف خالد الدوسري' : 'Chef Khalid Al-Dawsari'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {language === 'ar' ? 'شيف المطبخ ومسؤول الـ 86' : 'Kitchen Head & 86 Controller'}
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 text-center text-xs text-slate-400">
              {language === 'ar' ? 'بيئة عرض تجريبية تفاعلية لمنظومة RestoraIntel' : 'Interactive Prototype Review Environment for RestoraIntel'}
            </div>
          </div>

          {/* Right Hero / Intelligence Showcase Column */}
          <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#08131F] via-[#0D1C2D] to-[#12283E] p-12 flex-col justify-between border-s border-[#182F48] relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-0 end-0 w-80 h-80 bg-[#4edee3]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edee3] animate-ping" />
                <span className="text-xs font-extrabold text-[#4edee3] tracking-wider uppercase">
                  RestoraAI Neural Core v4.2
                </span>
              </div>

              <h3 className="text-2xl font-black text-white leading-snug">
                {language === 'ar'
                  ? 'منظومة الذكاء الاصطناعي التشغيلي الأولى للمطاعم في المملكة'
                  : 'The Leading AI Operating System for High-Volume Restaurants in Saudi Arabia'}
              </h3>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {language === 'ar'
                  ? 'توجيه ذكي لجداول الموظفين، تنبؤ دقيق بذروات الإقبال في فرع وادي الدواسر، كشف تلقائي عن عجز المخزون، وتحكم فوري في شاشات المطبخ KDS.'
                  : 'Automated staff shift allocation, accurate weekend surge prediction in Wadi Al-Dawasir, inventory depletion telemetry, and live KDS floor sync.'}
              </p>

              {/* Intelligence Stats Badge Cards */}
              <div className="mt-8 space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#08131F]/80 border border-[#182F48] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4edee3]/15 text-[#4edee3] flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {language === 'ar' ? 'تقليص هدر الغذاء والمخزون' : 'Food Waste Mitigation'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        -28.4%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'ar'
                        ? 'ضبط تلقائي لكميات طبخ الأرز واللحوم الطازجة بناءً على حركة الطلبات'
                        : 'Calibrated batch sizes based on real-time intake telemetry'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#08131F]/80 border border-[#182F48] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-300 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {language === 'ar' ? 'محرك التنبؤ بالساعات القصوى' : 'Peak Hour Surge Predictor'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                        {language === 'ar' ? '94.2% دقة' : '94.2% Accuracy'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {language === 'ar'
                        ? 'تنبؤ استباقي بذروة الجمعة لمهرجان التمور ومطابقة تغطية الشيفات'
                        : 'Proactive shift surge alignment with regional events'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Brand Proof */}
            <div className="relative z-10 pt-6 border-t border-[#182F48] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#4edee3]" />
                <span>{language === 'ar' ? 'عمليات بدون تأخير زمني' : 'Zero Latency Operations'}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">v2.4.0 • Enterprise Ready</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-[#142334]">
        © 2026 RestoraIntel Technologies Ltd. {language === 'ar' ? 'كافة الحقوق محفوظة' : 'All rights reserved'}.
      </footer>
    </div>
  );
};
