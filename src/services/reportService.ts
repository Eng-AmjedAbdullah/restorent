import type { ReportMetric, DashboardSummary } from '@/types/domain';
import { mockReportMetrics, mockDashboardSummaries } from '@/mocks/reports';
import { mockDashboardKPIs, type DashboardKPIs } from '@/mocks/dashboard';

export const reportService = {
  async getReportMetrics(restaurantId: string): Promise<ReportMetric[]> {
    const list = mockReportMetrics[restaurantId] || mockReportMetrics['rest-1'] || [];
    return JSON.parse(JSON.stringify(list));
  },

  async getDashboardSummary(restaurantId: string): Promise<DashboardSummary> {
    const summary = mockDashboardSummaries[restaurantId] || mockDashboardSummaries['rest-1'];
    return JSON.parse(JSON.stringify(summary));
  },

  async getDashboardKPIs(restaurantId: string): Promise<DashboardKPIs> {
    const kpi = mockDashboardKPIs[restaurantId] || mockDashboardKPIs['rest-1'];
    return JSON.parse(JSON.stringify(kpi));
  }
};
