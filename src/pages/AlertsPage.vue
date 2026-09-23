<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { mockAlerts } from '@/mocks/aiInsights';
import { Bell, AlertTriangle, AlertCircle, CheckCircle2, Clock } from 'lucide-vue-next';

const uiStore = useUIStore();
const authStore = useAuthStore();

const alerts = ref(mockAlerts);

const currentAlerts = computed(() => {
  const currentRestId = authStore.currentRestaurant?.id || 'rest-1';
  return alerts.value.filter(a => a.restaurant_id === currentRestId);
});

function markAsRead(id: string) {
  const alert = alerts.value.find(a => a.id === id);
  if (alert) {
    alert.read = true;
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'التنبيهات التشغيلية والحرجة' : 'Operational & System Alerts' }}
          </h1>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'تنبيهات المخزون الحرج، انخفاض التغطية، وتأخيرات الورديات' : 'Real-time operational alerts, stock depletion, and attendance deviations' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
          {{ currentAlerts.length }} {{ uiStore.language === 'ar' ? 'تنبيه مسجل' : 'Logged Alerts' }}
        </span>
      </div>
    </div>

    <div v-if="currentAlerts.length > 0" class="space-y-3">
      <div
        v-for="alert in currentAlerts"
        :key="alert.id"
        :class="[
          'bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs transition-all flex items-start gap-4',
          alert.read ? 'border-slate-200 opacity-80' : 'border-slate-300 ring-1 ring-slate-200'
        ]"
      >
        <div
          :class="[
            'p-2.5 rounded-xl shrink-0 mt-0.5',
            alert.type === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          ]"
        >
          <AlertTriangle v-if="alert.type === 'critical'" class="w-5 h-5" />
          <Bell v-else class="w-5 h-5" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
            <h3 class="font-bold text-sm text-slate-900">{{ alert.title[uiStore.language] }}</h3>
            <span class="text-[11px] text-slate-400 font-mono">
              {{ new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
            </span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">{{ alert.message[uiStore.language] }}</p>

          <div class="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <span
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                alert.urgency === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
              ]"
            >
              {{ alert.urgency }}
            </span>

            <button
              v-if="!alert.read"
              type="button"
              class="text-xs font-semibold text-[#2c777c] hover:underline cursor-pointer"
              @click="markAsRead(alert.id)"
            >
              {{ uiStore.language === 'ar' ? 'تعيين كمقروء' : 'Mark as resolved' }}
            </button>
            <span v-else class="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
              {{ uiStore.language === 'ar' ? 'تمت المراجعة' : 'Reviewed' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-12">
      <div class="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-3">
        <CheckCircle2 class="w-8 h-8" />
      </div>
      <h3 class="text-base font-bold text-slate-900">
        {{ uiStore.language === 'ar' ? 'جميع المؤشرات التشغيلية مستقرة' : 'All Operational Systems Stable' }}
      </h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto mt-1">
        {{ uiStore.language === 'ar'
          ? 'لا توجد تنبيهات حرجة في الوقت الحالي. يتم فحص مؤشرات المخزون وساعات العمل تلقائياً.'
          : 'No critical alerts at this moment. Inventory thresholds and shift timings are being monitored continuously.'
        }}
      </p>
    </div>
  </div>
</template>
