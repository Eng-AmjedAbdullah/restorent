/** Confirmed Laravel endpoints only. Mock-only operations live in operational.types.ts. */
import type { ApiSuccessResponse } from '@/contracts/backend/envelope';
import type { RestaurantDto, CreateRestaurantRequest, UpdateRestaurantRequest } from '@/contracts/backend/restaurant';
import type { EmployeeDto, CreateEmployeeRequest, UpdateEmployeeRequest } from '@/contracts/backend/employee';
import type { LoginCredentialsRequest, LoginResponseData, AuthMeResponseData } from '@/contracts/backend/auth';

export class ApiError extends Error {
  constructor(public readonly statusCode: number, message: string,
    public readonly errors: Record<string, string[]> | null = null,
    public readonly meta: unknown[] = []) {
    super(message);
    this.name = 'ApiError';
  }
}
export class ValidationError extends ApiError {
  constructor(errors: Record<string, string[]>, message = 'Validation failed.') {
    super(422, message, errors);
    this.name = 'ValidationError';
  }
}
export class AuthenticationError extends ApiError {
  constructor(message = 'Unauthenticated.') { super(401, message); this.name = 'AuthenticationError'; }
}
export class AuthorizationError extends ApiError {
  constructor(message = 'Access denied for this restaurant.') { super(403, message); this.name = 'AuthorizationError'; }
}
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found.') { super(404, message); this.name = 'NotFoundError'; }
}

export interface DataProvider {
  login(credentials: LoginCredentialsRequest): Promise<ApiSuccessResponse<LoginResponseData>>;
  logout(): Promise<ApiSuccessResponse<{ message: string }>>;
  checkAuthMe(): Promise<ApiSuccessResponse<AuthMeResponseData>>;
  listRestaurants(): Promise<ApiSuccessResponse<RestaurantDto[]>>;
  getRestaurant(id: number): Promise<ApiSuccessResponse<RestaurantDto>>;
  createRestaurant(payload: CreateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>>;
  updateRestaurant(id: number, payload: UpdateRestaurantRequest): Promise<ApiSuccessResponse<RestaurantDto>>;
  listEmployees(restaurantId: number): Promise<ApiSuccessResponse<EmployeeDto[]>>;
  getEmployee(restaurantId: number, employeeId: number): Promise<ApiSuccessResponse<EmployeeDto>>;
  createEmployee(restaurantId: number, payload: CreateEmployeeRequest): Promise<ApiSuccessResponse<EmployeeDto>>;
  updateEmployee(restaurantId: number, employeeId: number, payload: UpdateEmployeeRequest): Promise<ApiSuccessResponse<EmployeeDto>>;
}
