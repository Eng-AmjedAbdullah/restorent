import type { Restaurant } from '@/types/domain';
import { mockRestaurants } from '@/mocks/restaurants';

// In-memory cloned cache to simulate stateful mutations during the demo session
let restaurantsState: Restaurant[] = JSON.parse(JSON.stringify(mockRestaurants));

export const restaurantService = {
  async getRestaurants(): Promise<Restaurant[]> {
    // Simulated network delay
    return JSON.parse(JSON.stringify(restaurantsState));
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    const found = restaurantsState.find(r => r.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  async updateRestaurant(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const index = restaurantsState.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Restaurant with ID ${id} not found`);
    restaurantsState[index] = {
      ...restaurantsState[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    return JSON.parse(JSON.stringify(restaurantsState[index]));
  }
};
