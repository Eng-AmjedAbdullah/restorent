import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Restaurant } from '@/types/domain';
import { restaurantService } from '@/services/restaurantService';

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref<Restaurant[]>([]);
  const currentRestaurant = ref<Restaurant | null>(null);
  const isLoading = ref<boolean>(false);

  // Computed
  const activeRestaurantId = computed(() => currentRestaurant.value?.id || '');
  const activeBranchName = computed(() => currentRestaurant.value?.name || null);
  const activeCurrency = computed(() => currentRestaurant.value?.currency || 'SAR');

  async function fetchRestaurants(): Promise<Restaurant[]> {
    isLoading.value = true;
    try {
      const data = await restaurantService.getRestaurants();
      restaurants.value = data;
      if (!currentRestaurant.value && data.length > 0) {
        currentRestaurant.value = data[0];
      }
      return data;
    } catch (error) {
      console.error('[RestaurantStore] Failed to fetch restaurants:', error);
      return [];
    } finally {
      isLoading.value = false;
    }
  }

  function selectRestaurant(id: string): void {
    const target = restaurants.value.find(r => r.id === id);
    if (target) {
      currentRestaurant.value = target;
    }
  }

  async function updateRestaurantDetails(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
    isLoading.value = true;
    try {
      const updated = await restaurantService.updateRestaurant(id, updates);
      const index = restaurants.value.findIndex(r => r.id === id);
      if (index !== -1) {
        restaurants.value[index] = updated;
      }
      if (currentRestaurant.value?.id === id) {
        currentRestaurant.value = updated;
      }
      return updated;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    restaurants,
    currentRestaurant,
    isLoading,
    activeRestaurantId,
    activeBranchName,
    activeCurrency,
    fetchRestaurants,
    selectRestaurant,
    updateRestaurantDetails
  };
});
