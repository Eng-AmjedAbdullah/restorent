import type { InventoryItem } from '@/types/domain';
import { mockInventoryItems } from '@/mocks/inventory';

let inventoryState: InventoryItem[] = JSON.parse(JSON.stringify(mockInventoryItems));

export const inventoryService = {
  async getInventoryItems(restaurantId: string): Promise<InventoryItem[]> {
    const list = inventoryState.filter(i => i.restaurant_id === restaurantId);
    return JSON.parse(JSON.stringify(list));
  },

  async updateStock(id: string, newStock: number): Promise<InventoryItem> {
    const index = inventoryState.findIndex(i => i.id === id);
    if (index === -1) throw new Error(`Inventory item ${id} not found`);
    const item = inventoryState[index];
    item.current_stock = newStock;
    if (newStock <= 0) {
      item.status = 'out_of_stock';
    } else if (newStock <= item.reorder_point * 0.5) {
      item.status = 'critical';
    } else if (newStock <= item.reorder_point) {
      item.status = 'low_stock';
    } else {
      item.status = 'in_stock';
    }
    item.updated_at = new Date().toISOString();
    return JSON.parse(JSON.stringify(item));
  }
};
