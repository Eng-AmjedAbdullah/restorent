import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
  DashboardSummary,
  ReportMetric,
  Employee,
  Attendance,
  LeaveRequest,
  InventoryItem,
  Order,
  AIInsight,
  OperationalAlert
} from '@/types/domain';
import type { DashboardKPIs } from '@/mocks/dashboard';
import { reportService } from '@/services/reportService';
import { employeeService } from '@/services/employeeService';
import { attendanceService } from '@/services/attendanceService';
import { inventoryService } from '@/services/inventoryService';
import { orderService } from '@/services/orderService';
import { aiInsightService } from '@/services/aiInsightService';

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null);
  const metrics = ref<ReportMetric[]>([]);
  const kpis = ref<DashboardKPIs | null>(null);
  const employees = ref<Employee[]>([]);
  const attendance = ref<Attendance[]>([]);
  const leaveRequests = ref<LeaveRequest[]>([]);
  const inventory = ref<InventoryItem[]>([]);
  const orders = ref<Order[]>([]);
  const insights = ref<AIInsight[]>([]);
  const alerts = ref<OperationalAlert[]>([]);
  const isLoading = ref<boolean>(false);

  // Demo snapshot KPIs: operational counts are computed from the shared mock provider.
  const salesToday = computed(() => {
    return summary.value?.sales_today ?? 0;
  });

  /** Historical snapshot, never the current date unless sample data happens to include it. */
  const sampleSalesDate = computed(() => metrics.value.reduce((last, item) => item.date > last ? item.date : last, ''));

  const employeesWorking = computed(() => {
    return new Set(attendance.value.filter(a => a.status === 'active_shift').map(a => a.employee_id)).size;
  });

  const totalEmployees = computed(() => {
    return employees.value.length;
  });

  const lateAttendance = computed(() => {
    return attendance.value.filter(a => a.status === 'late').length;
  });

  const attendanceRate = computed(() => {
    const eligible = attendance.value.filter(a => ['on_time', 'late', 'early_leave', 'absent'].includes(a.status));
    return eligible.length ? Math.round(eligible.filter(a => a.status === 'on_time').length / eligible.length * 100) : 0;
  });

  const lowStockCount = computed(() => {
    return inventory.value.filter(i => i.status === 'critical' || i.status === 'low_stock').length;
  });

  const pendingRequestsCount = computed(() => {
    return leaveRequests.value.filter(l => l.status === 'pending').length;
  });

  let requestGeneration = 0;
  const selectedRestaurantId = ref<string | null>(null);
  async function fetchDashboardData(restaurantId: string): Promise<void> {
    const generation = ++requestGeneration;
    selectedRestaurantId.value = restaurantId || null;
    if (!restaurantId) {
      summary.value = null;
      metrics.value = [];
      kpis.value = null;
      employees.value = [];
      attendance.value = [];
      leaveRequests.value = [];
      inventory.value = [];
      orders.value = [];
      insights.value = [];
      alerts.value = [];
      return;
    }
    isLoading.value = true;
    try {
      const [
        sum,
        repMetrics,
        dashboardKpis,
        empList,
        attList,
        leavesList,
        invList,
        ordList,
        aiList,
        altList
      ] = await Promise.all([
        reportService.getDashboardSummary(restaurantId),
        reportService.getReportMetrics(restaurantId),
        reportService.getDashboardKPIs(restaurantId),
        employeeService.getEmployees(restaurantId),
        attendanceService.getAttendances(restaurantId),
        attendanceService.getLeaveRequests(restaurantId),
        inventoryService.getInventoryItems(restaurantId),
        orderService.getOrders(restaurantId),
        aiInsightService.getInsights(restaurantId),
        aiInsightService.getAlerts(restaurantId)
      ]);

      if (generation !== requestGeneration) return;
      summary.value = sum;
      metrics.value = repMetrics;
      kpis.value = dashboardKpis;
      employees.value = empList;
      attendance.value = attList;
      leaveRequests.value = leavesList;
      inventory.value = invList;
      orders.value = ordList;
      insights.value = aiList;
      alerts.value = altList;
    } catch (error) {
      console.error('[DashboardStore] Failed to load dashboard data:', error);
    } finally {
      if (generation === requestGeneration) isLoading.value = false;
    }
  }

  async function acceptInsight(id: string): Promise<void> {
    try {
      const restaurantId = selectedRestaurantId.value;
      if (!restaurantId) throw new Error('Choose a restaurant.');
      const updated = await aiInsightService.updateInsightStatus(restaurantId, id, 'accepted');
      if (selectedRestaurantId.value !== restaurantId) return;
      const idx = insights.value.findIndex(i => i.id === id);
      if (idx !== -1) {
        insights.value[idx] = updated;
      }
    } catch (err) {
      console.error('[DashboardStore] Failed to accept insight:', err);
      throw err;
    }
  }

  async function rejectInsight(id: string): Promise<void> {
    try {
      const restaurantId = selectedRestaurantId.value;
      if (!restaurantId) throw new Error('Choose a restaurant.');
      const updated = await aiInsightService.updateInsightStatus(restaurantId, id, 'rejected');
      if (selectedRestaurantId.value !== restaurantId) return;
      const idx = insights.value.findIndex(i => i.id === id);
      if (idx !== -1) {
        insights.value[idx] = updated;
      }
    } catch (err) {
      console.error('[DashboardStore] Failed to reject insight:', err);
      throw err;
    }
  }

  async function markAlertAsRead(id: string): Promise<void> {
    try {
      const restaurantId = selectedRestaurantId.value;
      if (!restaurantId) throw new Error('Choose a restaurant.');
      const updated = await aiInsightService.markAlertRead(restaurantId, id);
      if (selectedRestaurantId.value !== restaurantId) return;
      const idx = alerts.value.findIndex(a => a.id === id);
      if (idx !== -1) {
        alerts.value[idx] = updated;
      }
    } catch (err) {
      console.error('[DashboardStore] Failed to mark alert as read:', err);
      throw err;
    }
  }

  return {
    summary,
    metrics,
    kpis,
    employees,
    attendance,
    leaveRequests,
    inventory,
    orders,
    insights,
    alerts,
    isLoading,
    selectedRestaurantId,
    salesToday,
    sampleSalesDate,
    employeesWorking,
    totalEmployees,
    lateAttendance,
    attendanceRate,
    lowStockCount,
    pendingRequestsCount,
    fetchDashboardData,
    acceptInsight,
    rejectInsight,
    markAlertAsRead
  };
});
