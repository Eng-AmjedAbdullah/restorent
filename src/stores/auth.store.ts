import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Restaurant } from '@/types/domain';
import { authService } from '@/services/authService';
import { restaurantService } from '@/services/restaurantService';
import apiClient from '@/api/client';

export interface AuthState {
  currentUser: User | null;
  currentRestaurant: Restaurant | null;
  availableRestaurants: Restaurant[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null);
  const currentRestaurant = ref<Restaurant | null>(null);
  const availableRestaurants = ref<Restaurant[]>([]);
  const isAuthenticated = ref<boolean>(true); // Pre-authenticated demo state
  const isLoading = ref<boolean>(false);

  // Computed properties
  const userRole = computed(() => currentUser.value?.role || 'operations_director');
  const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin');
  const userName = computed(() => currentUser.value?.name || { ar: 'المستخدم', en: 'User' });

  // Initialize session with active demo restaurant & user
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
    } catch (error) {
      console.error('[AuthStore] Failed to initialize auth session:', error);
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
      // In future: apiClient.setAuthToken(res.token)
      return res;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    await authService.logout();
    apiClient.clearAuthToken();
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

  return {
    currentUser,
    currentRestaurant,
    availableRestaurants,
    isAuthenticated,
    isLoading,
    userRole,
    isSuperAdmin,
    userName,
    init,
    login,
    logout,
    switchRestaurant
  };
});
