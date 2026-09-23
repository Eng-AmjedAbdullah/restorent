<script setup lang="ts">
import { ref } from 'vue';
import { useUIStore } from '@/stores/ui';
import {
  Palette,
  Sparkles,
  Download,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Eye,
  Type,
  ShieldCheck,
  CheckCircle2
} from 'lucide-vue-next';

const uiStore = useUIStore();
const activeFilter = ref<'all' | 'production' | 'source' | 'icons'>('all');
const copiedPath = ref<string | null>(null);

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  copiedPath.value = text;
  uiStore.addToast({
    title: uiStore.language === 'ar' ? 'تم نسخ المسار' : 'Asset Path Copied',
    message: text,
    type: 'success',
    duration: 2500
  });
  setTimeout(() => {
    if (copiedPath.value === text) {
      copiedPath.value = null;
    }
  }, 2000);
}

interface BrandAsset {
  id: string;
  name: string;
  path: string;
  category: 'production' | 'source' | 'icons';
  format: string;
  dims: string;
  size: string;
  transparent: boolean;
  bgType: 'dark' | 'light' | 'both';
  badge: string;
  description: {
    ar: string;
    en: string;
  };
}

const assets: BrandAsset[] = [
  {
    id: 'logo-without-bg-trimmed',
    name: 'logo-without-bg-trimmed.webp',
    path: '/branding/logo-without-bg-trimmed.webp',
    category: 'production',
    format: 'WEBP',
    dims: '600 × 335 px',
    size: '60 KB',
    transparent: true,
    bgType: 'both',
    badge: 'Active In App',
    description: {
      ar: 'الشعار الرسمي المعتمد للشريط العلوي والجانبي بدون خلفية ومقتطع الحواف بدقة عالية.',
      en: 'Primary production emblem without background, trimmed with zero outer margins.'
    }
  },
  {
    id: 'logowithoutback-src',
    name: 'logowithoutback.png',
    path: '/logowithoutback.png',
    category: 'source',
    format: 'PNG (RGBA)',
    dims: '2000 × 2000 px',
    size: '2.1 MB',
    transparent: true,
    bgType: 'both',
    badge: 'Master Source',
    description: {
      ar: 'الملف المصدري المرفوع للشعار الكامل الشفاف بدقة فائقة 2000×2000 بكسل.',
      en: 'Authentic 2000×2000 master transparent PNG upload with twin chef-hat circuitry.'
    }
  },
  {
    id: 'iconwithoutback-src',
    name: 'iconwithoutback.png',
    path: '/iconwithoutback.png',
    category: 'source',
    format: 'PNG (RGBA)',
    dims: '2000 × 2000 px',
    size: '2.6 MB',
    transparent: true,
    bgType: 'both',
    badge: 'Master Source',
    description: {
      ar: 'الملف المصدري المرفوع للأيقونة الفردية الشفافة بدقة فائقة 2000×2000 بكسل.',
      en: 'Authentic 2000×2000 master transparent single chef hat and utensils icon upload.'
    }
  },
  {
    id: 'logo-compact-mark-dark',
    name: 'logo-compact-mark-dark.webp',
    path: '/branding/logo-compact-mark-dark.webp',
    category: 'production',
    format: 'WEBP',
    dims: '256 × 256 px',
    size: '18 KB',
    transparent: true,
    bgType: 'both',
    badge: 'Mobile & Launcher',
    description: {
      ar: 'أيقونة مدمجة 256 بكسل محسنة لشاشات الجوال وأشرطة الأدوات السريعة.',
      en: 'Optimized 256px square mark for mobile drawers, badges, and launchers.'
    }
  },
  {
    id: 'logo-mark-512',
    name: 'logo-mark.webp',
    path: '/branding/logo-mark.webp',
    category: 'production',
    format: 'WEBP',
    dims: '512 × 512 px',
    size: '46 KB',
    transparent: true,
    bgType: 'both',
    badge: 'High-Res Mark',
    description: {
      ar: 'رمز الشعار بدقة 512 بكسل لصفحات تسجيل الدخول والنوافذ المنبثقة.',
      en: 'High-resolution 512px emblem for authentication screens and modals.'
    }
  },
  {
    id: 'logo-lockup-dark',
    name: 'logo-lockup-dark.webp',
    path: '/branding/logo-lockup-dark.webp',
    category: 'production',
    format: 'WEBP',
    dims: '800 × 447 px',
    size: '87 KB',
    transparent: true,
    bgType: 'dark',
    badge: 'Dark Lockup',
    description: {
      ar: 'شعار عريض متكامل للخلفيات الداكنة وشاشات الترحيب.',
      en: 'Wide horizontal emblem lockup tuned for dark interfaces and splash screens.'
    }
  },
  {
    id: 'icon-512',
    name: 'icon-512.png',
    path: '/branding/icon-512.png',
    category: 'icons',
    format: 'PNG',
    dims: '512 × 512 px',
    size: '253 KB',
    transparent: true,
    bgType: 'both',
    badge: 'PWA Icon',
    description: {
      ar: 'أيقونة تطبيقات الويب التقدمية (PWA) ومتجر التطبيقات.',
      en: 'Progressive Web App installation icon for splash and home screens.'
    }
  },
  {
    id: 'icon-192',
    name: 'icon-192.png',
    path: '/branding/icon-192.png',
    category: 'icons',
    format: 'PNG',
    dims: '192 × 192 px',
    size: '52 KB',
    transparent: true,
    bgType: 'both',
    badge: 'Mobile Homescreen',
    description: {
      ar: 'أيقونة الشاشة الرئيسية لأجهزة Android وiOS.',
      en: 'Standard mobile home screen shortcut launcher icon.'
    }
  },
  {
    id: 'apple-touch-icon',
    name: 'apple-touch-icon.png',
    path: '/branding/apple-touch-icon.png',
    category: 'icons',
    format: 'PNG',
    dims: '180 × 180 px',
    size: '47 KB',
    transparent: true,
    bgType: 'both',
    badge: 'Apple Touch',
    description: {
      ar: 'أيقونة أجهزة Apple وSafari لمفضلة المتصفح والشاشة الرئيسية.',
      en: 'Apple touch bookmark and springboard icon for iOS/iPadOS.'
    }
  },
  {
    id: 'favicon-32',
    name: 'favicon-32.png',
    path: '/branding/favicon-32.png',
    category: 'icons',
    format: 'PNG',
    dims: '32 × 32 px',
    size: '2.8 KB',
    transparent: true,
    bgType: 'both',
    badge: 'Browser Tab',
    description: {
      ar: 'أيقونة لسان المتصفح عالية الوضوح لجميع محركات التصفح الحديثة.',
      en: 'High-DPI 32px tab favicon for Chrome, Safari, Edge, and Firefox.'
    }
  }
];

