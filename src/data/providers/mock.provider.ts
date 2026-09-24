/**
 * Mock Data Provider
 *
 * Implements the DataProvider interface using authoritative canonical fixtures.
 * Reproduces Laravel API response envelopes and HTTP status error categories.
 * Provides deterministic in-memory state mutations.
 */

import type {
  DataProvider,
} from './types';
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} from './types';
import type {
  ApiSuccessResponse,
} from '@/contracts/backend/envelope';
import type {
  RestaurantDto,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from '@/contracts/backend/restaurant';
import type {
  EmployeeDto,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from '@/contracts/backend/employee';
import type { PositionDto } from '@/contracts/backend/position';
import type {
  LoginCredentialsRequest,
  LoginResponseData,
  AuthMeResponseData,
} from '@/contracts/backend/auth';
import {
  canonicalRestaurants,
  canonicalEmployees,
  canonicalPositions,
  canonicalUsers,
} from '@/contracts/fixtures/canonicalFixtures';

// Unconfirmed mock data collections for compatibility layer
import { mockOrders } from '@/mocks/orders';
import { mockInventoryItems } from '@/mocks/inventory';
import { mockMenuItems } from '@/mocks/menu';
import { mockAttendances, mockLeaveRequests } from '@/mocks/attendance';
import { mockShifts } from '@/mocks/scheduling';
import { mockReportMetrics, mockDashboardSummaries } from '@/mocks/reports';
import { mockAIInsights } from '@/mocks/aiInsights';

export interface MockProviderOptions {
  latencyMs?: number;
}

export class MockDataProvider implements DataProvider {
  private latencyMs: number;

  // In-memory mutable state initialized from canonical fixtures
  private restaurants: RestaurantDto[];
  private employees: EmployeeDto[];
  private positions: PositionDto[];
  private currentUserId: number = 2; // Default mock authenticated user: Sara Al-Qahtani
  private authToken: string | null = 'mock-sanctum-bearer-token-sara-02';

  // Unconfirmed domain states
  private orders: any[];
  private inventory: any[];
  private menuItems: any[];
  private attendance: any[];
  private leaveRequests: any[];
  private shifts: any[];
  private aiInsights: Record<string, any[]>;

  constructor(options: MockProviderOptions = {}) {
    this.latencyMs = options.latencyMs ?? 30;
    this.restaurants = JSON.parse(JSON.stringify(canonicalRestaurants));
    this.employees = JSON.parse(JSON.stringify(canonicalEmployees));
    this.positions = JSON.parse(JSON.stringify(canonicalPositions));

    this.orders = JSON.parse(JSON.stringify(mockOrders));
    this.inventory = JSON.parse(JSON.stringify(mockInventoryItems));
    this.menuItems = JSON.parse(JSON.stringify(mockMenuItems));
    this.attendance = JSON.parse(JSON.stringify(mockAttendances));
    this.leaveRequests = JSON.parse(JSON.stringify(mockLeaveRequests));
    this.shifts = JSON.parse(JSON.stringify(mockShifts));
    this.aiInsights = JSON.parse(JSON.stringify(mockAIInsights));
  }

  public setLatency(ms: number) {
    this.latencyMs = ms;
  }

  public setSimulatedUser(userId: number, token?: string) {
    this.currentUserId = userId;
    this.authToken = token ?? `mock-sanctum-token-${userId}`;
  }

  private async delay(): Promise<void> {
    if (this.latencyMs <= 0) return;
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }

  // ====================================================
  // AUTHENTICATION
  // ====================================================

  async login(credentials: LoginCredentialsRequest): Promise<ApiSuccessResponse<LoginResponseData>> {
    await this.delay();

    if (!credentials.email || !credentials.password) {
      throw new ValidationError('Validation failed', {
        email: !credentials.email ? ['The email field is required.'] : [],
        password: !credentials.password ? ['The password field is required.'] : [],
      });
    }

    const matchedUser = canonicalUsers.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
    if (!matchedUser || credentials.password !== 'password') {
      throw new AuthenticationError('These credentials do not match our records.');
    }

    this.currentUserId = matchedUser.id;
    this.authToken = `mock-sanctum-token-${matchedUser.id}-${Date.now()}`;

    const defaultMembership = matchedUser.memberships?.[0] || null;
    const defaultRestaurant = defaultMembership
      ? this.restaurants.find((r) => r.id === defaultMembership.restaurant_id) || null
      : null;

    return {
      status: 'success',
      message: 'Authenticated successfully.',
      data: {
        token: this.authToken,
        token_type: 'Bearer',
        user: JSON.parse(JSON.stringify(matchedUser)),
        restaurant: defaultRestaurant ? JSON.parse(JSON.stringify(defaultRestaurant)) : null,
      },
      meta: [],
    };
  }

  async logout(): Promise<ApiSuccessResponse<{ message: string }>> {
    await this.delay();
    this.authToken = null;
    return {
      status: 'success',
      message: 'Successfully logged out.',
      data: { message: 'Tokens revoked.' },
      meta: [],
    };
  }

  async checkAuthMe(): Promise<ApiSuccessResponse<AuthMeResponseData>> {
    await this.delay();

    if (!this.authToken) {
      throw new AuthenticationError();
    }

    const user = canonicalUsers.find((u) => u.id === this.currentUserId);
    if (!user) {
      throw new AuthenticationError('User session invalid.');
    }

    return {
      status: 'success',
      message: 'User profile retrieved.',
      data: JSON.parse(JSON.stringify(user)),
      meta: [],
    };
  }

  // ====================================================
  // RESTAURANTS
  // ====================================================

  async listRestaurants(): Promise<ApiSuccessResponse<RestaurantDto[]>> {
    await this.delay();
    return {
      status: 'success',
      message: 'Restaurants retrieved successfully.',
      data: JSON.parse(JSON.stringify(this.restaurants)),
      meta: { total: this.restaurants.length, count: this.restaurants.length },
    };
  }

  async getRestaurant(id: number): Promise<ApiSuccessResponse<RestaurantDto>> {
    await this.delay();
    const found = this.restaurants.find((r) => r.id === id);
    if (!found) {
      throw new NotFoundError(`No query results for model [App\\Models\\Restaurant] ${id}`);
    }
    return {
      status: 'success',
      message: 'Restaurant retrieved.',
      data: JSON.parse(JSON.stringify(found)),
      meta: [],
    };
  }

  async createRestaurant(payload: CreateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>> {
    await this.delay();

    if (!payload.name || payload.name.trim() === '') {
      throw new ValidationError('Validation failed', {
        name: ['The name field is required.'],
      });
    }

    const nextId = Math.max(0, ...this.restaurants.map((r) => r.id)) + 1;
    const now = new Date().toISOString();
    const newRestaurant: RestaurantDto = {
      id: nextId,
      name: payload.name.trim(),
      slug: payload.slug || `rest-${nextId}`,
      currency_code: payload.currency_code || 'SAR',
      status: payload.status || 'active',
      timezone: payload.timezone || 'Asia/Riyadh',
      address: payload.address || null,
      city: payload.city || null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    };

    this.restaurants.push(newRestaurant);

    return {
      status: 'success',
      message: 'Restaurant created successfully.',
      data: JSON.parse(JSON.stringify(newRestaurant)),
      meta: [],
    };
  }

  async updateRestaurant(id: number, payload: UpdateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>> {
    await this.delay();

    const index = this.restaurants.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new NotFoundError(`No query results for model [App\\Models\\Restaurant] ${id}`);
    }

    const existing = this.restaurants[index];
    const updated: RestaurantDto = {
      ...existing,
      ...(payload.name !== undefined ? { name: payload.name } : {}),
      ...(payload.slug !== undefined ? { slug: payload.slug } : {}),
      ...(payload.currency_code !== undefined ? { currency_code: payload.currency_code } : {}),
      ...(payload.timezone !== undefined ? { timezone: payload.timezone } : {}),
      ...(payload.city !== undefined ? { city: payload.city } : {}),
      ...(payload.address !== undefined ? { address: payload.address } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      updated_at: new Date().toISOString(),
    };

    this.restaurants[index] = updated;

    return {
      status: 'success',
      message: 'Restaurant updated successfully.',
      data: JSON.parse(JSON.stringify(updated)),
      meta: [],
    };
  }

  // ====================================================
  // EMPLOYEES (Scoped by Restaurant)
  // ====================================================

  async listEmployees(restaurantId: number): Promise<ApiSuccessResponse<EmployeeDto[]>> {
    await this.delay();

    // Verify restaurant exists
    const restExists = this.restaurants.some((r) => r.id === restaurantId);
    if (!restExists) {
      throw new NotFoundError(`Restaurant ${restaurantId} not found.`);
    }

    const list = this.employees.filter((e) => e.restaurant_id === restaurantId);
    return {
      status: 'success',
      message: 'Employees retrieved successfully.',
      data: JSON.parse(JSON.stringify(list)),
      meta: { total: list.length, count: list.length },
    };
  }

  async getEmployee(restaurantId: number, employeeId: number): Promise<ApiSuccessResponse<EmployeeDto>> {
    await this.delay();

    const emp = this.employees.find((e) => e.id === employeeId && e.restaurant_id === restaurantId);
    if (!emp) {
      throw new NotFoundError(`Employee ${employeeId} not found for restaurant ${restaurantId}`);
    }

    return {
      status: 'success',
      message: 'Employee retrieved.',
      data: JSON.parse(JSON.stringify(emp)),
      meta: [],
    };
  }

  async createEmployee(restaurantId: number, payload: CreateEmployeeRequest): Promise<ApiSuccessResponse<EmployeeDto>> {
    await this.delay();

    // Validation
    const errors: Record<string, string[]> = {};
    if (!payload.first_name || payload.first_name.trim() === '') {
      errors.first_name = ['The first name field is required.'];
    }
    if (!payload.last_name || payload.last_name.trim() === '') {
      errors.last_name = ['The last name field is required.'];
    }
    if (Object.keys(errors).length > 0) {
      throw new ValidationError('The given data was invalid.', errors);
    }

    const restExists = this.restaurants.some((r) => r.id === restaurantId);
    if (!restExists) {
      throw new NotFoundError(`Restaurant ${restaurantId} not found.`);
    }

    const nextId = Math.max(0, ...this.employees.map((e) => e.id)) + 1;
    const now = new Date().toISOString();
    const employeeNumber = payload.employee_number || `EMP-${String(nextId).padStart(4, '0')}`;

    // Look up position if given
    let positionObj = null;
    if (payload.position_id) {
      const pos = this.positions.find((p) => p.id === payload.position_id);
      if (pos) positionObj = pos;
    }

    const newEmp: EmployeeDto = {
      id: nextId,
      restaurant_id: restaurantId, // Strictly scoped to the route's restaurant
      user_id: payload.user_id ?? null,
      position_id: payload.position_id ?? null,
      employee_number: employeeNumber,
      first_name: payload.first_name.trim(),
      last_name: payload.last_name.trim(),
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      hire_date: payload.hire_date ?? now.split('T')[0],
      termination_date: null,
      status: payload.status || 'active',
      created_at: now,
      updated_at: now,
      deleted_at: null,
      position: positionObj,
    };

    this.employees.unshift(newEmp);

    return {
      status: 'success',
      message: 'Employee created successfully.',
      data: JSON.parse(JSON.stringify(newEmp)),
      meta: [],
    };
  }

  async updateEmployee(
    restaurantId: number,
    employeeId: number,
    payload: UpdateEmployeeRequest
  ): Promise<ApiSuccessResponse<EmployeeDto>> {
    await this.delay();

    const index = this.employees.findIndex((e) => e.id === employeeId && e.restaurant_id === restaurantId);
    if (index === -1) {
      throw new NotFoundError(`Employee ${employeeId} not found for restaurant ${restaurantId}`);
    }

    const existing = this.employees[index];
    let positionObj = existing.position;
    if (payload.position_id !== undefined) {
      if (payload.position_id === null) {
        positionObj = null;
      } else {
        const foundPos = this.positions.find((p) => p.id === payload.position_id);
        positionObj = foundPos || null;
      }
    }

    const updated: EmployeeDto = {
      ...existing,
      ...(payload.first_name !== undefined ? { first_name: payload.first_name.trim() } : {}),
      ...(payload.last_name !== undefined ? { last_name: payload.last_name.trim() } : {}),
      ...(payload.employee_number !== undefined ? { employee_number: payload.employee_number } : {}),
      ...(payload.email !== undefined ? { email: payload.email } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.hire_date !== undefined ? { hire_date: payload.hire_date } : {}),
      ...(payload.termination_date !== undefined ? { termination_date: payload.termination_date } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.user_id !== undefined ? { user_id: payload.user_id } : {}),
      ...(payload.position_id !== undefined ? { position_id: payload.position_id } : {}),
      position: positionObj,
      updated_at: new Date().toISOString(),
    };

    // CRITICAL: restaurant_id MUST NOT BE ALTERED
    updated.restaurant_id = existing.restaurant_id;

    this.employees[index] = updated;

    return {
      status: 'success',
      message: 'Employee updated successfully.',
      data: JSON.parse(JSON.stringify(updated)),
      meta: [],
    };
  }

  async deleteEmployee(
    restaurantId: number,
    employeeId: number
  ): Promise<ApiSuccessResponse<{ message: string; deleted_id: number }>> {
    await this.delay();

    const index = this.employees.findIndex((e) => e.id === employeeId && e.restaurant_id === restaurantId);
    if (index === -1) {
      throw new NotFoundError(`Employee ${employeeId} not found for restaurant ${restaurantId}`);
    }

    this.employees.splice(index, 1);

    return {
      status: 'success',
      message: 'Employee deleted successfully.',
      data: { message: 'Employee record removed.', deleted_id: employeeId },
      meta: [],
    };
  }

  // ====================================================
  // POSITIONS (Scoped by Restaurant)
  // ====================================================

  async listPositions(restaurantId: number): Promise<ApiSuccessResponse<PositionDto[]>> {
    await this.delay();
    const list = this.positions.filter((p) => p.restaurant_id === restaurantId);
    return {
      status: 'success',
      message: 'Positions retrieved.',
      data: JSON.parse(JSON.stringify(list)),
      meta: [],
    };
  }

  // ====================================================
  // UNCONFIRMED DOMAINS (Scoped Compatibility Layer)
  // ====================================================

  private matchTenantId(recordRestaurantId: any, targetRestaurantId: number): boolean {
    if (recordRestaurantId === targetRestaurantId) return true;
    if (recordRestaurantId === `rest-${targetRestaurantId}`) return true;
    if (recordRestaurantId === `rest-0${targetRestaurantId}`) return true;
    if (recordRestaurantId === String(targetRestaurantId)) return true;
    return false;
  }

  async getOrders(restaurantId: number): Promise<unknown[]> {
    await this.delay();
    const filtered = this.orders.filter((o) => this.matchTenantId(o.restaurant_id, restaurantId));
    return JSON.parse(JSON.stringify(filtered));
  }

  async getInventory(restaurantId: number): Promise<unknown[]> {
    await this.delay();
    const filtered = this.inventory.filter((i) => this.matchTenantId(i.restaurant_id, restaurantId));
    return JSON.parse(JSON.stringify(filtered));
  }

  async getMenu(restaurantId: number): Promise<unknown[]> {
    await this.delay();
    const filtered = this.menuItems.filter((m) => this.matchTenantId(m.restaurant_id, restaurantId));
    return JSON.parse(JSON.stringify(filtered));
  }

  async getAttendance(restaurantId: number): Promise<unknown[]> {
    await this.delay();
    const filtered = this.attendance.filter((a) => this.matchTenantId(a.restaurant_id, restaurantId));
    return JSON.parse(JSON.stringify(filtered));
  }

  async getScheduling(restaurantId: number): Promise<unknown[]> {
    await this.delay();
    const filtered = this.shifts.filter((s) => this.matchTenantId(s.restaurant_id, restaurantId));
    return JSON.parse(JSON.stringify(filtered));
  }

  async getReports(restaurantId: number): Promise<unknown> {
    await this.delay();
    const metrics = mockReportMetrics[`rest-${restaurantId}`] || mockReportMetrics[String(restaurantId)] || [];
    const summary = mockDashboardSummaries[`rest-${restaurantId}`] || mockDashboardSummaries[String(restaurantId)] || null;
    return JSON.parse(JSON.stringify({ metrics, summary }));
  }

  async getAIInsights(restaurantId: number): Promise<unknown[]> {
    await this.delay();
    const list = this.aiInsights[`rest-${restaurantId}`] || this.aiInsights[String(restaurantId)] || [];
    return JSON.parse(JSON.stringify(list));
  }
}
