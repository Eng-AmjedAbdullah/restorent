<script setup lang="ts">
import { useUIStore } from '@/stores/ui';
import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-vue-next';

const uiStore = useUIStore();
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'التنبيهات التشغيلية والحرجة' : 'Operational & System Alerts' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Vue 3 Composition API Ready
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'تنبيهات المخزون الحرج، انخفاض التغطية، وتأخيرات الطهاة' : 'Real-time operational alerts, stock depletion, and attendance deviations' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-12">
      <div class="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-600 mb-3">
        <Bell class="w-8 h-8" />
      </div>
      <h3 class="text-base font-bold text-slate-900">
        {{ uiStore.language === 'ar' ? 'مركز التنبيهات مهيأ للربط' : 'Alerts Center Initialized' }}
      </h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto mt-1">
        {{ uiStore.language === 'ar'
          ? 'المسار جاهز ومربوط بالنظام المعماري لـ Vue 3 ومخازن Pinia.'
          : 'Route configured and connected to the Vue 3 architecture and Pinia stores.'
        }}
      </p>
    </div>
  </div>
</template>
