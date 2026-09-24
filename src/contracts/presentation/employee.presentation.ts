/**
 * Employee Presentation Model
 *
 * Tailored for Vue 3 views, staff directory cards, bilingual tables,
 * and badge formatting. Wire-level numeric ID is preserved.
 */

import type { EmployeeStatus } from '../backend/employee';
import type { LocalizedString, StatusBadgeVariant } from './restaurant.presentation';

export interface EmployeePresentationModel {
  id: number;
  string_id: string;
  legacy_id?: string;
  restaurant_id: number;
  employee_number: string | null;
  employee_code: string; // Presentation alias
  first_name: LocalizedString;
  last_name: LocalizedString;
  full_name: LocalizedString;
  raw_first_name: string;
  raw_last_name: string;
  email: string | null;
  phone: string | null;
  hire_date: string | null;
  termination_date: string | null;
  status: EmployeeStatus;
  status_badge: {
    label: LocalizedString;
    variant: StatusBadgeVariant;
  };
  position_id: number | null;
  position_name: LocalizedString | null;
  user_id: number | null;
  created_at: string;
  updated_at: string;
}
