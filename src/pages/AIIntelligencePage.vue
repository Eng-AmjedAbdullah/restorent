<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { useDashboardStore } from '@/stores/dashboard';
import { aiInsightService } from '@/services/aiInsightService';
import type { AIInsight } from '@/types/domain';
import { Sparkles, ShieldCheck } from 'lucide-vue-next';
const auth = useAuthStore();
const ui = useUIStore();
const dashboard = useDashboardStore();
const insights = ref<AIInsight[]>([]);
const loading = ref(false);
const saving = ref('');
const error = ref('');
const filter = ref<'all' | AIInsight['status']>('all');
const visible = computed(() => insights.value.filter(i => filter.value === 'all' || i.status === filter.value));
const pending = computed(() => insights.value.filter(i => i.status === 'pending').length);
let generation = 0;
async function load(): Promise<void> {
  const id = auth.currentRestaurant?.id;
  const current = ++generation;
  insights.value = []; error.value = '';
  if (!id) return;
  loading.value = true;
  try { const data = await aiInsightService.getInsights(id); if (current === generation) insights.value = data; }
  catch (e) { if (current === generation) error.value = e instanceof Error ? e.message : String(e); }
  finally { if (current === generation) loading.value = false; }
}
async function decide(insight: AIInsight, status: 'accepted' | 'rejected'): Promise<void> {
  const id = auth.currentRestaurant?.id;
  if (!id || !auth.can('restaurant.ai.forecasting.use') || insight.status !== 'pending') return;
  saving.value = insight.id; error.value = '';
  try {
    const updated = await aiInsightService.updateInsightStatus(id, insight.id, status);
    if (auth.currentRestaurant?.id !== id) return;
    insights.value = insights.value.map(i => i.id === updated.id ? updated : i);
    if (dashboard.selectedRestaurantId === id) await dashboard.fetchDashboardData(id);
    ui.addToast({ title: ui.language === 'ar' ? 'تم تسجيل القرار التجريبي' : 'Demo decision recorded',
      message: ui.language === 'ar' ? 'تغيرت حالة التوصية فقط. لم يتم تغيير جدول فعلي أو تشغيل نموذج.' : 'Recommendation status changed only; no real deployment or model run.', type: 'info' });
  } catch (e) { error.value = e instanceof Error ? e.message : String(e); }
  finally { saving.value = ''; }
}
watch(() => auth.currentRestaurant?.id, load, { immediate: true });
</script>

<template>
  <div class="space-y-5">
    <header class="border-b border-slate-200 pb-4"><h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2"><Sparkles class="w-6 h-6 text-teal-700"/>{{ ui.language === 'ar' ? 'التوصيات التشغيلية' : 'Operational recommendations' }}</h1>
      <p class="mt-1 text-sm text-slate-500">{{ ui.language === 'ar' ? 'توصيات وبيانات تاريخية تجريبية؛ لا يوجد نموذج ذكاء اصطناعي متصل في هذا الإصدار.' : 'Simulated recommendations and historical sample evidence. No live AI model is connected.' }}</p></header>
    <div class="flex flex-wrap gap-2 items-center"><span class="text-sm text-slate-500 me-2">{{ ui.language === 'ar' ? 'قيد المراجعة' : 'Pending' }}: {{ pending }}</span>
      <button v-for="status in (['all','pending','accepted','rejected','applied'] as const)" :key="status" type="button" :aria-pressed="filter===status" class="px-3 py-2 text-xs font-semibold rounded-xl border" :class="filter===status ? 'bg-teal-700 border-teal-700 text-white' : 'bg-white border-slate-200 text-slate-700'" @click="filter=status">{{ status==='all' ? (ui.language==='ar' ? 'الكل' : 'All') : status==='pending' ? (ui.language==='ar'?'معلقة':'Pending') : status==='accepted' ? (ui.language==='ar'?'مقبولة':'Accepted') : status==='rejected' ? (ui.language==='ar'?'مرفوضة':'Rejected') : (ui.language==='ar'?'منفذة في العينة':'Applied in sample') }}</button>
    </div>
    <p v-if="error" role="alert" class="text-sm text-rose-700 bg-rose-50 rounded-xl p-3">{{ error }}</p>
    <p v-if="loading" class="p-10 text-center bg-white rounded-xl text-slate-500">{{ ui.language==='ar'?'جارٍ تحميل بيانات التوصيات…':'Loading sample recommendations…' }}</p>
    <div v-else-if="!visible.length" class="p-10 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-sm">{{ ui.language==='ar'?'لا توجد توصيات لهذه التصفية.':'No recommendations match this filter.' }}</div>
    <section v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <article v-for="insight in visible" :key="insight.id" class="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm"><div class="flex flex-wrap items-start justify-between gap-2"><h2 class="font-bold text-slate-900 text-sm">{{ insight.title[ui.language] }}</h2><span class="text-xs rounded-lg px-2 py-1" :class="insight.urgency==='high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'">{{ insight.urgency }}</span></div>
        <p class="text-sm text-slate-600 leading-relaxed">{{ insight.description[ui.language] }}</p><p class="text-sm font-semibold text-teal-700">{{ insight.impact[ui.language] }}</p>
        <div class="bg-slate-50 rounded-xl p-3 space-y-1"><h3 class="font-bold text-xs text-slate-700 flex items-center gap-1"><ShieldCheck class="w-4 h-4"/>{{ ui.language==='ar'?'إجراء مقترح (محاكاة)':'Suggested demo action' }}</h3><p class="text-xs text-slate-600">{{ insight.suggested_action[ui.language] }}</p></div>
        <div class="flex items-center justify-between gap-3 flex-wrap border-t border-slate-100 pt-3"><span class="text-xs text-slate-500">{{ insight.status }}</span><div v-if="insight.status==='pending' && auth.can('restaurant.ai.forecasting.use')" class="flex gap-2"><button type="button" :disabled="Boolean(saving)" class="border border-slate-300 rounded-xl px-3 py-2 text-xs disabled:opacity-50" @click="decide(insight,'rejected')">{{ ui.language==='ar'?'رفض':'Dismiss' }}</button><button type="button" :disabled="Boolean(saving)" class="bg-teal-700 text-white rounded-xl px-3 py-2 text-xs disabled:opacity-50" @click="decide(insight,'accepted')">{{ ui.language==='ar'?'قبول في المحاكاة':'Accept in demo' }}</button></div></div>
      </article>
    </section>
  </div>
</template>
