<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { schedulingService } from '@/services/schedulingService';
import type { Shift } from '@/types/domain';
import { CalendarDays, Plus, Clock, Users } from 'lucide-vue-next';

const uiStore = useUIStore();
const shifts = ref<Shift[]>([]);

onMounted(async () => {
  shifts.value = await schedulingService.getShifts();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'جدولة الورديات والمناوبات' : 'Shift Scheduling & Coverage' }}
          </h1>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'تخطيط جدول الطهاة وطاقم الصالة وتغطية أوقات الذروة' : 'Shift planning, kitchen stations coverage, and peak hour dispatching' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div class="flex items-center gap-2 mb-4 text-xs font-semibold text-slate-500">
        <CalendarDays class="w-4 h-4 text-indigo-600" />
        <span>{{ uiStore.language === 'ar' ? 'الورديات المجدولة حالياً:' : 'Current Scheduled Shifts:' }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="shift in shifts.slice(0, 6)"
          :key="shift.id"
          class="p-4 rounded-xl border border-slate-200 bg-slate-50/60"
        >
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-bold text-slate-900">{{ shift.shift_name[uiStore.language] }}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">{{ shift.station }}</span>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>{{ shift.start_time }} - {{ shift.end_time }}</span>
            <span class="font-semibold text-emerald-700">{{ shift.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
