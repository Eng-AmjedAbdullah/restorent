/** Mock-only operational service; these are not published Laravel endpoints. */
import type { Attendance, LeaveRequest } from '@/types/domain';
import { getMockOperations } from '@/data/providers';
import { wireId } from '@/data/adapters/legacy-view';
import { employeeService } from './employeeService';
export const attendanceService = {
  async getAttendances(restaurantId: string): Promise<Attendance[]> {
    const rows = await getMockOperations().mockGetAttendance(wireId(restaurantId, 'rest'));
    const employees = await employeeService.getEmployees(restaurantId);
    return rows.map(row => ({ ...row, employee: employees.find(e => e.id === row.employee_id) }));
  },
  async recordClockIn(employeeId: string, restaurantId: string, time?: string): Promise<Attendance> {
    return getMockOperations().mockClockIn(wireId(restaurantId, 'rest'), wireId(employeeId, 'emp'), time);
  },
  async excuseAttendance(restaurantId: string, recordId: string, reason: string): Promise<Attendance> {
    return getMockOperations().mockExcuseAttendance(wireId(restaurantId, 'rest'), recordId, reason);
  },
  async getLeaveRequests(restaurantId: string): Promise<LeaveRequest[]> {
    const rows = await getMockOperations().mockGetLeaveRequests(wireId(restaurantId, 'rest'));
    const employees = await employeeService.getEmployees(restaurantId);
    return rows.map(row => ({ ...row, employee: employees.find(e => e.id === row.employee_id) }));
  },
  async approveLeaveRequest(restaurantId: string, id: string): Promise<LeaveRequest> {
    return getMockOperations().mockDecideLeave(wireId(restaurantId, 'rest'), id, 'approved');
  },
  async rejectLeaveRequest(restaurantId: string, id: string, reason: string): Promise<LeaveRequest> {
    return getMockOperations().mockDecideLeave(wireId(restaurantId, 'rest'), id, 'rejected', reason);
  },
};
