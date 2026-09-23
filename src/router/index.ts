import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { requiresAuth: false, title: 'Login' }
  },
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'employees',
        name: 'Employees',
        component: () => import('@/pages/EmployeesPage.vue'),
        meta: { title: 'Employees' }
      },
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('@/pages/AttendancePage.vue'),
        meta: { title: 'Attendance' }
      },
      {
        path: 'scheduling',
        name: 'Scheduling',
        component: () => import('@/pages/SchedulingPage.vue'),
        meta: { title: 'Scheduling' }
      },
      {
        path: 'leave-requests',
        name: 'LeaveRequests',
        component: () => import('@/pages/LeaveRequestsPage.vue'),
        meta: { title: 'Leave Requests' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/pages/InventoryPage.vue'),
        meta: { title: 'Inventory' }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/pages/MenuPage.vue'),
        meta: { title: 'Menu' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/pages/OrdersPage.vue'),
        meta: { title: 'Orders' }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/pages/ReportsPage.vue'),
        meta: { title: 'Reports' }
      },
      {
        path: 'ai-intelligence',
        name: 'AIIntelligence',
        component: () => import('@/pages/AIIntelligencePage.vue'),
        meta: { title: 'AI Intelligence' }
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: () => import('@/pages/AlertsPage.vue'),
        meta: { title: 'Alerts' }
      },
      {
        path: 'branding-preview',
        name: 'BrandingPreview',
        component: () => import('@/pages/BrandingPreviewPage.vue'),
        meta: { title: 'Branding Preview' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Navigation guard placeholder for future Laravel Sanctum token check
router.beforeEach((to, _from, next) => {
  // Can inspect auth token or pinia auth store here
  next();
});

export default router;
