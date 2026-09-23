<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { reportService } from '@/services/reportService';
import type { ReportMetric } from '@/types/domain';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-vue-next';

const uiStore = useUIStore();
const metrics = ref<ReportMetric[]>([]);

onMounted(async () => {
  metrics.value = await reportService.getReportMetrics('rest-1');
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'التقارير التحليلية والمالية' : 'Financial & Operational Reports' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-100 text-violet-800 border border-violet-200">
            Report Service Connected
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'تحليل المبيعات، نسبة تكلفة العمالة، ودوران الطاولات' : 'Sales performance, labor cost percentages, table turnover, and waste audit' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-start">
          <thead class="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th class="p-3 text-start">{{ uiStore.language === 'ar' ? 'التاريخ' : 'Date' }}</th>
              <th class="p-3 text-start">{{ uiStore.language === 'ar' ? 'المبيعات' : 'Sales' }}</th>
              <th class="p-3 text-start">{{ uiStore.language === 'ar' ? 'تكلفة العمالة %' : 'Labor Cost %' }}</th>
              <th class="p-3 text-start">{{ uiStore.language === 'ar' ? 'العملاء' : 'Customers' }}</th>
              <th class="p-3 text-start">{{ uiStore.language === 'ar' ? 'متوسط الفاتورة' : 'Avg Ticket' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="m in metrics" :key="m.id" class="hover:bg-slate-50">
              <td class="p-3 font-mono">{{ m.date }}</td>
              <td class="p-3 font-bold text-slate-900">{{ m.sales.toLocaleString() }} SAR</td>
              <td class="p-3 text-emerald-700 font-semibold">{{ m.labor_cost_percent }}%</td>
              <td class="p-3">{{ m.customer_count }}</td>
              <td class="p-3">{{ m.average_ticket }} SAR</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
