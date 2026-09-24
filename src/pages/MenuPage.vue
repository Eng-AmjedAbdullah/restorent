<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { menuService } from '@/services/menuService';
import type { MenuItem } from '@/types/domain';
import { UtensilsCrossed, Plus, Search } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';
const ui=useUIStore();const auth=useAuthStore();
const items=ref<MenuItem[]>([]);const search=ref('');const category=ref('all');
const loading=ref(false);const busy=ref<string|null>(null);const error=ref('');const showAdd=ref(false);let generation=0;
const canManage=computed(()=>auth.can('restaurant.menu.manage'));
const categories=computed(()=>['all',...new Set(items.value.map(i=>i.category))]);
const filtered=computed(()=>items.value.filter(i=>(category.value==='all'||i.category===category.value)&&
  [i.name.ar,i.name.en,i.description.ar,i.description.en].some(s=>s.toLowerCase().includes(search.value.trim().toLowerCase()))));
const currency=computed(()=>auth.currentRestaurant?.currency??'SAR');
function money(n:number){return new Intl.NumberFormat(ui.language==='ar'?'ar-SA':'en-US',{style:'currency',currency:currency.value}).format(n);}
const form=reactive({name:'',description:'',category:'mains' as MenuItem['category'],price:0,cost:0,preparation_time_minutes:15});
async function load(id:string|undefined){const n=++generation;items.value=[];error.value='';if(!id){loading.value=false;return;}loading.value=true;
  try{const data=await menuService.getMenuItems(id);if(n===generation)items.value=data;}
  catch(e){if(n===generation)error.value=e instanceof Error?e.message:'Failed to load menu.';}
  finally{if(n===generation)loading.value=false;}}
watch(()=>auth.currentRestaurant?.id,load,{immediate:true});
async function toggle(item:MenuItem){const rest=auth.currentRestaurant?.id;if(!rest||busy.value||!canManage.value)return;
  busy.value=item.id;error.value='';try{const updated=await menuService.toggleAvailability(rest,item.id);items.value=items.value.map(i=>i.id===updated.id?updated:i);}catch(e){error.value=e instanceof Error?e.message:'Update failed.';}finally{busy.value=null;}}
async function create(){const rest=auth.currentRestaurant?.id;if(!rest||busy.value||!canManage.value)return;
  if(!form.name.trim()||!Number.isFinite(form.price)||form.price<0||!Number.isFinite(form.cost)||form.cost<0){error.value='Invalid name, price or cost.';return;}
  busy.value='create';error.value='';try{
    const margin=form.price>0?Math.round(((form.price-form.cost)/form.price)*100):0;
    const item:Omit<MenuItem,'id'|'created_at'|'updated_at'>={restaurant_id:rest,name:{ar:form.name,en:form.name},description:{ar:form.description,en:form.description},
      category:form.category,price:form.price,cost:form.cost,profit_margin_percent:margin,is_available:true,is_featured:false,stock_alert_threshold:0,
      preparation_time_minutes:form.preparation_time_minutes,calories:0,allergens:[],tags:[]};
    const added=await menuService.addMenuItem(rest,item);items.value.unshift(added);showAdd.value=false;Object.assign(form,{name:'',description:'',category:'mains',price:0,cost:0,preparation_time_minutes:15});
  }catch(e){error.value=e instanceof Error?e.message:'Unable to add item.';}finally{busy.value=null;}}
