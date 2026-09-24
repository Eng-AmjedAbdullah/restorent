/** Temporary typed compatibility boundary: numeric Laravel DTOs -> old Vue presentation contracts.
 * Remove only after Vue components have been migrated to src/contracts/presentation/ directly.
 */
import type { RestaurantDto } from '@/contracts/backend/restaurant';
import type { UserDto } from '@/contracts/backend/user';
import type { EmployeeDto } from '@/contracts/backend/employee';
import type { PositionDto } from '@/contracts/backend/position';
import type { Restaurant, User, Employee, Position, UserRole } from '@/types/domain';
import { mapRestaurantToPresentation } from '@/contracts/mappers/restaurant.mapper';
import { mapUserToPresentation } from '@/contracts/mappers/user.mapper';
import { mapEmployeeToPresentation } from '@/contracts/mappers/employee.mapper';
import { canonicalRestaurants, canonicalEmployees } from '@/contracts/fixtures/canonicalFixtures';
import { mockRestaurants } from '@/mocks/restaurants';
import { mockUsers } from '@/mocks/users';
import { mockEmployees } from '@/mocks/employees';

export function wireId(id: string, kind: 'rest' | 'emp' | 'usr' | 'pos'): number {
  const matched = new RegExp(`^${kind}-(\\d+)$`).exec(id);
  if (!matched) throw new Error(`Invalid ${kind} presentation ID: ${id}`);
  const n = Number(matched[1]);
  if (!Number.isSafeInteger(n) || n <= 0) throw new Error(`Invalid ${kind} identifier.`);
  return n;
}
export const legacyRestaurantId = (n: number): string => `rest-${n}`;

export function toLegacyRestaurant(dto: RestaurantDto): Restaurant {
  const p = mapRestaurantToPresentation(dto);
  const original = canonicalRestaurants.find(r => r.id === dto.id);
  const known = mockRestaurants.find(r => r.id === `rest-${dto.id}` && r.name.en === dto.name);
  const name = original?.name === dto.name ? p.name : { ar: dto.name, en: dto.name };
  const city = p.city ?? { ar: dto.city ?? '', en: dto.city ?? '' };
  const address = p.address ?? { ar: dto.address ?? '', en: dto.address ?? '' };
  return {
    id: `rest-${dto.id}`, name, code: p.code, city, address,
    branch_type: known?.branch_type ?? 'dine_in', timezone: dto.timezone, currency: dto.currency_code,
    active_tables_count: known?.active_tables_count ?? 0, capacity: known?.capacity ?? 0,
    manager_id: known?.manager_id ?? '', status: dto.status === 'active' ? 'active' : 'closed',
    created_at: dto.created_at, updated_at: dto.updated_at,
    ...(known?.organization_id ? { organization_id: known.organization_id } : {})
  };
}
export function toLegacyUser(dto: UserDto): User {
  const p = mapUserToPresentation(dto);
  const known = mockUsers.find(u => u.email.toLowerCase() === dto.email.toLowerCase());
  const roleId = dto.roles?.[0]?.id;
  const role: UserRole = roleId === 1 ? 'super_admin' : roleId === 2 ? 'operations_director' :
    roleId === 3 ? 'general_manager' : roleId === 4 ? 'chef' : 'shift_supervisor';
  return {
    id: `usr-${dto.id}`, restaurant_id: p.default_restaurant_id ? `rest-${p.default_restaurant_id}` : '',
    name: p.full_name, email: dto.email, role, phone: dto.phone ?? undefined,
    avatar_url: known?.avatar_url, is_active: dto.status === 'active', last_login_at: dto.last_login_at ?? undefined,
    created_at: dto.created_at, updated_at: dto.updated_at,
  };
}
export function toLegacyPosition(dto: PositionDto): Position {
  const department = /kitchen|chef/i.test(dto.department ?? dto.name) ? 'kitchen' :
    /bar/i.test(dto.department ?? dto.name) ? 'bar' : /manage/i.test(dto.department ?? dto.name) ? 'management' : 'service';
  return { id: `pos-${dto.id}`, title: { ar: dto.name, en: dto.name }, department,
    hourly_rate_sar: 0, min_experience_years: 0, created_at: dto.created_at, updated_at: dto.updated_at };
}
export function toLegacyEmployee(dto: EmployeeDto): Employee {
  const p = mapEmployeeToPresentation(dto);
  const original = canonicalEmployees.find(e => e.id === dto.id);
  const originalNames = original && original.first_name === dto.first_name && original.last_name === dto.last_name;
  const known = originalNames ? mockEmployees.find(e => e.id === `emp-${dto.id}` &&
    e.first_name.en === dto.first_name && e.last_name.en === dto.last_name) : undefined;
  const name = originalNames ? p.first_name : { ar: dto.first_name, en: dto.first_name };
  const surname = originalNames ? p.last_name : { ar: dto.last_name, en: dto.last_name };
  return {
    id: `emp-${dto.id}`, restaurant_id: `rest-${dto.restaurant_id}`,
    employee_code: dto.employee_number ?? `EMP-${String(dto.id).padStart(4, '0')}`,
    first_name: name, last_name: surname, email: dto.email ?? '', phone: dto.phone ?? '',
    position_id: dto.position_id === null ? '' : `pos-${dto.position_id}`,
    position: dto.position ? toLegacyPosition(dto.position) : undefined,
    hire_date: dto.hire_date ?? '', contract_type: known?.contract_type ?? 'full_time',
    status: dto.status, avatar_url: known?.avatar_url ?? '',
    skills: known?.skills ?? [],
    leave_balance: known?.leave_balance ?? { annual_days: 0, sick_days: 0, emergency_days: 0 },
    performance_score: known?.performance_score ?? 0, hourly_rate: known?.hourly_rate ?? 0,
    emergency_contact: known?.emergency_contact ?? { name: '', relationship: '', phone: '' },
    created_at: dto.created_at, updated_at: dto.updated_at,
  };
}
