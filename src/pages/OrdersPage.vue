<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUIStore } from '@/stores/ui';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types/domain';
import { ChefHat, Clock, AlertCircle } from 'lucide-vue-next';

const uiStore = useUIStore();
const orders = ref<Order[]>([]);

onMounted(async () => {
  orders.value = await orderService.getLiveOrders();
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
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            Order Service Connected
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'متابعة تدفق الطلبات، زمن التحضير، وتذاكر الطهاة في الخط الساخن' : 'Real-time kitchen order tickets (KOT), cook preparation times, and statuses' }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3"
      >
        <div class="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
          <span class="font-bold text-slate-900 font-mono">#{{ order.order_number }}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">{{ order.status }}</span>
        </div>
        <div class="space-y-1 text-xs text-slate-700">
          <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between">
            <span>{{ item.quantity }}x {{ item.name[uiStore.language] }}</span>
            <span class="text-slate-400">{{ item.station }}</span>
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{{ order.order_type }} ({{ order.table_number || 'Takeaway' }})</span>
          <span class="font-bold text-slate-900">{{ order.total_amount }} SAR</span>
        </div>
      </div>
    </div>
  </div>
</template>
