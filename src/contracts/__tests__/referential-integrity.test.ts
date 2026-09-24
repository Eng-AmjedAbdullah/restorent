import { describe, it, expect } from 'bun:test';
import {
  canonicalRestaurants,
  canonicalEmployees,
  canonicalUsers,
  canonicalPositions,
  canonicalMemberships,
} from '../fixtures/canonicalFixtures';

describe('Referential Integrity Tests', () => {
  describe('14. Referential Integrity of Representative Mock Fixtures', () => {
    it('ensures every employee belongs to a valid restaurant in canonicalRestaurants', () => {
      const validRestaurantIds = new Set(canonicalRestaurants.map((r) => r.id));

      for (const emp of canonicalEmployees) {
        expect(validRestaurantIds.has(emp.restaurant_id)).toBe(true);
      }
    });

    it('strictly isolates employees by restaurant tenant boundary', () => {
      const rest1Employees = canonicalEmployees.filter((e) => e.restaurant_id === 'rest-1');
      const rest2Employees = canonicalEmployees.filter((e) => e.restaurant_id === 'rest-2');

      expect(rest1Employees.length).toBe(3);
      expect(rest2Employees.length).toBe(3);

      const rest1EmpIds = new Set(rest1Employees.map((e) => e.id));
      for (const emp of rest2Employees) {
        expect(rest1EmpIds.has(emp.id)).toBe(false);
      }
    });

    it('ensures employee position_id references a valid position or is null', () => {
      const validPositionIds = new Set(canonicalPositions.map((p) => p.id));

      for (const emp of canonicalEmployees) {
        if (emp.position_id !== null) {
          expect(validPositionIds.has(emp.position_id)).toBe(true);
        }
      }
    });

    it('ensures user memberships link to valid users and restaurants', () => {
      const validUserIds = new Set(canonicalUsers.map((u) => u.id));
      const validRestaurantIds = new Set(canonicalRestaurants.map((r) => r.id));

      for (const membership of canonicalMemberships) {
        expect(validUserIds.has(membership.user_id)).toBe(true);
        expect(validRestaurantIds.has(membership.restaurant_id)).toBe(true);
      }
    });

    it('ensures employee user_id references an existing user when not null', () => {
      const validUserIds = new Set(canonicalUsers.map((u) => u.id));

      for (const emp of canonicalEmployees) {
        if (emp.user_id !== null) {
          expect(validUserIds.has(emp.user_id)).toBe(true);
        }
      }
    });
  });
});
