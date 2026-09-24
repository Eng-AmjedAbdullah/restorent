<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { reportService } from '@/services/reportService';
import type { ReportMetric } from '@/types/domain';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-vue-next';

const uiStore = useUIStore();
const authStore = useAuthStore();
const metrics = ref<ReportMetric[]>([]);
const isLoading = ref<boolean>(true);

async function loadReports() {
  const restaurantId = authStore.currentRestaurant?.id;
  if (!restaurantId) {
    metrics.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    metrics.value = await reportService.getReportMetrics(restaurantId);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadReports();
});

watch(() => authStore.currentRestaurant?.id, () => {
  loadReports();
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
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'تحليل المبيعات، نسبة تكلفة العمالة، ودوران الطاولات' : 'Sales performance, labor cost percentages, table turnover, and waste audit' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div v-if="isLoading" class="p-8 text-center text-xs text-slate-500">
        {{ uiStore.language === 'ar' ? 'جاري تحميل التقارير المالية...' : 'Loading financial reports...' }}
      </div>

      <div v-else-if="metrics.length === 0" class="p-8 text-center text-xs text-slate-500">
        {{ uiStore.language === 'ar' ? 'لا توجد بيانات تقارير مسجلة لهذا الفرع' : 'No report metrics available for this branch' }}
      </div>

      <div v-else class="overflow-x-auto">
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
