<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { useDashboardStore } from '@/stores/dashboard';
import { aiInsightService } from '@/services/aiInsightService';
import type { OperationalAlert } from '@/types/domain';
import { Bell, AlertTriangle, CheckCheck, CircleCheck } from 'lucide-vue-next';

const auth = useAuthStore();
const ui = useUIStore();
const dashboard = useDashboardStore();
const alerts = ref<OperationalAlert[]>([]);
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const filter = ref<'all' | OperationalAlert['type'] | 'unread'>('all');
const unread = computed(() => alerts.value.filter(a => !a.read).length);
const visible = computed(() => alerts.value.filter(a => filter.value === 'all' || (filter.value === 'unread' ? !a.read : a.type === filter.value)));
let generation = 0;
async function load(): Promise<void> {
  const id = auth.currentRestaurant?.id;
  const current = ++generation;
  alerts.value = [];
  error.value = '';
  if (!id) return;
  loading.value = true;
  try {
    const data = await aiInsightService.getAlerts(id);
    if (current === generation) alerts.value = data;
  } catch (e) { if (current === generation) error.value = e instanceof Error ? e.message : String(e); }
  finally { if (current === generation) loading.value = false; }
}
async function markRead(alertId: string): Promise<void> {
  const restId = auth.currentRestaurant?.id;
  if (!restId) return;
  saving.value = true;
  error.value = '';
  try {
    const data = await aiInsightService.markAlertRead(restId, alertId);
    if (auth.currentRestaurant?.id !== restId) return;
    alerts.value = alerts.value.map(a => a.id === data.id ? data : a);
    if (dashboard.selectedRestaurantId === restId) await dashboard.markAlertAsRead(alertId);
  } catch (e) { error.value = e instanceof Error ? e.message : String(e); }
  finally { saving.value = false; }
}
async function markAll(): Promise<void> {
  const restId = auth.currentRestaurant?.id;
  if (!restId || !unread.value) return;
  saving.value = true;
  error.value = '';
  try {
    await aiInsightService.markAllAlertsRead(restId);
    if (auth.currentRestaurant?.id !== restId) return;
    alerts.value = alerts.value.map(a => ({ ...a, read: true }));
    if (dashboard.selectedRestaurantId === restId) await dashboard.fetchDashboardData(restId);
  } catch (e) { error.value = e instanceof Error ? e.message : String(e); }
  finally { saving.value = false; }
}
watch(() => auth.currentRestaurant?.id, load, { immediate: true });
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap justify-between items-start gap-3 border-b border-slate-200 pb-4">
      <div><h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2"><Bell class="w-6 h-6 text-teal-700"/>{{ ui.language === 'ar' ? 'التنبيهات التشغيلية' : 'Operational alerts' }}</h1>
        <p class="text-sm text-slate-500 mt-1">{{ ui.language === 'ar' ? 'تنبيهات مستمدة من بيانات تجريبية؛ قراءة التنبيه لا تعني حل الحادثة.' : 'Historical demo alerts. Marking an alert as read does not resolve its underlying incident.' }}</p></div>
      <button type="button" :disabled="saving || !unread" class="px-3 py-2 rounded-xl border border-teal-200 text-teal-800 text-xs font-semibold disabled:opacity-50 flex items-center gap-2" @click="markAll"><CheckCheck class="w-4 h-4"/>{{ ui.language === 'ar' ? 'تعيين الكل كمقروء' : 'Mark all as read' }} ({{ unread }})</button>
    </header>
    <p v-if="error" role="alert" class="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{{ error }}</p>
    <div class="flex flex-wrap gap-2" role="group" :aria-label="ui.language === 'ar' ? 'تصفية التنبيهات' : 'Filter alerts'">
      <button v-for="type in (['all', 'unread', 'critical', 'operational', 'simulation_insight'] as const)" :key="type" type="button" :aria-pressed="filter === type" class="rounded-xl border px-3 py-2 text-xs font-semibold transition-colors" :class="filter === type ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'" @click="filter = type">{{ type === 'all' ? (ui.language === 'ar' ? 'الكل' : 'All') : type === 'unread' ? (ui.language === 'ar' ? 'غير المقروءة' : 'Unread') : type === 'critical' ? (ui.language === 'ar' ? 'حرجة' : 'Critical') : type === 'operational' ? (ui.language === 'ar' ? 'تشغيلية' : 'Operational') : (ui.language === 'ar' ? 'محاكاة التوصيات' : 'Simulated insights') }}</button>
    </div>
    <div v-if="loading" class="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500 text-sm">{{ ui.language === 'ar' ? 'جاري تحميل التنبيهات…' : 'Loading alerts…' }}</div>
    <section v-else-if="visible.length" class="space-y-3">
      <article v-for="alert in visible" :key="alert.id" class="bg-white rounded-2xl border p-4 sm:p-5 flex gap-3" :class="alert.read ? 'border-slate-200 opacity-75' : alert.type === 'critical' ? 'border-rose-200' : 'border-teal-200'">
        <div class="p-2.5 h-fit rounded-xl" :class="alert.type === 'critical' ? 'bg-rose-50 text-rose-700' : 'bg-teal-50 text-teal-700'"><AlertTriangle v-if="alert.type === 'critical'" class="w-5 h-5"/><Bell v-else class="w-5 h-5"/></div>
        <div class="flex-1 min-w-0"><div class="flex flex-wrap justify-between gap-2"><h2 class="font-bold text-slate-900 text-sm">{{ alert.title[ui.language] }}</h2><time class="font-mono text-xs text-slate-400">{{ new Date(alert.created_at).toLocaleString(ui.language === 'ar' ? 'ar-SA' : 'en-US', { timeZone: auth.currentRestaurant?.timezone || 'UTC', dateStyle: 'medium', timeStyle: 'short' }) }}</time></div>
          <p class="mt-1 text-sm text-slate-600 leading-relaxed">{{ alert.message[ui.language] }}</p>
          <div class="flex flex-wrap justify-between items-center mt-3 pt-3 border-t border-slate-100 gap-2"><span class="text-xs text-slate-500">{{ alert.urgency === 'high' ? (ui.language === 'ar' ? 'أولوية عالية' : 'High priority') : alert.urgency === 'medium' ? (ui.language === 'ar' ? 'أولوية متوسطة' : 'Medium priority') : (ui.language === 'ar' ? 'أولوية منخفضة' : 'Low priority') }}</span>
            <button v-if="!alert.read" type="button" :disabled="saving" class="text-xs font-semibold text-teal-800 hover:underline disabled:opacity-50" @click="markRead(alert.id)">{{ ui.language === 'ar' ? 'تعيين كمقروء' : 'Mark as read' }}</button><span v-else class="inline-flex items-center gap-1 text-xs text-emerald-700"><CircleCheck class="w-4 h-4"/>{{ ui.language === 'ar' ? 'تمت القراءة' : 'Read' }}</span></div>
        </div>
      </article>
    </section>
    <div v-else class="p-10 bg-white rounded-2xl border border-slate-200 text-center text-sm text-slate-500">{{ ui.language === 'ar' ? 'لا توجد تنبيهات مطابقة لهذه التصفية في بيانات الفرع.' : 'No alerts match this filter in this restaurant’s demo data.' }}</div>
  </div>
</template>
