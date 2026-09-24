/**
 * Canonical Laravel Restaurant DTO and Request Payloads
 *
 * Reflects the authoritative schema from Laravel REST API.
 * Wire-level identifiers are integer database keys.
 *
 * Endpoints:
 * - GET  /api/restaurants
 * - POST /api/restaurants
 * - GET  /api/restaurants/{restaurant}
 * - PUT  /api/restaurants/{restaurant}
 */

export type RestaurantStatus = 'active' | 'inactive' | 'suspended' | 'archived';

/**
 * Canonical Restaurant Entity (Wire-level Laravel Model)
 */
export interface RestaurantDto {
  id: number;
  name: string;
  slug: string;
  currency_code: string;
  status: RestaurantStatus;
  timezone: string;
  address: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * Request payload for POST /api/restaurants
 *
 * Validation rules:
 * - name: required string (min: 2, max: 255)
 * - slug: optional string (unique, alphanumeric with dashes)
 * - currency_code: optional string (3-letter ISO code, e.g. SAR, AED, USD)
 * - timezone: optional string (IANA timezone, e.g. Asia/Riyadh)
 * - city: nullable string
 * - address: nullable string
 * - status: optional RestaurantStatus (defaults to active)
 *
 * Prohibited fields in request body:
 * - `id`: auto-increment primary key
 * - `created_at`, `updated_at`, `deleted_at`: managed by Eloquent
 */
export interface CreateRestaurantRequest {
  name: string;
  slug?: string;
  currency_code?: string;
  timezone?: string;
  city?: string | null;
  address?: string | null;
  status?: RestaurantStatus;
}

/**
 * Request payload for PUT /api/restaurants/{restaurant}
 *
 * Prohibited fields in request body:
 * - `id`: immutable primary key
 * - `created_at`, `updated_at`, `deleted_at`: managed by Eloquent
 */
export interface UpdateRestaurantRequest {
  name?: string;
  slug?: string;
  currency_code?: string;
  timezone?: string;
  city?: string | null;
  address?: string | null;
  status?: RestaurantStatus;
}
