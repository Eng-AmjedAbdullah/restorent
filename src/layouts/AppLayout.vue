<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import Sidebar from '@/components/layout/Sidebar.vue';
import Header from '@/components/layout/Header.vue';
import MobileNavigation from '@/components/layout/MobileNavigation.vue';
import ToastNotification from '@/components/ui/ToastNotification.vue';

const uiStore = useUIStore();
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.init();
});

const contentMarginClass = computed(() => {
  if (uiStore.sidebarCollapsed) {
    return 'lg:ms-20';
  }
  return 'lg:ms-64';
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-all duration-300">
    <!-- Desktop Sidebar -->
    <Sidebar class="hidden lg:flex" />

    <!-- Mobile Drawer -->
    <MobileNavigation />

    <!-- Main Content Wrapper -->
    <div :class="['flex-1 flex flex-col transition-all duration-300', contentMarginClass]">
      <Header />

      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>

    <!-- Global Toast Notifications -->
    <ToastNotification />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
