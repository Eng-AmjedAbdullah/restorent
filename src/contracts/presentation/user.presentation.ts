/**
 * User Presentation Model
 *
 * Tailored for Vue 3 user session, navigation header, and profile views.
 */

import type { UserAccountStatus } from '../backend/user';
import type { LocalizedString, StatusBadgeVariant } from './restaurant.presentation';

export interface UserPresentationModel {
  id: string;
  email: string;
  name_first: string;
  name_last: string;
  full_name: LocalizedString;
  name: LocalizedString; // Backward compatibility alias with existing Vue header & profile
  phone: string | null;
  status: UserAccountStatus;
  status_badge: {
    label: LocalizedString;
    variant: StatusBadgeVariant;
  };
  email_verified: boolean;
  last_login_at: string | null;
  default_restaurant_id: string | null;
  assigned_restaurant_ids: string[];
  primary_role: string | null;
  role_badge: {
    label: LocalizedString;
  } | null;
  permission_names: string[];
  created_at: string;
}
