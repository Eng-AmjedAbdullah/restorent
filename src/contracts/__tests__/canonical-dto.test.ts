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
    it('matches required wire-level fields and types with integer database IDs', () => {
      const restaurant: RestaurantDto = canonicalRestaurants[0];
      expect(typeof restaurant.id).toBe('number');
      expect(Number.isInteger(restaurant.id)).toBe(true);
      expect(typeof restaurant.name).toBe('string');
      expect(typeof restaurant.slug).toBe('string');
      expect(typeof restaurant.currency_code).toBe('string');
      expect(typeof restaurant.status).toBe('string');
      expect(typeof restaurant.timezone).toBe('string');
      expect(typeof restaurant.created_at).toBe('string');
      expect(typeof restaurant.updated_at).toBe('string');
    });

    it('ensures name is a plain string, NOT a localized dictionary in wire DTO', () => {
      for (const rest of canonicalRestaurants) {
        expect(typeof rest.name).toBe('string');
        expect(rest.name).not.toHaveProperty('ar');
        expect(rest.name).not.toHaveProperty('en');
      }
    });

    it('ensures currency_code is used instead of currency', () => {
      for (const rest of canonicalRestaurants) {
        expect(typeof rest.currency_code).toBe('string');
        expect((rest as unknown as Record<string, unknown>).currency).toBeUndefined();
      }
    });

    it('supports multiple currency codes beyond SAR', () => {
      const demoCurrencies = ['SAR', 'AED', 'USD', 'EUR', 'KWD'];
      for (const code of demoCurrencies) {
        const dummyRest: RestaurantDto = {
          id: 999,
          name: 'Multi-Currency Test',
          slug: 'test-cur',
          currency_code: code,
          status: 'active',
          timezone: 'Asia/Dubai',
          address: null,
          city: null,
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-01T00:00:00Z',
          deleted_at: null,
        };
        expect(dummyRest.currency_code).toBe(code);
      }
    });
  });

  describe('2. Canonical Employee DTO Compatibility', () => {
    it('matches required workforce fields with integer IDs and restaurant foreign keys', () => {
      const emp: EmployeeDto = canonicalEmployees[0];
      expect(typeof emp.id).toBe('number');
      expect(Number.isInteger(emp.id)).toBe(true);
      expect(typeof emp.restaurant_id).toBe('number');
      expect(Number.isInteger(emp.restaurant_id)).toBe(true);
      expect(typeof emp.first_name).toBe('string');
      expect(typeof emp.last_name).toBe('string');
      expect(typeof emp.status).toBe('string');
    });

    it('uses canonical employee_number instead of legacy employee_code on wire model', () => {
      for (const emp of canonicalEmployees) {
        if (emp.employee_number !== null) {
          expect(emp.employee_number).toMatch(/^EMP-\d{4}$/);
        }
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
    it('matches user identity fields with integer primary key and separate name_first / name_last', () => {
      const user: UserDto = canonicalUsers[0];
      expect(typeof user.id).toBe('number');
      expect(Number.isInteger(user.id)).toBe(true);
      expect(typeof user.email).toBe('string');
      expect(typeof user.name_first).toBe('string');
      expect(typeof user.name_last).toBe('string');
      expect(typeof user.status).toBe('string');
    });

    it('does not conflate user authentication identity with direct restaurant ownership', () => {
      for (const user of canonicalUsers) {
        // User identity should NOT have a single hardcoded direct restaurant_id
        expect((user as unknown as Record<string, unknown>).restaurant_id).toBeUndefined();
        // Instead, memberships hold restaurant associations
        if (user.memberships) {
          for (const membership of user.memberships) {
            expect(typeof membership.restaurant_id).toBe('number');
            expect(typeof membership.user_id).toBe('number');
            expect(membership.user_id).toBe(user.id);
          }
        }
      }
    });
  });

  describe('4. Nullable and Optional Fields', () => {
    it('allows nullable user_id on employees without system accounts', () => {
      const staffWithoutAccount = canonicalEmployees.find((e) => e.user_id === null);
      expect(staffWithoutAccount).toBeDefined();
      expect(staffWithoutAccount?.user_id).toBeNull();
    });

    it('allows nullable position_id on employees without formal positions', () => {
      const staffWithoutPosition = canonicalEmployees.find((e) => e.position_id === null);
      expect(staffWithoutPosition).toBeDefined();
      expect(staffWithoutPosition?.position_id).toBeNull();
    });

    it('allows nullable termination_date on active staff and valid string on terminated staff', () => {
      const activeStaff = canonicalEmployees.find((e) => e.status === 'active');
      const terminatedStaff = canonicalEmployees.find((e) => e.status === 'terminated');

      expect(activeStaff?.termination_date).toBeNull();
      expect(terminatedStaff?.termination_date).toBe('2024-05-30');
    });

    it('allows nullable email, phone, and employee_number on employee wire model', () => {
      const minimalEmp = canonicalEmployees.find((e) => e.employee_number === null);
      expect(minimalEmp).toBeDefined();
      expect(minimalEmp?.email).toBeNull();
      expect(minimalEmp?.phone).toBeNull();
    });

    it('allows nullable email_verified_at and last_login_at on pending users', () => {
      const pendingUser = canonicalUsers.find((u) => u.status === 'pending');
      expect(pendingUser).toBeDefined();
      expect(pendingUser?.email_verified_at).toBeNull();
      expect(pendingUser?.last_login_at).toBeNull();
    });
  });

  describe('5. Valid and Invalid Enum Values', () => {
    it('validates that all restaurant fixtures use supported backend statuses', () => {
      const validStatuses: RestaurantStatus[] = ['active', 'inactive', 'suspended', 'archived'];
      for (const rest of canonicalRestaurants) {
        expect(validStatuses.includes(rest.status)).toBe(true);
      }
    });

    it('validates that all employee fixtures use supported employment statuses', () => {
      const validStatuses: EmployeeStatus[] = ['active', 'inactive', 'on_leave', 'terminated', 'suspended'];
      for (const emp of canonicalEmployees) {
        expect(validStatuses.includes(emp.status)).toBe(true);
      }
    });

    it('rejects operational shift states (on_shift, on_break) from canonical employment status', () => {
      const invalidStatuses = ['on_shift', 'on_break', 'off_duty', 'late'];
      for (const invalid of invalidStatuses) {
        const isSupported = (canonicalEmployees as unknown as Array<{ status: string }>).some(
          (e) => e.status === invalid
        );
        expect(isSupported).toBe(false);
      }
    });

    it('validates that all user fixtures use valid account statuses', () => {
      const validUserStatuses: UserAccountStatus[] = ['active', 'suspended', 'pending'];
      for (const user of canonicalUsers) {
        expect(validUserStatuses.includes(user.status)).toBe(true);
      }
    });
  });
});
