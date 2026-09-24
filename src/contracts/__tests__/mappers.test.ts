import { describe, it, expect } from 'bun:test';
import { mapRestaurantToPresentation } from '../mappers/restaurant.mapper';
import { mapEmployeeToPresentation } from '../mappers/employee.mapper';
import { mapUserToPresentation } from '../mappers/user.mapper';
import {
  canonicalRestaurants,
  canonicalEmployees,
  canonicalUsers,
} from '../fixtures/canonicalFixtures';
import type { RestaurantDto } from '../backend/restaurant';
import type { EmployeeDto } from '../backend/employee';

describe('Presentation Mapper Tests', () => {
  describe('9. Restaurant-to-Presentation Mapping', () => {
    it('maps canonical DTO to presentation model with localized fields and status badge', () => {
      const dto = canonicalRestaurants[0]; // rest-1
      const presentation = mapRestaurantToPresentation(dto, { useMockCatalog: true });

      expect(presentation.id).toBe('rest-1');
      expect(presentation.raw_name).toBe('Restora Downtown Flagship - Olaya');
      expect(presentation.name.ar).toBe('ريستورا سنترال - فرع العليا الرئيسي');
      expect(presentation.name.en).toBe('Restora Downtown Flagship - Olaya');
      expect(presentation.currency).toBe('SAR');
      expect(presentation.currency_code).toBe('SAR');
      expect(presentation.status).toBe('active');
      expect(presentation.is_active).toBe(true);
      expect(presentation.status_badge.variant).toBe('success');
      expect(presentation.status_badge.label.ar).toBe('نشط وتشغيلي');
    });

    it('generates uppercase code from slug for presentation', () => {
      const dto = canonicalRestaurants[0];
      const presentation = mapRestaurantToPresentation(dto);
      expect(presentation.code).toBe('RUH-01');
    });
  });

  describe('10. Employee-to-Presentation Mapping', () => {
    it('maps canonical EmployeeDto to presentation model with full_name and employee_code alias', () => {
      const dto = canonicalEmployees[0]; // emp-101
      const presentation = mapEmployeeToPresentation(dto, { useMockCatalog: true });

      expect(presentation.id).toBe('emp-101');
      expect(presentation.employee_number).toBe('EMP-0101');
      expect(presentation.employee_code).toBe('EMP-0101'); // Backward-compatibility alias
      expect(presentation.first_name.ar).toBe('أحمد');
      expect(presentation.first_name.en).toBe('Ahmed');
      expect(presentation.last_name.ar).toBe('المنصور');
      expect(presentation.last_name.en).toBe('Al-Mansoor');
      expect(presentation.full_name.ar).toBe('أحمد المنصور');
      expect(presentation.full_name.en).toBe('Ahmed Al-Mansoor');
      expect(presentation.status_badge.variant).toBe('success');
      expect(presentation.status_badge.label.ar).toBe('نشط بالخدمة');
    });

    it('maps position relationship to position_name when present', () => {
      const dto = canonicalEmployees[0];
      const presentation = mapEmployeeToPresentation(dto, { useMockCatalog: true });
      expect(presentation.position_name).not.toBeNull();
      expect(presentation.position_name?.en).toBe('Executive Head Chef');
    });
  });

  describe('11. User-to-Presentation Mapping', () => {
    it('maps canonical UserDto to presentation model with full_name and tenant memberships', () => {
      const dto = canonicalUsers[0]; // usr-1
      const presentation = mapUserToPresentation(dto, { useMockCatalog: true });

      expect(presentation.id).toBe('usr-1');
      expect(presentation.email).toBe('sara.qahtani@restoraintel.com');
      expect(presentation.full_name.en).toBe('Sara Al-Qahtani');
      expect(presentation.full_name.ar).toBe('سارة القحطاني');
      expect(presentation.name.en).toBe('Sara Al-Qahtani'); // Compatibility alias
      expect(presentation.email_verified).toBe(true);
      expect(presentation.default_restaurant_id).toBe('rest-1');
      expect(presentation.assigned_restaurant_ids).toContain('rest-1');
      expect(presentation.assigned_restaurant_ids).toContain('rest-2');
      expect(presentation.primary_role).toBe('operations_director');
      expect(presentation.role_badge?.label.en).toBe('Operations Director');
      expect(presentation.permission_names).toContain('restaurant.employees.manage');
    });
  });

  describe('12. Arabic and English Presentation Behavior', () => {
    it('provides both Arabic and English strings in presentation models', () => {
      for (const dto of canonicalRestaurants) {
        const p = mapRestaurantToPresentation(dto, { useMockCatalog: true });
        expect(p.name.ar.length).toBeGreaterThan(0);
        expect(p.name.en.length).toBeGreaterThan(0);
        expect(p.status_badge.label.ar.length).toBeGreaterThan(0);
        expect(p.status_badge.label.en.length).toBeGreaterThan(0);
      }
    });
  });

  describe('13. Missing Optional Relationships', () => {
    it('gracefully handles employee with null position and null user_id', () => {
      const unassignedDto = canonicalEmployees.find((e) => e.id === 'emp-202');
      expect(unassignedDto).toBeDefined();

      const p = mapEmployeeToPresentation(unassignedDto!, { useMockCatalog: true });
      expect(p.position_id).toBeNull();
      expect(p.position_name).toBeNull();
      expect(p.user_id).toBeNull();
      expect(p.status).toBe('suspended');
      expect(p.status_badge.variant).toBe('danger');
    });

    it('gracefully handles user with no assigned memberships or roles', () => {
      const bareUser = {
        ...canonicalUsers[2],
        memberships: undefined,
        roles: undefined,
        permissions: undefined,
      };

      const p = mapUserToPresentation(bareUser, { useMockCatalog: true });
      expect(p.default_restaurant_id).toBeNull();
      expect(p.assigned_restaurant_ids).toEqual([]);
      expect(p.primary_role).toBeNull();
      expect(p.role_badge).toBeNull();
      expect(p.permission_names).toEqual([]);
    });
  });

  describe('15. Prevention of Fabricated Fallback Translations', () => {
    it('does NOT invent translation when entity is not in mock catalog (uses canonical string for both)', () => {
      const liveDto: RestaurantDto = {
        id: 'rest-live-999', // Unknown to catalog
        name: 'مطعم الساحل الشرقي', // Only Arabic name provided by backend
        slug: 'khobar-01',
        currency_code: 'SAR',
        status: 'active',
        timezone: 'Asia/Riyadh',
        address: null,
        city: 'الخبر',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
        deleted_at: null,
      };

      // In live mode (or unlisted mock ID)
      const presentation = mapRestaurantToPresentation(liveDto, { useMockCatalog: false });

      // Must strictly preserve the canonical name without fabricating an English translation
      expect(presentation.name.ar).toBe('مطعم الساحل الشرقي');
      expect(presentation.name.en).toBe('مطعم الساحل الشرقي');
      expect(presentation.raw_name).toBe('مطعم الساحل الشرقي');
    });

    it('does NOT invent English translation for new unlisted employee names', () => {
      const liveEmpDto: EmployeeDto = {
        id: 'emp-live-555',
        restaurant_id: 'rest-1',
        user_id: null,
        position_id: null,
        employee_number: 'EMP-9999',
        first_name: 'فهد',
        last_name: 'القرني',
        email: 'fahad.qarni@example.com',
        phone: '+966 50 000 1122',
        hire_date: '2026-09-01',
        termination_date: null,
        status: 'active',
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
        deleted_at: null,
      };

      const presentation = mapEmployeeToPresentation(liveEmpDto, { useMockCatalog: false });

      // Preserves original name string in both languages instead of hallucinating an English spelling
      expect(presentation.first_name.ar).toBe('فهد');
      expect(presentation.first_name.en).toBe('فهد');
      expect(presentation.last_name.ar).toBe('القرني');
      expect(presentation.last_name.en).toBe('القرني');
      expect(presentation.full_name.ar).toBe('فهد القرني');
      expect(presentation.full_name.en).toBe('فهد القرني');
    });
  });
});
