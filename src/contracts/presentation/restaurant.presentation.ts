/**
 * Restaurant Presentation Model
 *
 * Tailored for Vue 3 templates, RTL/LTR localization, and status badging.
 * Decoupled from wire-level Laravel DTOs.
 */

import type { RestaurantStatus } from '../backend/restaurant';

export type StatusBadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface RestaurantPresentationModel {
  id: string;
  name: LocalizedString;
  raw_name: string;
  slug: string;
  code: string;
  currency: string;
  currency_code: string;
  status: RestaurantStatus;
  status_badge: {
    label: LocalizedString;
    variant: StatusBadgeVariant;
  };
  timezone: string;
  city: LocalizedString | null;
  address: LocalizedString | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}
