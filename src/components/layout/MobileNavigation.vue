<script setup lang="ts">
import { ref } from 'vue';
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
  X,
  LogOut,
  Building2,
  Check,
  ChevronDown
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();

const branchPickerOpen = ref(false);

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

function close() {
  uiStore.setMobileMenuOpen(false);
  branchPickerOpen.value = false;
}

function isActive(path: string) {
  return route.path === path;
}

function selectBranch(id: string) {
  authStore.switchRestaurant(id);
  branchPickerOpen.value = false;
  uiStore.addToast({
    title: uiStore.language === 'ar' ? 'تم تبديل الفرع النشط' : 'Switched Active Branch',
    message: authStore.currentRestaurant?.name[uiStore.language],
    type: 'info',
    duration: 3000
  });
}

function handleLogout() {
  close();
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div v-if="uiStore.mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden flex">
    <!-- Backdrop with blur -->
    <div
      class="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      @click="close"
    />

    <!-- Drawer Panel (Compact, high-level SaaS width) -->
    <div class="relative w-[80%] max-w-[290px] bg-[#0b131a] text-slate-300 flex flex-col h-full z-10 shadow-2xl border-e border-[#162534]">
      <!-- Drawer Header (Consistent with Main Header Height) -->
      <div class="h-[76px] sm:h-[80px] flex items-center justify-between px-3.5 border-b border-[#162534] shrink-0">
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            src="/branding/logo-without-bg-trimmed.webp"
            alt="RestoraIntel Logo"
            class="h-8 sm:h-9 w-auto max-w-[54px] object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(78,222,227,0.25)]"
          />
          <div dir="ltr" class="flex items-center gap-0.5 select-none">
            <span class="font-black text-white text-lg sm:text-xl tracking-tight">Restora</span>
            <span class="font-black text-[#4edee3] text-lg sm:text-xl tracking-tight">Intel</span>
          </div>
        </div>

        <button
          type="button"
          class="p-2 text-slate-400 hover:text-white hover:bg-[#12202f] rounded-xl cursor-pointer transition-colors"
          :aria-label="uiStore.language === 'ar' ? 'إغلاق القائمة' : 'Close Menu'"
          @click="close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Quick Branch Switcher (No Language Buttons & No Redundant Components) -->
      <div class="p-3 border-b border-[#162534] bg-slate-950/40 shrink-0">
        <div class="relative">
          <button
            type="button"
            class="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#12202f] border border-[#1e344d] hover:border-[#4edee3]/40 text-start transition-all cursor-pointer"
            @click="branchPickerOpen = !branchPickerOpen"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-7 h-7 rounded-lg bg-[#4edee3]/15 text-[#4edee3] flex items-center justify-center shrink-0">
                <Building2 class="w-3.5 h-3.5 text-[#4edee3]" />
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[10px] font-bold text-[#4edee3] uppercase">
                  {{ authStore.currentRestaurant?.code }}
                </span>
                <span class="text-xs font-bold text-white truncate">
                  {{ authStore.currentRestaurant?.name[uiStore.language] }}
                </span>
              </div>
            </div>
            <ChevronDown
              class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ms-1"
              :class="{ 'rotate-180': branchPickerOpen }"
            />
          </button>

          <!-- Branch List Accordion -->
          <div
            v-if="branchPickerOpen"
            class="mt-1.5 p-1.5 rounded-xl bg-[#0c1622] border border-[#1e344d] space-y-1 max-h-48 overflow-y-auto"
          >
            <button
              v-for="rest in authStore.availableRestaurants"
              :key="rest.id"
              type="button"
              :class="[
                'w-full flex items-center justify-between p-2 rounded-lg text-start text-xs transition-colors cursor-pointer',
                rest.id === authStore.currentRestaurant?.id
                  ? 'bg-[#2c777c]/30 text-[#4edee3] font-bold'
                  : 'text-slate-300 hover:bg-[#12202f] hover:text-white'
              ]"
              @click="selectBranch(rest.id)"
            >
              <div class="flex flex-col min-w-0">
                <span class="truncate font-semibold">{{ rest.name[uiStore.language] }}</span>
                <span class="text-[10px] text-slate-400">{{ rest.city[uiStore.language] }} • {{ rest.code }}</span>
              </div>
              <Check v-if="rest.id === authStore.currentRestaurant?.id" class="w-4 h-4 text-[#4edee3] shrink-0" />
            </button>
          </div>
        </div>
      </div>

      <!-- Navigation Links with Clean Dividers -->
      <div class="flex-1 overflow-y-auto p-3 space-y-1">
        <template v-for="(group, gIdx) in navGroups" :key="group.id">
          <!-- Divider between nav groups -->
          <div v-if="gIdx > 0" class="my-2 border-t border-[#162534]"></div>

          <!-- Section title -->
          <div
            v-if="group.label"
            class="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none"
          >
            {{ group.label[uiStore.language] }}
          </div>

          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
              isActive(item.path)
                ? 'bg-gradient-to-r from-[#2c777c] to-[#236064] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            ]"
            @click="close"
          >
            <component
              :is="item.icon"
              :class="['w-4 h-4 shrink-0', item.highlight ? 'text-[#4edee3]' : '']"
            />
            <span class="flex-1 truncate">{{ $t(item.name) }}</span>

            <span
              v-if="item.badge"
              class="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30"
            >
              {{ item.badge }}
            </span>

            <span
              v-if="item.highlight"
              class="px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-[#4edee3]/20 text-[#4edee3] border border-[#4edee3]/30"
            >
              AI
            </span>
          </router-link>
        </template>
      </div>

      <!-- Footer: Only Logout Icon and Text -->
      <div class="p-3 border-t border-[#162534] bg-slate-950/60 shrink-0">
        <button
          type="button"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800/80 hover:border-rose-500/30 transition-all cursor-pointer shadow-xs group"
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4 shrink-0 text-rose-400 group-hover:scale-105 transition-transform" />
          <span class="truncate font-semibold">{{ uiStore.language === 'ar' ? 'تسجيل الخروج' : 'Logout' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
