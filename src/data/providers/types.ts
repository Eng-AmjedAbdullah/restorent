/**
 * DataProvider Interface & Network Error Types
 *
 * Defines the contract between Application Services and the Data Layer.
 * Both the MockDataProvider and the future HTTP API Adapter implement this interface.
 */

import type {
  ApiSuccessResponse,
  ApiValidationErrorResponse,
  ApiAuthenticationErrorResponse,
  ApiAuthorizationErrorResponse,
  ApiNotFoundErrorResponse,
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

// --- Typed API Errors ---

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: Record<string, string[]> | null;
  public readonly meta: unknown;

  constructor(statusCode: number, message: string, errors: Record<string, string[]> | null = null, meta: unknown = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.meta = meta;
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'The given data was invalid.', errors: Record<string, string[]> = {}) {
    super(422, message, errors);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Unauthenticated. Valid bearer token required.') {
    super(401, message, null);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'This action is unauthorized for the given tenant.') {
    super(403, message, null);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Requested resource not found.') {
    super(404, message, null);
    this.name = 'NotFoundError';
  }
}

// --- Confirmed DataProvider Interface ---

export interface DataProvider {
  // Authentication
  login(credentials: LoginCredentialsRequest): Promise<ApiSuccessResponse<LoginResponseData>>;
  logout(): Promise<ApiSuccessResponse<{ message: string }>>;
  checkAuthMe(): Promise<ApiSuccessResponse<AuthMeResponseData>>;

  // Restaurants
  listRestaurants(): Promise<ApiSuccessResponse<RestaurantDto[]>>;
  getRestaurant(id: number): Promise<ApiSuccessResponse<RestaurantDto>>;
  createRestaurant(payload: CreateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>>;
  updateRestaurant(id: number, payload: UpdateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>>;

  // Employees (Scoped by Restaurant)
  listEmployees(restaurantId: number): Promise<ApiSuccessResponse<EmployeeDto[]>>;
  getEmployee(restaurantId: number, employeeId: number): Promise<ApiSuccessResponse<EmployeeDto>>;
  createEmployee(restaurantId: number, payload: CreateEmployeeRequest): Promise<ApiSuccessResponse<EmployeeDto>>;
  updateEmployee(restaurantId: number, employeeId: number, payload: UpdateEmployeeRequest): Promise<ApiSuccessResponse<EmployeeDto>>;
  deleteEmployee(restaurantId: number, employeeId: number): Promise<ApiSuccessResponse<{ message: string; deleted_id: number }>>;

  // Positions (Scoped by Restaurant)
  listPositions(restaurantId: number): Promise<ApiSuccessResponse<PositionDto[]>>;

  // Compatibility Layer for Unconfirmed Operational Domains (Scoped by Restaurant)
  getOrders?(restaurantId: number): Promise<unknown[]>;
  getInventory?(restaurantId: number): Promise<unknown[]>;
  getMenu?(restaurantId: number): Promise<unknown[]>;
  getAttendance?(restaurantId: number): Promise<unknown[]>;
  getScheduling?(restaurantId: number): Promise<unknown[]>;
  getReports?(restaurantId: number): Promise<unknown>;
  getAIInsights?(restaurantId: number): Promise<unknown[]>;
}