const colorPalette = [
  { name: 'Brand Cyan', hex: '#4edee3', role: 'Primary Accent & Glowing Elements', textDark: true },
  { name: 'Brand Teal', hex: '#34abb1', role: 'Active States & Primary Buttons', textDark: false },
  { name: 'Deep Brand', hex: '#2c777c', role: 'Gradients & Nav Highlights', textDark: false },
  { name: 'Executive Dark', hex: '#0b131a', role: 'Sidebar & Header Primary Surface', textDark: false },
  { name: 'Elevated Surface', hex: '#12202f', role: 'Card & Dropdown Trigger Surface', textDark: false },
  { name: 'Clean Surface', hex: '#ffffff', role: 'Light Content & Dropdown Popover', textDark: true }
];

function filteredAssets() {
  if (activeFilter.value === 'all') return assets;
  return assets.filter((a) => a.category === activeFilter.value);
}
</script>

<template>
  <div class="space-y-8 pb-12 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2.5">
          <span class="p-2 rounded-xl bg-teal-50 border border-teal-200/80 text-[#0f766e]">
            <Palette class="w-5 h-5 text-[#0f766e]" />
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'هوية ريستورا إنتل البصرية' : 'RestoraIntel Brand Identity & Visual Assets' }}
          </h1>
        </div>
        <p class="text-sm text-slate-500 mt-2 max-w-3xl leading-relaxed">
          {{
            uiStore.language === 'ar'
              ? 'المكتبة المركزية المعتمدة لكافة الأصول البصرية الرقمية، الشعارات الشفافة، الرموز، لوحة الألوان والخطوط الرسمية للمنصة.'
              : 'Complete official design system guide, transparent brand lockups, master assets, color tokens, and typography specifications.'
          }}
        </p>
      </div>

      <!-- Quick Stats Badge -->
      <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0">
        <ShieldCheck class="w-4 h-4 text-emerald-600" />
        <span class="text-xs font-semibold text-slate-700">
          {{ uiStore.language === 'ar' ? 'أصول أصلية 100% بدون خلفية' : '100% Authentic Transparent Assets' }}
        </span>
      </div>
    </div>

    <!-- Live In-App Lockup Preview Card -->
    <div class="bg-[#0b131a] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
      <div class="absolute -top-24 -end-24 w-80 h-80 bg-[#4edee3]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4edee3]/15 text-[#4edee3] text-[11px] font-bold tracking-wide uppercase mb-2">
            <Sparkles class="w-3 h-3" />
            {{ uiStore.language === 'ar' ? 'المظهر المعتمد في المنصة' : 'Active In-App Representation' }}
          </span>
          <h3 class="text-lg font-bold text-white">
            {{ uiStore.language === 'ar' ? 'الشعار المقتطع بدون خلفية مع الخط المعتمد' : 'Cropped Logo Without Background + Proportional Type' }}
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            {{ uiStore.language === 'ar' ? 'مطابق تماماً لما يظهر حالياً في الشريط العلوي وقائمة الجوال والواجهة الرئيسية' : 'Live representation across desktop sidebar, mobile drawer, and top navigation bar' }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <!-- Dark Background Preview -->
        <div class="p-6 rounded-2xl bg-[#12202f] border border-[#1e344d] flex flex-col items-center justify-center gap-4 text-center">
          <span class="text-[11px] font-mono text-slate-400">Dark Executive Header Surface (#0b131a)</span>
          <div class="flex items-center gap-3 p-3 rounded-2xl bg-[#0b131a] border border-slate-800 shadow-md">
            <img
              src="/branding/logo-without-bg-trimmed.webp"
              alt="Logo Preview"
              class="h-10 w-auto object-contain drop-shadow-[0_2px_10px_rgba(78,222,227,0.3)]"
            />
            <div dir="ltr" class="flex items-center select-none font-sans">
              <span class="font-black text-white text-xl sm:text-2xl tracking-tight leading-none">Restora</span>
              <span class="font-black text-[#4edee3] text-xl sm:text-2xl tracking-tight leading-none ms-0.5">Intel</span>
            </div>
          </div>
          <span class="text-[11px] text-emerald-400 font-semibold">✓ Exact Live Sidebar & Drawer Ratio</span>
        </div>

        <!-- Checkered Light Preview -->
        <div class="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center gap-4 text-center text-slate-900">
          <span class="text-[11px] font-mono text-slate-500">Light Card & Modal Surface (#ffffff)</span>
          <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <img
              src="/branding/logo-without-bg-trimmed.webp"
              alt="Logo Preview Light"
              class="h-10 w-auto object-contain"
            />
            <div dir="ltr" class="flex items-center select-none font-sans">
              <span class="font-black text-slate-900 text-xl sm:text-2xl tracking-tight leading-none">Restora</span>
              <span class="font-black text-[#0f766e] text-xl sm:text-2xl tracking-tight leading-none ms-0.5">Intel</span>
            </div>
          </div>
          <span class="text-[11px] text-teal-700 font-semibold">✓ Transparent PNG / Alpha Channel</span>
        </div>
      </div>
    </div>

    <!-- Color Palette Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-900">
          {{ uiStore.language === 'ar' ? 'لوحة الألوان الرسمية' : 'Official Color Palette' }}
        </h2>
        <span class="text-xs text-slate-500 font-mono">Tailwind CSS v4 Tokens</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          v-for="color in colorPalette"
          :key="color.hex"
          class="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
        >
          <div
            class="h-14 rounded-xl border border-black/10 shadow-inner flex items-center justify-center mb-3"
            :style="{ backgroundColor: color.hex }"
          >
            <span :class="['text-xs font-mono font-bold', color.textDark ? 'text-slate-900' : 'text-white']">
              {{ color.hex }}
            </span>
          </div>
          <div>
            <div class="font-bold text-xs text-slate-800">{{ color.name }}</div>
            <div class="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{{ color.role }}</div>
            <button
              type="button"
              class="mt-2.5 w-full flex items-center justify-center gap-1 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-[11px] font-mono text-slate-600 transition-colors cursor-pointer"
              @click="copyToClipboard(color.hex)"
            >
              <Copy class="w-3 h-3" />
              <span>Copy HEX</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Asset Showcase & Filtering -->
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 class="text-lg font-bold text-slate-900">
          {{ uiStore.language === 'ar' ? 'معرض الأصول الرقمية والتحميل' : 'Digital Assets Repository & Downloads' }}
        </h2>

        <!-- Filters -->
        <div class="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            @click="activeFilter = 'all'"
          >
            {{ uiStore.language === 'ar' ? 'الكل' : 'All' }} ({{ assets.length }})
          </button>
          <button
            type="button"
            :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', activeFilter === 'production' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            @click="activeFilter = 'production'"
          >
            {{ uiStore.language === 'ar' ? 'الإنتاج' : 'Production' }}
          </button>
          <button
            type="button"
            :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', activeFilter === 'source' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            @click="activeFilter = 'source'"
          >
            {{ uiStore.language === 'ar' ? 'الأصول المرفوعة' : 'Master Uploads' }}
          </button>
          <button
            type="button"
            :class="['px-3 py-1.5 rounded-lg transition-all cursor-pointer', activeFilter === 'icons' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900']"
            @click="activeFilter = 'icons'"
          >
            {{ uiStore.language === 'ar' ? 'الأيقونات' : 'Favicons & PWA' }}
          </button>
        </div>
      </div>

      <!-- Assets Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="asset in filteredAssets()"
          :key="asset.id"
          class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
        >
          <!-- Asset Preview Stage -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-[#0f766e] border border-teal-200/60 uppercase">
                {{ asset.badge }}
              </span>
              <span class="text-[11px] font-mono font-semibold text-slate-400">
                {{ asset.format }}
              </span>
            </div>

            <div class="h-36 rounded-xl bg-[#0b131a] border border-slate-800 flex items-center justify-center p-4 relative overflow-hidden mb-4 group">
              <!-- Transparency checkerboard indicator -->
              <div v-if="asset.transparent" class="absolute top-2 start-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-[#4edee3] border border-[#4edee3]/30">
                Alpha 100%
              </div>
              <img
                :src="asset.path"
                :alt="asset.name"
                class="max-h-24 max-w-full object-contain drop-shadow-[0_2px_8px_rgba(78,222,227,0.25)] transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <!-- Asset Details -->
            <div class="space-y-1.5">
              <div class="font-mono text-xs font-bold text-slate-900 truncate" :title="asset.name">
                {{ asset.name }}
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed min-h-[32px]">
                {{ asset.description[uiStore.language] }}
              </p>
              <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>{{ asset.dims }}</span>
                <span>{{ asset.size }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 mt-3 border-t border-slate-100">
            <button
              type="button"
              class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              @click="copyToClipboard(asset.path)"
            >
              <Check v-if="copiedPath === asset.path" class="w-3.5 h-3.5 text-emerald-600" />
              <Copy v-else class="w-3.5 h-3.5 text-slate-500" />
              <span>{{ copiedPath === asset.path ? 'Copied!' : 'Copy Path' }}</span>
            </button>

            <a
              :href="asset.path"
              download
              class="inline-flex items-center justify-center p-2 rounded-xl bg-[#0f766e] hover:bg-[#0d646a] text-white transition-colors cursor-pointer shadow-xs"
              :title="uiStore.language === 'ar' ? 'تحميل الأصل' : 'Download Asset'"
            >
              <Download class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
