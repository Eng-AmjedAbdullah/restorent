/**
 * Canonical Laravel User, Membership, Role & Permission DTOs
 *
 * Reflects user authentication identity and authorization contracts.
 * User represents system account identity, which is decoupled from
 * tenant restaurant membership and employee workforce records.
 * Wire-level identifiers are integer database keys.
 */

export type UserAccountStatus = 'active' | 'suspended' | 'pending';
export type RestaurantMembershipStatus = 'active' | 'inactive' | 'suspended' | 'invited';

/**
 * Canonical User Entity (Laravel User Model)
 */
export interface UserDto {
  id: number;
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
 * Role assignment pivot linking a membership to a specific Role
 */
export interface RoleAssignmentDto {
  id: number;
  membership_id: number;
  role_id: number;
  created_at?: string;
  updated_at?: string;
  role?: RoleDto;
}

/**
 * Pivot / Membership linking a User to a specific Restaurant tenant
 */
export interface RestaurantMembershipDto {
  id: number;
  user_id: number;
  restaurant_id: number;
  status: RestaurantMembershipStatus;
  invited_at: string | null;
  joined_at: string | null;
  left_at: string | null;
  created_at: string;
  updated_at: string;

  // Optional loaded role assignments
  role_assignments?: RoleAssignmentDto[];
}

/**
 * Canonical Role Entity
 */
export interface RoleDto {
  id: number;
  restaurant_id: number | null;
  scope: string; // 'system' | 'restaurant'
  name: string;
  description: string | null;
  is_default: boolean;

  // Optional loaded permissions
  permissions?: PermissionDto[];
}

/**
 * Canonical Permission Entity
 *
 * Capability identifier is `code` (e.g. `restaurant.employees.manage`).
 */
export interface PermissionDto {
  id: number;
  code: string;
  name: string;
  description: string | null;
}
