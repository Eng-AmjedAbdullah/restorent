<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types/domain';
import { ChefHat, Clock, AlertCircle } from 'lucide-vue-next';

const uiStore = useUIStore();
const authStore = useAuthStore();
const orders = ref<Order[]>([]);
const isLoading = ref<boolean>(true);

async function loadOrders() {
  const restaurantId = authStore.currentRestaurant?.id;
  if (!restaurantId) {
    orders.value = [];
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  try {
    orders.value = await orderService.getOrders(restaurantId);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadOrders();
});

watch(() => authStore.currentRestaurant?.id, () => {
  loadOrders();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'شاشة المطبخ والطلبات الحية' : 'Live Kitchen Display & Orders' }}
          </h1>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'متابعة تدفق الطلبات، زمن التحضير، وتذاكر الطهاة في الخط الساخن' : 'Real-time kitchen order tickets (KOT), cook preparation times, and statuses' }}
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
      {{ uiStore.language === 'ar' ? 'جاري تحميل الطلبات الحية...' : 'Loading live orders...' }}
    </div>

    <div v-else-if="orders.length === 0" class="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
      {{ uiStore.language === 'ar' ? 'لا توجد طلبات جارية لهذا الفرع حالياً' : 'No active orders found for this branch' }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
      >
        <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
          <span class="font-bold text-slate-900 font-mono">#{{ order.order_number }}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 uppercase">{{ order.status }}</span>
        </div>
        <div class="space-y-1 text-xs text-slate-700">
          <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between items-center">
            <span>{{ item.quantity }}x {{ item.name[uiStore.language] }}</span>
            <span class="text-slate-500 font-mono text-[11px]">{{ item.unit_price * item.quantity }} SAR</span>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{{ order.order_type }} ({{ order.table_number || 'Takeaway' }})</span>
          <span class="font-bold text-slate-900">{{ order.total }} SAR</span>
        </div>
      </div>
    </div>
  </div>
</template>
