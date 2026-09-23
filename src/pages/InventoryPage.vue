<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { inventoryService } from '@/services/inventoryService';
import type { InventoryItem } from '@/types/domain';
import { Boxes, AlertTriangle, ArrowUpDown, Package } from 'lucide-vue-next';

const uiStore = useUIStore();
const inventoryItems = ref<InventoryItem[]>([]);

onMounted(async () => {
  inventoryItems.value = await inventoryService.getInventoryItems();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'إدارة المخزون ونقاط إعادة الطلب' : 'Inventory & Par Levels' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Inventory Service Connected
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'تتبع المواد الخام، التنبيهات الحرجة، ومستوى الأمان للمنتجات' : 'Track raw kitchen ingredients, par levels, stockouts, and suppliers' }}
        </p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="item in inventoryItems.slice(0, 4)"
          :key="item.id"
          class="p-4 rounded-xl border border-slate-200 bg-slate-50/50"
        >
          <div class="flex items-center justify-between text-xs mb-1">
            <span class="text-slate-500 font-mono">{{ item.sku }}</span>
            <span
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-bold',
                item.status === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              ]"
            >
              {{ item.status }}
            </span>
          </div>
          <h4 class="font-bold text-slate-900 text-sm mt-1">{{ item.name[uiStore.language] }}</h4>
          <div class="mt-2 text-xs text-slate-600 flex justify-between">
            <span>{{ uiStore.language === 'ar' ? 'الرصيد الحالي:' : 'Current Stock:' }}</span>
            <span class="font-bold text-slate-900">{{ item.current_stock }} {{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
