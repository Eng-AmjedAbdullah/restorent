import type { Shift } from '@/types/domain';
import { getMockOperations } from '@/data/providers';
import { wireId } from '@/data/adapters/legacy-view';
export const schedulingService = {
  async getShifts(id: string): Promise<Shift[]> { return getMockOperations().mockGetShifts(wireId(id, 'rest')); },
  async createShift(data: Omit<Shift, 'id' | 'created_at' | 'updated_at'>): Promise<Shift> {
    return getMockOperations().mockCreateShift(wireId(data.restaurant_id, 'rest'), data);
  },
};
