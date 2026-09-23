import type { Restaurant } from '@/types/domain';

export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    organization_id: 'org-1',
    name: {
      ar: 'ريستورا سنترال - فرع العليا الرئيسي',
      en: 'Restora Downtown Flagship - Olaya'
    },
    code: 'RUH-01',
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'طريق الملك فهد، حي العليا، الرياض',
      en: 'King Fahd Road, Al Olaya District, Riyadh'
    },
    branch_type: 'flagship',
    timezone: 'Asia/Riyadh',
    currency: 'SAR',
    active_tables_count: 38,
    capacity: 160,
    manager_id: 'usr-1',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-03-20T09:30:00Z'
  },
  {
    id: 'rest-2',
    organization_id: 'org-1',
    name: {
      ar: 'ريستورا مارينا - كورنيش جدة الواجهة',
      en: 'Restora Marina Waterfront - Jeddah'
    },
    code: 'JED-02',
    city: { ar: 'جدة', en: 'Jeddah' },
    address: {
      ar: 'طريق الكورنيش الشمالي، الشاطئ، جدة',
      en: 'North Corniche Road, Al Shati, Jeddah'
    },
    branch_type: 'dine_in',
    timezone: 'Asia/Riyadh',
    currency: 'SAR',
    active_tables_count: 46,
    capacity: 210,
    manager_id: 'usr-2',
    status: 'active',
    created_at: '2024-06-01T11:00:00Z',
    updated_at: '2026-03-21T15:20:00Z'
  },
  {
    id: 'rest-3',
    organization_id: 'org-1',
    name: {
      ar: 'ريستورا بيسترو - التخصصي إكسبريس',
      en: 'Restora Bistro - Takhassusi Express'
    },
    code: 'RUH-03',
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'شارع التخصصي، المعذر الشمالي، الرياض',
      en: 'Takhassusi St, Al Mathar Ash Shamali, Riyadh'
    },
    branch_type: 'express',
    timezone: 'Asia/Riyadh',
    currency: 'SAR',
    active_tables_count: 22,
    capacity: 85,
    manager_id: 'usr-3',
    status: 'active',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2026-03-22T08:10:00Z'
  }
];
