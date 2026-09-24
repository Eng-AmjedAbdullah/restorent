/**
 * Canonical Laravel Backend Mock Fixtures
 *
 * All wire-level fixtures adhere to the authoritative Laravel REST API contracts:
 * - Integer primary and foreign keys
 * - Plain string names
 * - Strict tenant boundaries
 * - Verified identity links (linked users and employees match actual personal identities)
 * - Supported employment statuses (active, inactive, on_leave, terminated, suspended)
 * - Empty restaurant collections and edge-case testing fixtures
 */

import type { RestaurantDto } from '../backend/restaurant';
import type { PositionDto } from '../backend/position';
import type { EmployeeDto } from '../backend/employee';
import type {
  UserDto,
  RestaurantMembershipDto,
  RoleAssignmentDto,
  RoleDto,
  PermissionDto,
} from '../backend/user';

// ==========================================
// 1. CANONICAL PERMISSIONS
// ==========================================
export const canonicalPermissions: PermissionDto[] = [
  {
    id: 1,
    code: 'system.restaurants.manage',
    name: 'Manage All System Restaurants',
    description: 'Global administrator platform management across all tenant restaurants',
  },
  {
    id: 2,
    code: 'restaurant.profile.manage_self',
    name: 'Manage Restaurant Profile',
    description: 'Update branch settings, currency, hours, and operational metadata',
  },
  {
    id: 3,
    code: 'restaurant.employees.manage',
    name: 'Manage Restaurant Employees',
    description: 'Create, update, and manage workforce members within the active branch',
  },
  {
    id: 4,
    code: 'restaurant.reports.view',
    name: 'View Restaurant Reports',
    description: 'Access financial, inventory, and operational reports for the branch',
  },
  {
    id: 5,
    code: 'restaurant.kds.view',
    name: 'View Kitchen Display System',
    description: 'Access live kitchen orders and order preparation ticket queues',
  },
];

// ==========================================
// 2. CANONICAL ROLES
// ==========================================
export const canonicalRoles: RoleDto[] = [
  {
    id: 1,
    restaurant_id: null, // System-wide scope
    scope: 'system',
    name: 'System Super Administrator',
    description: 'Unrestricted global access to all branches and system settings',
    is_default: false,
    permissions: canonicalPermissions,
  },
  {
    id: 2,
    restaurant_id: null,
    scope: 'restaurant',
    name: 'Restaurant Operations Director',
    description: 'Multi-branch operations executive with complete tenant management permissions',
    is_default: false,
    permissions: canonicalPermissions.filter((p) => p.code !== 'system.restaurants.manage'),
  },
  {
    id: 3,
    restaurant_id: null,
    scope: 'restaurant',
    name: 'Branch General Manager',
    description: 'Branch manager with employee, profile, and reporting permissions',
    is_default: true,
    permissions: canonicalPermissions.filter((p) =>
      ['restaurant.profile.manage_self', 'restaurant.employees.manage', 'restaurant.reports.view'].includes(p.code)
    ),
  },
  {
    id: 4,
    restaurant_id: null,
    scope: 'restaurant',
    name: 'Kitchen & Floor Staff',
    description: 'Workforce team member with line and order display access only',
    is_default: false,
    permissions: canonicalPermissions.filter((p) => p.code === 'restaurant.kds.view'),
  },
];

// ==========================================
// 3. CANONICAL RESTAURANTS
// ==========================================
export const canonicalRestaurants: RestaurantDto[] = [
  {
    id: 1,
    name: 'Restora Downtown Flagship - Olaya',
    slug: 'ruh-01',
    currency_code: 'SAR',
    status: 'active',
    timezone: 'Asia/Riyadh',
    address: 'King Fahd Road, Al-Olaya Commercial District',
    city: 'Riyadh',
    created_at: '2025-01-10T08:00:00Z',
    updated_at: '2026-03-01T10:30:00Z',
    deleted_at: null,
  },
  {
    id: 2,
    name: 'Restora Waterfront Bistro - Corniche',
    slug: 'jed-01',
    currency_code: 'SAR',
    status: 'active',
    timezone: 'Asia/Riyadh',
    address: 'North Corniche Road, Marina Front',
    city: 'Jeddah',
    created_at: '2025-03-15T09:00:00Z',
    updated_at: '2026-02-28T14:15:00Z',
    deleted_at: null,
  },
  {
    id: 3,
    name: 'Restora Cultural Oasis - Diriyah',
    slug: 'ruh-02',
    currency_code: 'SAR',
    status: 'active',
    timezone: 'Asia/Riyadh',
    address: 'Al-Bujairi Heritage District, Historic Diriyah',
    city: 'Riyadh',
    created_at: '2025-06-20T11:00:00Z',
    updated_at: '2026-01-15T16:45:00Z',
    deleted_at: null,
  },
  {
    id: 4,
    name: 'Restora Khobar Seafront - Marina',
    slug: 'dmm-01',
    currency_code: 'SAR',
    status: 'inactive',
    timezone: 'Asia/Riyadh',
    address: 'Prince Turki Street, Seafront Walkway',
    city: 'Al-Khobar',
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2026-02-10T08:00:00Z',
    deleted_at: null,
  },
  {
    id: 5,
    name: 'Restora Test Empty Branch - Diplomatic',
    slug: 'ruh-99',
    currency_code: 'SAR',
    status: 'active',
    timezone: 'Asia/Riyadh',
    address: 'Diplomatic Quarter Square',
    city: 'Riyadh',
    created_at: '2026-01-01T12:00:00Z',
    updated_at: '2026-01-01T12:00:00Z',
    deleted_at: null,
  },
];

