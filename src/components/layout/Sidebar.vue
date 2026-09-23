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

const navItems = [
  { name: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'nav.employees', path: '/employees', icon: Users },
  { name: 'nav.attendance', path: '/attendance', icon: Clock },
  { name: 'nav.scheduling', path: '/scheduling', icon: CalendarDays },
  { name: 'nav.leaveRequests', path: '/leave-requests', icon: FileCheck },
  { name: 'nav.menu', path: '/menu', icon: UtensilsCrossed },
  { name: 'nav.orders', path: '/orders', icon: ChefHat, badge: 3 },
  { name: 'nav.inventory', path: '/inventory', icon: Boxes },
  { name: 'nav.alerts', path: '/alerts', icon: Bell },
  { name: 'nav.reports', path: '/reports', icon: BarChart3 },
  { name: 'nav.aiIntelligence', path: '/ai-intelligence', icon: Sparkles, highlight: true },
  { name: 'nav.brandingPreview', path: '/branding-preview', icon: Palette }
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
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Brand Header -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
      <router-link to="/dashboard" class="flex items-center gap-3 overflow-hidden">
        <!-- Logo Image from validated /branding/ assets -->
        <img
          src="/branding/logo-compact-mark-dark.webp"
          alt="RestoraIntel Mark"
          class="h-9 w-9 object-contain shrink-0"
        />
        <div v-if="!isCollapsed" class="flex flex-col min-w-0 transition-opacity duration-200">
          <div class="flex items-center gap-1.5">
            <span class="font-extrabold text-white text-base tracking-tight">Restora</span>
            <span class="font-extrabold text-[#4edee3] text-base tracking-tight">Intel</span>
          </div>
          <span class="text-[10px] text-slate-400 truncate tracking-wide">
            {{ uiStore.language === 'ar' ? 'المنصة التشغيلية للضيافة' : 'Hospitality OS' }}
          </span>
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

    <!-- Navigation List -->
    <div class="flex-1 overflow-y-auto py-3 px-3 space-y-1 sidebar-scrollbar">
      <router-link
        v-for="item in navItems"
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
    </div>

    <!-- Footer Profile / Logout -->
    <div class="p-3 border-t border-slate-800/80 bg-slate-950/40">
      <div v-if="!isCollapsed" class="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/60">
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            :src="authStore.currentUser?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80'"
            alt="User avatar"
            class="w-8 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          <div class="flex flex-col min-w-0">
            <span class="text-xs font-bold text-white truncate">
              {{ authStore.currentUser?.name[uiStore.language] }}
            </span>
            <span class="text-[10px] text-[#4edee3] truncate">
              {{ $t('common.userRole') }}
            </span>
          </div>
        </div>

        <button
          type="button"
          class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          :title="$t('nav.logout')"
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>

      <div v-else class="flex justify-center">
        <button
          type="button"
          class="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          :title="$t('nav.logout')"
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>
