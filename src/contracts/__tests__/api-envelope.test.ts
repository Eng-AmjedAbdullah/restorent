import { describe, it, expect } from 'bun:test';
import type {
  ApiSuccessResponse,
  ApiValidationErrorResponse,
  ApiAuthenticationErrorResponse,
  ApiAuthorizationErrorResponse,
  ApiNotFoundErrorResponse,
} from '../backend/envelope';
import {
  mapToCreateRestaurantRequest,
  mapToUpdateRestaurantRequest,
} from '../mappers/restaurant.mapper';
import {
  mapToCreateEmployeeRequest,
  mapToUpdateEmployeeRequest,
} from '../mappers/employee.mapper';
import { canonicalRestaurants } from '../fixtures/canonicalFixtures';

describe('API Response Envelope & Request Payload Tests', () => {
  describe('6. Successful API Response Envelopes', () => {
    it('structures success envelope with status, message, data, and meta', () => {
      const response: ApiSuccessResponse<typeof canonicalRestaurants> = {
        status: 'success',
        message: 'Restaurants retrieved successfully.',
        data: canonicalRestaurants,
        meta: { total: 3, page: 1 },
      };

      expect(response.status).toBe('success');
      expect(response.message).toBe('Restaurants retrieved successfully.');
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBe(3);
      expect(response.meta).toBeDefined();
    });

    it('supports empty array meta envelope as common in Laravel resource responses', () => {
      const response: ApiSuccessResponse<{ id: string }> = {
        status: 'success',
        message: 'Resource retrieved.',
        data: { id: 'rest-1' },
        meta: [],
      };

      expect(response.status).toBe('success');
      expect(Array.isArray(response.meta)).toBe(true);
    });
  });

  describe('7. Structured API Error Envelopes', () => {
    it('structures HTTP 422 validation errors with field-level string arrays', () => {
      const valError: ApiValidationErrorResponse = {
        status: 'error',
        message: 'The given data was invalid.',
        errors: {
          email: ['The email field is required.', 'The email must be a valid email address.'],
          first_name: ['The first name field is required.'],
          phone: ['The phone format is invalid for region SA.'],
        },
        meta: [],
      };

      expect(valError.status).toBe('error');
      expect(valError.errors).not.toBeNull();
      expect(Array.isArray(valError.errors.email)).toBe(true);
      expect(valError.errors.email.length).toBe(2);
      expect(valError.errors.first_name[0]).toContain('required');
    });

    it('structures HTTP 401 unauthenticated response with null errors', () => {
      const authError: ApiAuthenticationErrorResponse = {
        status: 'error',
        message: 'Unauthenticated. Valid bearer token required.',
        errors: null,
        meta: [],
      };

      expect(authError.status).toBe('error');
      expect(authError.errors).toBeNull();
    });

    it('structures HTTP 403 forbidden response with null errors', () => {
      const forbiddenError: ApiAuthorizationErrorResponse = {
        status: 'error',
        message: 'This action is unauthorized for the given restaurant tenant.',
        errors: null,
        meta: [],
      };

      expect(forbiddenError.status).toBe('error');
      expect(forbiddenError.errors).toBeNull();
    });

    it('structures HTTP 404 not found response with null errors', () => {
      const notFoundError: ApiNotFoundErrorResponse = {
        status: 'error',
        message: 'No query results for model [App\\Models\\Employee] emp-999',
        errors: null,
        meta: [],
      };

      expect(notFoundError.status).toBe('error');
      expect(notFoundError.errors).toBeNull();
    });
  });

  describe('8. Request Payload Restrictions', () => {
    it('prohibits database-generated ID and timestamps when creating a restaurant', () => {
      const createReq = mapToCreateRestaurantRequest({
        id: 'forbidden-id-123',
        name: { ar: 'فرع تجريبي', en: 'Demo Branch' },
        raw_name: 'Demo Branch',
        currency_code: 'SAR',
        timezone: 'Asia/Riyadh',
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      });

      expect(createReq.name).toBe('Demo Branch');
      expect(createReq.currency_code).toBe('SAR');
      expect((createReq as unknown as Record<string, unknown>).id).toBeUndefined();
      expect((createReq as unknown as Record<string, unknown>).created_at).toBeUndefined();
      expect((createReq as unknown as Record<string, unknown>).updated_at).toBeUndefined();
      expect((createReq as unknown as Record<string, unknown>).slug).toBeUndefined();
    });

    it('prohibits immutable fields and slug from restaurant update payload', () => {
      const updateReq = mapToUpdateRestaurantRequest({
        id: 'forbidden-id-123',
        raw_name: 'Updated Branch Name',
        timezone: 'Asia/Riyadh',
        created_at: '2026-01-01',
      });

      expect(updateReq.name).toBe('Updated Branch Name');
      expect((updateReq as unknown as Record<string, unknown>).id).toBeUndefined();
      expect((updateReq as unknown as Record<string, unknown>).created_at).toBeUndefined();
    });

    it('prohibits route-scoped restaurant_id and database ID from employee creation payload', () => {
      const createEmpReq = mapToCreateEmployeeRequest({
        id: 'forbidden-emp-id',
        restaurant_id: 'rest-1',
        first_name: { ar: 'سامي', en: 'Sami' },
        last_name: { ar: 'النجار', en: 'Al-Najjar' },
        raw_first_name: 'Sami',
        raw_last_name: 'Al-Najjar',
        email: 'sami.najjar@restoraintel.com',
        phone: '+966 50 111 4455',
        hire_date: '2026-03-01',
        employee_code: 'EMP-0501',
        created_at: '2026-01-01',
      });

      expect(createEmpReq.first_name).toBe('Sami');
      expect(createEmpReq.last_name).toBe('Al-Najjar');
      expect(createEmpReq.employee_number).toBe('EMP-0501');
      // Prohibited in request body:
      expect((createEmpReq as unknown as Record<string, unknown>).id).toBeUndefined();
      expect((createEmpReq as unknown as Record<string, unknown>).restaurant_id).toBeUndefined();
      expect((createEmpReq as unknown as Record<string, unknown>).created_at).toBeUndefined();
    });

    it('prohibits tenant modification in employee update payload', () => {
      const updateEmpReq = mapToUpdateEmployeeRequest({
        id: 'emp-101',
        restaurant_id: 'rest-2', // Attempting to change tenant ownership
        raw_first_name: 'Ahmed Updated',
      });

      expect(updateEmpReq.first_name).toBe('Ahmed Updated');
      expect((updateEmpReq as unknown as Record<string, unknown>).id).toBeUndefined();
      expect((updateEmpReq as unknown as Record<string, unknown>).restaurant_id).toBeUndefined();
    });
  });
});
