import { describe, it, expect } from 'bun:test';
import type { RestaurantDto, RestaurantStatus } from '../backend/restaurant';
import type { EmployeeDto, EmployeeStatus } from '../backend/employee';
import type { UserDto, UserAccountStatus } from '../backend/user';
import {
  canonicalRestaurants,
  canonicalEmployees,
  canonicalUsers,
} from '../fixtures/canonicalFixtures';

describe('Canonical DTO Compatibility Tests', () => {
  describe('1. Canonical Restaurant DTO Compatibility', () => {
    it('matches required wire-level fields and types', () => {
      const restaurant: RestaurantDto = canonicalRestaurants[0];
      expect(typeof restaurant.id).toBe('string');
      expect(typeof restaurant.name).toBe('string');
      expect(typeof restaurant.slug).toBe('string');
      expect(typeof restaurant.currency_code).toBe('string');
      expect(typeof restaurant.status).toBe('string');
      expect(typeof restaurant.timezone).toBe('string');
      expect(typeof restaurant.created_at).toBe('string');
      expect(typeof restaurant.updated_at).toBe('string');
    });

    it('ensures name is a plain string, NOT a localized dictionary in DTO', () => {
      for (const rest of canonicalRestaurants) {
        expect(typeof rest.name).toBe('string');
        expect(rest.name).not.toHaveProperty('ar');
        expect(rest.name).not.toHaveProperty('en');
      }
    });

    it('ensures currency_code is used instead of currency', () => {
      for (const rest of canonicalRestaurants) {
        expect(rest.currency_code).toBe('SAR');
        expect((rest as unknown as Record<string, unknown>).currency).toBeUndefined();
      }
    });
  });

  describe('2. Canonical Employee DTO Compatibility', () => {
    it('matches required workforce fields', () => {
      const emp: EmployeeDto = canonicalEmployees[0];
      expect(typeof emp.id).toBe('string');
      expect(typeof emp.restaurant_id).toBe('string');
      expect(typeof emp.employee_number).toBe('string');
      expect(typeof emp.first_name).toBe('string');
      expect(typeof emp.last_name).toBe('string');
      expect(typeof emp.email).toBe('string');
      expect(typeof emp.phone).toBe('string');
      expect(typeof emp.hire_date).toBe('string');
      expect(typeof emp.status).toBe('string');
    });

    it('uses canonical employee_number instead of employee_code', () => {
      for (const emp of canonicalEmployees) {
        expect(emp.employee_number).toMatch(/^EMP-\d{4}$/);
        expect((emp as unknown as Record<string, unknown>).employee_code).toBeUndefined();
      }
    });

    it('keeps first_name and last_name as plain strings in canonical DTO', () => {
      for (const emp of canonicalEmployees) {
        expect(typeof emp.first_name).toBe('string');
        expect(typeof emp.last_name).toBe('string');
        expect(emp.first_name).not.toHaveProperty('ar');
        expect(emp.last_name).not.toHaveProperty('en');
      }
    });
  });

  describe('3. Canonical User DTO Compatibility', () => {
    it('matches user identity fields and separate name_first / name_last', () => {
      const user: UserDto = canonicalUsers[0];
      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.name_first).toBe('string');
      expect(typeof user.name_last).toBe('string');
      expect(typeof user.status).toBe('string');
      expect(user.email).toContain('@');
    });

    it('does not conflate user authentication identity with direct restaurant ownership', () => {
      for (const user of canonicalUsers) {
        // User identity should NOT have a single hardcoded direct restaurant_id
        expect((user as unknown as Record<string, unknown>).restaurant_id).toBeUndefined();
        // Memberships represent tenant links
        expect(Array.isArray(user.memberships)).toBe(true);
      }
    });
  });

  describe('4. Nullable and Optional Fields', () => {
    it('allows nullable user_id on employees without system accounts', () => {
      const unlinkedEmp = canonicalEmployees.find((e) => e.id === 'emp-102');
      expect(unlinkedEmp).toBeDefined();
      expect(unlinkedEmp?.user_id).toBeNull();
    });

    it('allows nullable position_id on employees without formal positions', () => {
      const unassignedEmp = canonicalEmployees.find((e) => e.id === 'emp-202');
      expect(unassignedEmp).toBeDefined();
      expect(unassignedEmp?.position_id).toBeNull();
      expect(unassignedEmp?.position).toBeNull();
    });

    it('allows nullable termination_date on active staff and valid string on terminated staff', () => {
      const activeEmp = canonicalEmployees.find((e) => e.status === 'active');
      const terminatedEmp = canonicalEmployees.find((e) => e.status === 'terminated');

      expect(activeEmp?.termination_date).toBeNull();
      expect(typeof terminatedEmp?.termination_date).toBe('string');
    });

    it('allows nullable email_verified_at and last_login_at on pending users', () => {
      const pendingUser = canonicalUsers.find((u) => u.id === 'usr-3');
      expect(pendingUser?.status).toBe('pending');
      expect(pendingUser?.email_verified_at).toBeNull();
      expect(pendingUser?.last_login_at).toBeNull();
    });
  });

  describe('5. Valid and Invalid Enum Values', () => {
    const validRestaurantStatuses: RestaurantStatus[] = ['active', 'inactive', 'suspended', 'archived'];
    const validEmployeeStatuses: EmployeeStatus[] = ['active', 'inactive', 'on_leave', 'terminated', 'suspended'];
    const validUserStatuses: UserAccountStatus[] = ['active', 'suspended', 'pending'];

    it('validates that all restaurant fixtures use supported backend statuses', () => {
      for (const rest of canonicalRestaurants) {
        expect(validRestaurantStatuses).toContain(rest.status);
      }
    });

    it('validates that all employee fixtures use supported employment statuses', () => {
      for (const emp of canonicalEmployees) {
        expect(validEmployeeStatuses).toContain(emp.status);
      }
    });

    it('rejects operational shift states (on_shift, on_break) from canonical employment status', () => {
      const operationalStates = ['on_shift', 'on_break', 'off_duty'];
      for (const emp of canonicalEmployees) {
        expect(operationalStates).not.toContain(emp.status);
      }
    });

    it('validates that all user fixtures use valid account statuses', () => {
      for (const user of canonicalUsers) {
        expect(validUserStatuses).toContain(user.status);
      }
    });
  });
});
