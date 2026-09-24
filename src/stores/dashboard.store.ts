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

  // Live KPI Computations exactly preserving React Dashboard calculations
  const salesToday = computed(() => {
    return summary.value?.sales_today || 42150;
  });

  const employeesWorking = computed(() => {
    return employees.value.filter(e => e.status === 'on_shift').length;
  });

  const totalEmployees = computed(() => {
    return employees.value.length;
  });

  const lateAttendance = computed(() => {
    return attendance.value.filter(a => a.status === 'late').length;
  });

  const attendanceRate = computed(() => {
    const total = attendance.value.length || 1;
    return Math.round(((attendance.value.length - lateAttendance.value) / total) * 100);
  });

  const lowStockCount = computed(() => {
    return inventory.value.filter(i => i.status === 'critical' || i.status === 'low_stock').length;
  });

  const pendingRequestsCount = computed(() => {
    return leaveRequests.value.filter(l => l.status === 'pending').length;
  });

  async function fetchDashboardData(restaurantId: string): Promise<void> {
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
      isLoading.value = false;
    }
  }

  async function acceptInsight(id: string): Promise<void> {
    try {
      const updated = await aiInsightService.updateInsightStatus(id, 'accepted');
      const idx = insights.value.findIndex(i => i.id === id);
      if (idx !== -1) {
        insights.value[idx] = updated;
      }
    } catch (err) {
      console.error('[DashboardStore] Failed to accept insight:', err);
    }
  }

  async function rejectInsight(id: string): Promise<void> {
    try {
      const updated = await aiInsightService.updateInsightStatus(id, 'rejected');
      const idx = insights.value.findIndex(i => i.id === id);
      if (idx !== -1) {
        insights.value[idx] = updated;
      }
    } catch (err) {
      console.error('[DashboardStore] Failed to reject insight:', err);
    }
  }

  async function markAlertAsRead(id: string): Promise<void> {
    try {
      const updated = await aiInsightService.markAlertRead(id);
      const idx = alerts.value.findIndex(a => a.id === id);
      if (idx !== -1) {
        alerts.value[idx] = updated;
      }
    } catch (err) {
      console.error('[DashboardStore] Failed to mark alert as read:', err);
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
    salesToday,
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
