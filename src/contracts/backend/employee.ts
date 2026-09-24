/**
 * Canonical Laravel Employee DTO and Request Payloads
 *
 * Reflects the authoritative schema from Laravel REST API.
 * Wire-level identifiers are integer database keys.
 *
 * Endpoints:
 * - GET  /api/restaurants/{restaurant}/employees
 * - GET  /api/restaurants/{restaurant}/employees/{employee}
 * - POST /api/restaurants/{restaurant}/employees
 * - PUT  /api/restaurants/{restaurant}/employees/{employee}
 */

import type { PositionDto } from './position';

/**
 * Employment contract lifecycle statuses supported by Laravel backend.
 * NOTE: Operational shift/attendance states (on_shift, on_break, off_duty)
 * belong to the Attendance/Shift domain, NOT employment lifecycle status.
 */
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated' | 'suspended';

/**
 * Canonical Employee Entity (Wire-level Laravel Model)
 */
export interface EmployeeDto {
  id: number;
  restaurant_id: number;
  user_id: number | null;
  position_id: number | null;
  employee_number: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  hire_date: string | null; // YYYY-MM-DD or null
  termination_date: string | null; // YYYY-MM-DD or null
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Optional loaded relationships
  position?: PositionDto | null;
}

/**
 * Request payload for POST /api/restaurants/{restaurant}/employees
 *
 * Validation rules:
 * - first_name: required string (min: 1, max: 100)
 * - last_name: required string (min: 1, max: 100)
 * - status: required EmployeeStatus (active, inactive, on_leave, terminated, suspended)
 * - employee_number: optional/nullable string
 * - email: optional/nullable string (valid email format if provided)
 * - phone: optional/nullable string
 * - hire_date: optional/nullable string (YYYY-MM-DD)
 * - user_id: optional/nullable integer (must exist in users table)
 * - position_id: optional/nullable integer (must exist in positions table for this restaurant)
 *
 * Prohibited fields in request body:
 * - `id`: database generated
 * - `restaurant_id`: scoped by URL parameter; prohibited in request body
 * - `created_at`, `updated_at`, `deleted_at`: managed by Eloquent
 */
export interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  status: EmployeeStatus;
  employee_number?: string | null;
  email?: string | null;
  phone?: string | null;
  hire_date?: string | null;
  user_id?: number | null;
  position_id?: number | null;
}

/**
 * Request payload for PUT /api/restaurants/{restaurant}/employees/{employee}
 *
 * Prohibited fields in request body:
 * - `id`: immutable primary key
 * - `restaurant_id`: tenant reassignment is not permitted via employee update
 * - `created_at`, `updated_at`, `deleted_at`: managed by Eloquent
 */
export interface UpdateEmployeeRequest {
  first_name?: string;
  last_name?: string;
  employee_number?: string | null;
  email?: string | null;
  phone?: string | null;
  hire_date?: string | null;
  termination_date?: string | null;
  status?: EmployeeStatus;
  user_id?: number | null;
  position_id?: number | null;
}
