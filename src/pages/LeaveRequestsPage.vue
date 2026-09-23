<script setup lang="ts">
import { ref } from 'vue';
import { useUIStore } from '@/stores/ui';
import { FileCheck, Clock, Check, X } from 'lucide-vue-next';

const uiStore = useUIStore();
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'إدارة الإجازات والاستئذان' : 'Leave Requests & Approvals' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Vue 3 Composition API Ready
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'مراجعة طلبات الإجازة السنوية، المرضية، والبدائل التشغيلية' : 'Review employee leaves, shift replacement coverage, and annual quotas' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-12">
      <div class="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
        <FileCheck class="w-8 h-8" />
      </div>
      <h3 class="text-base font-bold text-slate-900">
        {{ uiStore.language === 'ar' ? 'وحدة طلبات الإجازات مهيأة للربط' : 'Leave Management Module Initialized' }}
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
