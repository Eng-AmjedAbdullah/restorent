import type { Order } from '@/types/domain';
import { getMockOperations } from '@/data/providers';
import { wireId } from '@/data/adapters/legacy-view';
export const orderService = {
  async getOrders(id: string): Promise<Order[]> { return getMockOperations().mockGetOrders(wireId(id, 'rest')); },
  async updateOrderStatus(restaurantId: string, id: string, status: Order['status']): Promise<Order> {
    return getMockOperations().mockUpdateOrderStatus(wireId(restaurantId, 'rest'), id, status);
  },
  async toggleItemPrepared(restaurantId: string, orderId: string, itemId: string): Promise<Order> {
    return getMockOperations().mockToggleOrderItem(wireId(restaurantId, 'rest'), orderId, itemId);
  },
};
