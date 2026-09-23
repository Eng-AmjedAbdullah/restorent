<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import RestaurantSwitcher from '@/components/ui/RestaurantSwitcher.vue';
import {
  Menu,
  Languages,
  Bell,
  Search,
  Sparkles,
  ExternalLink
} from 'lucide-vue-next';

const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();
const searchQuery = ref('');

function toggleLanguage() {
  uiStore.toggleLanguage();
}

function openAlerts() {
  router.push('/alerts');
}
</script>

<template>
  <header class="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
    <!-- Left: Mobile Menu & Restaurant Switcher -->
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        @click="uiStore.setMobileMenuOpen(true)"
      >
        <Menu class="w-5 h-5" />
      </button>

      <!-- Multi-Restaurant Switcher -->
      <RestaurantSwitcher />
    </div>

    <!-- Center: Search Bar (Desktop) -->
    <div class="hidden md:flex items-center flex-1 max-w-md mx-4">
      <div class="relative w-full">
        <Search class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('common.search')"
          class="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-[#34abb1] focus:ring-2 focus:ring-[#34abb1]/20 rounded-xl py-1.5 ps-9 pe-4 text-xs transition-all outline-none"
        />
      </div>
    </div>

    <!-- Right: Actions & Profile -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- AI Simulation Badge (Demo Clarification) -->
      <router-link
        to="/ai-intelligence"
        class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4edee3]/15 text-[#2c777c] border border-[#4edee3]/30 text-xs font-semibold hover:bg-[#4edee3]/25 transition-colors"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>{{ $t('common.aiSimulationBadge') }}</span>
      </router-link>

      <!-- Language Switcher -->
      <button
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        @click="toggleLanguage"
      >
        <Languages class="w-3.5 h-3.5 text-[#34abb1]" />
        <span>{{ uiStore.language === 'ar' ? 'English' : 'العربية' }}</span>
      </button>

      <!-- Notification Alerts -->
      <button
        type="button"
        class="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        :title="$t('common.notifications')"
        @click="openAlerts"
      >
        <Bell class="w-4 h-4" />
        <span class="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
      </button>

      <!-- User Chip -->
      <div class="flex items-center gap-2 ps-2 border-s border-slate-200">
        <img
          :src="authStore.currentUser?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80'"
          alt="Avatar"
          class="w-8 h-8 rounded-xl object-cover border border-slate-200"
        />
        <div class="hidden xl:flex flex-col text-start">
          <span class="text-xs font-bold text-slate-800 leading-tight">
            {{ authStore.currentUser?.name[uiStore.language] }}
          </span>
          <span class="text-[10px] text-slate-500">
            {{ $t('common.userRole') }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>