</script>
<template>
  <div class="space-y-5">
    <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4"><div><h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2"><UtensilsCrossed class="w-6 h-6 text-teal-700"/>{{ ui.language==='ar'?'إدارة قائمة الطعام':'Menu Management' }}</h1><p class="text-sm text-slate-500 mt-1">{{ ui.language==='ar'?'إدارة الأصناف والأسعار وتوفرها محليًا في النسخة التجريبية.':'Manage demo menu items, prices and availability.' }}</p></div>
      <button v-if="canManage" type="button" class="flex items-center gap-2 bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl text-sm" @click="showAdd=true"><Plus class="w-4 h-4"/>{{ ui.language==='ar'?'إضافة صنف':'Add item' }}</button></header>
    <div class="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"><div class="flex flex-col sm:flex-row gap-3"><label class="relative grow"><Search class="absolute start-3 top-3 w-4 h-4 text-slate-400"/><input v-model="search" type="search" class="w-full ps-10 pe-3 py-2 border border-slate-200 rounded-xl text-sm" :placeholder="ui.language==='ar'?'ابحث عن صنف…':'Search menu…'"/></label><select v-model="category" class="px-3 py-2 border border-slate-200 rounded-xl text-sm"><option v-for="c in categories" :key="c" :value="c">{{ c==='all'?(ui.language==='ar'?'كل التصنيفات':'All categories'):c }}</option></select></div>
      <p v-if="error" role="alert" class="bg-rose-50 text-rose-700 p-3 rounded-lg text-sm">{{ error }}</p>
      <p v-if="loading" class="p-10 text-center text-slate-500">{{ ui.language==='ar'?'جاري التحميل…':'Loading…' }}</p><p v-else-if="!filtered.length" class="p-10 text-center text-slate-500">{{ ui.language==='ar'?'لا توجد أصناف مطابقة.':'No matching menu items.' }}</p>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"><article v-for="item in filtered" :key="item.id" class="p-4 border border-slate-200 bg-slate-50/30 rounded-xl space-y-3"><div class="flex justify-between gap-2"><div><h2 class="font-bold text-slate-900">{{ item.name[ui.language] }}</h2><p class="text-xs text-slate-500 mt-1">{{ item.category }}</p></div><strong class="text-teal-700 text-sm">{{ money(item.price) }}</strong></div><p class="text-xs text-slate-500 line-clamp-2">{{ item.description[ui.language] }}</p><div class="flex justify-between text-xs text-slate-600"><span>{{ ui.language==='ar'?'التكلفة':'Cost' }}: {{ money(item.cost) }}</span><span>{{ item.profit_margin_percent }}%</span></div><div class="pt-3 border-t border-slate-200 flex justify-between items-center gap-2"><span :class="['px-2 py-1 text-xs font-semibold rounded-full',item.is_available?'bg-emerald-100 text-emerald-800':'bg-rose-100 text-rose-800']">{{ item.is_available?(ui.language==='ar'?'متاح':'Available'):(ui.language==='ar'?'غير متوفر':'Unavailable') }}</span><button v-if="canManage" type="button" :disabled="!!busy" class="text-teal-800 text-xs font-semibold hover:underline disabled:opacity-50" @click="toggle(item)">{{ ui.language==='ar'?'تبديل التوفر':'Toggle availability' }}</button></div></article></div>
    </div>
    <Dialog :is-open="showAdd" :title="ui.language==='ar'?'إضافة صنف تجريبي':'Add demo menu item'" @close="showAdd=false"><form class="space-y-3" @submit.prevent="create"><p class="text-xs text-slate-500">{{ ui.language==='ar'?'الأسماء الجديدة تُخزن كما أُدخلت، دون ترجمة مختلقة.':'New names are stored as entered; no invented translation.' }}</p><label class="block text-xs font-semibold">{{ ui.language==='ar'?'اسم الصنف':'Item name' }}<input v-model="form.name" required class="mt-1 w-full block p-2 border border-slate-200 rounded-xl"/></label><label class="block text-xs font-semibold">{{ ui.language==='ar'?'الوصف':'Description' }}<textarea v-model="form.description" rows="2" class="mt-1 block w-full p-2 border border-slate-200 rounded-xl"/></label><label class="block text-xs font-semibold">{{ ui.language==='ar'?'التصنيف':'Category' }}<select v-model="form.category" class="mt-1 w-full block p-2 border border-slate-200 rounded-xl"><option v-for="c in ['appetizers','mains','steaks','pasta','beverages','desserts']" :key="c" :value="c">{{ c }}</option></select></label><div class="grid grid-cols-2 gap-3"><label class="text-xs font-semibold">{{ ui.language==='ar'?'السعر':'Price' }}<input v-model.number="form.price" type="number" min="0" step="0.01" required class="mt-1 w-full block p-2 border border-slate-200 rounded-xl"/></label><label class="text-xs font-semibold">{{ ui.language==='ar'?'التكلفة':'Cost' }}<input v-model.number="form.cost" type="number" min="0" step="0.01" required class="mt-1 w-full block p-2 border border-slate-200 rounded-xl"/></label></div><label class="block text-xs font-semibold">{{ ui.language==='ar'?'وقت الإعداد (دقائق)':'Prep time (minutes)' }}<input v-model.number="form.preparation_time_minutes" type="number" min="0" required class="mt-1 w-full block p-2 border border-slate-200 rounded-xl"/></label><p v-if="error" role="alert" class="text-rose-700 text-xs">{{ error }}</p><button type="submit" :disabled="!!busy" class="bg-teal-700 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50">{{ ui.language==='ar'?'حفظ':'Save item' }}</button></form></Dialog>
  </div>
</template>
