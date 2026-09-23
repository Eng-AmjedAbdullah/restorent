import type { ReportMetric, DashboardSummary } from '@/types/domain';
import { mockReportMetrics, mockDashboardSummaries } from '@/mocks/reports';

export const reportService = {
  async getReportMetrics(restaurantId: string): Promise<ReportMetric[]> {
    const list = mockReportMetrics[restaurantId] || mockReportMetrics['rest-1'] || [];
    return JSON.parse(JSON.stringify(list));
  },

  async getDashboardSummary(restaurantId: string): Promise<DashboardSummary> {
    const summary = mockDashboardSummaries[restaurantId] || mockDashboardSummaries['rest-1'];
    return JSON.parse(JSON.stringify(summary));
  }
};
