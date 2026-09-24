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

export type LoginCredentialsRequest = LoginRequest;

/**
 * Login Success Data Payload (inside ApiSuccessResponse.data)
 */
export interface LoginResponseData {
  token: string;
  token_type?: string;
  user: UserDto;
  restaurant?: RestaurantDto | null;
}

/**
 * Auth Me Response Data (GET /api/auth/me)
 * The Laravel API returns the authenticated UserDto directly inside the envelope `data` field.
 */
export type AuthMeResponseData = UserDto;
