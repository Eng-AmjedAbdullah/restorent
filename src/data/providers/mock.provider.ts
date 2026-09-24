/** In-memory, explicitly NON-PRODUCTION Laravel-shaped provider. No real HTTP or secrets. */
import type { DataProvider } from './types';
import type { MockOperationalProvider } from './operational.types';
import { ValidationError, AuthenticationError, AuthorizationError, NotFoundError } from './types';
import type { ApiSuccessResponse } from '@/contracts/backend/envelope';
import type { RestaurantDto, CreateRestaurantRequest, UpdateRestaurantRequest, RestaurantStatus } from '@/contracts/backend/restaurant';
import type { EmployeeDto, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeStatus } from '@/contracts/backend/employee';
import type { PositionDto } from '@/contracts/backend/position';
import type { UserDto, RestaurantMembershipDto } from '@/contracts/backend/user';
import type { LoginCredentialsRequest, LoginResponseData, AuthMeResponseData } from '@/contracts/backend/auth';
import type { Attendance, LeaveRequest, Shift, MenuItem, Order, InventoryItem, ReportMetric, DashboardSummary, AIInsight, OperationalAlert } from '@/types/domain';
import type { DashboardKPIs } from '@/mocks/dashboard';
import { canonicalRestaurants, canonicalEmployees, canonicalPositions, canonicalUsers } from '@/contracts/fixtures/canonicalFixtures';
import { mockOrders } from '@/mocks/orders';
import { mockInventoryItems } from '@/mocks/inventory';
import { mockMenuItems } from '@/mocks/menu';
import { mockAttendances, mockLeaveRequests } from '@/mocks/attendance';
import { mockShifts } from '@/mocks/scheduling';
import { mockReportMetrics, mockDashboardSummaries } from '@/mocks/reports';
import { mockDashboardKPIs } from '@/mocks/dashboard';
import { mockAIInsights, mockAlerts } from '@/mocks/aiInsights';
import { overlappingShifts, validateShiftDraft } from './scheduling.rules';

