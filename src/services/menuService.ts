import type { MenuItem } from '@/types/domain';
import { getMockOperations } from '@/data/providers';
import { wireId } from '@/data/adapters/legacy-view';
export const menuService = {
  async getMenuItems(id: string): Promise<MenuItem[]> { return getMockOperations().mockGetMenu(wireId(id, 'rest')); },
  async toggleAvailability(restaurantId: string, id: string): Promise<MenuItem> {
    return getMockOperations().mockToggleMenuAvailability(wireId(restaurantId, 'rest'), id);
  },
  async addMenuItem(restaurantId: string, item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
    return getMockOperations().mockAddMenuItem(wireId(restaurantId, 'rest'), item);
  },
};
