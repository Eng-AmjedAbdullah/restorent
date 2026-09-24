// Non-financial demo attributes are deliberately a labeled snapshot, never real telemetry.

export interface DashboardKPIs {
  revenueGrowth: number;
  customerSatisfaction: number;
  averageTicket: number;
  peakHour: string;
}

export const mockDashboardKPIs: Record<string, DashboardKPIs> = {
  'rest-1': {
    revenueGrowth: 11.2,
    customerSatisfaction: 4.88,
    averageTicket: 168.3,
    peakHour: '20:00 - 22:30'
  },
  'rest-2': {
    revenueGrowth: 6.4,
    customerSatisfaction: 4.92,
    averageTicket: 208.4,
    peakHour: '19:30 - 23:00'
  },
  'rest-3': {
    revenueGrowth: 8.9,
    customerSatisfaction: 4.75,
    averageTicket: 60.5,
    peakHour: '13:00 - 15:30'
  }
};

