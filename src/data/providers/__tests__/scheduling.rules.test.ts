import { describe, it, expect, beforeEach } from 'bun:test';
import { MockDataProvider, DEMO_PASSWORD } from '../mock.provider';
import { AuthenticationError, AuthorizationError, ValidationError } from '../types';
import { clockMinutes, shiftsOverlap, validateShiftDraft } from '../scheduling.rules';
import type { Shift } from '@/types/domain';

const admin = { email: 'admin@restoraintel.com', password: DEMO_PASSWORD };
const draft = { employee_id: 'emp-101', date: '2026-10-01', start_time: '09:00', end_time: '17:00' };
const input = { ...draft, restaurant_id: 'rest-1', shift_name: { ar: 'وردية تجريبية', en: 'Demo shift' }, station: 'prep' as const,
  color_code: '#2F7F82', is_overtime: false, status: 'scheduled' as const };

describe('Mock scheduling validity and safety', () => {
  let provider: MockDataProvider;
  beforeEach(() => { provider = new MockDataProvider({ latencyMs: 0, restoreSession: false }); });

  it('rejects invalid clock syntax, invalid calendar dates and reversed intervals', () => {
    expect(clockMinutes('24:00')).toBeNull();
    expect(clockMinutes('09:30')).toBe(570);
    expect(validateShiftDraft({ ...draft, date: '2026-02-30' })).toHaveProperty('date');
    expect(validateShiftDraft({ ...draft, end_time: '08:00' })).toHaveProperty('time');
  });
  it('treats adjoining intervals as non-overlapping and intersecting intervals as conflicts', () => {
    expect(shiftsOverlap(draft, { ...draft, start_time: '17:00', end_time: '18:00' })).toBe(false);
    expect(shiftsOverlap(draft, { ...draft, start_time: '16:59', end_time: '19:00' })).toBe(true);
  });
  it('rejects scheduling without authentication or sufficient permissions', async () => {
    await expect(provider.mockCreateShift(1, input)).rejects.toBeInstanceOf(AuthenticationError);
    await provider.login({ email: 'khalid.ghamdi@restoraintel.com', password: DEMO_PASSWORD });
    await expect(provider.mockCreateShift(1, input)).rejects.toBeInstanceOf(AuthorizationError);
  });
  it('creates a valid shift then rejects an overlap without mutating the schedule', async () => {
    await provider.login(admin);
    const before = (await provider.mockGetShifts(1)).length;
    const created = await provider.mockCreateShift(1, input);
    expect(created.date).toBe(input.date);
    await expect(provider.mockCreateShift(1, { ...input, start_time: '16:30', end_time: '20:00' })).rejects.toBeInstanceOf(ValidationError);
    expect((await provider.mockGetShifts(1)).length).toBe(before + 1);
  });
  it('rejects foreign employees and inactive employee assignments', async () => {
    await provider.login(admin);
    await expect(provider.mockCreateShift(1, { ...input, employee_id: 'emp-201' })).rejects.toBeInstanceOf(ValidationError);
    const inactive = (await provider.listEmployees(1)).data.find(e => e.status !== 'active');
    if (!inactive) throw new Error('Expected inactive employee fixture');
    await expect(provider.mockCreateShift(1, { ...input, employee_id: `emp-${inactive.id}` })).rejects.toBeInstanceOf(ValidationError);
  });
  it('prevents scheduling during an approved leave', async () => {
    await provider.login(admin);
    const leave = (await provider.mockGetLeaveRequests(1)).find(l => l.status === 'pending' && l.employee_id === 'emp-102');
    if (!leave) throw new Error('Expected pending leave fixture for active emp-102');
    const employee = (await provider.listEmployees(1)).data.find(e => `emp-${e.id}` === leave.employee_id);
    if (!employee || employee.status !== 'active') throw new Error('Expected active emp-102 fixture');
    await provider.mockDecideLeave(1, leave.id, 'approved');
    await expect(provider.mockCreateShift(1, { ...input, employee_id: leave.employee_id, date: leave.start_date })).rejects.toBeInstanceOf(ValidationError);
  });
});