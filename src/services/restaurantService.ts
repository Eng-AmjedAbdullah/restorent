import type { Restaurant } from '@/types/domain';
import { getDataProvider } from '@/data/providers';
import { toLegacyRestaurant, wireId } from '@/data/adapters/legacy-view';

export const restaurantService = {
  async getRestaurants(): Promise<Restaurant[]> {
    const res = await getDataProvider().listRestaurants();
    return res.data.map(toLegacyRestaurant);
  },
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try { return toLegacyRestaurant((await getDataProvider().getRestaurant(wireId(id, 'rest'))).data); }
    catch (err) { if (err instanceof Error && err.name === 'NotFoundError') return null; throw err; }
  },
  async updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
    const current = (await getDataProvider().getRestaurant(wireId(id, 'rest'))).data;
    const payload = {
      ...(updates.name ? { name: updates.name.en || updates.name.ar } : {}),
      ...(updates.currency ? { currency_code: updates.currency } : {}),
      ...(updates.timezone ? { timezone: updates.timezone } : {}),
      ...(updates.status ? { status: updates.status === 'active' ? 'active' as const : 'inactive' as const } : {}),
      ...(updates.city ? { city: updates.city.en || updates.city.ar } : {}),
      ...(updates.address ? { address: updates.address.en || updates.address.ar } : {}),
    };
    // Existing UI-only fields are not silently written to the canonical Laravel record.
    if (current.deleted_at) throw new Error('Cannot update a deleted restaurant.');
    return toLegacyRestaurant((await getDataProvider().updateRestaurant(current.id, payload)).data);
  },
};
