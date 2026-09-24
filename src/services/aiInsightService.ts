import type { AIInsight, OperationalAlert } from '@/types/domain';
import { getMockOperations } from '@/data/providers';
import { wireId } from '@/data/adapters/legacy-view';
export const aiInsightService = {
  async getInsights(id: string): Promise<AIInsight[]> { return getMockOperations().mockGetInsights(wireId(id, 'rest')); },
  async updateInsightStatus(restaurantId: string, id: string, status: AIInsight['status']): Promise<AIInsight> {
    return getMockOperations().mockUpdateInsight(wireId(restaurantId, 'rest'), id, status);
  },
  async getAlerts(id: string): Promise<OperationalAlert[]> { return getMockOperations().mockGetAlerts(wireId(id, 'rest')); },
  async markAlertRead(restaurantId: string, id: string): Promise<OperationalAlert> {
    return getMockOperations().mockMarkAlertRead(wireId(restaurantId, 'rest'), id);
  },
  async markAllAlertsRead(restaurantId: string): Promise<void> {
    return getMockOperations().mockMarkAllAlertsRead(wireId(restaurantId, 'rest'));
  },
};
