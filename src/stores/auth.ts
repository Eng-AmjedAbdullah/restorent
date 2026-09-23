import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Restaurant } from '@/types/domain';
import { authService } from '@/services/authService';
import { restaurantService } from '@/services/restaurantService';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null);
  const currentRestaurant = ref<Restaurant | null>(null);
  const availableRestaurants = ref<Restaurant[]>([]);
  const isAuthenticated = ref<boolean>(true); // Pre-authenticated for demo
  const isLoading = ref<boolean>(false);

  // Initialize with Sara Al-Qahtani and Downtown Flagship
  async function init() {
    isLoading.value = true;
    try {
      const user = await authService.getCurrentUser();
      currentUser.value = user;
      const restaurants = await restaurantService.getRestaurants();
      availableRestaurants.value = restaurants;
      const activeRest = restaurants.find(r => r.id === user.restaurant_id) || restaurants[0];
      currentRestaurant.value = activeRest;
      isAuthenticated.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  async function login(email: string, password?: string) {
    isLoading.value = true;
    try {
      const res = await authService.login(email, password);
      currentUser.value = res.user;
      currentRestaurant.value = res.restaurant;
      isAuthenticated.value = true;
      return res;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    await authService.logout();
    isAuthenticated.value = false;
    currentUser.value = null;
  }

  function switchRestaurant(restaurantId: string) {
    const target = availableRestaurants.value.find(r => r.id === restaurantId);
    if (target) {
      currentRestaurant.value = target;
      if (currentUser.value) {
        currentUser.value.restaurant_id = target.id;
      }
    }
  }

  const userRole = computed(() => currentUser.value?.role || 'operations_director');
  const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin');

  return {
    currentUser,
    currentRestaurant,
    availableRestaurants,
    isAuthenticated,
    isLoading,
    userRole,
    isSuperAdmin,
    init,
    login,
    logout,
    switchRestaurant
  };
});
