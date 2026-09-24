import type { InventoryItem } from '@/types/domain';
import { getMockOperations } from '@/data/providers';
import { wireId } from '@/data/adapters/legacy-view';
export const inventoryService = {
  async getInventoryItems(id: string): Promise<InventoryItem[]> {
    return getMockOperations().mockGetInventory(wireId(id, 'rest'));
  },
  async updateStock(restaurantId: string, id: string, stock: number): Promise<InventoryItem> {
    return getMockOperations().mockUpdateStock(wireId(restaurantId, 'rest'), id, stock);
  },
};