// ==========================================
// 4. CANONICAL POSITIONS
// ==========================================
export const canonicalPositions: PositionDto[] = [
  {
    id: 1,
    restaurant_id: 1,
    name: 'Executive Head Chef',
    code: 'CHEF-EXEC',
    status: 'active',
    department: 'Kitchen Operations',
    created_at: '2025-01-12T00:00:00Z',
    updated_at: '2025-01-12T00:00:00Z',
  },
  {
    id: 2,
    restaurant_id: 1,
    name: 'Sous Chef / Line Supervisor',
    code: 'SOUS-01',
    status: 'active',
    department: 'Kitchen Operations',
    created_at: '2025-01-12T00:00:00Z',
    updated_at: '2025-01-12T00:00:00Z',
  },
  {
    id: 3,
    restaurant_id: 1,
    name: 'Floor Captain & Guest Host',
    code: 'FLR-CPT',
    status: 'active',
    department: 'Dining Floor',
    created_at: '2025-01-12T00:00:00Z',
    updated_at: '2025-01-12T00:00:00Z',
  },
  {
    id: 4,
    restaurant_id: 2,
    name: 'Head Chef - Seafood Specialist',
    code: 'CHEF-SEA',
    status: 'active',
    department: 'Kitchen Operations',
    created_at: '2025-03-20T00:00:00Z',
    updated_at: '2025-03-20T00:00:00Z',
  },
  {
    id: 5,
    restaurant_id: 2,
    name: 'Pastry & Dessert Chef',
    code: 'PSTRY-01',
    status: 'active',
    department: 'Bakery & Dessert',
    created_at: '2025-03-20T00:00:00Z',
    updated_at: '2025-03-20T00:00:00Z',
  },
];

