/**
 * Canonical Laravel Position DTO
 *
 * Minimal confirmed structure for employee workforce roles/positions.
 * Positions are strictly scoped to a specific restaurant tenant.
 */

export type PositionStatus = 'active' | 'inactive';

export interface PositionDto {
  id: number;
  restaurant_id: number;
  name: string;
  code: string | null;
  status: PositionStatus;
  department?: string | null;
  created_at?: string;
  updated_at?: string;
}
