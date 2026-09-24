/**
 * Canonical Laravel User, Membership, Role & Permission DTOs
 *
 * Reflects user authentication identity and authorization contracts.
 * User represents system account identity, which is decoupled from
 * tenant restaurant membership and employee workforce records.
 */

export type UserAccountStatus = 'active' | 'suspended' | 'pending';

/**
 * Canonical User Entity (Laravel User Model)
 */
export interface UserDto {
  id: string;
  email: string;
  name_first: string;
  name_last: string;
  phone: string | null;
  status: UserAccountStatus;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Optional loaded relationships
  memberships?: RestaurantMembershipDto[];
  roles?: RoleDto[];
  permissions?: PermissionDto[];
}

/**
 * Pivot / Membership linking a User to a specific Restaurant tenant
 */
export interface RestaurantMembershipDto {
  id: string;
  user_id: string;
  restaurant_id: string;
  role: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Canonical Role Entity (Spatie / Laravel Permission)
 */
export interface RoleDto {
  id: string;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Canonical Permission Entity
 * Standard permission codes:
 * - `system.restaurants.manage`
 * - `restaurant.profile.manage_self`
 * - `restaurant.employees.manage`
 */
export interface PermissionDto {
  id: string;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
}