// ==========================================
// 5. CANONICAL ROLE ASSIGNMENTS & MEMBERSHIPS
// ==========================================
export const canonicalMemberships: RestaurantMembershipDto[] = [
  // User 1 (Tariq - System Admin) in Restaurants 1, 2, 3
  {
    id: 1,
    user_id: 1,
    restaurant_id: 1,
    status: 'active',
    invited_at: '2025-01-10T08:00:00Z',
    joined_at: '2025-01-10T08:30:00Z',
    left_at: null,
    created_at: '2025-01-10T08:00:00Z',
    updated_at: '2025-01-10T08:30:00Z',
    role_assignments: [
      { id: 1, membership_id: 1, role_id: 1, role: canonicalRoles[0] },
    ],
  },
  {
    id: 2,
    user_id: 1,
    restaurant_id: 2,
    status: 'active',
    invited_at: '2025-03-15T09:00:00Z',
    joined_at: '2025-03-15T09:15:00Z',
    left_at: null,
    created_at: '2025-03-15T09:00:00Z',
    updated_at: '2025-03-15T09:15:00Z',
    role_assignments: [
      { id: 2, membership_id: 2, role_id: 1, role: canonicalRoles[0] },
    ],
  },
  {
    id: 3,
    user_id: 1,
    restaurant_id: 3,
    status: 'active',
    invited_at: '2025-06-20T11:00:00Z',
    joined_at: '2025-06-20T11:10:00Z',
    left_at: null,
    created_at: '2025-06-20T11:00:00Z',
    updated_at: '2025-06-20T11:10:00Z',
    role_assignments: [
      { id: 3, membership_id: 3, role_id: 1, role: canonicalRoles[0] },
    ],
  },

  // User 2 (Sara - Operations Director) in Restaurants 1 and 2
  {
    id: 4,
    user_id: 2,
    restaurant_id: 1,
    status: 'active',
    invited_at: '2025-01-11T10:00:00Z',
    joined_at: '2025-01-11T10:15:00Z',
    left_at: null,
    created_at: '2025-01-11T10:00:00Z',
    updated_at: '2025-01-11T10:15:00Z',
    role_assignments: [
      { id: 4, membership_id: 4, role_id: 2, role: canonicalRoles[1] },
    ],
  },
  {
    id: 5,
    user_id: 2,
    restaurant_id: 2,
    status: 'active',
    invited_at: '2025-03-16T10:00:00Z',
    joined_at: '2025-03-16T10:20:00Z',
    left_at: null,
    created_at: '2025-03-16T10:00:00Z',
    updated_at: '2025-03-16T10:20:00Z',
    role_assignments: [
      { id: 5, membership_id: 5, role_id: 2, role: canonicalRoles[1] },
    ],
  },

  // User 3 (Ahmed Al-Mansoor - Branch Manager & Head Chef) in Restaurant 1
  {
    id: 6,
    user_id: 3,
    restaurant_id: 1,
    status: 'active',
    invited_at: '2025-01-12T09:00:00Z',
    joined_at: '2025-01-12T09:30:00Z',
    left_at: null,
    created_at: '2025-01-12T09:00:00Z',
    updated_at: '2025-01-12T09:30:00Z',
    role_assignments: [
      { id: 6, membership_id: 6, role_id: 3, role: canonicalRoles[2] },
    ],
  },

  // User 4 (Khalid Al-Ghamdi - Kitchen Staff) in Restaurant 1
  {
    id: 7,
    user_id: 4,
    restaurant_id: 1,
    status: 'active',
    invited_at: '2025-06-01T08:00:00Z',
    joined_at: '2025-06-01T08:45:00Z',
    left_at: null,
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2025-06-01T08:45:00Z',
    role_assignments: [
      { id: 7, membership_id: 7, role_id: 4, role: canonicalRoles[3] },
    ],
  },

  // User 5 (Faisal - Suspended User) in Restaurant 1
  {
    id: 8,
    user_id: 5,
    restaurant_id: 1,
    status: 'suspended',
    invited_at: '2025-02-01T10:00:00Z',
    joined_at: '2025-02-01T10:15:00Z',
    left_at: '2026-02-15T00:00:00Z',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2026-02-15T00:00:00Z',
    role_assignments: [
      { id: 8, membership_id: 8, role_id: 4, role: canonicalRoles[3] },
    ],
  },

  // User 6 (Reem - Invited/Pending User) in Restaurant 2
  {
    id: 9,
    user_id: 6,
    restaurant_id: 2,
    status: 'invited',
    invited_at: '2026-03-01T09:00:00Z',
    joined_at: null,
    left_at: null,
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-01T09:00:00Z',
    role_assignments: [
      { id: 9, membership_id: 9, role_id: 4, role: canonicalRoles[3] },
    ],
  },
];