export const DEMO_PASSWORD = 'Demo!12345';
const SESSION_KEY = 'restoraintel_demo_user';
export interface MockProviderOptions { latencyMs?: number; restoreSession?: boolean }
const copy = <T>(value: T): T => structuredClone(value);
const result = <T>(data: T, message: string): ApiSuccessResponse<T> => ({ status: 'success', message, data: copy(data), meta: [] });
const restaurantStatuses: RestaurantStatus[] = ['active', 'inactive', 'suspended', 'archived'];
const employeeStatuses: EmployeeStatus[] = ['active', 'inactive', 'on_leave', 'terminated', 'suspended'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numericId = (id: number): string => `rest-${id}`;

/** Tests and the Vue app share exactly this implementation through getDataProvider(). */
export class MockDataProvider implements DataProvider, MockOperationalProvider {
  private restaurants = copy(canonicalRestaurants);
  private employees = copy(canonicalEmployees);
  private positions = copy(canonicalPositions);
  private users = copy(canonicalUsers);
  private sessionUserId: number | null = null;
  private authToken: string | null = null;
  private latencyMs: number;
  private orders: Order[] = copy(mockOrders);
  private inventory: InventoryItem[] = copy(mockInventoryItems);
  private menu: MenuItem[] = copy(mockMenuItems);
  private attendance: Attendance[] = copy(mockAttendances);
  private leaves: LeaveRequest[] = copy(mockLeaveRequests);
  private shifts: Shift[] = copy(mockShifts);
  private insights: Record<string, AIInsight[]> = copy(mockAIInsights);
  private alerts: OperationalAlert[] = copy(mockAlerts);
  private readonly initialReports: Record<string, ReportMetric[]> = copy(mockReportMetrics);
  private readonly initialSummaries: Record<string, DashboardSummary> = copy(mockDashboardSummaries);
  private readonly initialKPIs: Record<string, DashboardKPIs> = copy(mockDashboardKPIs);

  constructor(options: MockProviderOptions = {}) {
    this.latencyMs = options.latencyMs ?? 30;
    if (options.restoreSession !== false && typeof sessionStorage !== 'undefined') {
      const id = Number(sessionStorage.getItem(SESSION_KEY));
      const user = this.users.find(u => u.id === id && u.status === 'active');
      if (user) { this.sessionUserId = user.id; this.authToken = `demo-only-${user.id}`; }
    }
  }
  setLatency(ms: number): void {
    if (!Number.isFinite(ms) || ms < 0) throw new RangeError('Latency must be non-negative.');
    this.latencyMs = ms;
  }
  /** Test fixture helper. Not used by active application code. */
  setSimulatedUser(id: number | null): void {
    const user = this.users.find(u => u.id === id && u.status === 'active');
    if (id !== null && !user) throw new AuthenticationError('Inactive or unknown demo persona.');
    this.sessionUserId = id;
    this.authToken = id === null ? null : `test-demo-only-${id}`;
  }
  private async delay(): Promise<void> {
    if (this.latencyMs) await new Promise<void>(resolve => setTimeout(resolve, this.latencyMs));
  }
  private requireUser(): UserDto {
    const user = this.users.find(u => u.id === this.sessionUserId && u.status === 'active');
    if (!this.authToken || !user) throw new AuthenticationError();
    return user;
  }
  private isSystemAdmin(user: UserDto): boolean {
    return Boolean(user.roles?.some(role => role.scope === 'system' &&
      role.permissions?.some(permission => permission.code === 'system.restaurants.manage')));
  }
  private activeMembership(user: UserDto, restaurantId: number): RestaurantMembershipDto | undefined {
    return user.memberships?.find(m => m.restaurant_id === restaurantId && m.status === 'active' &&
      m.joined_at !== null && m.left_at === null);
  }
  private can(user: UserDto, restaurantId: number, permission: string): boolean {
    if (this.isSystemAdmin(user)) return true;
    const membership = this.activeMembership(user, restaurantId);
    return Boolean(membership?.role_assignments?.some(assignment => assignment.role?.permissions?.some(p => p.code === permission)));
  }
  private authorize(restaurantId: number, permission?: string): UserDto {
    const user = this.requireUser();
    if (this.isSystemAdmin(user)) return user;
    if (!this.activeMembership(user, restaurantId)) throw new AuthorizationError();
    if (permission && !this.can(user, restaurantId, permission)) throw new AuthorizationError('Insufficient restaurant permissions.');
    return user;
  }
  private existingRestaurant(id: number): RestaurantDto {
    const rest = this.restaurants.find(r => r.id === id && r.deleted_at === null);
    if (!rest) throw new NotFoundError('Restaurant not found.');
    return rest;
  }
  private assertRestaurantAccess(id: number, permission?: string): void {
    this.requireUser();
    this.existingRestaurant(id);
    this.authorize(id, permission);
  }
  private ensureNoProtectedFields(payload: object, fields: string[]): void {
    const obj = payload as Record<string, unknown>;
    const errors: Record<string, string[]> = {};
    for (const name of fields) if (Object.prototype.hasOwnProperty.call(obj, name)) errors[name] = ['This field is prohibited.'];
    if (Object.keys(errors).length) throw new ValidationError(errors);
  }
  private validateRestaurant(payload: CreateRestaurantRequest | UpdateRestaurantRequest, creating: boolean, existingId?: number): void {
    const errors: Record<string, string[]> = {};
    if (creating && (!payload.name || !payload.name.trim())) errors.name = ['Name is required.'];
    if (payload.name !== undefined && (!payload.name.trim() || payload.name.length > 255)) errors.name = ['Name must contain 1–255 characters.'];
    if (payload.slug != null) {
      if (!/^[a-z0-9-]{1,120}$/.test(payload.slug)) errors.slug = ['Slug must use lowercase letters, numbers and hyphens (up to 120).'];
      else if (this.restaurants.some(r => r.id !== existingId && r.slug === payload.slug && r.deleted_at === null)) errors.slug = ['Slug is already taken.'];
    }
    if (payload.currency_code !== undefined && !/^[A-Z]{3}$/.test(payload.currency_code)) errors.currency_code = ['Use a three-letter uppercase currency code.'];
    if (payload.timezone !== undefined && (payload.timezone.length < 1 || payload.timezone.length > 64)) errors.timezone = ['Timezone must contain 1–64 characters.'];
    if (payload.status !== undefined && !restaurantStatuses.includes(payload.status)) errors.status = ['Invalid restaurant status.'];
    if (Object.keys(errors).length) throw new ValidationError(errors);
  }
  private validateEmployee(restaurantId: number, payload: CreateEmployeeRequest | UpdateEmployeeRequest, currentId?: number): void {
    const errors: Record<string, string[]> = {};
    if (currentId === undefined && (!payload.first_name || !payload.last_name || !payload.status)) {
      if (!payload.first_name) errors.first_name = ['First name is required.'];
      if (!payload.last_name) errors.last_name = ['Last name is required.'];
      if (!payload.status) errors.status = ['Employment status is required.'];
    }
    for (const name of ['first_name', 'last_name'] as const) {
      const value = payload[name];
      if (value !== undefined && (typeof value !== 'string' || !value.trim() || value.length > 100)) errors[name] = ['Name must contain 1–100 characters.'];
    }
    if (payload.status !== undefined && !employeeStatuses.includes(payload.status)) errors.status = ['Invalid employment status.'];
    if (payload.employee_number != null) {
      if (!/^[A-Za-z0-9-]{1,64}$/.test(payload.employee_number)) errors.employee_number = ['Invalid employee number.'];
      else if (this.employees.some(e => e.id !== currentId && e.restaurant_id === restaurantId && e.employee_number === payload.employee_number)) errors.employee_number = ['Employee number already in use.'];
    }
    if (payload.email != null && payload.email !== '' && (payload.email.length > 255 || !emailPattern.test(payload.email))) errors.email = ['Enter a valid email address.'];
    if (payload.phone != null && payload.phone.length > 32) errors.phone = ['Phone exceeds 32 characters.'];
    if (payload.user_id != null && !this.users.some(u => u.id === payload.user_id)) errors.user_id = ['User does not exist.'];
    if (payload.position_id != null && !this.positions.some(p => p.id === payload.position_id && p.restaurant_id === restaurantId)) errors.position_id = ['Position must belong to the selected restaurant.'];
    const hire = payload.hire_date;
    const termination = 'termination_date' in payload ? payload.termination_date : undefined;
    if (hire && !/^\d{4}-\d{2}-\d{2}$/.test(hire)) errors.hire_date = ['Use YYYY-MM-DD.'];
    if (termination && (!/^\d{4}-\d{2}-\d{2}$/.test(termination) || (hire && termination < hire))) errors.termination_date = ['Termination date must be on or after hire date.'];
    if (Object.keys(errors).length) throw new ValidationError(errors);
  }

  async login(credentials: LoginCredentialsRequest): Promise<ApiSuccessResponse<LoginResponseData>> {
    await this.delay();
    if (!credentials.email?.trim() || !credentials.password) {
      const errors: Record<string, string[]> = {};
      if (!credentials.email?.trim()) errors.email = ['Email is required.'];
      if (!credentials.password) errors.password = ['Password is required.'];
      throw new ValidationError(errors);
    }
    const user = this.users.find(u => u.email.toLowerCase() === credentials.email.trim().toLowerCase());
    if (credentials.password !== DEMO_PASSWORD || !user || user.status !== 'active') throw new AuthenticationError('Invalid demo credentials or inactive account.');
    this.sessionUserId = user.id;
    this.authToken = `demo-only-${user.id}`;
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(SESSION_KEY, String(user.id));
    const active = user.memberships?.find(m => m.status === 'active' && m.left_at === null);
    const restaurant = active ? this.restaurants.find(r => r.id === active.restaurant_id) ?? null : null;
    return result({ token: this.authToken, token_type: 'Bearer', user, restaurant }, 'Demo session opened.');
  }
  async logout(): Promise<ApiSuccessResponse<{ message: string }>> {
    await this.delay();
    this.authToken = null;
    this.sessionUserId = null;
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(SESSION_KEY);
    return result({ message: 'Demo session ended.' }, 'Logged out.');
  }
  async checkAuthMe(): Promise<ApiSuccessResponse<AuthMeResponseData>> {
    await this.delay();
    return result(this.requireUser(), 'Authenticated demo user retrieved.');
  }
  async listRestaurants(): Promise<ApiSuccessResponse<RestaurantDto[]>> {
    await this.delay();
    const user = this.requireUser();
    const items = this.restaurants.filter(r => r.deleted_at === null &&
      (this.isSystemAdmin(user) || Boolean(this.activeMembership(user, r.id))));
    return result(items, 'Accessible restaurants retrieved.');
  }
  async getRestaurant(id: number): Promise<ApiSuccessResponse<RestaurantDto>> {
    await this.delay();
    this.assertRestaurantAccess(id);
    return result(this.existingRestaurant(id), 'Restaurant retrieved.');
  }
  async createRestaurant(payload: CreateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>> {
    await this.delay();
    const user = this.requireUser();
    if (!this.isSystemAdmin(user)) throw new AuthorizationError('System restaurant management permission required.');
    this.ensureNoProtectedFields(payload, ['id', 'restaurant_id', 'created_at', 'updated_at', 'deleted_at']);
    this.validateRestaurant(payload, true);
    const id = Math.max(0, ...this.restaurants.map(r => r.id)) + 1;
    const now = new Date().toISOString();
    const slug = payload.slug ?? `rest-${id}`;
    if (this.restaurants.some(r => r.slug === slug && r.deleted_at === null)) throw new ValidationError({ slug: ['Slug is already taken.'] });
    const item: RestaurantDto = { id, name: payload.name.trim(), slug, status: payload.status ?? 'active', timezone: payload.timezone ?? 'UTC',
      currency_code: payload.currency_code ?? 'SAR', city: payload.city ?? null, address: payload.address ?? null,
      created_at: now, updated_at: now, deleted_at: null };
    this.restaurants.push(item);
    return result(item, 'Restaurant created.');
  }
  async updateRestaurant(id: number, payload: UpdateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>> {
    await this.delay();
    this.assertRestaurantAccess(id, 'restaurant.profile.manage_self');
    this.ensureNoProtectedFields(payload, ['id', 'restaurant_id', 'created_at', 'updated_at', 'deleted_at']);
    this.validateRestaurant(payload, false, id);
    const item = this.existingRestaurant(id);
    const updated: RestaurantDto = { ...item, ...payload, name: payload.name?.trim() ?? item.name, updated_at: new Date().toISOString() };
    this.restaurants[this.restaurants.indexOf(item)] = updated;
    return result(updated, 'Restaurant updated.');
  }
  async listEmployees(restaurantId: number): Promise<ApiSuccessResponse<EmployeeDto[]>> {
    await this.delay(); this.assertRestaurantAccess(restaurantId);
    return result(this.employees.filter(e => e.restaurant_id === restaurantId && e.deleted_at === null), 'Employees retrieved.');
  }
  async getEmployee(restaurantId: number, employeeId: number): Promise<ApiSuccessResponse<EmployeeDto>> {
    await this.delay(); this.assertRestaurantAccess(restaurantId);
    const item = this.employees.find(e => e.id === employeeId && e.restaurant_id === restaurantId && e.deleted_at === null);
    if (!item) throw new NotFoundError('Employee not found.');
    return result(item, 'Employee retrieved.');
  }
  async createEmployee(restaurantId: number, payload: CreateEmployeeRequest): Promise<ApiSuccessResponse<EmployeeDto>> {
    await this.delay(); this.assertRestaurantAccess(restaurantId, 'restaurant.employees.manage');
    this.ensureNoProtectedFields(payload, ['id', 'restaurant_id', 'created_at', 'updated_at', 'deleted_at']);
    this.validateEmployee(restaurantId, payload);
    const id = Math.max(0, ...this.employees.map(e => e.id)) + 1;
    const now = new Date().toISOString();
    const item: EmployeeDto = { id, restaurant_id: restaurantId, user_id: payload.user_id ?? null,
      position_id: payload.position_id ?? null, employee_number: payload.employee_number ?? `EMP-${String(id).padStart(4, '0')}`,
      first_name: payload.first_name.trim(), last_name: payload.last_name.trim(), email: payload.email || null,
      phone: payload.phone || null, hire_date: payload.hire_date ?? null, termination_date: null,
      status: payload.status, created_at: now, updated_at: now, deleted_at: null,
      position: this.positions.find(p => p.id === payload.position_id && p.restaurant_id === restaurantId) ?? null };
    this.employees.unshift(item);
    return result(item, 'Employee created.');
  }
  async updateEmployee(restaurantId: number, employeeId: number, payload: UpdateEmployeeRequest): Promise<ApiSuccessResponse<EmployeeDto>> {
    await this.delay(); this.assertRestaurantAccess(restaurantId, 'restaurant.employees.manage');
    this.ensureNoProtectedFields(payload, ['id', 'restaurant_id', 'created_at', 'updated_at', 'deleted_at']);
    const item = this.employees.find(e => e.id === employeeId && e.restaurant_id === restaurantId && e.deleted_at === null);
    if (!item) throw new NotFoundError('Employee not found.');
    this.validateEmployee(restaurantId, payload, employeeId);
    const hire_date = payload.hire_date === undefined ? item.hire_date : payload.hire_date;
    const termination_date = payload.termination_date === undefined ? item.termination_date : payload.termination_date;
    if (hire_date && termination_date && termination_date < hire_date) throw new ValidationError({ termination_date: ['Termination date precedes hire date.'] });
    const updated: EmployeeDto = { ...item, ...payload, first_name: payload.first_name?.trim() ?? item.first_name,
      last_name: payload.last_name?.trim() ?? item.last_name, updated_at: new Date().toISOString(),
      position: payload.position_id === undefined ? item.position :
        this.positions.find(p => p.id === payload.position_id && p.restaurant_id === restaurantId) ?? null };
    this.employees[this.employees.indexOf(item)] = updated;
    return result(updated, 'Employee updated.');
  }

  /** These operations implement UI-only DEMO features; no corresponding Laravel endpoints are asserted. */
  async mockListPositions(restaurantId: number): Promise<PositionDto[]> {
    await this.delay(); this.assertRestaurantAccess(restaurantId);
    return copy(this.positions.filter(p => p.restaurant_id === restaurantId));
  }
  private opKey(id: number): string { return numericId(id); }
  async mockGetAttendance(id: number): Promise<Attendance[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.attendance.filter(a => a.restaurant_id === this.opKey(id)));
  }
  async mockClockIn(id: number, employeeId: number, time?: string): Promise<Attendance> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.attendance.manage');
    const employee = this.employees.find(e => e.id === employeeId && e.restaurant_id === id && e.deleted_at === null);
    if (!employee) throw new ValidationError({ employee_id: ['Employee must belong to the active restaurant.'] });
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: this.existingRestaurant(id).timezone,
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const parts = Object.fromEntries(formatter.formatToParts(now).map(p => [p.type, p.value]));
    const date = `${parts.year}-${parts.month}-${parts.day}`;
    const clockTime = time ?? `${parts.hour}:${parts.minute}`;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(clockTime)) throw new ValidationError({ time: ['Use HH:mm.'] });
    const late = Math.max(0, Number(clockTime.slice(0, 2)) * 60 + Number(clockTime.slice(3)) - 480);
    const rec: Attendance = { id: `att-demo-${Math.max(0, ...this.attendance.map(a => Number(a.id.replace(/\D/g, '')) || 0)) + 1}`,
      restaurant_id: this.opKey(id), employee_id: `emp-${employeeId}`, date, scheduled_start: '08:00', scheduled_end: '16:30',
      actual_clock_in: clockTime, break_duration_minutes: 0, late_minutes: late, overtime_minutes: 0,
      status: late > 0 ? 'late' : 'on_time', device_source: 'manual_override', created_at: now.toISOString(), updated_at: now.toISOString() };
    this.attendance.unshift(rec);
    return copy(rec);
  }
  async mockExcuseAttendance(id: number, recordId: string, reason: string): Promise<Attendance> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.attendance.manage');
    const item = this.attendance.find(a => a.id === recordId && a.restaurant_id === this.opKey(id));
    if (!item) throw new NotFoundError('Attendance record not found.');
    if (!reason.trim()) throw new ValidationError({ manager_notes: ['Reason is required.'] });
    const user = this.requireUser();
    item.status = 'excused'; item.manager_override_by = `usr-${user.id}`;
    item.manager_notes = reason.trim(); item.updated_at = new Date().toISOString();
    return copy(item);
  }
  async mockGetLeaveRequests(id: number): Promise<LeaveRequest[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.leaves.filter(l => l.restaurant_id === this.opKey(id)));
  }
  async mockDecideLeave(id: number, leaveId: string, decision: 'approved' | 'rejected', reason?: string): Promise<LeaveRequest> {
    await this.delay(); const user = this.authorize(id, 'restaurant.leave.manage');
    const item = this.leaves.find(l => l.id === leaveId && l.restaurant_id === this.opKey(id));
    if (!item) throw new NotFoundError('Leave request not found.');
    if (item.status !== 'pending') throw new ValidationError({ status: ['Only pending requests can be decided.'] });
    if (decision === 'rejected' && !reason?.trim()) throw new ValidationError({ rejection_reason: ['A rejection reason is required.'] });
    item.status = decision; item.rejection_reason = decision === 'rejected' ? reason!.trim() : undefined;
    item.actioned_by = `usr-${user.id}`; item.actioned_at = new Date().toISOString(); item.updated_at = item.actioned_at;
    return copy(item);
  }
  async mockGetShifts(id: number): Promise<Shift[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.shifts.filter(s => s.restaurant_id === this.opKey(id)));
  }
  async mockCreateShift(id: number, input: Omit<Shift, 'id' | 'created_at' | 'updated_at'>): Promise<Shift> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.shifts.manage');
    const employee = this.employees.find(e => e.id === Number(input.employee_id.replace(/^emp-/, '')) &&
      e.restaurant_id === id && e.deleted_at === null);
    if (input.restaurant_id !== this.opKey(id) || !employee)
      throw new ValidationError({ employee_id: ['Employee and shift must belong to the active restaurant.'] });
    if (employee.status !== 'active')
      throw new ValidationError({ employee_id: ['Only active employees can be scheduled.'] });
    if (!input.shift_name.ar.trim() || !input.shift_name.en.trim())
      throw new ValidationError({ shift_name: ['The shift name is required.'] });
    const errors = validateShiftDraft(input);
    if (Object.keys(errors).length) throw new ValidationError(errors);
    const conflict = overlappingShifts(input, this.shifts.filter(s => s.restaurant_id === this.opKey(id)));
    if (conflict.length) throw new ValidationError({ time: [`Employee already has an overlapping shift (${conflict[0].start_time}–${conflict[0].end_time}).`] });
    const approvedLeave = this.leaves.some(leave => leave.restaurant_id === this.opKey(id) &&
      leave.employee_id === input.employee_id && leave.status === 'approved' &&
      input.date >= leave.start_date && input.date <= leave.end_date);
    if (approvedLeave) throw new ValidationError({ date: ['Employee has an approved leave covering this shift.'] });
    const now = new Date().toISOString();
    const item: Shift = { ...input, id: `shf-demo-${this.shifts.length + 1}`, created_at: now, updated_at: now };
    this.shifts.push(item); return copy(item);
  }
  async mockGetMenu(id: number): Promise<MenuItem[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.menu.filter(m => m.restaurant_id === this.opKey(id)));
  }
  async mockToggleMenuAvailability(id: number, itemId: string): Promise<MenuItem> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.menu.manage');
    const item = this.menu.find(m => m.id === itemId && m.restaurant_id === this.opKey(id));
    if (!item) throw new NotFoundError('Menu item not found.');
    item.is_available = !item.is_available; item.updated_at = new Date().toISOString(); return copy(item);
  }
  async mockAddMenuItem(id: number, input: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.menu.manage');
    if (input.restaurant_id !== this.opKey(id) || !input.name.ar.trim() || !input.name.en.trim() || !Number.isFinite(input.price) || input.price < 0 || !Number.isFinite(input.cost) || input.cost < 0)
      throw new ValidationError({ item: ['Invalid item name, tenant, price or cost.'] });
    const now = new Date().toISOString();
    const item: MenuItem = { ...input, id: `menu-demo-${this.menu.length + 1}`, created_at: now, updated_at: now };
    this.menu.unshift(item); return copy(item);
  }
  async mockGetOrders(id: number): Promise<Order[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.orders.filter(o => o.restaurant_id === this.opKey(id)));
  }
  async mockUpdateOrderStatus(id: number, orderId: string, status: Order['status']): Promise<Order> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.orders.manage');
    const order = this.orders.find(o => o.id === orderId && o.restaurant_id === this.opKey(id));
    if (!order) throw new NotFoundError('Order not found.');
    const next: Partial<Record<Order['status'], Order['status']>> = { new: 'preparing', preparing: 'ready', ready: 'delivered' };
    if (next[order.status] !== status) throw new ValidationError({ status: ['Invalid order status transition.'] });
    order.status = status; order.updated_at = new Date().toISOString(); return copy(order);
  }
  async mockToggleOrderItem(id: number, orderId: string, itemId: string): Promise<Order> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.orders.manage');
    const order = this.orders.find(o => o.id === orderId && o.restaurant_id === this.opKey(id));
    if (!order) throw new NotFoundError('Order not found.');
    const item = order.items.find(i => i.id === itemId);
    if (!item) throw new NotFoundError('Order item not found.');
    item.is_prepared = !item.is_prepared; order.updated_at = new Date().toISOString(); return copy(order);
  }
  async mockGetInventory(id: number): Promise<InventoryItem[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.inventory.filter(i => i.restaurant_id === this.opKey(id)));
  }
  async mockUpdateStock(id: number, itemId: string, stock: number): Promise<InventoryItem> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.inventory.manage');
    const item = this.inventory.find(i => i.id === itemId && i.restaurant_id === this.opKey(id));
    if (!item) throw new NotFoundError('Inventory item not found.');
    if (!Number.isFinite(stock) || stock < 0) throw new ValidationError({ current_stock: ['Stock must be a non-negative number.'] });
    item.current_stock = stock;
    item.status = stock === 0 ? 'out_of_stock' : stock <= item.reorder_point * 0.5 ? 'critical' : stock <= item.reorder_point ? 'low_stock' : 'in_stock';
    item.updated_at = new Date().toISOString(); item.last_restocked_at = item.updated_at;
    return copy(item);
  }
  async mockGetReports(id: number): Promise<ReportMetric[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.initialReports[this.opKey(id)] ?? []);
  }
  async mockGetSummary(id: number): Promise<DashboardSummary | null> {
    await this.delay(); this.assertRestaurantAccess(id);
    const seed = this.initialSummaries[this.opKey(id)];
    if (!seed) return null;
    const key = this.opKey(id);
    // Financial snapshots follow the latest *sample* report date for this restaurant;
    // these fields must never be represented to users as live calendar-day sales.
    const reports = [...(this.initialReports[key] ?? [])].sort((a, b) => a.date.localeCompare(b.date));
    const latest = reports.at(-1);
    const previous = reports.at(-2);
    const sampleDate = latest?.date ?? '';
    const dailyAttendance = this.attendance.filter(a => a.restaurant_id === key && a.date === sampleDate);
    const eligible = dailyAttendance.filter(a => ['on_time', 'late', 'early_leave', 'absent'].includes(a.status));
    const onDuty = dailyAttendance.filter(a => a.status === 'active_shift');
    return copy({ ...seed,
      sales_today: latest?.sales ?? 0,
      sales_yesterday: previous?.sales ?? 0,
      employees_on_duty: new Set(onDuty.map(a => a.employee_id)).size,
      total_shift_staff: new Set(dailyAttendance.map(a => a.employee_id)).size,
      attendance_rate: eligible.length ? Math.round(eligible.filter(a => a.status === 'on_time').length / eligible.length * 100) : 0,
      late_count: dailyAttendance.filter(a => a.status === 'late').length,
      pending_leave_requests: this.leaves.filter(l => l.restaurant_id === key && l.status === 'pending').length,
      critical_inventory_alerts: this.inventory.filter(i => i.restaurant_id === key && ['critical', 'out_of_stock'].includes(i.status)).length,
      active_orders_count: this.orders.filter(o => o.restaurant_id === key && !['delivered', 'cancelled'].includes(o.status)).length });
  }
  async mockGetKPIs(id: number): Promise<DashboardKPIs | null> {
    await this.delay(); this.assertRestaurantAccess(id);
    const key = this.opKey(id);
    const snapshot = this.initialKPIs[key];
    if (!snapshot) return null;
    const reports = [...(this.initialReports[key] ?? [])].sort((a, b) => a.date.localeCompare(b.date));
    const latest = reports.at(-1);
    const previous = reports.at(-2);
    return copy({ ...snapshot,
      averageTicket: latest?.average_ticket ?? 0,
      revenueGrowth: previous && previous.sales !== 0 && latest ?
        Math.round((latest.sales - previous.sales) / previous.sales * 1000) / 10 : 0 });
  }
  async mockGetInsights(id: number): Promise<AIInsight[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.insights[this.opKey(id)] ?? []);
  }
  async mockUpdateInsight(id: number, insightId: string, status: AIInsight['status']): Promise<AIInsight> {
    await this.delay(); this.assertRestaurantAccess(id, 'restaurant.ai.forecasting.use');
    const item = this.insights[this.opKey(id)]?.find(i => i.id === insightId);
    if (!item) throw new NotFoundError('Insight not found.');
    if (item.status !== 'pending' || !['accepted', 'rejected'].includes(status)) throw new ValidationError({ status: ['Unsupported recommendation transition.'] });
    item.status = status; item.updated_at = new Date().toISOString(); return copy(item);
  }
  async mockGetAlerts(id: number): Promise<OperationalAlert[]> {
    await this.delay(); this.assertRestaurantAccess(id);
    return copy(this.alerts.filter(a => a.restaurant_id === this.opKey(id)));
  }
  async mockMarkAlertRead(id: number, alertId: string): Promise<OperationalAlert> {
    await this.delay(); this.assertRestaurantAccess(id);
    const item = this.alerts.find(a => a.id === alertId && a.restaurant_id === this.opKey(id));
    if (!item) throw new NotFoundError('Alert not found.');
    item.read = true; item.updated_at = new Date().toISOString(); return copy(item);
  }
  async mockMarkAllAlertsRead(id: number): Promise<void> {
    await this.delay(); this.assertRestaurantAccess(id);
    for (const item of this.alerts) if (item.restaurant_id === this.opKey(id)) { item.read = true; item.updated_at = new Date().toISOString(); }
  }
}
