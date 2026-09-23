import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DashboardSummary, ReportMetric } from '@/types/domain';
import { reportService } from '@/services/reportService';
import { mockDashboardKPIs, type DashboardKPIs } from '@/mocks/dashboard';

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null);
  const metrics = ref<ReportMetric[]>([]);
  const kpis = ref<DashboardKPIs | null>(null);
  const isLoading = ref<boolean>(false);

  async function fetchDashboardData(restaurantId: string = 'rest-1'): Promise<void> {
    isLoading.value = true;
    try {
      const [sum, repMetrics] = await Promise.all([
        reportService.getDashboardSummary(restaurantId),
        reportService.getReportMetrics(restaurantId)
      ]);
      summary.value = sum;
      metrics.value = repMetrics;
      kpis.value = mockDashboardKPIs[restaurantId] || mockDashboardKPIs['rest-1'];
    } catch (error) {
      console.error('[DashboardStore] Failed to load dashboard data:', error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    summary,
    metrics,
    kpis,
    isLoading,
    fetchDashboardData
  };
});