// ==========================================
// 6. CANONICAL USERS
// ==========================================
export const canonicalUsers: UserDto[] = [
  {
    id: 1,
    email: 'admin@restoraintel.com',
    name_first: 'Tariq',
    name_last: 'Al-Otaibi',
    phone: '+966 50 111 2233',
    status: 'active',
    email_verified_at: '2025-01-10T08:15:00Z',
    last_login_at: '2026-09-23T18:00:00Z',
    created_at: '2025-01-10T08:00:00Z',
    updated_at: '2026-09-23T18:00:00Z',
    deleted_at: null,
    memberships: canonicalMemberships.filter((m) => m.user_id === 1),
    roles: [canonicalRoles[0]],
    permissions: canonicalPermissions,
  },
  {
    id: 2,
    email: 'sara.qahtani@restoraintel.com',
    name_first: 'Sara',
    name_last: 'Al-Qahtani',
    phone: '+966 55 222 3344',
    status: 'active',
    email_verified_at: '2025-01-11T10:10:00Z',
    last_login_at: '2026-09-23T17:30:00Z',
    created_at: '2025-01-11T10:00:00Z',
    updated_at: '2026-09-23T17:30:00Z',
    deleted_at: null,
    memberships: canonicalMemberships.filter((m) => m.user_id === 2),
    roles: [canonicalRoles[1]],
    permissions: canonicalPermissions.filter((p) => p.code !== 'system.restaurants.manage'),
  },
  {
    id: 3,
    email: 'ahmed.mansoor@restoraintel.com',
    name_first: 'Ahmed',
    name_last: 'Al-Mansoor',
    phone: '+966 50 123 4567',
    status: 'active',
    email_verified_at: '2025-01-12T09:20:00Z',
    last_login_at: '2026-09-23T16:00:00Z',
    created_at: '2025-01-12T09:00:00Z',
    updated_at: '2026-09-23T16:00:00Z',
    deleted_at: null,
    memberships: canonicalMemberships.filter((m) => m.user_id === 3),
    roles: [canonicalRoles[2]],
    permissions: canonicalRoles[2].permissions,
  },
  {
    id: 4,
    email: 'khalid.ghamdi@restoraintel.com',
    name_first: 'Khalid',
    name_last: 'Al-Ghamdi',
    phone: '+966 55 987 6543',
    status: 'active',
    email_verified_at: '2025-06-01T08:30:00Z',
    last_login_at: '2026-09-23T12:00:00Z',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2026-09-23T12:00:00Z',
    deleted_at: null,
    memberships: canonicalMemberships.filter((m) => m.user_id === 4),
    roles: [canonicalRoles[3]],
    permissions: canonicalRoles[3].permissions,
  },
  {
    id: 5,
    email: 'suspended.user@restoraintel.com',
    name_first: 'Faisal',
    name_last: 'Al-Dossary',
    phone: '+966 54 888 7766',
    status: 'suspended',
    email_verified_at: '2025-02-01T10:10:00Z',
    last_login_at: '2026-02-14T20:00:00Z',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2026-02-15T00:00:00Z',
    deleted_at: null,
    memberships: canonicalMemberships.filter((m) => m.user_id === 5),
    roles: [canonicalRoles[3]],
    permissions: [],
  },
  {
    id: 6,
    email: 'reem.harbi@restoraintel.com',
    name_first: 'Reem',
    name_last: 'Al-Harbi',
    phone: null,
    status: 'pending',
    email_verified_at: null,
    last_login_at: null,
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-01T09:00:00Z',
    deleted_at: null,
    memberships: canonicalMemberships.filter((m) => m.user_id === 6),
    roles: [],
    permissions: [],
  },
];

