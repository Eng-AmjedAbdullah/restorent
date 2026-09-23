<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { aiInsightService } from '@/services/aiInsightService';
import type { AIInsight } from '@/types/domain';
import { Sparkles, Brain, CheckCircle, ArrowRight, Zap } from 'lucide-vue-next';

const uiStore = useUIStore();
const authStore = useAuthStore();
const insights = ref<AIInsight[]>([]);

async function loadInsights() {
  const restId = authStore.currentRestaurant?.id || 'rest-1';
  insights.value = await aiInsightService.getInsights(restId);
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

    <div class="space-y-4">
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
                  insight.impact === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                ]"
              >
                {{ insight.impact }} priority
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ insight.description[uiStore.language] }}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span class="font-medium text-purple-700 capitalize">{{ insight.category }}</span>
              <span class="font-mono text-[11px]">{{ new Date(insight.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
