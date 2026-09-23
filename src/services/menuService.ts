import type { MenuItem } from '@/types/domain';
import { mockMenuItems } from '@/mocks/menu';

let menuState: MenuItem[] = JSON.parse(JSON.stringify(mockMenuItems));

export const menuService = {
  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const list = menuState.filter(m => m.restaurant_id === restaurantId);
    return JSON.parse(JSON.stringify(list));
  },

  async toggleAvailability(id: string): Promise<MenuItem> {
    const index = menuState.findIndex(m => m.id === id);
    if (index === -1) throw new Error(`Menu item ${id} not found`);
    menuState[index].is_available = !menuState[index].is_available;
    menuState[index].updated_at = new Date().toISOString();
    return JSON.parse(JSON.stringify(menuState[index]));
  }
};