// ==========================================
// 7. CANONICAL EMPLOYEES
// ==========================================
export const canonicalEmployees: EmployeeDto[] = [
  // --- Restaurant 1 (Downtown Flagship) ---
  {
    id: 101,
    restaurant_id: 1,
    user_id: 3, // Linked to user 3 (Ahmed Al-Mansoor - consistent identity!)
    position_id: 1,
    employee_number: 'EMP-0101',
    first_name: 'Ahmed',
    last_name: 'Al-Mansoor',
    email: 'ahmed.mansoor@restoraintel.com',
    phone: '+966 50 123 4567',
    hire_date: '2023-01-15',
    termination_date: null,
    status: 'active',
    created_at: '2025-01-12T09:00:00Z',
    updated_at: '2026-01-10T11:00:00Z',
    deleted_at: null,
    position: canonicalPositions[0],
  },
  {
    id: 102,
    restaurant_id: 1,
    user_id: 4, // Linked to user 4 (Khalid Al-Ghamdi - consistent identity!)
    position_id: 2,
    employee_number: 'EMP-0102',
    first_name: 'Khalid',
    last_name: 'Al-Ghamdi',
    email: 'khalid.ghamdi@restoraintel.com',
    phone: '+966 55 987 6543',
    hire_date: '2023-06-01',
    termination_date: null,
    status: 'active',
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2026-02-01T09:00:00Z',
    deleted_at: null,
    position: canonicalPositions[1],
  },
  {
    id: 103,
    restaurant_id: 1,
    user_id: null, // Employee without system user account
    position_id: 3,
    employee_number: 'EMP-0103',
    first_name: 'Noura',
    last_name: 'Al-Zahrani',
    email: 'noura.zahrani@restoraintel.com',
    phone: '+966 54 321 0987',
    hire_date: '2024-02-10',
    termination_date: null,
    status: 'on_leave',
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2026-03-01T08:00:00Z',
    deleted_at: null,
    position: canonicalPositions[2],
  },
  {
    id: 104,
    restaurant_id: 1,
    user_id: null,
    position_id: null, // Employee without assigned position
    employee_number: 'EMP-0104',
    first_name: 'Yousef',
    last_name: 'Al-Mutairi',
    email: 'yousef.m@restoraintel.com',
    phone: '+966 50 777 6655',
    hire_date: '2024-08-01',
    termination_date: null,
    status: 'inactive',
    created_at: '2025-08-01T12:00:00Z',
    updated_at: '2026-01-15T14:00:00Z',
    deleted_at: null,
    position: null,
  },
  {
    id: 105,
    restaurant_id: 1,
    user_id: null,
    position_id: 2,
    employee_number: 'EMP-0105',
    first_name: 'Ibrahim',
    last_name: 'Al-Shammari',
    email: 'ibrahim.s@restoraintel.com',
    phone: '+966 56 444 8899',
    hire_date: '2023-03-01',
    termination_date: '2024-05-30',
    status: 'terminated',
    created_at: '2025-03-01T08:00:00Z',
    updated_at: '2025-05-30T17:00:00Z',
    deleted_at: null,
    position: canonicalPositions[1],
  },
  {
    id: 106,
    restaurant_id: 1,
    user_id: null,
    position_id: 3,
    employee_number: null, // Nullable employee_number supported by backend
    first_name: 'Majed',
    last_name: 'Al-Subaie',
    email: null,
    phone: null,
    hire_date: null,
    termination_date: null,
    status: 'suspended',
    created_at: '2025-10-01T10:00:00Z',
    updated_at: '2026-01-05T09:00:00Z',
    deleted_at: null,
    position: canonicalPositions[2],
  },

  // --- Restaurant 2 (Waterfront Bistro) ---
  {
    id: 201,
    restaurant_id: 2,
    user_id: null,
    position_id: 4,
    employee_number: 'EMP-0201',
    first_name: 'Bandar',
    last_name: 'Al-Shehri',
    email: 'bandar.shehri@restoraintel.com',
    phone: '+966 52 333 4455',
    hire_date: '2023-04-10',
    termination_date: null,
    status: 'active',
    created_at: '2025-03-20T09:00:00Z',
    updated_at: '2026-01-10T12:00:00Z',
    deleted_at: null,
    position: canonicalPositions[3],
  },
  {
    id: 202,
    restaurant_id: 2,
    user_id: null,
    position_id: 5,
    employee_number: 'EMP-0202',
    first_name: 'Mona',
    last_name: 'Al-Harbi',
    email: 'mona.harbi@restoraintel.com',
    phone: '+966 53 777 8899',
    hire_date: '2023-09-01',
    termination_date: null,
    status: 'active',
    created_at: '2025-03-20T09:00:00Z',
    updated_at: '2026-02-15T15:00:00Z',
    deleted_at: null,
    position: canonicalPositions[4],
  },
  {
    id: 203,
    restaurant_id: 2,
    user_id: null,
    position_id: null,
    employee_number: 'EMP-0203',
    first_name: 'Hassan',
    last_name: 'Al-Khatib',
    email: 'hassan.k@restoraintel.com',
    phone: '+966 59 111 2233',
    hire_date: '2024-01-15',
    termination_date: null,
    status: 'active',
    created_at: '2025-04-01T10:00:00Z',
    updated_at: '2026-01-20T11:00:00Z',
    deleted_at: null,
    position: null,
  },

  // --- Restaurant 3 (Cultural Oasis) ---
  {
    id: 301,
    restaurant_id: 3,
    user_id: null,
    position_id: null,
    employee_number: 'EMP-0301',
    first_name: 'Saud',
    last_name: 'Al-Hajri',
    email: 'saud.h@restoraintel.com',
    phone: '+966 50 888 9900',
    hire_date: '2024-05-01',
    termination_date: null,
    status: 'active',
    created_at: '2025-06-25T11:00:00Z',
    updated_at: '2026-01-10T14:00:00Z',
    deleted_at: null,
    position: null,
  },
  // Note: Restaurant 5 intentionally has 0 employees for testing empty state handling.
];

// ==========================================
// 8. DETERMINISTIC LEGACY-TO-CANONICAL ID MAPPING
// ==========================================
export const legacyToCanonicalRestaurantIdMap: Record<string, number> = {
  'rest-1': 1,
  'rest-2': 2,
  'rest-3': 3,
  'rest-4': 4,
  'rest-5': 5,
};

export const legacyToCanonicalEmployeeIdMap: Record<string, number> = {
  'emp-101': 101,
  'emp-102': 102,
  'emp-103': 103,
  'emp-104': 104,
  'emp-105': 105,
  'emp-106': 106,
  'emp-201': 201,
  'emp-202': 202,
  'emp-203': 203,
  'emp-301': 301,
};

export const legacyToCanonicalUserIdMap: Record<string, number> = {
  'usr-1': 1,
  'usr-2': 2,
  'usr-3': 3,
  'usr-4': 4,
  'usr-5': 5,
  'usr-6': 6,
};
