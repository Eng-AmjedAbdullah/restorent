import type { DashboardSummary } from '@/types/domain';
import { mockDashboardSummaries, mockReportMetrics } from './reports';

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

export const getDashboardSummaryByRestaurant = (restaurantId: string): DashboardSummary => {
  return (
    mockDashboardSummaries[restaurantId] ||
    mockDashboardSummaries['rest-1'] || {
      sales_today: 45000,
      sales_yesterday: 41000,
      employees_on_duty: 4,
      total_shift_staff: 5,
      attendance_rate: 98,
      late_count: 0,
      critical_inventory_alerts: 0,
      pending_leave_requests: 0,
      active_orders_count: 2,
      station_coverage: {
        kitchen: 100,
        floor: 100,
        bar: 100,
        stewarding: 100
      }
    }
  );
};

export { mockDashboardSummaries, mockReportMetrics };
