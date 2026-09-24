/** These UI-only mock operations are NOT claims that matching Laravel endpoints exist. */
import type { PositionDto } from '@/contracts/backend/position';
import type { Attendance, LeaveRequest, Shift, MenuItem, Order, InventoryItem, ReportMetric, DashboardSummary, AIInsight, OperationalAlert } from '@/types/domain';
import type { DashboardKPIs } from '@/mocks/dashboard';

export interface MockOperationalProvider {
  mockListPositions(restaurantId: number): Promise<PositionDto[]>;
  mockGetAttendance(restaurantId: number): Promise<Attendance[]>;
  mockClockIn(restaurantId: number, employeeId: number, time?: string): Promise<Attendance>;
  mockExcuseAttendance(restaurantId: number, recordId: string, reason: string): Promise<Attendance>;
  mockGetLeaveRequests(restaurantId: number): Promise<LeaveRequest[]>;
  mockDecideLeave(restaurantId: number, leaveId: string, decision: 'approved' | 'rejected', reason?: string): Promise<LeaveRequest>;
  mockGetShifts(restaurantId: number): Promise<Shift[]>;
  mockCreateShift(restaurantId: number, data: Omit<Shift, 'id' | 'created_at' | 'updated_at'>): Promise<Shift>;
  mockGetMenu(restaurantId: number): Promise<MenuItem[]>;
  mockToggleMenuAvailability(restaurantId: number, id: string): Promise<MenuItem>;
  mockAddMenuItem(restaurantId: number, item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem>;
  mockGetOrders(restaurantId: number): Promise<Order[]>;
  mockUpdateOrderStatus(restaurantId: number, id: string, status: Order['status']): Promise<Order>;
  mockToggleOrderItem(restaurantId: number, orderId: string, itemId: string): Promise<Order>;
  mockGetInventory(restaurantId: number): Promise<InventoryItem[]>;
  mockUpdateStock(restaurantId: number, id: string, stock: number): Promise<InventoryItem>;
  mockGetReports(restaurantId: number): Promise<ReportMetric[]>;
  mockGetSummary(restaurantId: number): Promise<DashboardSummary | null>;
  mockGetKPIs(restaurantId: number): Promise<DashboardKPIs | null>;
  mockGetInsights(restaurantId: number): Promise<AIInsight[]>;
  mockUpdateInsight(restaurantId: number, id: string, status: AIInsight['status']): Promise<AIInsight>;
  mockGetAlerts(restaurantId: number): Promise<OperationalAlert[]>;
  mockMarkAlertRead(restaurantId: number, id: string): Promise<OperationalAlert>;
  mockMarkAllAlertsRead(restaurantId: number): Promise<void>;
}
