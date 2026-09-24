import type { ReportMetric, DashboardSummary } from '@/types/domain';
import type { DashboardKPIs } from '@/mocks/dashboard';
import { getMockOperations } from '@/data/providers';
import { wireId } from '@/data/adapters/legacy-view';
export const reportService = {
  async getReportMetrics(id: string): Promise<ReportMetric[]> { return getMockOperations().mockGetReports(wireId(id, 'rest')); },
  async getDashboardSummary(id: string): Promise<DashboardSummary | null> { return getMockOperations().mockGetSummary(wireId(id, 'rest')); },
  async getDashboardKPIs(id: string): Promise<DashboardKPIs | null> { return getMockOperations().mockGetKPIs(wireId(id, 'rest')); },
};
