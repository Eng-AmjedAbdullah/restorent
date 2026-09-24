<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { inventoryService } from '@/services/inventoryService';
import type { InventoryItem } from '@/types/domain';
import { Boxes, Search, PackagePlus } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';
const ui=useUIStore();const auth=useAuthStore();
const items=ref<InventoryItem[]>([]);const search=ref('');const category=ref('all');
const selected=ref<InventoryItem|null>(null);const amount=ref<number>(0);
const loading=ref(false);const busy=ref(false);const error=ref('');let generation=0;
const canManage=computed(()=>auth.can('restaurant.inventory.manage'));
const currency=computed(()=>auth.currentRestaurant?.currency??'SAR');
const categories=computed(()=>['all',...new Set(items.value.map(i=>i.category))]);
const filtered=computed(()=>items.value.filter(i=>(category.value==='all'||i.category===category.value)&&
  [i.sku,i.name.ar,i.name.en,i.supplier_name].some(x=>x.toLowerCase().includes(search.value.trim().toLowerCase()))));
const critical=computed(()=>items.value.filter(i=>i.status==='critical'||i.status==='out_of_stock').length);
function money(value:number){return new Intl.NumberFormat(ui.language==='ar'?'ar-SA':'en-US',{style:'currency',currency:currency.value}).format(value);}
async function load(id:string|undefined){const n=++generation;items.value=[];error.value='';if(!id){loading.value=false;return;}loading.value=true;
  try{const data=await inventoryService.getInventoryItems(id);if(n===generation)items.value=data;}
  catch(e){if(n===generation)error.value=e instanceof Error?e.message:'Unable to load inventory.';}
  finally{if(n===generation)loading.value=false;}}
watch(()=>auth.currentRestaurant?.id,load,{immediate:true});
function openRestock(item:InventoryItem){selected.value=item;amount.value=0;error.value='';}
async function restock(){const id=auth.currentRestaurant?.id,item=selected.value;if(!id||!item||busy.value)return;
  if(!Number.isFinite(amount.value)||amount.value<=0){error.value=ui.language==='ar'?'أدخل كمية موجبة صحيحة':'Enter a positive quantity.';return;}
  busy.value=true;error.value='';try{const updated=await inventoryService.updateStock(id,item.id,item.current_stock+amount.value);items.value=items.value.map(i=>i.id===updated.id?updated:i);selected.value=null;}
  catch(e){error.value=e instanceof Error?e.message:'Stock update failed.';}finally{busy.value=false;}}
</script>
<template>
  <div class="space-y-5">
    <header class="border-b border-slate-200 pb-4"><h1 class="text-2xl font-bold text-slate-900 flex gap-2 items-center"><Boxes class="w-6 h-6 text-teal-700"/>{{ ui.language==='ar'?'المخزون ومستويات إعادة الطلب':'Inventory & Reorder Levels' }}</h1><p class="text-sm text-slate-500 mt-1">{{ ui.language==='ar'?'تعديلات المخزون محاكاة محلية، وليست أوامر شراء فعلية.':'Stock updates are local simulations, not purchase orders.' }}</p></header>
    <div class="grid grid-cols-2 gap-3"><div class="bg-white rounded-xl border border-slate-200 p-4"><p class="text-xs text-slate-500">{{ ui.language==='ar'?'الأصناف':'Items' }}</p><p class="text-2xl font-bold">{{ items.length }}</p></div><div class="bg-white rounded-xl border border-rose-200 p-4"><p class="text-xs text-slate-500">{{ ui.language==='ar'?'حرج أو نافد':'Critical / out of stock' }}</p><p class="text-2xl font-bold text-rose-700">{{ critical }}</p></div></div>
    <div class="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
      <div class="flex flex-col md:flex-row gap-3"><label class="relative grow"><Search class="w-4 h-4 absolute start-3 top-3 text-slate-400"/><input v-model="search" type="search" :placeholder="ui.language==='ar'?'البحث في المخزون…':'Search inventory…'" class="w-full ps-10 pe-3 py-2 border border-slate-200 rounded-xl text-sm"/></label><select v-model="category" class="border border-slate-200 px-3 py-2 rounded-xl text-sm"><option v-for="c in categories" :key="c" :value="c">{{ c==='all'?(ui.language==='ar'?'كل التصنيفات':'All categories'):c }}</option></select></div>
      <p v-if="error" role="alert" class="p-3 rounded-xl bg-rose-50 text-rose-800 text-sm">{{ error }}</p>
      <p v-if="loading" class="p-8 text-slate-500 text-center">{{ ui.language==='ar'?'جاري التحميل…':'Loading…' }}</p><p v-else-if="!filtered.length" class="p-10 text-slate-500 text-center">{{ ui.language==='ar'?'لا توجد أصناف مطابقة.':'No matching stock items.' }}</p>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <article v-for="item in filtered" :key="item.id" class="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
          <div class="flex justify-between gap-2"><div><p class="text-xs font-mono text-slate-500">{{ item.sku }}</p><h2 class="font-bold text-slate-900 mt-1">{{ item.name[ui.language] }}</h2></div><span :class="['rounded-full text-[11px] font-bold px-2 py-1 h-fit',item.status==='out_of_stock'||item.status==='critical'?'bg-rose-100 text-rose-700':item.status==='low_stock'?'bg-amber-100 text-amber-700':'bg-teal-100 text-teal-800']">{{ item.status }}</span></div>
          <div class="text-xs text-slate-600 flex justify-between"><span>{{ ui.language==='ar'?'الرصيد':'Current' }}</span><strong>{{ item.current_stock }} {{ item.unit }}</strong></div><div class="text-xs text-slate-600 flex justify-between"><span>{{ ui.language==='ar'?'نقطة إعادة الطلب':'Reorder point' }}</span><strong>{{ item.reorder_point }} {{ item.unit }}</strong></div><div class="text-xs text-slate-500">{{ money(item.cost_per_unit) }} / {{ item.unit }}</div>
          <button v-if="canManage" type="button" class="w-full flex justify-center items-center gap-2 py-2 px-3 border border-teal-300 text-teal-800 font-semibold rounded-lg text-sm hover:bg-teal-50" @click="openRestock(item)"><PackagePlus class="w-4 h-4"/>{{ ui.language==='ar'?'إضافة كمية تجريبية':'Add demo stock' }}</button>
        </article>
      </div>
    </div>
    <Dialog :is-open="!!selected" :title="ui.language==='ar'?'تحديث المخزون التجريبي':'Demo stock update'" @close="selected=null">
      <form class="space-y-4" @submit.prevent="restock"><p class="text-sm text-slate-600">{{ selected?.name[ui.language] }} — {{ selected?.current_stock }} {{ selected?.unit }}</p><label class="block text-sm font-semibold">{{ ui.language==='ar'?'الكمية الإضافية':'Additional quantity' }}<input v-model.number="amount" type="number" min="0.01" step="0.01" required class="w-full block mt-2 border border-slate-200 rounded-xl p-3"/></label><p v-if="error" role="alert" class="text-xs text-rose-700">{{ error }}</p><button type="submit" :disabled="busy" class="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50">{{ ui.language==='ar'?'حفظ':'Save' }}</button></form>
    </Dialog>
  </div>
</template>
