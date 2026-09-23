<script setup lang="ts">
import { useRoute } from 'vue-router';
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
  X
} from 'lucide-vue-next';

const route = useRoute();
const uiStore = useUIStore();
const authStore = useAuthStore();

const navItems = [
  { name: 'nav.dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'nav.employees', path: '/employees', icon: Users },
  { name: 'nav.attendance', path: '/attendance', icon: Clock },
  { name: 'nav.scheduling', path: '/scheduling', icon: CalendarDays },
  { name: 'nav.leaveRequests', path: '/leave-requests', icon: FileCheck },
  { name: 'nav.menu', path: '/menu', icon: UtensilsCrossed },
  { name: 'nav.orders', path: '/orders', icon: ChefHat },
  { name: 'nav.inventory', path: '/inventory', icon: Boxes },
  { name: 'nav.alerts', path: '/alerts', icon: Bell },
  { name: 'nav.reports', path: '/reports', icon: BarChart3 },
  { name: 'nav.aiIntelligence', path: '/ai-intelligence', icon: Sparkles, highlight: true },
  { name: 'nav.brandingPreview', path: '/branding-preview', icon: Palette }
];

function close() {
  uiStore.setMobileMenuOpen(false);
}

function isActive(path: string) {
  return route.path === path;
}
</script>

<template>
  <div v-if="uiStore.mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden flex">
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      @click="close"
    ></div>

    <!-- Drawer Panel -->
    <div class="relative w-4/5 max-w-xs bg-[#0b131a] text-slate-300 flex flex-col h-full z-10 shadow-2xl">
      <div class="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <img
            src="/branding/logo-compact-mark-dark.webp"
            alt="RestoraIntel Mark"
            class="h-8 w-8 object-contain"
          />
          <div class="flex items-center gap-1">
            <span class="font-extrabold text-white text-base">Restora</span>
            <span class="font-extrabold text-[#4edee3] text-base">Intel</span>
          </div>
        </div>

        <button
          type="button"
          class="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          @click="close"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-3 space-y-1">
        <router-link
          v-for="item in navItems"
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
          <span>{{ $t(item.name) }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
