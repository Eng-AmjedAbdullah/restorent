import type { User, Restaurant } from '@/types/domain';
import { mockUsers } from '@/mocks/users';
import { mockRestaurants } from '@/mocks/restaurants';

export const authService = {
  async login(email: string, _password?: string): Promise<{ user: User; restaurant: Restaurant }> {
    // Find matching user or fallback to Sara Al-Qahtani (Operations Director)
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
    const restaurant = mockRestaurants.find(r => r.id === user.restaurant_id) || mockRestaurants[0];
    return {
      user: JSON.parse(JSON.stringify(user)),
      restaurant: JSON.parse(JSON.stringify(restaurant))
    };
  },

  async logout(): Promise<void> {
    // Demo logout placeholder for future Laravel Sanctum / Passport token revocation
    return Promise.resolve();
  },

  async getCurrentUser(): Promise<User> {
    return JSON.parse(JSON.stringify(mockUsers[0]));
  }
};
