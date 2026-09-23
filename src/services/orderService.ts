import type { Order } from '@/types/domain';
import { mockOrders } from '@/mocks/orders';

let ordersState: Order[] = JSON.parse(JSON.stringify(mockOrders));

export const orderService = {
  async getOrders(restaurantId: string): Promise<Order[]> {
    const list = ordersState.filter(o => o.restaurant_id === restaurantId);
    return JSON.parse(JSON.stringify(list));
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const index = ordersState.findIndex(o => o.id === orderId);
    if (index === -1) throw new Error(`Order ${orderId} not found`);
    ordersState[index].status = status;
    ordersState[index].updated_at = new Date().toISOString();
    return JSON.parse(JSON.stringify(ordersState[index]));
  },

  async toggleItemPrepared(orderId: string, itemId: string): Promise<Order> {
    const order = ordersState.find(o => o.id === orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    const item = order.items.find(i => i.id === itemId);
    if (item) {
      item.is_prepared = !item.is_prepared;
    }
    return JSON.parse(JSON.stringify(order));
  }
};
