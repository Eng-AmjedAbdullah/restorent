<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
// import RestaurantSwitcher from '@/components/ui/RestaurantSwitcher.vue';
import {
  Menu,
  Globe,
  Bell,
  Search,
  Sparkles,
  LogOut,
  ChevronDown
} from 'lucide-vue-next';

const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const userDropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function toggleLanguage() {
  uiStore.toggleLanguage();
}

function openAlerts() {
  router.push('/alerts');
}

function handleLogout() {
  userDropdownOpen.value = false;
  authStore.logout();
  router.push('/login');
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    userDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="sticky top-0 z-20 h-[76px] sm:h-[80px] bg-[#0b131a] text-slate-100 border-b border-[#162534] px-3 sm:px-6 flex items-center justify-between gap-3 shadow-md select-none transition-all">
    <!-- Left: Mobile Menu Trigger -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      <!-- Mobile Navigation Hamburger -->
      <button
        type="button"
        class="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#12202f] hover:bg-[#1a2d40] border border-[#1e344d] hover:border-[#4edee3]/40 text-slate-200 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
        :aria-label="$t('nav.dashboard')"
        @click="uiStore.setMobileMenuOpen(true)"
      >
        <Menu class="w-5 h-5 text-slate-200" />
      </button>
    </div>

    <!-- Center: Desktop Search Input -->
    <div class="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-2 lg:mx-4">
      <div class="relative w-full">
        <Search class="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('common.search')"
          class="w-full bg-[#12202f] border border-[#1e344d] hover:border-slate-600 focus:border-[#4edee3] focus:ring-2 focus:ring-[#4edee3]/20 rounded-xl py-2 ps-10 pe-10 text-xs text-white placeholder-slate-400 transition-all outline-none"
        />
        <kbd class="absolute end-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 rounded border border-slate-700">⌘K</kbd>
      </div>
    </div>

    <!-- Right: Controls & User Profile -->
    <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
      <!-- AI Intelligence Pill (Wide screens only) -->
      <router-link
        to="/ai-intelligence"
        class="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4edee3]/15 text-[#4edee3] border border-[#4edee3]/30 hover:bg-[#4edee3]/25 text-xs font-semibold transition-colors"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>RestoraAI</span>
      </router-link>

      <!-- Single Primary Language Switcher -->
      <button
        type="button"
        class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#12202f] hover:bg-[#1a2d40] border border-[#1e344d] hover:border-[#4edee3]/50 text-xs font-bold text-white transition-all cursor-pointer shadow-xs active:scale-95"
        :title="uiStore.language === 'ar' ? 'Switch to English' : 'التحويل للعربية'"
        @click="toggleLanguage"
      >
        <Globe class="w-4 h-4 text-[#4edee3]" />
        <span class="font-mono text-xs uppercase tracking-wide text-white">{{ uiStore.language === 'ar' ? 'EN' : 'عربي' }}</span>
      </button>

      <!-- Incident Notifications Bell -->
      <button
        type="button"
        class="relative p-2.5 rounded-xl bg-[#12202f] hover:bg-[#1a2d40] border border-[#1e344d] hover:border-[#4edee3]/50 text-slate-200 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
        :title="$t('common.notifications')"
        @click="openAlerts"
      >
        <Bell class="w-4 h-4 text-slate-200" />
        <span class="absolute top-2 end-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0b131a]" />
      </button>

      <!-- Vertical subtle separator on medium and up -->
      <div class="h-8 w-px bg-[#1e344d] hidden sm:block mx-0.5"></div>

      <!-- User Profile (Showing Name & Role on Large Screens) -->
      <div ref="dropdownRef" class="relative">
        <button
          type="button"
          class="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#12202f]/70 hover:bg-[#12202f] border border-[#1e344d] hover:border-[#4edee3]/40 transition-all cursor-pointer focus:outline-none group shadow-xs"
          @click="userDropdownOpen = !userDropdownOpen"
        >
          <!-- Avatar with online badge -->
          <div class="relative shrink-0">
            <img
              :src="authStore.currentUser?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80'"
              alt="Avatar"
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-[#1e344d] group-hover:ring-[#4edee3]/60 transition-all shadow-xs"
            />
            <span class="absolute -bottom-0.5 -end-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0b131a]" />
          </div>

          <!-- Name & Role (Visible on md/lg and larger screens) -->
          <div class="hidden md:flex flex-col text-start min-w-0 max-w-[130px] lg:max-w-[170px] xl:max-w-[200px]">
            <span class="text-xs font-bold text-white truncate leading-tight group-hover:text-[#4edee3] transition-colors">
              {{ authStore.currentUser?.name[uiStore.language] }}
            </span>
            <span class="text-[10px] font-semibold text-[#4edee3] truncate leading-tight mt-0.5">
              {{ $t('common.userRole') }}
            </span>
          </div>

          <ChevronDown
            class="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200 shrink-0 ms-0.5"
            :class="{ 'rotate-180': userDropdownOpen }"
          />
        </button>

        <!-- Compact User Menu (Clean style with dark border) -->
        <div
          v-if="userDropdownOpen"
          class="absolute top-full mt-2 end-0 w-64 bg-white rounded-2xl border-2 border-slate-900 shadow-[0_12px_40px_rgba(0,0,0,0.22)] z-50 p-2 animate-in fade-in zoom-in-95 duration-100 text-slate-800"
        >
          <!-- User Info Header -->
          <div class="px-3.5 py-3 bg-slate-50 border border-slate-200/90 rounded-xl mb-1.5 flex items-center gap-3">
            <img
              :src="authStore.currentUser?.avatar_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80'"
              alt="Avatar"
              class="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-slate-900 truncate">
                {{ authStore.currentUser?.name[uiStore.language] }}
              </p>
              <p class="text-[11px] text-[#0f766e] font-semibold truncate mt-0.5">
                {{ $t('common.userRole') }}
              </p>
              <p class="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                {{ authStore.currentUser?.email || 'sara@restoraintel.sa' }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-0.5">
            <button
              type="button"
              class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
              <span>{{ uiStore.language === 'ar' ? 'تسجيل الخروج' : 'Logout' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
