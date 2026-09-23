<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  FileCheck,
  UtensilsCrossed,
  ChefHat,
  Boxes,
  Bell,
  BarChart3,
  Sparkles,
  Palette,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();

interface NavItem {
  name: string;
  path: string;
  icon: any;
  badge?: number | string;
  highlight?: boolean;
}

interface NavGroup {
  id: string;
  label?: { ar: string; en: string };
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: 'main',
    items: [
      { name: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard }
    ]
  },
  {
    id: 'workforce',
    label: { ar: 'الموظفون والورديات', en: 'Team & Shifts' },
    items: [
      { name: 'nav.employees', path: '/employees', icon: Users },
      { name: 'nav.attendance', path: '/attendance', icon: Clock },
      { name: 'nav.scheduling', path: '/scheduling', icon: CalendarDays },
      { name: 'nav.leaveRequests', path: '/leave-requests', icon: FileCheck }
    ]
  },
  {
    id: 'operations',
    label: { ar: 'العمليات والمطبخ', en: 'Operations & Kitchen' },
    items: [
      { name: 'nav.menu', path: '/menu', icon: UtensilsCrossed },
      { name: 'nav.orders', path: '/orders', icon: ChefHat, badge: 3 },
      { name: 'nav.inventory', path: '/inventory', icon: Boxes }
    ]
  },
  {
    id: 'intelligence',
    label: { ar: 'الذكاء والتقارير', en: 'Intelligence & Reports' },
    items: [
      { name: 'nav.aiIntelligence', path: '/ai-intelligence', icon: Sparkles, highlight: true },
      { name: 'nav.alerts', path: '/alerts', icon: Bell },
      { name: 'nav.reports', path: '/reports', icon: BarChart3 }
    ]
  },
  {
    id: 'system',
    items: [
      { name: 'nav.brandingPreview', path: '/branding-preview', icon: Palette }
    ]
  }
];

const isCollapsed = computed(() => uiStore.sidebarCollapsed);

function isActive(path: string) {
  return route.path === path;
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 start-0 z-30 flex flex-col bg-[#0b131a] text-slate-300 transition-all duration-300 border-e border-slate-800/80 select-none',
      isCollapsed ? 'w-20' : 'w-60'
    ]"
  >
    <!-- Brand Header -->
    <div class="h-[76px] sm:h-[80px] flex items-center justify-between px-3.5 border-b border-slate-800/80 shrink-0">
      <router-link to="/dashboard" class="flex items-center gap-2.5 overflow-hidden">
        <!-- Logo Image: cropped logo without background -->
        <img
          src="/branding/logo-without-bg-trimmed.webp"
          alt="RestoraIntel Logo"
          class="h-8 sm:h-9 w-auto max-w-[54px] object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(78,222,227,0.25)]"
        />
        <div v-if="!isCollapsed" class="flex items-center min-w-0 transition-opacity duration-200">
          <div dir="ltr" class="flex items-center gap-0.5 select-none">
            <span class="font-black text-white text-lg sm:text-xl tracking-tight">Restora</span>
            <span class="font-black text-[#4edee3] text-lg sm:text-xl tracking-tight">Intel</span>
          </div>
        </div>
      </router-link>

      <button
        type="button"
        class="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        @click="uiStore.toggleSidebar"
      >
        <component
          :is="uiStore.direction === 'rtl' ? (isCollapsed ? ChevronLeft : ChevronRight) : (isCollapsed ? ChevronRight : ChevronLeft)"
          class="w-4 h-4"
        />
      </button>
    </div>

    <!-- Active Restaurant Context Badge (when not collapsed) -->
    <div v-if="!isCollapsed" class="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/50">
      <div class="flex items-center gap-2 text-xs">
        <Building class="w-3.5 h-3.5 text-[#34abb1] shrink-0" />
        <span class="text-slate-400 truncate">
          {{ authStore.currentRestaurant?.name[uiStore.language] }}
        </span>
      </div>
    </div>

    <!-- Navigation List with Clean Dividers -->
    <div class="flex-1 overflow-y-auto py-3 px-3 sidebar-scrollbar space-y-1">
      <template v-for="(group, gIdx) in navGroups" :key="group.id">
        <!-- Divider between nav groups -->
        <div v-if="gIdx > 0" class="my-2 border-t border-slate-800/80"></div>

        <!-- Optional section title -->
        <div
          v-if="!isCollapsed && group.label"
          class="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none"
        >
          {{ group.label[uiStore.language] }}
        </div>

        <router-link
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          :class="[
            'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150',
            isActive(item.path)
              ? 'bg-gradient-to-r from-[#2c777c] to-[#236064] text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              'w-4 h-4 shrink-0 transition-colors',
              isActive(item.path) ? 'text-white' : (item.highlight ? 'text-[#4edee3]' : 'text-slate-400 group-hover:text-slate-200')
            ]"
          />

          <span v-if="!isCollapsed" class="truncate flex-1">
            {{ $t(item.name) }}
          </span>

          <span
            v-if="!isCollapsed && item.badge"
            class="ms-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30"
          >
            {{ item.badge }}
          </span>

          <span
            v-if="!isCollapsed && item.highlight"
            class="ms-auto px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-[#4edee3]/20 text-[#4edee3] border border-[#4edee3]/30"
          >
            AI
          </span>

          <!-- Collapsed Tooltip -->
          <div
            v-if="isCollapsed"
            class="absolute start-full ms-2 hidden group-hover:flex items-center px-2.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none"
          >
            {{ $t(item.name) }}
          </div>
        </router-link>
      </template>
    </div>

    <!-- Footer: Only Logout Icon and Text (Avatar & Name in Header Only) -->
    <div class="p-3 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
      <button
        v-if="!isCollapsed"
        type="button"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800/80 hover:border-rose-500/30 transition-all cursor-pointer shadow-xs group"
        @click="handleLogout"
      >
        <LogOut class="w-4 h-4 shrink-0 text-rose-400 group-hover:scale-105 transition-transform" />
        <span class="truncate font-semibold">{{ uiStore.language === 'ar' ? 'تسجيل الخروج' : 'Logout' }}</span>
      </button>

      <button
        v-else
        type="button"
        class="w-full flex items-center justify-center p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800/80 hover:border-rose-500/30 transition-all cursor-pointer"
        :title="uiStore.language === 'ar' ? 'تسجيل الخروج' : 'Logout'"
        @click="handleLogout"
      >
        <LogOut class="w-4 h-4 shrink-0 text-rose-400" />
      </button>
    </div>
  </aside>
</template>
