/** Compatibility facade: active restaurant state lives ONLY in auth.store. */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Restaurant } from '@/types/domain';
import { useAuthStore } from './auth.store';
import { restaurantService } from '@/services/restaurantService';

export const useRestaurantStore = defineStore('restaurant', () => {
  const auth = useAuthStore();
  const restaurants = computed(() => auth.availableRestaurants);
  const currentRestaurant = computed(() => auth.currentRestaurant);
  const activeRestaurantId = computed(() => auth.activeRestaurantId ?? '');
  const activeBranchName = computed(() => auth.currentRestaurant?.name ?? null);
  const activeCurrency = computed(() => auth.currentRestaurant?.currency ?? 'SAR');
  const isLoading = ref(false);
  async function fetchRestaurants(): Promise<Restaurant[]> {
    isLoading.value = true;
    try { await auth.refreshRestaurants(); return auth.availableRestaurants; }
    finally { isLoading.value = false; }
  }
  function selectRestaurant(id: string): boolean { return auth.switchRestaurant(id); }
  async function updateRestaurantDetails(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    isLoading.value = true;
    try { const updated = await restaurantService.updateRestaurant(id, data); await auth.refreshRestaurants(); return updated; }
    finally { isLoading.value = false; }
  }
  return { restaurants, currentRestaurant, activeRestaurantId, activeBranchName, activeCurrency, isLoading,
    fetchRestaurants, selectRestaurant, updateRestaurantDetails };
});
