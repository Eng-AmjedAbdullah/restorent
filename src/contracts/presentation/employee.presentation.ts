/**
 * Employee Presentation Model
 *
 * Tailored for Vue 3 views, staff directory cards, bilingual tables,
 * and badge formatting.
 */

import type { EmployeeStatus } from '../backend/employee';
import type { LocalizedString, StatusBadgeVariant } from './restaurant.presentation';

export interface EmployeePresentationModel {
  id: string;
  restaurant_id: string;
  employee_number: string;
  employee_code: string; // Alias for backward compatibility with existing templates
  first_name: LocalizedString;
  last_name: LocalizedString;
  full_name: LocalizedString;
  raw_first_name: string;
  raw_last_name: string;
  email: string;
  phone: string;
  hire_date: string;
  termination_date: string | null;
  status: EmployeeStatus;
  status_badge: {
    label: LocalizedString;
    variant: StatusBadgeVariant;
  };
  position_id: string | null;
  position_name: LocalizedString | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}
