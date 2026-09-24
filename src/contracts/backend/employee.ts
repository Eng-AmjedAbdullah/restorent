/**
 * Canonical Laravel Employee DTO and Request Payloads
 *
 * Reflects the authoritative schema from Laravel REST API.
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
  id: string;
  restaurant_id: string;
  user_id: string | null;
  position_id: string | null;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hire_date: string; // YYYY-MM-DD
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
 * Prohibited fields:
 * - `id`: database generated
 * - `restaurant_id`: scoped by URL parameter; prohibited in request body
 * - `created_at`, `updated_at`, `deleted_at`: managed by Eloquent
 */
export interface CreateEmployeeRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  hire_date: string;
  employee_number?: string;
  status?: EmployeeStatus;
  user_id?: string | null;
  position_id?: string | null;
}

/**
 * Request payload for PUT /api/restaurants/{restaurant}/employees/{employee}
 *
 * Prohibited fields:
 * - `id`: immutable primary key
 * - `restaurant_id`: tenant reassignment is not permitted via employee update
 * - `created_at`, `updated_at`, `deleted_at`: managed by Eloquent
 */
export interface UpdateEmployeeRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  hire_date?: string;
  termination_date?: string | null;
  employee_number?: string;
  status?: EmployeeStatus;
  user_id?: string | null;
  position_id?: string | null;
}
