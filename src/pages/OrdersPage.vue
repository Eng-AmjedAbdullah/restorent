<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types/domain';
import { ChefHat, Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-vue-next';
const ui = useUIStore(); const auth = useAuthStore();
const orders = ref<Order[]>([]); const busy = ref<string | null>(null);
const loading = ref(false); const error = ref(''); let generation = 0;
const canManage = computed(() => auth.can('restaurant.orders.manage'));
const columns = [
  {status:'new',ar:'جديد',en:'New',next:'preparing',nextAr:'بدء التجهيز',nextEn:'Start preparing',color:'border-sky-300 bg-sky-50/50'},
  {status:'preparing',ar:'قيد الإعداد',en:'Preparing',next:'ready',nextAr:'جاهز',nextEn:'Mark ready',color:'border-amber-300 bg-amber-50/50'},
  {status:'ready',ar:'جاهز',en:'Ready',next:'delivered',nextAr:'تسليم تجريبي',nextEn:'Mark delivered',color:'border-emerald-300 bg-emerald-50/50'},
  {status:'delivered',ar:'تم التسليم',en:'Delivered',next:'',nextAr:'',nextEn:'',color:'border-slate-200 bg-slate-50'}
] as const;
const currency = computed(() => auth.currentRestaurant?.currency ?? 'SAR');
function formatMoney(amount:number) { return new Intl.NumberFormat(ui.language === 'ar' ? 'ar-SA' : 'en-US',{style:'currency',currency:currency.value}).format(amount); }
async function load(id: string | undefined) {
  const stamp = ++generation; orders.value=[];error.value='';
  if(!id){loading.value=false;return;}loading.value=true;
  try { const records=await orderService.getOrders(id); if(stamp===generation)orders.value=records; }
  catch(e){if(stamp===generation)error.value=e instanceof Error?e.message:'Unable to load orders.';}
  finally{if(stamp===generation)loading.value=false;}
}
watch(() => auth.currentRestaurant?.id,load,{immediate:true});
async function nextStatus(order:Order, next:Order['status']) {
  const restaurantId=auth.currentRestaurant?.id;
  if(!restaurantId || busy.value || !canManage.value)return;
  busy.value=order.id;error.value='';
  try {const updated=await orderService.updateOrderStatus(restaurantId,order.id,next);orders.value=orders.value.map(o=>o.id===updated.id?updated:o);}
  catch(e){error.value=e instanceof Error?e.message:'Unable to update order.';}
  finally{busy.value=null;}
}
async function toggleItem(order:Order,itemId:string|undefined) {
  const id=auth.currentRestaurant?.id; if(!id||!itemId||busy.value||!canManage.value)return;
  busy.value=order.id;error.value='';
  try{const updated=await orderService.toggleItemPrepared(id,order.id,itemId);orders.value=orders.value.map(o=>o.id===updated.id?updated:o);}
  catch(e){error.value=e instanceof Error?e.message:'Unable to update item.';}
  finally{busy.value=null;}
}
</script>

<template>
  <div class="space-y-5">
    <header class="border-b border-slate-200 pb-4"><h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2"><ChefHat class="w-6 h-6 text-teal-700"/>{{ ui.language === 'ar'?'شاشة المطبخ التجريبية':'Demo Kitchen Display (KDS)' }}</h1>
      <p class="text-sm text-slate-500 mt-1">{{ ui.language === 'ar'?'تذاكر تاريخية ومحاكاة مراحل الإعداد؛ لا اتصال فعلي بالمطبخ.':'Historical sample tickets with local stage transitions; no live kitchen connectivity.' }}</p></header>
    <p v-if="error" role="alert" class="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">{{ error }}</p>
    <p v-if="loading" class="p-10 bg-white rounded-2xl text-center text-slate-500">{{ ui.language==='ar'?'تحميل التذاكر…':'Loading tickets…' }}</p>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
      <section v-for="col in columns" :key="col.status" :class="['rounded-2xl border min-h-52 p-3 space-y-3',col.color]">
        <header class="flex justify-between items-center p-1"><h2 class="text-sm font-bold text-slate-900">{{ col[ui.language] }}</h2><span class="text-xs font-bold rounded-full px-2 py-1 bg-white/80 text-slate-700">{{ orders.filter(o=>o.status===col.status).length }}</span></header>
        <article v-for="order in orders.filter(o=>o.status===col.status)" :key="order.id" class="bg-white border border-slate-200 shadow-sm rounded-xl p-3 space-y-3">
          <div class="flex justify-between items-start gap-2"><div><p dir="ltr" class="font-mono text-sm font-bold text-slate-900">{{ order.order_number }}</p><p class="text-[11px] text-slate-500 mt-1">{{ order.order_type }} · {{ order.table_number||'—' }}</p></div><span v-if="order.priority!=='normal'" class="bg-rose-50 text-rose-700 px-2 py-1 rounded text-xs font-semibold">{{ order.priority }}</span></div>
          <ul class="divide-y divide-slate-100"><li v-for="(item,i) in order.items" :key="item.id||i" class="py-2 space-y-1"><button type="button" :disabled="!canManage||!!busy||!item.id||order.status==='delivered'" :aria-pressed="item.is_prepared" class="flex items-start gap-2 text-start w-full text-xs disabled:cursor-default" @click="toggleItem(order,item.id)"><CheckCircle2 :class="['w-4 h-4 shrink-0',item.is_prepared?'text-emerald-600':'text-slate-300']"/><span :class="item.is_prepared?'line-through text-slate-400':'font-semibold text-slate-800'">{{ item.quantity }} × {{ item.name[ui.language] }}</span></button><p v-if="item.notes" class="text-[10px] bg-amber-50 text-amber-800 rounded p-1.5">{{ item.notes }}</p></li></ul>
          <div class="border-t border-slate-100 pt-2 flex justify-between text-xs"><span class="text-slate-500 flex items-center gap-1"><Clock class="w-3 h-3"/>{{ order.elapsed_minutes }} min <span class="text-[10px]">{{ ui.language==='ar'?'(لقطة تجريبية)':'(snapshot)' }}</span></span><strong>{{ formatMoney(order.total) }}</strong></div>
          <button v-if="col.next&&canManage" type="button" :disabled="!!busy" class="w-full p-2 rounded-lg bg-teal-700 text-white text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-1" @click="nextStatus(order,col.next as Order['status'])">{{ ui.language==='ar'?col.nextAr:col.nextEn }}<ArrowLeft v-if="ui.language==='ar'" class="w-3 h-3"/><ArrowRight v-else class="w-3 h-3"/></button>
        </article>
        <p v-if="!orders.some(o=>o.status===col.status)" class="p-7 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl">{{ ui.language==='ar'?'لا توجد تذاكر':'No tickets' }}</p>
      </section>
    </div>
  </div>
</template>
