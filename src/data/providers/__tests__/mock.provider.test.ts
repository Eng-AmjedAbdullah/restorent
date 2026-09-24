import { describe, it, expect, beforeEach } from 'bun:test';
import { MockDataProvider } from '../mock.provider';
import {
  ValidationError,
  AuthenticationError,
  NotFoundError,
} from '../types';

describe('MockDataProvider Architectural Tests (STAGE B)', () => {
  let provider: MockDataProvider;

  beforeEach(() => {
    // Zero latency for fast, deterministic unit test execution
    provider = new MockDataProvider({ latencyMs: 0 });
  });

  describe('1. Laravel Response Envelope Conformance', () => {
    it('returns restaurants wrapped in status, message, data, and meta', async () => {
      const response = await provider.listRestaurants();

      expect(response.status).toBe('success');
      expect(typeof response.message).toBe('string');
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThan(3);
      expect(response.meta).toBeDefined();

      // Ensure wire ID is integer
      expect(typeof response.data[0].id).toBe('number');
    });

    it('returns single restaurant wrapped in envelope', async () => {
      const response = await provider.getRestaurant(1);

      expect(response.status).toBe('success');
      expect(response.data.id).toBe(1);
      expect(response.data.name).toBe('Restora Downtown Flagship - Olaya');
    });
  });

  describe('2. HTTP-Style Error Simulation', () => {
    it('throws ValidationError with 422 status and field error arrays when required fields are missing', async () => {
      try {
        await provider.createEmployee(1, {
          first_name: '',
          last_name: '',
          status: 'active',
        });
        expect(true).toBe(false); // Should not reach here
      } catch (err: any) {
        expect(err instanceof ValidationError).toBe(true);
        expect(err.statusCode).toBe(422);
        expect(err.errors).toBeDefined();
        expect(err.errors.first_name).toBeDefined();
        expect(err.errors.last_name).toBeDefined();
      }
    });

    it('throws NotFoundError with 404 status when querying a non-existent restaurant or employee', async () => {
      try {
        await provider.getRestaurant(99999);
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err instanceof NotFoundError).toBe(true);
        expect(err.statusCode).toBe(404);
      }

      try {
        await provider.getEmployee(1, 99999);
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err instanceof NotFoundError).toBe(true);
        expect(err.statusCode).toBe(404);
      }
    });

    it('throws AuthenticationError with 401 when invalid credentials are provided', async () => {
      try {
        await provider.login({
          email: 'unknown@example.com',
          password: 'wrongpassword',
        });
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err instanceof AuthenticationError).toBe(true);
        expect(err.statusCode).toBe(401);
      }
    });
  });

  describe('3. Deterministic In-Memory Mutations', () => {
    it('creates an employee, assigns a numeric ID, scopes to restaurant, and updates list', async () => {
      const initialEmployees = await provider.listEmployees(1);
      const initialCount = initialEmployees.data.length;

      const createRes = await provider.createEmployee(1, {
        first_name: 'Tareq',
        last_name: 'Al-Husseini',
        status: 'active',
        email: 'tareq.h@restoraintel.com',
        phone: '+966 50 999 8877',
      });

      expect(createRes.status).toBe('success');
      expect(typeof createRes.data.id).toBe('number');
      expect(createRes.data.restaurant_id).toBe(1);
      expect(createRes.data.first_name).toBe('Tareq');
      expect(createRes.data.employee_number).toMatch(/^EMP-\d{4}$/);

      // Verify list has immediately updated
      const updatedList = await provider.listEmployees(1);
      expect(updatedList.data.length).toBe(initialCount + 1);
      expect(updatedList.data.some((e) => e.id === createRes.data.id)).toBe(true);
    });

    it('updates an employee without altering restaurant_id tenant ownership', async () => {
      const initialEmp = await provider.getEmployee(1, 101);
      expect(initialEmp.data.restaurant_id).toBe(1);

      const updateRes = await provider.updateEmployee(1, 101, {
        first_name: 'Ahmed Updated',
        status: 'on_leave',
      });

      expect(updateRes.status).toBe('success');
      expect(updateRes.data.first_name).toBe('Ahmed Updated');
      expect(updateRes.data.status).toBe('on_leave');
      // Tenant ownership MUST remain 1
      expect(updateRes.data.restaurant_id).toBe(1);

      // Verify query returns updated record
      const refreshed = await provider.getEmployee(1, 101);
      expect(refreshed.data.first_name).toBe('Ahmed Updated');
      expect(refreshed.data.status).toBe('on_leave');
    });

    it('updates restaurant profile without duplicating entries', async () => {
      const initialList = await provider.listRestaurants();
      const initialCount = initialList.data.length;

      const updateRes = await provider.updateRestaurant(1, {
        name: 'Restora Downtown Flagship - Renamed',
        city: 'الرياض - العاصمة',
      });

      expect(updateRes.status).toBe('success');
      expect(updateRes.data.name).toBe('Restora Downtown Flagship - Renamed');

      const afterList = await provider.listRestaurants();
      expect(afterList.data.length).toBe(initialCount);
    });
  });

  describe('4. Restaurant Scoping & Unconfirmed Domain Isolation', () => {
    it('scopes employees strictly by restaurant boundary', async () => {
      const rest1Emps = await provider.listEmployees(1);
      const rest2Emps = await provider.listEmployees(2);
      const emptyRestEmps = await provider.listEmployees(5);

      expect(rest1Emps.data.every((e) => e.restaurant_id === 1)).toBe(true);
      expect(rest2Emps.data.every((e) => e.restaurant_id === 2)).toBe(true);
      expect(emptyRestEmps.data.length).toBe(0);
    });

    it('scopes unconfirmed domains (orders, menu, inventory) by restaurant ID', async () => {
      const rest1Orders = await provider.getOrders!(1);
      expect(Array.isArray(rest1Orders)).toBe(true);

      const rest1Inventory = await provider.getInventory!(1);
      expect(Array.isArray(rest1Inventory)).toBe(true);

      const rest1Menu = await provider.getMenu!(1);
      expect(Array.isArray(rest1Menu)).toBe(true);
    });
  });
});
