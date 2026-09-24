/**
 * User Presentation Mapper
 *
 * Pure functions converting canonical User DTOs into Presentation Models.
 */

import type { UserDto } from '../backend/user';
import type { UserPresentationModel } from '../presentation/user.presentation';
import type { LocalizedString } from '../presentation/restaurant.presentation';
import type { MapperOptions } from './restaurant.mapper';
import {
  MOCK_LOCALIZATION_CATALOG,
  USER_STATUS_LABELS,
} from './localizationCatalog';

const ROLE_LABELS: Record<string, LocalizedString> = {
  super_admin: { ar: 'مدير عام المنظومة', en: 'Super Administrator' },
  operations_director: { ar: 'مديرة العمليات والتشغيل', en: 'Operations Director' },
  general_manager: { ar: 'مدير الفرع العام', en: 'General Manager' },
  shift_supervisor: { ar: 'مشرف وردية', en: 'Shift Supervisor' },
  chef: { ar: 'رئيس الطهاة', en: 'Head Chef' },
  inventory_manager: { ar: 'مسؤول المستودع والجرد', en: 'Inventory Manager' },
};

/**
 * Maps a Canonical User DTO into a Vue Presentation Model
 */
export function mapUserToPresentation(
  dto: UserDto,
  options: MapperOptions = { useMockCatalog: true }
): UserPresentationModel {
  const catalogEntry = options.useMockCatalog !== false
    ? MOCK_LOCALIZATION_CATALOG[dto.id]
    : undefined;

  const firstName = catalogEntry?.first_name || {
    ar: dto.name_first,
    en: dto.name_first,
  };

  const lastName = catalogEntry?.last_name || {
    ar: dto.name_last,
    en: dto.name_last,
  };

  const fullName: LocalizedString = {
    ar: `${firstName.ar} ${lastName.ar}`.trim(),
    en: `${firstName.en} ${lastName.en}`.trim(),
  };

  const statusBadge = USER_STATUS_LABELS[dto.status] || {
    label: { ar: dto.status, en: dto.status },
    variant: 'default' as const,
  };

  // Find default restaurant or first assigned restaurant membership
  const defaultMembership = dto.memberships?.find((m) => m.is_default);
  const defaultRestaurantId = defaultMembership?.restaurant_id || dto.memberships?.[0]?.restaurant_id || null;
  const assignedRestaurantIds = dto.memberships?.map((m) => m.restaurant_id) || [];

  // Determine primary role
  const primaryRole = dto.roles?.[0]?.name || defaultMembership?.role || null;
  const roleBadge = primaryRole
    ? {
        label: ROLE_LABELS[primaryRole] || { ar: primaryRole, en: primaryRole },
      }
    : null;

  const permissionNames = dto.permissions?.map((p) => p.name) || [];

  return {
    id: dto.id,
    email: dto.email,
    name_first: dto.name_first,
    name_last: dto.name_last,
    full_name: fullName,
    name: fullName, // Backward compatibility alias
    phone: dto.phone,
    status: dto.status,
    status_badge: statusBadge,
    email_verified: dto.email_verified_at !== null,
    last_login_at: dto.last_login_at,
    default_restaurant_id: defaultRestaurantId,
    assigned_restaurant_ids: assignedRestaurantIds,
    primary_role: primaryRole,
    role_badge: roleBadge,
    permission_names: permissionNames,
    created_at: dto.created_at,
  };
}
