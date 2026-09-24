/** Demo-only credential checking, delegated to the single active provider. */
import type { User, Restaurant } from '@/types/domain';
import { getDataProvider } from '@/data/providers';
import { toLegacyUser, toLegacyRestaurant } from '@/data/adapters/legacy-view';

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; restaurant: Restaurant | null }> {
    const res = await getDataProvider().login({ email, password });
    return { user: toLegacyUser(res.data.user), restaurant: res.data.restaurant ? toLegacyRestaurant(res.data.restaurant) : null };
  },
  async logout(): Promise<void> { await getDataProvider().logout(); },
  async getCurrentUser(): Promise<User> {
    const res = await getDataProvider().checkAuthMe();
    return toLegacyUser(res.data);
  },
};
