<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { menuService } from '@/services/menuService';
import type { MenuItem } from '@/types/domain';
import { UtensilsCrossed, Plus, DollarSign, Tag } from 'lucide-vue-next';

const uiStore = useUIStore();
const menuItems = ref<MenuItem[]>([]);

onMounted(async () => {
  menuItems.value = await menuService.getMenuItems();
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

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in menuItems.slice(0, 6)"
        :key="item.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4"
      >
        <div class="flex items-start justify-between">
          <div>
            <h4 class="font-bold text-slate-900 text-sm">{{ item.name[uiStore.language] }}</h4>
            <p class="text-xs text-slate-500 mt-0.5">{{ item.category }}</p>
          </div>
          <span class="font-bold text-sm text-[#2c777c]">{{ item.price }} SAR</span>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{{ uiStore.language === 'ar' ? 'تكلفة الصنف:' : 'Item Cost:' }} {{ item.cost }} SAR</span>
          <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">{{ item.is_active ? 'Active' : 'Inactive' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
