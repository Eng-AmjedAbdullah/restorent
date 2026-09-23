import type { Shift } from '@/types/domain';

export const mockShifts: Shift[] = [
  // Restaurant 1: Downtown Flagship
  {
    id: 'shf-101',
    restaurant_id: 'rest-1',
    employee_id: 'emp-101',
    date: '2026-03-22',
    shift_name: { ar: 'وردية الغداء الرئيسية', en: 'Lunch Service Lead' },
    station: 'hot_line',
    start_time: '08:00',
    end_time: '16:30',
    color_code: '#34abb1',
    is_overtime: false,
    status: 'in_progress',
    notes: 'الإشراف على الخط الساخن وتحضيرات الغداء',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T08:00:00Z'
  },
  {
    id: 'shf-102',
    restaurant_id: 'rest-1',
    employee_id: 'emp-102',
    date: '2026-03-22',
    shift_name: { ar: 'وردية تجهيز الصلصات والمقبلات', en: 'Prep & Sauces' },
    station: 'prep',
    start_time: '08:00',
    end_time: '16:30',
    color_code: '#2c777c',
    is_overtime: false,
    status: 'in_progress',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T08:00:00Z'
  },
  {
    id: 'shf-103',
    restaurant_id: 'rest-1',
    employee_id: 'emp-103',
    date: '2026-03-22',
    shift_name: { ar: 'مشرف صالة الغداء', en: 'Floor Supervisor' },
    station: 'floor_captain',
    start_time: '09:00',
    end_time: '17:30',
    color_code: '#4edee3',
    is_overtime: false,
    status: 'in_progress',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T09:00:00Z'
  },
  {
    id: 'shf-104',
    restaurant_id: 'rest-1',
    employee_id: 'emp-104',
    date: '2026-03-22',
    shift_name: { ar: 'محطة المشروبات والقهوة', en: 'Beverage & Bar' },
    station: 'barista',
    start_time: '08:30',
    end_time: '17:00',
    color_code: '#10b981',
    is_overtime: false,
    status: 'in_progress',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T08:30:00Z'
  },

  // Restaurant 2: Marina Waterfront
  {
    id: 'shf-201',
    restaurant_id: 'rest-2',
    employee_id: 'emp-201',
    date: '2026-03-22',
    shift_name: { ar: 'رئيس المطبخ البحري', en: 'Seafood Lead' },
    station: 'hot_line',
    start_time: '09:00',
    end_time: '17:30',
    color_code: '#34abb1',
    is_overtime: false,
    status: 'in_progress',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T09:00:00Z'
  },
  {
    id: 'shf-202',
    restaurant_id: 'rest-2',
    employee_id: 'emp-202',
    date: '2026-03-22',
    shift_name: { ar: 'إدارة صالة الواجهة البحرية', en: 'Waterfront Terrace Lead' },
    station: 'floor_captain',
    start_time: '09:00',
    end_time: '17:30',
    color_code: '#4edee3',
    is_overtime: false,
    status: 'in_progress',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T09:00:00Z'
  },

  // Restaurant 3: Bistro Express
  {
    id: 'shf-301',
    restaurant_id: 'rest-3',
    employee_id: 'emp-301',
    date: '2026-03-22',
    shift_name: { ar: 'وردية الإكسبريس الصباحية', en: 'Morning Express Line' },
    station: 'hot_line',
    start_time: '07:30',
    end_time: '16:00',
    color_code: '#34abb1',
    is_overtime: false,
    status: 'in_progress',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T07:30:00Z'
  },
  {
    id: 'shf-302',
    restaurant_id: 'rest-3',
    employee_id: 'emp-302',
    date: '2026-03-22',
    shift_name: { ar: 'خدمة الطلبات السريعة', en: 'Express Service Desk' },
    station: 'cashier',
    start_time: '07:30',
    end_time: '16:00',
    color_code: '#f59e0b',
    is_overtime: false,
    status: 'in_progress',
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-22T07:30:00Z'
  }
];
