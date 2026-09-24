import type { ReportMetric, DashboardSummary } from '@/types/domain';
import { mockReportMetrics, mockDashboardSummaries } from '@/mocks/reports';
import { mockDashboardKPIs, type DashboardKPIs } from '@/mocks/dashboard';

export const reportService = {
  async getReportMetrics(restaurantId: string): Promise<ReportMetric[]> {
    if (!restaurantId) return [];
    const list = mockReportMetrics[restaurantId] || [];
    return JSON.parse(JSON.stringify(list));
  },

  async getDashboardSummary(restaurantId: string): Promise<DashboardSummary | null> {
    if (!restaurantId) return null;
    const summary = mockDashboardSummaries[restaurantId] || null;
    return summary ? JSON.parse(JSON.stringify(summary)) : null;
  },

  async getDashboardKPIs(restaurantId: string): Promise<DashboardKPIs | null> {
    if (!restaurantId) return null;
    const kpi = mockDashboardKPIs[restaurantId] || null;
    return kpi ? JSON.parse(JSON.stringify(kpi)) : null;
  }
};
