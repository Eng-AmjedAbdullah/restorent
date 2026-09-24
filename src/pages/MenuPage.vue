<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { menuService } from '@/services/menuService';
import type { MenuItem } from '@/types/domain';
import { UtensilsCrossed, Plus, DollarSign, Tag } from 'lucide-vue-next';

const uiStore = useUIStore();
const authStore = useAuthStore();
const menuItems = ref<MenuItem[]>([]);
const isLoading = ref<boolean>(true);

async function loadMenu() {
  const restaurantId = authStore.currentRestaurant?.id;
  if (!restaurantId) {
    menuItems.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    menuItems.value = await menuService.getMenuItems(restaurantId);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadMenu();
});

watch(() => authStore.currentRestaurant?.id, () => {
  loadMenu();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'هندسة قائمة الطعام والأصناف' : 'Menu Engineering & Pricing' }}
          </h1>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'الأصناف، تكلفة الوجبات، وتصنيف الأطباق الأكثر ربحية' : 'Manage recipe items, menu cost cards, and profitability analytics' }}
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
      {{ uiStore.language === 'ar' ? 'جاري تحميل قائمة الطعام...' : 'Loading menu items...' }}
    </div>

    <div v-else-if="menuItems.length === 0" class="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
      {{ uiStore.language === 'ar' ? 'لا توجد أصناف في قائمة الطعام لهذا الفرع حالياً' : 'No menu items found for this branch' }}
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in menuItems.slice(0, 6)"
        :key="item.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4"
      >
        <div class="flex items-start justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">{{ item.name[uiStore.language] }}</h4>
            <p class="text-xs text-slate-500 mt-0.5 capitalize">{{ item.category }}</p>
          </div>
          <span class="font-bold text-sm text-[#2c777c]">{{ item.price }} SAR</span>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{{ uiStore.language === 'ar' ? 'تكلفة الصنف:' : 'Item Cost:' }} {{ item.cost }} SAR</span>
          <span
            :class="[
              'px-2 py-0.5 rounded font-semibold',
              item.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            ]"
          >
            {{ item.is_available ? (uiStore.language === 'ar' ? 'متاح' : 'Available') : (uiStore.language === 'ar' ? 'غير متوفر' : 'Unavailable') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
