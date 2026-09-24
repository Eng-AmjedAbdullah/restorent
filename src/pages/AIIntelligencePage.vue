<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { aiInsightService } from '@/services/aiInsightService';
import type { AIInsight } from '@/types/domain';
import { Sparkles, Brain, CheckCircle, ArrowRight, Zap, TrendingUp } from 'lucide-vue-next';

const uiStore = useUIStore();
const authStore = useAuthStore();
const insights = ref<AIInsight[]>([]);
const isLoading = ref<boolean>(true);

async function loadInsights() {
  const restId = authStore.currentRestaurant?.id;
  if (!restId) {
    insights.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    insights.value = await aiInsightService.getInsights(restId);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadInsights();
});

watch(() => authStore.currentRestaurant?.id, () => {
  loadInsights();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'مركز الذكاء الاصطناعي والتوصيات التشغيلية' : 'AI Intelligence & Predictive Operations' }}
          </h1>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'توصيات تنبؤية للورديات، ضبط الهدر، وتحسين هوامش الربحية' : 'Predictive scheduling, kitchen waste prevention, and profitability optimization' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700 shadow-2xs flex items-center gap-1.5">
          <Zap class="w-3.5 h-3.5" />
          <span>{{ insights.length }} {{ uiStore.language === 'ar' ? 'توصية نشطة' : 'Active Recommendations' }}</span>
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
      {{ uiStore.language === 'ar' ? 'جاري تحليل العمليات واستخراج التوصيات الذكية...' : 'Analyzing operations and retrieving AI insights...' }}
    </div>

    <div v-else-if="insights.length === 0" class="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
      {{ uiStore.language === 'ar' ? 'لا توجد توصيات ذكاء اصطناعي حالية لهذا الفرع' : 'No AI recommendations currently active for this branch' }}
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="insight in insights"
        :key="insight.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-purple-300 transition-colors"
      >
        <div class="flex items-start gap-4">
          <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 mt-1 shrink-0">
            <Sparkles class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-bold text-slate-900 text-sm">{{ insight.title[uiStore.language] }}</h3>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0',
                  insight.urgency === 'high' ? 'bg-rose-100 text-rose-800' : insight.urgency === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ insight.urgency }} {{ uiStore.language === 'ar' ? 'أولوية' : 'priority' }}
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ insight.description[uiStore.language] }}</p>
            <div v-if="insight.impact" class="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 inline-block px-2.5 py-1 rounded-lg border border-emerald-100">
              {{ insight.impact[uiStore.language] }}
            </div>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span class="font-medium text-purple-700 capitalize">{{ insight.category }}</span>
              <span class="font-mono text-[11px]">{{ insight.created_at ? new Date(insight.created_at).toLocaleDateString() : '' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
