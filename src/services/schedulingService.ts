import type { Shift } from '@/types/domain';
import { mockShifts } from '@/mocks/scheduling';

let shiftsState: Shift[] = JSON.parse(JSON.stringify(mockShifts));

export const schedulingService = {
  async getShifts(restaurantId: string): Promise<Shift[]> {
    const list = shiftsState.filter(s => s.restaurant_id === restaurantId);
    return JSON.parse(JSON.stringify(list));
  },

  async createShift(data: Omit<Shift, 'id' | 'created_at' | 'updated_at'>): Promise<Shift> {
    const now = new Date().toISOString();
    const newShift: Shift = {
      ...data,
      id: `shf-${Date.now()}`,
      created_at: now,
      updated_at: now
    };
    shiftsState.push(newShift);
    return JSON.parse(JSON.stringify(newShift));
  }
};
