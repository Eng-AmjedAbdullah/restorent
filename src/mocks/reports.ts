import type { ReportMetric, DashboardSummary } from '@/types/domain';

export const mockReportMetrics: Record<string, ReportMetric[]> = {
  'rest-1': [
    { id: 'rep-1-1', restaurant_id: 'rest-1', date: '2026-03-16', sales: 41200, labor_cost_percent: 21.4, customer_count: 240, average_ticket: 171.6, table_turn_time_minutes: 48, food_waste_kg: 7.2, created_at: '2026-03-17T01:00:00Z', updated_at: '2026-03-17T01:00:00Z' },
    { id: 'rep-1-2', restaurant_id: 'rest-1', date: '2026-03-17', sales: 38900, labor_cost_percent: 22.1, customer_count: 220, average_ticket: 176.8, table_turn_time_minutes: 50, food_waste_kg: 8.1, created_at: '2026-03-18T01:00:00Z', updated_at: '2026-03-18T01:00:00Z' },
    { id: 'rep-1-3', restaurant_id: 'rest-1', date: '2026-03-18', sales: 44500, labor_cost_percent: 20.2, customer_count: 265, average_ticket: 167.9, table_turn_time_minutes: 46, food_waste_kg: 6.8, created_at: '2026-03-19T01:00:00Z', updated_at: '2026-03-19T01:00:00Z' },
    { id: 'rep-1-4', restaurant_id: 'rest-1', date: '2026-03-19', sales: 53100, labor_cost_percent: 18.9, customer_count: 310, average_ticket: 171.2, table_turn_time_minutes: 52, food_waste_kg: 9.0, created_at: '2026-03-20T01:00:00Z', updated_at: '2026-03-20T01:00:00Z' },
    { id: 'rep-1-5', restaurant_id: 'rest-1', date: '2026-03-20', sales: 64800, labor_cost_percent: 17.5, customer_count: 385, average_ticket: 168.3, table_turn_time_minutes: 54, food_waste_kg: 10.4, created_at: '2026-03-21T01:00:00Z', updated_at: '2026-03-21T01:00:00Z' },
    { id: 'rep-1-6', restaurant_id: 'rest-1', date: '2026-03-21', sales: 68200, labor_cost_percent: 16.8, customer_count: 405, average_ticket: 168.4, table_turn_time_minutes: 55, food_waste_kg: 9.8, created_at: '2026-03-22T01:00:00Z', updated_at: '2026-03-22T01:00:00Z' },
    { id: 'rep-1-7', restaurant_id: 'rest-1', date: '2026-03-22', sales: 46800, labor_cost_percent: 19.8, customer_count: 278, average_ticket: 168.3, table_turn_time_minutes: 47, food_waste_kg: 5.5, created_at: '2026-03-22T14:00:00Z', updated_at: '2026-03-22T14:00:00Z' }
  ],
  'rest-2': [
    { id: 'rep-2-1', restaurant_id: 'rest-2', date: '2026-03-16', sales: 52000, labor_cost_percent: 23.0, customer_count: 260, average_ticket: 200.0, table_turn_time_minutes: 62, food_waste_kg: 9.4, created_at: '2026-03-17T01:00:00Z', updated_at: '2026-03-17T01:00:00Z' },
    { id: 'rep-2-2', restaurant_id: 'rest-2', date: '2026-03-17', sales: 49500, labor_cost_percent: 24.1, customer_count: 245, average_ticket: 202.0, table_turn_time_minutes: 60, food_waste_kg: 10.1, created_at: '2026-03-18T01:00:00Z', updated_at: '2026-03-18T01:00:00Z' },
    { id: 'rep-2-3', restaurant_id: 'rest-2', date: '2026-03-18', sales: 58200, labor_cost_percent: 21.5, customer_count: 280, average_ticket: 207.8, table_turn_time_minutes: 58, food_waste_kg: 8.7, created_at: '2026-03-19T01:00:00Z', updated_at: '2026-03-19T01:00:00Z' },
    { id: 'rep-2-4', restaurant_id: 'rest-2', date: '2026-03-19', sales: 71400, labor_cost_percent: 18.2, customer_count: 340, average_ticket: 210.0, table_turn_time_minutes: 65, food_waste_kg: 12.0, created_at: '2026-03-20T01:00:00Z', updated_at: '2026-03-20T01:00:00Z' },
    { id: 'rep-2-5', restaurant_id: 'rest-2', date: '2026-03-20', sales: 86500, labor_cost_percent: 16.9, customer_count: 410, average_ticket: 210.9, table_turn_time_minutes: 68, food_waste_kg: 14.5, created_at: '2026-03-21T01:00:00Z', updated_at: '2026-03-21T01:00:00Z' },
    { id: 'rep-2-6', restaurant_id: 'rest-2', date: '2026-03-21', sales: 91200, labor_cost_percent: 15.8, customer_count: 430, average_ticket: 212.0, table_turn_time_minutes: 70, food_waste_kg: 13.2, created_at: '2026-03-22T01:00:00Z', updated_at: '2026-03-22T01:00:00Z' },
    { id: 'rep-2-7', restaurant_id: 'rest-2', date: '2026-03-22', sales: 61500, labor_cost_percent: 19.1, customer_count: 295, average_ticket: 208.4, table_turn_time_minutes: 60, food_waste_kg: 7.8, created_at: '2026-03-22T14:00:00Z', updated_at: '2026-03-22T14:00:00Z' }
  ],
  'rest-3': [
    { id: 'rep-3-1', restaurant_id: 'rest-3', date: '2026-03-16', sales: 18400, labor_cost_percent: 25.5, customer_count: 310, average_ticket: 59.3, table_turn_time_minutes: 24, food_waste_kg: 3.1, created_at: '2026-03-17T01:00:00Z', updated_at: '2026-03-17T01:00:00Z' },
    { id: 'rep-3-2', restaurant_id: 'rest-3', date: '2026-03-17', sales: 19200, labor_cost_percent: 24.8, customer_count: 325, average_ticket: 59.0, table_turn_time_minutes: 23, food_waste_kg: 3.5, created_at: '2026-03-18T01:00:00Z', updated_at: '2026-03-18T01:00:00Z' },
    { id: 'rep-3-3', restaurant_id: 'rest-3', date: '2026-03-18', sales: 21500, labor_cost_percent: 22.0, customer_count: 360, average_ticket: 59.7, table_turn_time_minutes: 22, food_waste_kg: 2.9, created_at: '2026-03-19T01:00:00Z', updated_at: '2026-03-19T01:00:00Z' },
    { id: 'rep-3-4', restaurant_id: 'rest-3', date: '2026-03-19', sales: 26800, labor_cost_percent: 19.5, customer_count: 450, average_ticket: 59.5, table_turn_time_minutes: 25, food_waste_kg: 4.2, created_at: '2026-03-20T01:00:00Z', updated_at: '2026-03-20T01:00:00Z' },
    { id: 'rep-3-5', restaurant_id: 'rest-3', date: '2026-03-20', sales: 32400, labor_cost_percent: 17.8, customer_count: 540, average_ticket: 60.0, table_turn_time_minutes: 26, food_waste_kg: 5.0, created_at: '2026-03-21T01:00:00Z', updated_at: '2026-03-21T01:00:00Z' },
    { id: 'rep-3-6', restaurant_id: 'rest-3', date: '2026-03-21', sales: 34100, labor_cost_percent: 17.1, customer_count: 565, average_ticket: 60.3, table_turn_time_minutes: 25, food_waste_kg: 4.8, created_at: '2026-03-22T01:00:00Z', updated_at: '2026-03-22T01:00:00Z' },
    { id: 'rep-3-7', restaurant_id: 'rest-3', date: '2026-03-22', sales: 23600, labor_cost_percent: 21.0, customer_count: 390, average_ticket: 60.5, table_turn_time_minutes: 24, food_waste_kg: 2.8, created_at: '2026-03-22T14:00:00Z', updated_at: '2026-03-22T14:00:00Z' }
  ]
};

