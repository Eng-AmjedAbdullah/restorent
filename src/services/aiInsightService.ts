import type { AIInsight, OperationalAlert } from '@/types/domain';
import { mockAIInsights, mockAlerts } from '@/mocks/aiInsights';

let insightsState: Record<string, AIInsight[]> = JSON.parse(JSON.stringify(mockAIInsights));
let alertsState: OperationalAlert[] = JSON.parse(JSON.stringify(mockAlerts));

export const aiInsightService = {
  async getInsights(restaurantId: string): Promise<AIInsight[]> {
    const list = insightsState[restaurantId] || [];
    return JSON.parse(JSON.stringify(list));
  },

  async updateInsightStatus(id: string, status: AIInsight['status']): Promise<AIInsight> {
    for (const restId in insightsState) {
      const idx = insightsState[restId].findIndex(i => i.id === id);
      if (idx !== -1) {
        insightsState[restId][idx].status = status;
        insightsState[restId][idx].updated_at = new Date().toISOString();
        return JSON.parse(JSON.stringify(insightsState[restId][idx]));
      }
    }
    throw new Error(`Insight ${id} not found`);
  },

  async getAlerts(restaurantId: string): Promise<OperationalAlert[]> {
    const list = alertsState.filter(a => a.restaurant_id === restaurantId);
    return JSON.parse(JSON.stringify(list));
  },

  async markAlertRead(id: string): Promise<OperationalAlert> {
    const idx = alertsState.findIndex(a => a.id === id);
    if (idx === -1) throw new Error(`Alert ${id} not found`);
    alertsState[idx].read = true;
    alertsState[idx].updated_at = new Date().toISOString();
    return JSON.parse(JSON.stringify(alertsState[idx]));
  }
};
