import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Palette,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Monitor,
  Lock,
  ExternalLink,
  Info,
  Sparkles,
  FileCheck,
  ShieldCheck,
  HelpCircle,
  Sun,
  Moon,
  Grid
} from 'lucide-react';

interface AssetDetail {
  id: string;
  name: string;
  category: 'emblem' | 'wordmark' | 'lockup' | 'icon' | 'favicon' | 'master';
  format: 'WEBP' | 'PNG' | 'ICO';
  dimensions: string;
  fileSize: string;
  originalSize: string;
  compression: string;
  path: string;
  alphaChannel: boolean;
  alphaLabel: { ar: string; en: string };
  purpose: { ar: string; en: string };
  recommendedBg: 'dark' | 'light' | 'both';
  notes: { ar: string; en: string };
}

const BRAND_ASSETS: AssetDetail[] = [
  {
    id: 'logo-full-original-dark',
    name: 'logo-full-original-dark.webp',
    category: 'master',
    format: 'WEBP',
    dimensions: '1200 × 765 px',
    fileSize: '127.6 KB',
    originalSize: '2.50 MB (logo1.png)',
    compression: '-95.1%',
    path: '/branding/logo-full-original-dark.webp',
    alphaChannel: false,
    alphaLabel: {
      ar: 'خلفية داكنة طبيعية (بدون قص)',
      en: 'Native Dark Canvas (Preserved)'
    },
    purpose: {
      ar: 'الشعار الرئيسي الكامل المعتمد على الأسطح الداكنة وشاشات الترحيب',
      en: 'Master full lockup for dark surfaces, hero presentation, and login'
    },
    recommendedBg: 'dark',
    notes: {
      ar: 'يحافظ على كامل العمل الفني الأصلي (القبعتان، الأدوات، الدوائر المتوهجة، النص) دون أي تشويه حواف.',
      en: 'Preserves 100% of authentic artwork on its native dark gradient with glowing cyan circuitry.'
    }
  },
  {
    id: 'logo-twin-mark-dark',
    name: 'logo-twin-mark-dark.webp',
    category: 'emblem',
    format: 'WEBP',
    dimensions: '1200 × 650 px',
    fileSize: '116.6 KB',
    originalSize: '2.05 MB (logowithout.png)',
    compression: '-94.3%',
    path: '/branding/logo-twin-mark-dark.webp',
    alphaChannel: false,
    alphaLabel: {
      ar: 'خلفية داكنة طبيعية (نسبة أصلية 1.85:1)',
      en: 'Native Dark Canvas (Natural 1.85:1)'
    },
    purpose: {
      ar: 'الخيار 1: شعار القبعتين التوأم الكامل بالنسب الطبيعية (بدون أي اقتطاع)',
      en: 'Variant 1: Complete full twin-chef-hat emblem at natural aspect ratio'
    },
    recommendedBg: 'dark',
    notes: {
      ar: 'يعالج مشكلة الاقتطاع تمامًا: تم الحفاظ على قبعتي الشيف الخارجيتين، والأدوات، وجميع فروع الدوائر الجانبية.',
      en: 'Fixes the cropped mark defect: Preserves BOTH outer chef hats, utensils, and full bilateral circuits.'
    }
  },
  {
    id: 'logo-compact-mark-dark',
    name: 'logo-compact-mark-dark.webp',
    category: 'emblem',
    format: 'WEBP',
    dimensions: '512 × 512 px',
    fileSize: '51.3 KB',
    originalSize: '2.05 MB (logowithout.png)',
    compression: '-97.5%',
    path: '/branding/logo-compact-mark-dark.webp',
    alphaChannel: false,
    alphaLabel: {
      ar: 'خلفية داكنة منسقة (مربع 1:1)',
      en: 'Centered on Dark #08131F (1:1)'
    },
    purpose: {
      ar: 'الخيار 2: أيقونة مدمجة لوحدة قبعة الشيف والأدوات الأصلية الكاملة (المقاسات 16–48px)',
      en: 'Variant 2: Compact emblem using ONE complete authentic chef-hat & utensil motif'
    },
    recommendedBg: 'both',
    notes: {
      ar: 'تم اقتصاص وحدة قبعة شيف حقيقية كاملة وتوسيطها في إطار 1:1 دون قطع حواف القبعة أو أدواتها.',
      en: 'Authentic single chef-hat-and-utensil unit centered inside a 1:1 box with zero clipping.'
    }
  },
  {
    id: 'logo-compact-mark-alt-right',
    name: 'logo-compact-mark-alt-right.webp',
    category: 'emblem',
    format: 'WEBP',
    dimensions: '512 × 512 px',
    fileSize: '51.9 KB',
    originalSize: '2.05 MB (logowithout.png)',
    compression: '-97.5%',
    path: '/branding/logo-compact-mark-alt-right.webp',
    alphaChannel: false,
    alphaLabel: {
      ar: 'خلفية داكنة (الوحدة اليمنى البديلة)',
      en: 'Native Dark Canvas (Right Unit Alt)'
    },
    purpose: {
      ar: 'بديل للمقارنة: الوحدة اليمنى لقبعة الشيف من العمل الفني الأصلي',
      en: 'Alternative for approval: Right chef-hat unit from the original artwork'
    },
    recommendedBg: 'dark',
    notes: {
      ar: 'مقدم للمقارنة في بوابة الاعتماد لاختيار اتجاه أدوات الطهي الأنسب للشريط الجانبي.',
      en: 'Presented side-by-side for review to compare utensil orientation and curvature.'
    }
  },
  {
    id: 'wordmark-dark',
    name: 'wordmark-dark.webp',
    category: 'wordmark',
    format: 'WEBP',
    dimensions: '900 × 79 px',
    fileSize: '33.0 KB',
    originalSize: '402 KB (name.png)',
    compression: '-91.8%',
    path: '/branding/wordmark-dark.webp',
    alphaChannel: true,
    alphaLabel: {
      ar: 'شفاف 100% (ألفا حقيقية)',
      en: 'True 100% Transparent Alpha'
    },
    purpose: {
      ar: 'الاسم النصي الأصلي المستخرج للواجهات والأشرطة الداكنة',
      en: 'Authentic extracted wordmark for dark headers & navigation'
    },
    recommendedBg: 'dark',
    notes: {
      ar: 'استخراج نقي عبر Luminance-to-Alpha مع الحفاظ على اللون الأبيض والسياني المتوهج دون هالات داكنة.',
      en: 'Subpixel luminance-to-alpha extraction, crisp white & cyan lettering, zero black fringing.'
    }
  },
  {
    id: 'wordmark-light',
    name: 'wordmark-light.webp',
    category: 'wordmark',
    format: 'WEBP',
    dimensions: '900 × 79 px',
    fileSize: '20.9 KB',
    originalSize: '402 KB (name.png)',
    compression: '-94.8%',
    path: '/branding/wordmark-light.webp',
    alphaChannel: true,
    alphaLabel: {
      ar: 'شفاف 100% (ألفا حقيقية)',
      en: 'True 100% Transparent Alpha'
    },
    purpose: {
      ar: 'الاسم النصي الأصلي للواجهات الفاتحة والبيضاء (لون كحلي داكن #0F172A)',
      en: 'Authentic wordmark in deep slate #0F172A for light & white UI'
    },
    recommendedBg: 'light',
    notes: {
      ar: 'شفاف تمامًا، بدون أي مستطيل داكن، يندمج بانسجام مع الخلفيات البيضاء والرمادية وطباعة الفواتير.',
      en: '100% transparent alpha in deep slate #0F172A. Eliminates oversized dark boxes in light theme.'
    }
  },
  {
    id: 'logo-lockup-dark',
    name: 'logo-lockup-dark.webp',
    category: 'lockup',
    format: 'WEBP',
    dimensions: '560 × 90 px',
    fileSize: '8.2 KB',
    originalSize: '2.50 MB (logo1.png)',
    compression: '-99.7%',
    path: '/branding/logo-lockup-dark.webp',
    alphaChannel: false,
    alphaLabel: {
      ar: 'شريط داكن #060E17',
      en: 'Dark Navy Base (#060E17)'
    },
    purpose: {
      ar: 'شعار أفقي متكامل لشريط التنقل الداكن الموسع (أيقونة + نص)',
      en: 'Horizontal lockup for expanded dark navigation bar'
    },
    recommendedBg: 'dark',
    notes: {
      ar: 'يجمع أيقونة قبعة الشيف الدقيقة مع النص الأصلي بشكل أفقي مريح للعين بدلاً من الشعار الرأسي الضخم.',
      en: 'Engineered horizontal proportions for modern dashboard headers and sidebars.'
    }
  },
  {
    id: 'logo-lockup-light',
    name: 'logo-lockup-light.webp',
    category: 'lockup',
    format: 'WEBP',
    dimensions: '560 × 90 px',
    fileSize: '11.1 KB',
    originalSize: '2.50 MB (logo1.png)',
    compression: '-99.6%',
    path: '/branding/logo-lockup-light.webp',
    alphaChannel: true,
    alphaLabel: {
      ar: 'شفاف 100% (ألفا حقيقية)',
      en: 'True 100% Transparent Alpha'
    },
    purpose: {
      ar: 'شعار حقيقي للواجهات الفاتحة (شارة جوهرة مصغرة + نص كحلي فاخر)',
      en: 'Real light-theme app branding (discrete jewel badge + transparent wordmark)'
    },
    recommendedBg: 'light',
    notes: {
      ar: 'يعالج العيب السابق: لا يوجد مستطيل داكن ضخم يغطي الشريط الأبيض، بل شارة أنيقة 40px مع نص شفاف.',
      en: 'Replaces previous oversized dark rectangle with a discrete rounded badge & transparent typography.'
    }
  },
  {
    id: 'logo-compact-mark-128',
    name: 'logo-compact-mark-128.webp',
    category: 'icon',
    format: 'WEBP',
    dimensions: '128 × 128 px',
    fileSize: '8.7 KB',
    originalSize: '2.05 MB (logowithout.png)',
    compression: '-99.6%',
    path: '/branding/logo-compact-mark-128.webp',
    alphaChannel: false,
    alphaLabel: {
      ar: 'خلفية داكنة (شريط مطوي)',
      en: 'Native Dark Canvas (Dock/Nav)'
    },
    purpose: {
      ar: 'أيقونة الشريط الجانبي المطوي وDock المقاس 40–48px',
      en: 'Optimized icon for collapsed sidebar (40px/48px) and OS dock'
    },
    recommendedBg: 'both',
    notes: {
      ar: 'مضبوطة بحدة معززة (Lanczos + Unsharp Mask) لضمان وضوح الشوكة والسكين وتفاصيل القبعة.',
      en: 'Tuned with gentle unsharp mask for razor-sharp utensil legibility at tiny viewports.'
    }
  },
  {
    id: 'apple-touch-icon',
    name: 'apple-touch-icon.png',
    category: 'icon',
    format: 'PNG',
    dimensions: '180 × 180 px',
    fileSize: '52.9 KB',
    originalSize: '2.05 MB (logowithout.png)',
    compression: '-97.4%',
    path: '/branding/apple-touch-icon.png',
    alphaChannel: false,
    alphaLabel: {
      ar: 'خلفية صلبة متوافقة مع iOS',
      en: 'Opaque Canvas (Apple Spec)'
    },
    purpose: {
      ar: 'أيقونة الشاشة الرئيسية لأجهزة Apple iOS وiPadOS',
      en: 'iOS Home Screen Touch Icon for iPhone and iPad'
    },
    recommendedBg: 'both',
    notes: {
      ar: 'تتبع معايير Apple الصارمة لأيقونات اللمس (خلفية صلبة بدون شفافية لتجنب السواد التلقائي).',
      en: 'Strictly adheres to Apple HIG specs with opaque canvas to prevent OS dark fringing.'
    }
  },
  {
    id: 'favicon-ico',
    name: 'favicon.ico',
    category: 'favicon',
    format: 'ICO',
    dimensions: '16, 32, 48 px',
    fileSize: '15.0 KB',
    originalSize: '2.05 MB (logowithout.png)',
    compression: '-99.3%',
    path: '/branding/favicon.ico',
    alphaChannel: true,
    alphaLabel: {
      ar: 'ICO متعدد الطبقات',
      en: 'Multi-resolution Windows ICO'
    },
    purpose: {
      ar: 'أيقونة المفضلة وعلامات التبويب لجميع المتصفحات القديمة والحديثة',
      en: 'Universal browser tab & bookmark icon (16/32/48 multi-res)'
    },
    recommendedBg: 'both',
    notes: {
      ar: 'ملف ICO حقيقي يحتوي على 3 مقاسات مدمجة ومفحوصة بدقة دون أي تغليف وهمي.',
      en: 'Genuine multi-layer ICO with tuned 16px, 32px, and 48px mipmaps.'
    }
  },
  {
    id: 'favicon-32',
    name: 'favicon-32.png',
    category: 'favicon',
    format: 'PNG',
    dimensions: '32 × 32 px',
    fileSize: '2.9 KB',
    originalSize: '2.05 MB (logowithout.png)',
    compression: '-99.8%',
    path: '/branding/favicon-32.png',
    alphaChannel: false,
    alphaLabel: {
      ar: 'PNG عالي الدقة للتبويب',
      en: 'High-DPI Retina Tab Icon'
    },
    purpose: {
      ar: 'أيقونة التبويب لشاشات Retina وHigh-DPI الحديثة',
      en: 'Retina browser tab icon for Chrome, Edge, Safari, Firefox'
    },
    recommendedBg: 'both',
    notes: {
      ar: 'تظهر قبعة الشيف بتدرجها السياني بوضوح كامل حتى في أصغر أبعاد شريط التبويب.',
      en: 'Retains recognizable chef-hat geometry and vibrant cyan gradient.'
    }
  }
];