export const mockDashboardSummaries: Record<string, DashboardSummary> = {
  'rest-1': {
    sales_today: 46800,
    sales_yesterday: 42100,
    employees_on_duty: 4,
    total_shift_staff: 5,
    attendance_rate: 96.5,
    late_count: 1,
    critical_inventory_alerts: 1,
    pending_leave_requests: 1,
    active_orders_count: 3,
    station_coverage: {
      kitchen: 95,
      floor: 100,
      bar: 100,
      stewarding: 88
    }
  },
  'rest-2': {
    sales_today: 61500,
    sales_yesterday: 57800,
    employees_on_duty: 3,
    total_shift_staff: 3,
    attendance_rate: 100,
    late_count: 0,
    critical_inventory_alerts: 1,
    pending_leave_requests: 1,
    active_orders_count: 1,
    station_coverage: {
      kitchen: 92,
      floor: 96,
      bar: 85,
      stewarding: 90
    }
  },
  'rest-3': {
    sales_today: 23600,
    sales_yesterday: 21900,
    employees_on_duty: 2,
    total_shift_staff: 2,
    attendance_rate: 100,
    late_count: 0,
    critical_inventory_alerts: 0,
    pending_leave_requests: 0,
    active_orders_count: 1,
    station_coverage: {
      kitchen: 98,
      floor: 100,
      bar: 90,
      stewarding: 95
    }
  }
};
