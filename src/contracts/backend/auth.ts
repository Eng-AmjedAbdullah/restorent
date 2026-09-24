/**
 * Canonical Authentication Contracts (Laravel Sanctum)
 *
 * Endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/logout
 * - GET  /api/auth/me
 */

import type { UserDto } from './user';
import type { RestaurantDto } from './restaurant';

/**
 * Login Request Payload (POST /api/auth/login)
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login Success Data Payload
 */
export interface LoginResponseData {
  token: string;
  user: UserDto;
  restaurant?: RestaurantDto | null;
}

/**
 * Auth Me Response Data (GET /api/auth/me)
 */
export interface AuthMeResponseData {
  user: UserDto;
}
