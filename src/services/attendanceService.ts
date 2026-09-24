import type { Attendance, LeaveRequest } from '@/types/domain';
import { mockAttendances, mockLeaveRequests } from '@/mocks/attendance';
import { mockEmployees } from '@/mocks/employees';

let attendanceState: Attendance[] = JSON.parse(JSON.stringify(mockAttendances));
let leaveRequestsState: LeaveRequest[] = JSON.parse(JSON.stringify(mockLeaveRequests));

export const attendanceService = {
  async getAttendances(restaurantId: string): Promise<Attendance[]> {
    if (!restaurantId) return [];
    const list = attendanceState.filter(a => a.restaurant_id === restaurantId);
    const enriched = list.map(item => {
      const emp = item.employee || mockEmployees.find(e => e.id === item.employee_id);
      return { ...item, employee: emp };
    });
    return JSON.parse(JSON.stringify(enriched));
  },

  async recordClockIn(employeeId: string, restaurantId: string): Promise<Attendance> {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const dateStr = now.toISOString().split('T')[0];

    const newRecord: Attendance = {
      id: `att-${Date.now()}`,
      restaurant_id: restaurantId,
      employee_id: employeeId,
      date: dateStr,
      scheduled_start: '08:00',
      scheduled_end: '16:30',
      actual_clock_in: timeStr,
      break_duration_minutes: 0,
      late_minutes: 0,
      overtime_minutes: 0,
      status: 'active_shift',
      device_source: 'mobile_geofence',
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };
    attendanceState.unshift(newRecord);
    return JSON.parse(JSON.stringify(newRecord));
  },

  async getLeaveRequests(restaurantId: string): Promise<LeaveRequest[]> {
    const list = leaveRequestsState.filter(l => l.restaurant_id === restaurantId);
    return JSON.parse(JSON.stringify(list));
  },

  async approveLeaveRequest(id: string): Promise<LeaveRequest> {
    const index = leaveRequestsState.findIndex(l => l.id === id);
    if (index === -1) throw new Error(`Leave request ${id} not found`);
    leaveRequestsState[index].status = 'approved';
    leaveRequestsState[index].updated_at = new Date().toISOString();
    return JSON.parse(JSON.stringify(leaveRequestsState[index]));
  },

  async rejectLeaveRequest(id: string, reason?: string): Promise<LeaveRequest> {
    const index = leaveRequestsState.findIndex(l => l.id === id);
    if (index === -1) throw new Error(`Leave request ${id} not found`);
    leaveRequestsState[index].status = 'rejected';
    leaveRequestsState[index].rejection_reason = reason;
    leaveRequestsState[index].updated_at = new Date().toISOString();
    return JSON.parse(JSON.stringify(leaveRequestsState[index]));
  }
};
