/**
 * Canonical Laravel Position DTO
 *
 * Minimal confirmed structure for employee workforce roles/positions.
 */

export interface PositionDto {
  id: string;
  restaurant_id: string | null;
  name: string;
  department: string | null;
  created_at?: string;
  updated_at?: string;
}
