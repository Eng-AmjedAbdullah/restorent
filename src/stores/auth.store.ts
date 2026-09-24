/** The only authoritative selected-restaurant context for the Vue application. */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User, Restaurant } from '@/types/domain';
import type { UserDto } from '@/contracts/backend/user';
import { AuthenticationError } from '@/data/providers';
import { getDataProvider } from '@/data/providers';
import { authService } from '@/services/authService';
import { restaurantService } from '@/services/restaurantService';
import { toLegacyUser } from '@/data/adapters/legacy-view';
import apiClient from '@/api/client';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null);
  const currentUserDto = ref<UserDto | null>(null);
  const currentRestaurant = ref<Restaurant | null>(null);
  const availableRestaurants = ref<Restaurant[]>([]);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const initialized = ref(false);
  let inFlightInit: Promise<void> | null = null;

  const userRole = computed(() => currentUser.value?.role ?? null);
  const isSuperAdmin = computed(() => currentUserDto.value?.roles?.some(r => r.scope === 'system' &&
    r.permissions?.some(p => p.code === 'system.restaurants.manage')) ?? false);
  const userName = computed(() => currentUser.value?.name ?? { ar: 'مستخدم', en: 'User' });
  const activeRestaurantId = computed(() => currentRestaurant.value?.id ?? null);

  function can(code: string, restaurantId = currentRestaurant.value?.id): boolean {
    const user = currentUserDto.value;
    if (!user || !restaurantId || !isAuthenticated.value) return false;
    if (isSuperAdmin.value) return true;
    const id = Number(restaurantId.replace(/^rest-/, ''));
    const member = user.memberships?.find(m => m.restaurant_id === id && m.status === 'active' && m.left_at === null && m.joined_at !== null);
    return member?.role_assignments?.some(a => a.role?.permissions?.some(p => p.code === code)) ?? false;
  }
  async function refreshSession(): Promise<void> {
    const raw = (await getDataProvider().checkAuthMe()).data;
    currentUserDto.value = raw;
    currentUser.value = toLegacyUser(raw);
    isAuthenticated.value = true;
    const restaurants = await restaurantService.getRestaurants();
    availableRestaurants.value = restaurants;
    const key = `restoraintel_selected_${raw.id}`;
    const stored = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
    currentRestaurant.value = restaurants.find(r => r.id === stored) ??
      (currentRestaurant.value && restaurants.find(r => r.id === currentRestaurant.value?.id)) ??
      restaurants.find(r => r.status === 'active') ?? restaurants[0] ?? null;
  }
  async function init(): Promise<void> {
    if (initialized.value) return;
    if (inFlightInit) return inFlightInit;
    inFlightInit = (async () => {
      isLoading.value = true;
      try { await refreshSession(); }
      catch (err) {
        currentUser.value = null; currentUserDto.value = null; currentRestaurant.value = null;
        availableRestaurants.value = []; isAuthenticated.value = false;
        if (!(err instanceof AuthenticationError)) console.error('[AuthStore] Could not restore demo session:', err);
      } finally { initialized.value = true; isLoading.value = false; inFlightInit = null; }
    })();
    return inFlightInit;
  }
  async function login(email: string, password: string): Promise<void> {
    isLoading.value = true;
    try { await authService.login(email, password); await refreshSession(); initialized.value = true; }
    finally { isLoading.value = false; }
  }
  async function logout(): Promise<void> {
    await authService.logout();
    apiClient.clearAuthToken();
    isAuthenticated.value = false; currentUser.value = null; currentUserDto.value = null;
    currentRestaurant.value = null; availableRestaurants.value = []; initialized.value = true;
  }
  function switchRestaurant(id: string): boolean {
    const next = availableRestaurants.value.find(r => r.id === id);
    if (!next || next.status !== 'active') return false;
    currentRestaurant.value = next;
    if (typeof sessionStorage !== 'undefined' && currentUserDto.value) sessionStorage.setItem(`restoraintel_selected_${currentUserDto.value.id}`, id);
    return true;
  }
  async function refreshRestaurants(): Promise<void> {
    if (!isAuthenticated.value) return;
    const selected = currentRestaurant.value?.id;
    availableRestaurants.value = await restaurantService.getRestaurants();
    currentRestaurant.value = availableRestaurants.value.find(r => r.id === selected) ?? availableRestaurants.value.find(r => r.status === 'active') ?? null;
  }
  return { currentUser, currentUserDto, currentRestaurant, availableRestaurants, isAuthenticated, isLoading, initialized,
    userRole, isSuperAdmin, userName, activeRestaurantId, can, init, login, logout, switchRestaurant, refreshRestaurants };
});
