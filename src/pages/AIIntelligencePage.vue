<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { aiInsightService } from '@/services/aiInsightService';
import type { AIInsight } from '@/types/domain';
import { Sparkles, Brain, CheckCircle, ArrowRight } from 'lucide-vue-next';

const uiStore = useUIStore();
const insights = ref<AIInsight[]>([]);

onMounted(async () => {
  insights.value = await aiInsightService.getInsights('rest-1');
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
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            AI Service Connected
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'توصيات تنبؤية للورديات، ضبط الهدر، وتحسين هوامش الربحية' : 'Predictive scheduling, kitchen waste prevention, and profitability optimization' }}
        </p>
      </div>
    </div>

    <div class="space-y-4">
      <div
        v-for="insight in insights"
        :key="insight.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-purple-300 transition-colors"
      >
        <div class="flex items-start gap-4">
          <div class="p-2.5 rounded-xl bg-purple-50 text-purple-600 mt-1">
            <Sparkles class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-bold text-slate-900 text-sm">{{ insight.title[uiStore.language] }}</h3>
              <span
                :class="[
                  'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                  insight.impact === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                ]"
              >
                {{ insight.impact }} impact
              </span>
            </div>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ insight.description[uiStore.language] }}</p>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span class="font-medium text-purple-700">{{ insight.category }}</span>
              <span class="font-mono text-[11px]">{{ new Date(insight.created_at).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
