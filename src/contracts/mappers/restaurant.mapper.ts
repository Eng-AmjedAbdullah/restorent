/**
 * Restaurant Presentation Mapper
 *
 * Pure functions converting canonical Restaurant DTOs into Presentation Models
 * and vice-versa.
 */

import type {
  RestaurantDto,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from '../backend/restaurant';
import type {
  RestaurantPresentationModel,
  LocalizedString,
} from '../presentation/restaurant.presentation';
import {
  MOCK_LOCALIZATION_CATALOG,
  RESTAURANT_STATUS_LABELS,
} from './localizationCatalog';

export interface MapperOptions {
  /**
   * When true (default in mock mode), inspects the verified localization
   * catalog for known fixture IDs. If false or ID is unlisted, uses the
   * canonical backend string without inventing translations.
   */
  useMockCatalog?: boolean;
}

/**
 * Maps a Canonical Restaurant DTO into a Vue Presentation Model
 */
export function mapRestaurantToPresentation(
  dto: RestaurantDto,
  options: MapperOptions = { useMockCatalog: true }
): RestaurantPresentationModel {
  const catalogEntry = options.useMockCatalog !== false
    ? MOCK_LOCALIZATION_CATALOG[dto.id]
    : undefined;

  const name: LocalizedString = catalogEntry?.name || {
    ar: dto.name,
    en: dto.name,
  };

  const city: LocalizedString | null = catalogEntry?.city || (
    dto.city ? { ar: dto.city, en: dto.city } : null
  );

  const address: LocalizedString | null = catalogEntry?.address || (
    dto.address ? { ar: dto.address, en: dto.address } : null
  );

  const statusBadge = RESTAURANT_STATUS_LABELS[dto.status] || {
    label: { ar: dto.status, en: dto.status },
    variant: 'default' as const,
  };

  // Derive a compact branch code (e.g. "RUH-01" from slug or uppercase substring)
  const code = dto.slug
    ? dto.slug.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 10)
    : dto.id.toUpperCase();

  return {
    id: dto.id,
    name,
    raw_name: dto.name,
    slug: dto.slug,
    code,
    currency: dto.currency_code,
    currency_code: dto.currency_code,
    status: dto.status,
    status_badge: statusBadge,
    timezone: dto.timezone,
    city,
    address,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
    is_active: dto.status === 'active',
  };
}

/**
 * Maps a Presentation Model (or form input) to CreateRestaurantRequest
 * Enforces removal of prohibited backend fields (id, slug, timestamps).
 */
export function mapToCreateRestaurantRequest(
  presentation: Partial<RestaurantPresentationModel> & { raw_name?: string }
): CreateRestaurantRequest {
  const name = presentation.raw_name || presentation.name?.en || presentation.name?.ar || '';
  return {
    name,
    currency_code: presentation.currency_code || presentation.currency || 'SAR',
    timezone: presentation.timezone || 'Asia/Riyadh',
    city: presentation.city?.en || presentation.city?.ar || null,
    address: presentation.address?.en || presentation.address?.ar || null,
    status: presentation.status || 'active',
  };
}

/**
 * Maps a Presentation Model to UpdateRestaurantRequest
 * Enforces removal of prohibited backend fields.
 */
export function mapToUpdateRestaurantRequest(
  presentation: Partial<RestaurantPresentationModel>
): UpdateRestaurantRequest {
  const req: UpdateRestaurantRequest = {};
  if (presentation.raw_name || presentation.name) {
    req.name = presentation.raw_name || presentation.name?.en || presentation.name?.ar;
  }
  if (presentation.currency_code || presentation.currency) {
    req.currency_code = presentation.currency_code || presentation.currency;
  }
  if (presentation.timezone) {
    req.timezone = presentation.timezone;
  }
  if (presentation.city !== undefined) {
    req.city = presentation.city ? (presentation.city.en || presentation.city.ar) : null;
  }
  if (presentation.address !== undefined) {
    req.address = presentation.address ? (presentation.address.en || presentation.address.ar) : null;
  }
  if (presentation.status) {
    req.status = presentation.status;
  }
  return req;
}
