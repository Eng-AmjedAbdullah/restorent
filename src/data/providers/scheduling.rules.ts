/** Pure rules for the DEMO scheduling repository; not an asserted Laravel API. */
import type { Shift } from '@/types/domain';

export type ShiftDraft = Pick<Shift, 'employee_id' | 'date' | 'start_time' | 'end_time'>;

function validDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function clockMinutes(value: string): number | null {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

/** Intervals are half-open, so an 08:00–12:00 shift and a 12:00–16:00 shift do not overlap. */
export function shiftsOverlap(a: ShiftDraft, b: ShiftDraft): boolean {
  if (a.employee_id !== b.employee_id || a.date !== b.date) return false;
  const aStart = clockMinutes(a.start_time);
  const aEnd = clockMinutes(a.end_time);
  const bStart = clockMinutes(b.start_time);
  const bEnd = clockMinutes(b.end_time);
  if (aStart === null || aEnd === null || bStart === null || bEnd === null) return false;
  return aStart < bEnd && bStart < aEnd;
}

export function validateShiftDraft(draft: ShiftDraft): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  if (!validDate(draft.date)) errors.date = ['Enter a valid shift date (YYYY-MM-DD).'];
  const start = clockMinutes(draft.start_time);
  const end = clockMinutes(draft.end_time);
  if (start === null || end === null || start >= end) {
    errors.time = ['Provide valid HH:mm times with the end strictly after the start. Overnight shifts are not supported in this demo.'];
  }
  return errors;
}

export function overlappingShifts(draft: ShiftDraft, existing: readonly Shift[]): Shift[] {
  return existing.filter(shift => shift.status !== 'gap_uncovered' && shiftsOverlap(draft, shift));
}