<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { attendanceService } from '@/services/attendanceService';
import type { Attendance } from '@/types/domain';
import { Clock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-vue-next';

const uiStore = useUIStore();
const attendanceList = ref<Attendance[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    attendanceList.value = await attendanceService.getAttendanceRecords();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'سجل الحضور والانصراف الذكي' : 'Smart Biometric & Geofence Attendance' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
            Attendance Service Connected
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'متابعة البصمة، النطاق الجغرافي، وساعات العمل الإضافية' : 'Monitor biometric clock-ins, geofence validations, and overtime shifts' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <Clock class="w-8 h-8 text-emerald-600" />
          <div>
            <div class="text-lg font-bold text-slate-900">{{ attendanceList.length }}</div>
            <div class="text-xs text-slate-500">{{ uiStore.language === 'ar' ? 'سجلات وردية اليوم' : 'Today Shift Records' }}</div>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <CheckCircle2 class="w-8 h-8 text-blue-600" />
          <div>
            <div class="text-lg font-bold text-slate-900">96.5%</div>
            <div class="text-xs text-slate-500">{{ uiStore.language === 'ar' ? 'الالتزام بالمواعيد' : 'Punctuality Index' }}</div>
          </div>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <ShieldCheck class="w-8 h-8 text-purple-600" />
          <div>
            <div class="text-lg font-bold text-slate-900">{{ uiStore.language === 'ar' ? 'تحقق حيوي' : 'Biometric Verified' }}</div>
            <div class="text-xs text-slate-500">{{ uiStore.language === 'ar' ? 'نظام البصمة النشط' : 'Active Kiosk Hardware' }}</div>
          </div>
        </div>
      </div>

      <div class="divide-y divide-slate-100">
        <div
          v-for="rec in attendanceList.slice(0, 5)"
          :key="rec.id"
          class="py-3 flex items-center justify-between text-xs"
        >
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span class="font-bold text-slate-800">{{ rec.employee?.first_name[uiStore.language] }} {{ rec.employee?.last_name[uiStore.language] }}</span>
            <span class="text-slate-400 font-mono text-[11px]">{{ rec.employee?.employee_code }}</span>
          </div>
          <div class="flex items-center gap-4 text-slate-600">
            <span>{{ rec.scheduled_start }} - {{ rec.scheduled_end }}</span>
            <span class="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">{{ rec.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