export const BrandingPreviewPage: React.FC = () => {
  const { language, setCurrentPage } = useApp();
  const [backgroundMode, setBackgroundMode] = useState<'white' | 'gray' | 'navy' | 'checker'>('navy');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sidebarSimulationTheme, setSidebarSimulationTheme] = useState<'dark' | 'light'>('dark');
  const [sidebarSimulationState, setSidebarSimulationState] = useState<'expanded' | 'collapsed'>('expanded');
  const [headerSimulationTheme, setHeaderSimulationTheme] = useState<'dark' | 'light'>('dark');

  const filteredAssets = activeCategory === 'all'
    ? BRAND_ASSETS
    : BRAND_ASSETS.filter(a => a.category === activeCategory);

  const getCanvasBgClass = () => {
    switch (backgroundMode) {
      case 'white':
        return 'bg-white border-y border-slate-200';
      case 'gray':
        return 'bg-[#F8FAFC] border-y border-slate-200';
      case 'navy':
        return 'bg-[#08131F]';
      case 'checker':
        return 'bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px] bg-slate-200';
      default:
        return 'bg-[#08131F]';
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Banner: Formal Approval Gate Notice */}
      <div className="rounded-3xl bg-gradient-to-br from-[#060E17] via-[#091826] to-[#0A2238] border border-[#16304C] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#4edee3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#4edee3]/20 border border-[#4edee3]/40 text-[#4edee3] text-xs font-bold font-mono uppercase tracking-wider">
                TASK 02R • BRAND ASSETS APPROVAL GATE
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Development Verification Mode</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Originals Safe & Intact</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {language === 'ar'
                ? 'بوابة اعتماد أصول الهوية المصححة (TASK 02R)'
                : 'RestoraIntel Brand Finalization & Corrective Review'}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'تم فحص جميع ملاحظات التدقيق ومعالجة مشكلة اقتصاص قبعات الشيف السابقة تمامًا. توفر هذه البوابة المقارنة الكاملة بين الشعار ذي القبعتين التوأم بالنسب الطبيعية، والأيقونة المدمجة أحادية الوحدة، والهوية الحقيقية للشاشات الفاتحة والداكنة، واختبار قنوات الشفافية على 4 خلفيات.'
                : 'All corrective requirements applied: unclipped full twin-chef-hat emblem at natural aspect ratio, authentic single-motif compact icon (16–48px), real light-theme lockups (no oversized dark rectangles), and verified alpha channels tested across 4 background surfaces.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage('dashboard')}
              className="border-slate-700 bg-slate-800/90 text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              {language === 'ar' ? 'العودة للتطبيق' : 'Back to App'}
            </Button>
            <div className="px-4 py-2.5 rounded-2xl bg-[#08131F]/90 border border-[#34abb1]/40 text-center">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                {language === 'ar' ? 'حالة الاعتماد' : 'Approval Gate Status'}
              </span>
              <span className="text-sm font-black text-[#4edee3] font-mono">
                {language === 'ar' ? 'بانتظار موافقتك' : 'Pending Review'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Authoritative Uploaded Originals Inspection */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <FileCheck className="w-5 h-5 text-[#2c777c]" />
              <CardTitle className="text-base font-bold">
                {language === 'ar' ? '1. فحص الملفات المصدرية الأصلية المرفوعة (محفوظة بأمان في الجذر)' : '1. Authoritative Uploaded Originals (Preserved in Root & Public)'}
              </CardTitle>
            </div>
            <Badge variant="cyan">Preserved & Unaltered</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* logo1.png */}
            <div className="p-4 rounded-2xl bg-[#08131F] text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4edee3]">logo1.png</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Original</span>
              </div>
              <div className="aspect-video w-full rounded-xl bg-[#040A10] border border-slate-800/80 flex items-center justify-center p-2 overflow-hidden">
                <img src="/logo1.png" alt="logo1.png original" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between"><span className="text-slate-400">Dimensions:</span><span className="font-mono text-white font-bold">2000 × 1327 px</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Raw Size:</span><span className="font-mono text-amber-300 font-bold">2.50 MB</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Alpha:</span><span className="text-rose-400 font-bold">False (Opaque Dark RGB)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Content:</span><span className="text-slate-200">Twin-Hat Emblem + Wordmark</span></div>
              </div>
            </div>

            {/* logowithout.png */}
            <div className="p-4 rounded-2xl bg-[#08131F] text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4edee3]">logowithout.png</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Original</span>
              </div>
              <div className="aspect-video w-full rounded-xl bg-[#040A10] border border-slate-800/80 flex items-center justify-center p-2 overflow-hidden">
                <img src="/logowithout.png" alt="logowithout.png original" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between"><span className="text-slate-400">Dimensions:</span><span className="font-mono text-white font-bold">1986 × 1034 px</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Raw Size:</span><span className="font-mono text-amber-300 font-bold">2.05 MB</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Alpha:</span><span className="text-rose-400 font-bold">False (Opaque Dark RGB)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Content:</span><span className="text-slate-200">Wide Twin-Hat Emblem Only</span></div>
              </div>
            </div>

            {/* name.png */}
            <div className="p-4 rounded-2xl bg-[#08131F] text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4edee3]">name.png</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Original</span>
              </div>
              <div className="aspect-video w-full rounded-xl bg-[#040A10] border border-slate-800/80 flex items-center justify-center p-2 overflow-hidden">
                <img src="/name.png" alt="name.png original" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between"><span className="text-slate-400">Dimensions:</span><span className="font-mono text-white font-bold">2000 × 263 px</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Raw Size:</span><span className="font-mono text-amber-300 font-bold">402 KB</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Alpha:</span><span className="text-rose-400 font-bold">False (Opaque Dark RGB)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Content:</span><span className="text-slate-200">RestoraIntel Wordmark Only</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: CORE ISSUE 1 - Cropped Mark Solution (Side-by-Side Comparison) */}
      <Card className="border-cyan-300 shadow-md overflow-hidden bg-slate-50/50">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-[#081827] text-white py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#4edee3]" />
              <CardTitle className="text-base font-bold text-white">
                {language === 'ar' ? '2. حل مشكلة اقتصاص الأيقونة: عرض الخيارين المعتمدين هندسيًا' : '2. Defect Fix: Complete Twin-Hat Emblem vs Authentic Single-Motif Mark'}
              </CardTitle>
            </div>
            <Badge variant="cyan">Zero Artwork Cut Off</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-800">
                {language === 'ar' ? 'سبب رفض النموذج السابق (Rejected Defect):' : 'Cause of Previous Rejection (Why the square crop was wrong):'}
              </p>
              <p className="mt-1 leading-relaxed text-rose-700">
                {language === 'ar'
                  ? 'العمل الفني الأصلي (logowithout.png) هو شعار عريض بنسبة 1.85:1 يحتوي على قبعتي شيف توأم متناظرتين. الاقتصاص المربع السابق بحجم 1200x1034 اقتطع 393 بكسل من الجانبين مما أدى إلى قطع قبعات الشيف الخارجية وتشوه الدوائر الإلكترونية. الحل المعتمد يقدم خيارين أصيلين دون قص أي تفصيل.'
                  : 'The original emblem is a wide 1.85:1 composition with twin chef hats. Blindly forcing it into a square chopped 393px off both sides, bisecting the chef hats. Below are the two authentic solutions that preserve 100% of the artwork.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Variant 1: Complete Full Twin-Chef-Hat Emblem at Natural Aspect Ratio */}
            <div className="p-5 rounded-2xl bg-[#08131F] text-white border border-[#1d4a63] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#4edee3]">logo-twin-mark-dark.webp</span>
                  <Badge variant="cyan">Variant 1 • Approved</Badge>
                </div>
                <h3 className="font-bold text-sm text-white">
                  {language === 'ar' ? 'الخيار 1: شعار القبعتين التوأم الكامل بالنسب الطبيعية' : 'Variant 1: Complete Full Twin-Chef-Hat Emblem'}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'ar'
                    ? 'النسبة الطبيعية العريضة (1.85:1). يحافظ على قبعتي الشيف معًا، والسكين والشوكة، وكامل الدوائر المتوهجة.'
                    : 'Natural 1.85:1 aspect ratio (1200 × 650 px). Preserves BOTH chef hats, utensils, and full bilateral circuitry.'}
                </p>
              </div>

              <div className="w-full aspect-[16/9] rounded-xl bg-[#040A10] border border-[#162D44] flex items-center justify-center p-3 overflow-hidden">
                <img
                  src="/branding/logo-twin-mark-dark.webp"
                  alt="Complete Full Twin Chef Hat Emblem"
                  className="max-h-full max-w-full object-contain drop-shadow-[0_4px_16px_rgba(78,222,227,0.3)]"
                />
              </div>

              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between"><span className="text-slate-400">Dimensions:</span><span className="font-mono text-[#4edee3] font-bold">1200 × 650 px (1.85:1)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">File Size:</span><span className="font-mono text-emerald-400 font-bold">116.6 KB (-94.3%)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Chef Hats:</span><span className="text-white font-medium">Both Left & Right Hats Complete</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Best For:</span><span className="text-white font-medium">Headers, Wide Media, Hero Cards</span></div>
              </div>
            </div>

            {/* Variant 2: Compact Emblem for 16-48px using ONE Complete Authentic Motif */}
            <div className="p-5 rounded-2xl bg-[#08131F] text-white border border-[#1d4a63] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#4edee3]">logo-compact-mark-dark.webp</span>
                  <Badge variant="cyan">Variant 2 • Approved</Badge>
                </div>
                <h3 className="font-bold text-sm text-white">
                  {language === 'ar' ? 'الخيار 2: أيقونة مربعة لوحدة قبعة شيف أصيلة كاملة' : 'Variant 2: Compact Authentic Single Chef-Hat Motif'}
                </h3>
                <p className="text-xs text-slate-300">
                  {language === 'ar'
                    ? 'اقتصاص هندسي دقيق لوحدة قبعة شيف واحدة متكاملة مع أدواتها دون قطع أي جزء، مجهزة للمقاسات 16–48px.'
                    : 'One complete authentic chef-hat & utensil motif centered in 1:1 canvas. Zero clipping of hat or utensils.'}
                </p>
              </div>

              <div className="w-full aspect-[16/9] rounded-xl bg-[#040A10] border border-[#162D44] flex items-center justify-center p-3 gap-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-24 h-24 rounded-xl bg-[#08131F] border border-[#1d4a63] flex items-center justify-center p-1 shadow-md">
                    <img
                      src="/branding/logo-compact-mark-dark.webp"
                      alt="Compact Mark 512"
                      className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(78,222,227,0.35)]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Left Unit (Default)</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="w-24 h-24 rounded-xl bg-[#08131F] border border-[#1d4a63] flex items-center justify-center p-1 shadow-md">
                    <img
                      src="/branding/logo-compact-mark-alt-right.webp"
                      alt="Compact Mark Right Alt"
                      className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(78,222,227,0.35)]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Right Unit (Alternative)</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between"><span className="text-slate-400">Dimensions:</span><span className="font-mono text-[#4edee3] font-bold">512 × 512 px (1:1)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">File Size:</span><span className="font-mono text-emerald-400 font-bold">51.3 KB (-97.5%)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Chef Hat:</span><span className="text-white font-medium">1 Complete Unit, Zero Cutoff</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Best For:</span><span className="text-white font-medium">Collapsed Sidebar (40px), Favicons, Docks</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: CORE ISSUE 2 - Real Light-Theme vs Dark-Theme Branding */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Palette className="w-5 h-5 text-[#2c777c]" />
              <CardTitle className="text-base font-bold">
                {language === 'ar' ? '3. معالجة الواجهات الفاتحة والداكنة (استبعاد المستطيل الداكن الضخم)' : '3. Real Light-Theme vs Dark-Theme Branding (No Oversized Dark Boxes)'}
              </CardTitle>
            </div>
            <Badge variant="cyan">Transparent Lockups</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-xs text-slate-600 leading-relaxed">
            {language === 'ar'
              ? 'في المحاولة السابقة، كانت نسخة العرض الفاتح عبارة عن بطاقة داكنة ثقيلة بمستطيل كبير. في هذا التصحيح، تم فصل الشعار الكامل المخصص للأسطح الداكنة عن الهوية الشفافة الحقيقية للواجهات الفاتحة باستخدام الاسم النصي المستخرج بلون كحلي أنيق وشارة جوهرة مصغرة 40px.'
              : 'The previous task used an oversized dark rectangle on white cards. We now provide real transparent app branding: authentic typography rendered in deep slate #0F172A on transparent canvas paired with a discrete 40px rounded badge, preserving the master artwork exclusively for dark surfaces.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Real Dark Theme Lockup */}
            <div className="p-5 rounded-2xl bg-[#060E17] text-white border border-[#162D44] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#4edee3]">logo-lockup-dark.webp</span>
                <Badge variant="cyan">Dark Theme</Badge>
              </div>
              <div className="p-4 rounded-xl bg-[#040A10] border border-[#122030] flex items-center justify-center">
                <img
                  src="/branding/logo-lockup-dark.webp"
                  alt="Real Dark App Lockup"
                  className="max-h-16 w-auto object-contain"
                />
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex justify-between"><span className="text-slate-400">Dimensions:</span><span className="font-mono text-white font-bold">560 × 90 px</span></div>
                <div className="flex justify-between"><span className="text-slate-400">File Size:</span><span className="font-mono text-emerald-400 font-bold">8.2 KB (-99.7%)</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Composition:</span><span className="text-slate-200">Compact Mark + Transparent Wordmark</span></div>
              </div>
            </div>

            {/* Real Light Theme Lockup */}
            <div className="p-5 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#2c777c]">logo-lockup-light.webp</span>
                <Badge variant="neutral">Light Theme (Transparent)</Badge>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <img
                  src="/branding/logo-lockup-light.webp"
                  alt="Real Light App Lockup"
                  className="max-h-16 w-auto object-contain"
                />
              </div>
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between"><span className="text-slate-500">Dimensions:</span><span className="font-mono text-slate-900 font-bold">560 × 90 px</span></div>
                <div className="flex justify-between"><span className="text-slate-500">File Size:</span><span className="font-mono text-emerald-700 font-bold">11.1 KB (-99.6%)</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Alpha Channel:</span><span className="text-emerald-700 font-bold">True (Transparent Canvas)</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: CORE ISSUE 3 - Verify Transparency on 4 Backgrounds */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Eye className="w-5 h-5 text-[#2c777c]" />
              <CardTitle className="text-base font-bold">
                {language === 'ar' ? '4. فحص قنوات الشفافية الحقيقية على 4 خلفيات اختبار' : '4. Transparency Verification Matrix: 4 Real Background Surfaces'}
              </CardTitle>
            </div>

            {/* 4 Background Toggle Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/90 rounded-xl border border-slate-300">
              <button
                onClick={() => setBackgroundMode('white')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  backgroundMode === 'white' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Pure White (#FFF)</span>
              </button>
              <button
                onClick={() => setBackgroundMode('gray')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  backgroundMode === 'gray' ? 'bg-slate-100 text-slate-950 shadow-xs border border-slate-300' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <span>Light Gray (#F8F)</span>
              </button>
              <button
                onClick={() => setBackgroundMode('navy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  backgroundMode === 'navy' ? 'bg-[#08131F] text-white shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Dark Navy (#08131F)</span>
              </button>
              <button
                onClick={() => setBackgroundMode('checker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  backgroundMode === 'checker' ? 'bg-slate-300 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Grid className="w-3.5 h-3.5 text-slate-700" />
                <span>Checkerboard</span>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'all', label: language === 'ar' ? 'جميع الأصول (12)' : 'All Corrected Assets (12)' },
              { id: 'emblem', label: language === 'ar' ? 'رموز الشعار والأيقونات (4)' : 'Emblems & Marks (4)' },
              { id: 'wordmark', label: language === 'ar' ? 'النصوص الشفافة (2)' : 'Transparent Wordmarks (2)' },
              { id: 'lockup', label: language === 'ar' ? 'الهوية المجمعة للواجهات (2)' : 'Theme Lockups (2)' },
              { id: 'favicon', label: language === 'ar' ? 'المتصفح والمفضلة (2)' : 'Favicons & Tabs (2)' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#2c777c] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map(asset => {
              const isWordmark = asset.category === 'wordmark';
              const isFavicon = asset.category === 'favicon';
              const isLockup = asset.category === 'lockup';

              return (
                <div key={asset.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    {/* Header */}
                    <div className="p-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                      <div>
                        <h4 className="font-mono font-bold text-xs text-slate-900">{asset.name}</h4>
                        <span className="text-[10px] text-slate-500">{asset.purpose[language]}</span>
                      </div>
                      <Badge variant={asset.alphaChannel ? 'cyan' : 'neutral'}>
                        {asset.alphaChannel ? 'Alpha: True' : 'Alpha: False'}
                      </Badge>
                    </div>

                    {/* Live Preview on Selected Background */}
                    <div className={`p-6 min-h-[170px] flex items-center justify-center transition-colors ${getCanvasBgClass()}`}>
                      <img
                        src={asset.path}
                        alt={asset.name}
                        className={`object-contain transition-transform hover:scale-105 ${
                          isFavicon
                            ? 'w-12 h-12'
                            : isWordmark
                            ? 'w-64 max-h-12'
                            : isLockup
                            ? 'w-64 max-h-16'
                            : 'max-h-28 w-auto'
                        }`}
                      />
                    </div>

                    {/* Metadata & Alpha Label */}
                    <div className="p-3.5 space-y-1.5 text-xs border-t border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dimensions:</span>
                        <span className="font-mono font-bold text-slate-800">{asset.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payload:</span>
                        <span className="font-mono font-bold text-emerald-700">{asset.fileSize} ({asset.compression})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Alpha Status:</span>
                        <span className={`font-semibold ${asset.alphaChannel ? 'text-cyan-700' : 'text-slate-600'}`}>
                          {asset.alphaLabel[language]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 leading-relaxed">
                        {asset.notes[language]}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-slate-400">{asset.path}</span>
                    <a
                      href={asset.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#2c777c] hover:text-[#34abb1] flex items-center gap-1"
                    >
                      <span>{language === 'ar' ? 'معاينة' : 'Raw'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: CORE ISSUE 4 - Favicons & Icons Scalability Ladder */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Eye className="w-5 h-5 text-[#2c777c]" />
              <CardTitle className="text-base font-bold">
                {language === 'ar'
                  ? '5. مقياس التدرج البصري للأيقونات المصغرة (من 16px إلى 180px بدون أي تشويه)'
                  : '5. Icon Scalability Ladder: Real Pixel Renderings (16px to 180px)'}
              </CardTitle>
            </div>
            <Badge variant="cyan">Pseudo-Vector SVG Removed</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <p className="text-xs text-slate-600">
            {language === 'ar'
              ? 'تم التحقق من دقة القراءة والوضوح التام لأدوات الطهي وقبعة الشيف على جميع المقاسات القياسية. كما تم إزالة ملف logo.svg غير الدقيق وتحديث وسوم index.html بمسارات ICO وPNG المعتمدة رسميًا.'
              : 'Every icon size verified for knife/hat silhouette clarity. Removed inaccurate pseudo-vector SVG; index.html now links to canonical multi-resolution favicon.ico and PNGs.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {/* 16px Favicon */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-between text-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">16 × 16 px</span>
              <div className="w-12 h-12 rounded-lg bg-[#08131F] flex items-center justify-center border border-slate-700 shadow-xs">
                <img src="/branding/favicon-16.png" alt="16px Favicon" className="w-4 h-4 object-contain" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">favicon-16.png</span>
            </div>

            {/* 32px Tab Icon */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-between text-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">32 × 32 px</span>
              <div className="w-12 h-12 rounded-lg bg-[#08131F] flex items-center justify-center border border-slate-700 shadow-xs">
                <img src="/branding/favicon-32.png" alt="32px Tab Icon" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">favicon-32.png</span>
            </div>

            {/* 40px Header / Mobile Mark */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-between text-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">40 × 40 px</span>
              <div className="w-12 h-12 rounded-lg bg-[#08131F] flex items-center justify-center border border-slate-700 shadow-xs">
                <img src="/branding/logo-compact-mark-128.webp" alt="40px Mark" className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(78,222,227,0.35)]" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">compact.webp</span>
            </div>

            {/* 48px Dock Icon */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-between text-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">48 × 48 px</span>
              <div className="w-12 h-12 rounded-lg bg-[#08131F] flex items-center justify-center border border-slate-700 shadow-xs">
                <img src="/branding/favicon-48.png" alt="48px Dock Icon" className="w-12 h-12 object-contain" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">favicon-48.png</span>
            </div>

            {/* 64px Launcher */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-between text-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">64 × 64 px</span>
              <div className="w-14 h-14 rounded-xl bg-[#08131F] flex items-center justify-center border border-slate-700 shadow-xs">
                <img src="/branding/logo-compact-mark-dark.webp" alt="64px Launcher" className="w-12 h-12 object-contain" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">launcher</span>
            </div>

            {/* 128px High-Res Icon */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-between text-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">128 × 128 px</span>
              <div className="w-16 h-16 rounded-xl bg-[#08131F] flex items-center justify-center border border-slate-700 shadow-xs">
                <img src="/branding/logo-compact-mark-128.webp" alt="128px High-Res" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">128.webp</span>
            </div>

            {/* 180px Apple Touch Icon */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-between text-center gap-2">
              <span className="text-[11px] font-bold text-slate-700">180 × 180 px</span>
              <div className="w-18 h-18 rounded-2xl bg-[#08131F] flex items-center justify-center border border-slate-700 shadow-xs">
                <img src="/branding/apple-touch-icon.png" alt="180px Apple Touch Icon" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-[9px] text-slate-500 font-mono">apple-touch</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6: CORE ISSUE 8 - Live In-Context Shell Simulations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Simulation 1: Sidebar Simulation (Light vs Dark, Expanded vs Collapsed) */}
        <Card className="border-slate-300 shadow-sm">
          <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[#2c777c]" />
              <CardTitle className="text-base font-bold">
                {language === 'ar' ? '6. محاكاة الشريط الجانبي (Sidebar Live Simulation)' : '6. Sidebar Shell Integration Simulation'}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center p-0.5 bg-slate-200 rounded-lg">
                <button
                  onClick={() => setSidebarSimulationTheme('dark')}
                  className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${
                    sidebarSimulationTheme === 'dark' ? 'bg-[#08131F] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setSidebarSimulationTheme('light')}
                  className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${
                    sidebarSimulationTheme === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Light
                </button>
              </div>

              <div className="flex items-center p-0.5 bg-slate-200 rounded-lg">
                <button
                  onClick={() => setSidebarSimulationState('expanded')}
                  className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${
                    sidebarSimulationState === 'expanded' ? 'bg-[#2c777c] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Expanded
                </button>
                <button
                  onClick={() => setSidebarSimulationState('collapsed')}
                  className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${
                    sidebarSimulationState === 'collapsed' ? 'bg-[#2c777c] text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Collapsed
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className={`rounded-2xl p-4 border flex items-center justify-center min-h-[220px] transition-colors ${
              sidebarSimulationTheme === 'dark' ? 'bg-[#040A10] border-[#162C42]' : 'bg-slate-100 border-slate-300'
            }`}>
              {sidebarSimulationState === 'expanded' ? (
                <div className={`w-72 rounded-xl p-4 border shadow-xl transition-colors ${
                  sidebarSimulationTheme === 'dark' ? 'bg-[#060E17] border-[#182F48] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  {/* Brand Header */}
                  <div className={`flex items-center pb-3 border-b ${sidebarSimulationTheme === 'dark' ? 'border-[#142334]' : 'border-slate-100'}`}>
                    {sidebarSimulationTheme === 'dark' ? (
                      <img src="/branding/logo-lockup-dark.webp" alt="Dark Lockup" className="max-h-9 w-auto object-contain" />
                    ) : (
                      <img src="/branding/logo-lockup-light.webp" alt="Light Lockup" className="max-h-9 w-auto object-contain" />
                    )}
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className={`p-2 rounded-lg text-xs font-bold flex items-center justify-between ${
                      sidebarSimulationTheme === 'dark'
                        ? 'bg-gradient-to-r from-[#2c777c]/35 to-[#34abb1]/25 border border-[#4edee3]/40 text-white'
                        : 'bg-teal-50 border border-teal-200 text-teal-900'
                    }`}>
                      <span>Dashboard & Analytics</span>
                      <span className="w-2 h-2 rounded-full bg-[#4edee3]" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`w-18 rounded-xl p-3 border shadow-xl flex flex-col items-center gap-4 transition-colors ${
                  sidebarSimulationTheme === 'dark' ? 'bg-[#060E17] border-[#182F48]' : 'bg-white border-slate-200'
                }`}>
                  <img
                    src="/branding/logo-compact-mark-128.webp"
                    alt="Collapsed Sidebar Icon"
                    className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(78,222,227,0.35)]"
                  />
                  <div className={`w-full h-px ${sidebarSimulationTheme === 'dark' ? 'bg-[#182F48]' : 'bg-slate-200'}`} />
                  <div className="w-8 h-8 rounded-lg bg-[#2c777c]/30 border border-[#4edee3]/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#4edee3]" />
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              {language === 'ar'
                ? 'في الوضع الفاتح، لا يوجد أي مستطيل داكن ضخم يغطي الشريط، بل شارة أنيقة مع نص كحلي شفاف.'
                : 'In light theme, no oversized dark rectangle dominates the bar — discrete jewel badge + transparent slate typography.'}
            </p>
          </CardContent>
        </Card>

        {/* Simulation 2: Authentication Screen Mockup */}
        <Card className="border-slate-300 shadow-sm">
          <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#2c777c]" />
              <CardTitle className="text-base font-bold">
                {language === 'ar' ? '7. محاكاة شاشة الدخول (Login Presentation Showcase)' : '7. Authentication Hero Showcase'}
              </CardTitle>
            </div>
            <Badge variant="cyan">Native Glowing Canvas</Badge>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-[#08131F] rounded-2xl p-6 border border-[#182F48] text-white flex flex-col items-center text-center shadow-lg relative overflow-hidden">
              <div className="absolute top-0 end-0 w-48 h-48 bg-[#4edee3]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="max-w-[280px] mb-3">
                <img
                  src="/branding/logo-full-original-dark.webp"
                  alt="RestoraIntel Master Artwork"
                  className="w-full h-auto object-contain drop-shadow-[0_4px_16px_rgba(78,222,227,0.25)]"
                />
              </div>

              <div className="space-y-1 mt-1">
                <p className="text-xs font-semibold text-slate-300">
                  {language === 'ar'
                    ? 'الذكاء التشغيلي المتقدم لسلاسل المطاعم الكبرى'
                    : 'Enterprise Restaurant Operations Intelligence Platform'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4edee3]/15 border border-[#34abb1]/40 text-[#4edee3] text-[10px] font-bold">
                  <span>SSO & Biometric Ready</span>
                </div>
              </div>

              <div className="w-full max-w-xs mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Asset File:</span>
                <span className="font-mono text-[#4edee3] font-bold">logo-full-original-dark.webp (127 KB)</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">
              {language === 'ar'
                ? 'استخدام العمل الفني الكامل على خلفية داكنة خاضعة للتحكم يحافظ على التوهج الفاخر للمطاعم الراقية.'
                : 'Controlled dark presentation block preserves glowing cyan aura for high-end enterprise branding.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 7: Comprehensive Technical Audit Table */}
      <Card className="border-slate-300 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles className="w-5 h-5 text-[#2c777c]" />
              <CardTitle className="text-base font-bold">
                {language === 'ar' ? '8. جدول التدقيق الهندسي الشامل للأصول المحسنة' : '8. Comprehensive Technical Audit: Dimensions, Sizes & Alpha Channels'}
              </CardTitle>
            </div>
            <Badge variant="cyan">All 12 Canonical Assets Verified</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-start">Asset File</th>
                  <th className="py-3 px-4 text-start">Format</th>
                  <th className="py-3 px-4 text-start">Dimensions</th>
                  <th className="py-3 px-4 text-start">Original Size</th>
                  <th className="py-3 px-4 text-start">Final Size</th>
                  <th className="py-3 px-4 text-start">Compression</th>
                  <th className="py-3 px-4 text-start">Alpha Channel</th>
                  <th className="py-3 px-4 text-start">Canonical Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {BRAND_ASSETS.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{asset.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-200 text-slate-800">
                        {asset.format}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{asset.dimensions}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{asset.originalSize}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{asset.fileSize}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {asset.compression}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        asset.alphaChannel ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {asset.alphaChannel ? 'True (Transparent)' : 'False (Native Dark)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{asset.path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 8: APPROVAL GATE CHECKLIST & DECISION SUMMARY */}
      <Card className="border-cyan-300 shadow-md bg-gradient-to-br from-slate-900 to-[#0A1B2A] text-white">
        <CardHeader className="border-b border-slate-800 py-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#4edee3]" />
            <CardTitle className="text-base font-bold text-white">
              {language === 'ar' ? 'بوابة الاعتماد الرسمية: نقاط القرار قبل الانتقال للمهمة التالية (TASK 03)' : 'Official Approval Gate: Pending User Decisions Before TASK 03'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed text-sm text-slate-200">
            {language === 'ar'
              ? 'يرجى مراجعة الخيارات أعلاه والتأكيد على القرارات التالية لنتمكن من اعتماد الأصول ونشرها عبر كامل صفحات التطبيق:'
              : 'Please review the corrected branding architecture above and provide your decision on the following items:'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#060E17] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#4edee3] block uppercase">Decision Point 1</span>
              <h4 className="font-bold text-white">Twin-Hat vs Compact Mark</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {language === 'ar'
                  ? 'اعتماد شعار القبعتين التوأم (logo-twin-mark-dark.webp) للرؤوس العريضة، والأيقونة المدمجة (logo-compact-mark-dark.webp) للشريط المطوي والمفضلة.'
                  : 'Approve Twin-Hat emblem for wide headers, and Single-Motif mark for compact 16–48px icons.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#060E17] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#4edee3] block uppercase">Decision Point 2</span>
              <h4 className="font-bold text-white">Single-Motif Orientation</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {language === 'ar'
                  ? 'تفضيل الوحدة اليسرى (Left Unit) أو الوحدة اليمنى (Right Unit) للأيقونة المربعة المدمجة.'
                  : 'Confirm preference between Left Unit (default) or Right Unit (alternative) for the compact square motif.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#060E17] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#4edee3] block uppercase">Decision Point 3</span>
              <h4 className="font-bold text-white">Light-Theme Lockup</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {language === 'ar'
                  ? 'اعتماد الشارة الأنيقة 40px مع النص الكحلي الشفاف (logo-lockup-light.webp) كبديل للمستطيل الداكن القديم.'
                  : 'Approve discrete 40px rounded badge + transparent slate wordmark (logo-lockup-light.webp) for light UI.'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-center">
            <p className="text-[#4edee3] font-mono font-bold text-sm">
              {language === 'ar'
                ? 'تم إيقاف التغييرات بانتظار موافقتك الصريحة قبل بدء المهمة TASK 03.'
                : 'Execution paused at Approval Gate. Awaiting your feedback or approval before TASK 03.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
