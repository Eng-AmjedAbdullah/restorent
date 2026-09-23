<script setup lang="ts">
import { useUIStore } from '@/stores/ui';
import { Palette, Layers, CheckCircle2, ShieldCheck } from 'lucide-vue-next';

const uiStore = useUIStore();

const brandAssets = [
  { name: 'logo-full-original-dark.webp', path: '/branding/logo-full-original-dark.webp', dims: '1200 × 765 px' },
  { name: 'logo-mark.webp', path: '/branding/logo-mark.webp', dims: '512 × 512 px' },
  { name: 'logo-lockup-dark.webp', path: '/branding/logo-lockup-dark.webp', dims: '800 × 260 px' },
  { name: 'logo-sidebar-expanded.webp', path: '/branding/logo-sidebar-expanded.webp', dims: '600 × 160 px' },
  { name: 'icon-512.png', path: '/branding/icon-512.png', dims: '512 × 512 px' }
];
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'هوية ريستورا إنتل البصرية' : 'RestoraIntel Brand Identity & Visual Assets' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
            Brand Assets Preserved
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'مكتبة الأصول الرقمية والشعارات والرموز الرسمية للمنصة' : 'Official logos, lockups, color palettes, and production vector assets' }}
        </p>
      </div>
    </div>

    <!-- Assets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="asset in brandAssets"
        :key="asset.path"
        class="bg-[#0b131a] rounded-2xl border border-slate-800 p-5 flex flex-col justify-between"
      >
        <div class="h-32 flex items-center justify-center p-4 bg-slate-900/60 rounded-xl mb-4 border border-slate-800/80">
          <img :src="asset.path" :alt="asset.name" class="max-h-24 max-w-full object-contain" />
        </div>
        <div>
          <div class="font-mono text-xs text-white truncate font-bold">{{ asset.name }}</div>
          <div class="text-[11px] text-slate-400 mt-1 flex justify-between">
            <span>{{ asset.dims }}</span>
            <span class="text-[#4edee3]">Production Ready</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
