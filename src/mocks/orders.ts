import type { Order } from '@/types/domain';

export const mockOrders: Order[] = [
  // Restaurant 1: Downtown Flagship
  {
    id: 'ord-101',
    restaurant_id: 'rest-1',
    order_number: '#RUH-412',
    order_type: 'dine_in',
    table_number: 'T-14',
    server_name: 'خالد العتيبي',
    customer_name: 'عبد العزيز السديري (VIP)',
    status: 'preparing',
    priority: 'vip',
    elapsed_minutes: 11,
    items: [
      { id: 'item-101-1', order_id: 'ord-101', menu_item_id: 'menu-101', name: { ar: 'ستيك ريب آي بلاك أنجوس (Medium-Rare)', en: 'Prime Ribeye (Medium-Rare)' }, quantity: 2, unit_price: 185, notes: 'صلصة الفلفل الأسود جانبية', is_prepared: false },
      { id: 'item-101-2', order_id: 'ord-101', menu_item_id: 'menu-102', name: { ar: 'تاجلياتيلي بالكمأة السوداء', en: 'Truffle Tagliatelle' }, quantity: 1, unit_price: 98, is_prepared: true },
      { id: 'item-101-3', order_id: 'ord-101', menu_item_id: 'menu-104', name: { ar: 'موهيتو باشن فروت فوار', en: 'Passion Fruit Mojito' }, quantity: 3, unit_price: 36, is_prepared: true }
    ],
    subtotal: 576,
    tax: 86.4,
    total: 662.4,
    created_at: '2026-03-22T13:45:00Z',
    updated_at: '2026-03-22T13:52:00Z'
  },
  {
    id: 'ord-102',
    restaurant_id: 'rest-1',
    order_number: '#RUH-413',
    order_type: 'dine_in',
    table_number: 'T-08',
    server_name: 'خالد العتيبي',
    customer_name: 'عائلة الشعلان',
    status: 'ready',
    priority: 'normal',
    elapsed_minutes: 18,
    items: [
      { id: 'item-102-1', order_id: 'ord-102', menu_item_id: 'menu-103', name: { ar: 'سالمون مشوي بنكهة الحمضيات', en: 'Atlantic Salmon' }, quantity: 2, unit_price: 125, is_prepared: true },
      { id: 'item-102-2', order_id: 'ord-102', menu_item_id: 'menu-102', name: { ar: 'تاجلياتيلي بالكمأة السوداء', en: 'Truffle Tagliatelle' }, quantity: 1, unit_price: 98, is_prepared: true }
    ],
    subtotal: 348,
    tax: 52.2,
    total: 400.2,
    created_at: '2026-03-22T13:38:00Z',
    updated_at: '2026-03-22T13:54:00Z'
  },
  {
    id: 'ord-103',
    restaurant_id: 'rest-1',
    order_number: '#RUH-414',
    order_type: 'delivery',
    server_name: 'محطة التوصيل الذاتي',
    customer_name: 'جاهز #5521 - فهد',
    status: 'new',
    priority: 'rush',
    elapsed_minutes: 3,
    items: [
      { id: 'item-103-1', order_id: 'ord-103', menu_item_id: 'menu-101', name: { ar: 'ستيك ريب آي بلاك أنجوس (Well-Done)', en: 'Prime Ribeye (Well-Done)' }, quantity: 1, unit_price: 185, notes: 'تغليف حراري محكم', is_prepared: false },
      { id: 'item-103-2', order_id: 'ord-103', menu_item_id: 'menu-104', name: { ar: 'موهيتو باشن فروت فوار', en: 'Passion Fruit Mojito' }, quantity: 2, unit_price: 36, is_prepared: false }
    ],
    subtotal: 257,
    tax: 38.55,
    total: 295.55,
    created_at: '2026-03-22T13:55:00Z',
    updated_at: '2026-03-22T13:55:00Z'
  },

  // Restaurant 2: Marina Waterfront
  {
    id: 'ord-201',
    restaurant_id: 'rest-2',
    order_number: '#JED-189',
    order_type: 'dine_in',
    table_number: 'W-03',
    server_name: 'ليلى الحربي',
    customer_name: 'م. حسام باديب',
    status: 'preparing',
    priority: 'vip',
    elapsed_minutes: 14,
    items: [
      { id: 'item-201-1', order_id: 'ord-201', menu_item_id: 'menu-201', name: { ar: 'باييلا المأكولات البحرية الكبيرة', en: 'Seafood Paella Large' }, quantity: 1, unit_price: 165, is_prepared: false },
      { id: 'item-201-2', order_id: 'ord-201', menu_item_id: 'menu-202', name: { ar: 'سيباس مشوي على الفحم', en: 'Charcoal Grilled Sea Bass' }, quantity: 1, unit_price: 145, is_prepared: false }
    ],
    subtotal: 310,
    tax: 46.5,
    total: 356.5,
    created_at: '2026-03-22T13:42:00Z',
    updated_at: '2026-03-22T13:49:00Z'
  },

  // Restaurant 3: Bistro Express
  {
    id: 'ord-301',
    restaurant_id: 'rest-3',
    order_number: '#EXP-84',
    order_type: 'takeaway',
    server_name: 'دلال المطيري',
    customer_name: 'سلطان الناصر',
    status: 'preparing',
    priority: 'rush',
    elapsed_minutes: 5,
    items: [
      { id: 'item-301-1', order_id: 'ord-301', menu_item_id: 'menu-301', name: { ar: 'سماش برجر أنجوس كلاسيك تريبل', en: 'Triple Smash Burger' }, quantity: 2, unit_price: 54, is_prepared: false },
      { id: 'item-301-2', order_id: 'ord-301', menu_item_id: 'menu-302', name: { ar: 'بطاطس مقرمشة بالكمأة والبارميزان', en: 'Truffle Fries' }, quantity: 2, unit_price: 28, is_prepared: true }
    ],
    subtotal: 164,
    tax: 24.6,
    total: 188.6,
    created_at: '2026-03-22T13:51:00Z',
    updated_at: '2026-03-22T13:53:00Z'
  }
];
