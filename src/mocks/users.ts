import type { User, Role } from '@/types/domain';

export const mockRoles: Role[] = [
  {
    id: 'role-superadmin',
    name: 'super_admin',
    display_name: { ar: 'مدير عام المنظومة', en: 'Super Administrator' },
    permissions: ['all'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role-ops-director',
    name: 'operations_director',
    display_name: { ar: 'مديرة العمليات والتشغيل', en: 'Operations Director' },
    permissions: ['restaurants.read', 'restaurants.write', 'analytics.view', 'staff.manage', 'inventory.audit'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'role-gm',
    name: 'general_manager',
    display_name: { ar: 'مدير الفرع العام', en: 'General Manager' },
    permissions: ['restaurant.manage', 'staff.view', 'orders.manage', 'inventory.view'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    organization_id: 'org-1',
    restaurant_id: 'rest-1',
    name: {
      ar: 'سارة عبد الرحمن القحطاني',
      en: 'Sara Al-Qahtani'
    },
    email: 'sara.qahtani@restoraintel.com',
    role: 'operations_director',
    phone: '+966 50 123 4567',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
    is_active: true,
    last_login_at: '2026-03-22T08:30:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-03-22T08:30:00Z'
  },
  {
    id: 'usr-2',
    organization_id: 'org-1',
    restaurant_id: 'rest-2',
    name: {
      ar: 'طارق خالد الغامدي',
      en: 'Tariq Al-Ghamdi'
    },
    email: 'tariq.ghamdi@restoraintel.com',
    role: 'general_manager',
    phone: '+966 55 987 6543',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    is_active: true,
    last_login_at: '2026-03-22T07:45:00Z',
    created_at: '2024-06-01T11:00:00Z',
    updated_at: '2026-03-22T07:45:00Z'
  },
  {
    id: 'usr-3',
    organization_id: 'org-1',
    restaurant_id: 'rest-3',
    name: {
      ar: 'فيصل محمد الدوسري',
      en: 'Faisal Al-Dossari'
    },
    email: 'faisal.dossari@restoraintel.com',
    role: 'shift_supervisor',
    phone: '+966 54 321 0987',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
    is_active: true,
    last_login_at: '2026-03-22T08:00:00Z',
    created_at: '2024-11-20T09:00:00Z',
    updated_at: '2026-03-22T08:00:00Z'
  }
];
