<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { reportService } from '@/services/reportService';
import type { ReportMetric } from '@/types/domain';
import { BarChart3, Download, Printer } from 'lucide-vue-next';
const ui=useUIStore();const auth=useAuthStore();const metrics=ref<ReportMetric[]>([]);
const loading=ref(false);const error=ref('');const range=ref<'all'|'7'|'30'>('all');let generation=0;
const currency=computed(()=>auth.currentRestaurant?.currency??'SAR');
const latestDate=computed(()=>metrics.value.reduce((max,m)=>m.date>max?m.date:max,''));
const filtered=computed(()=>{
  if(range.value==='all'||!latestDate.value)return metrics.value;
  const cutoff=new Date(`${latestDate.value}T00:00:00Z`);cutoff.setUTCDate(cutoff.getUTCDate()-Number(range.value)+1);
  const iso=cutoff.toISOString().slice(0,10);return metrics.value.filter(m=>m.date>=iso&&m.date<=latestDate.value);
});
const totalSales=computed(()=>filtered.value.reduce((sum,m)=>sum+m.sales,0));
const customers=computed(()=>filtered.value.reduce((sum,m)=>sum+m.customer_count,0));
const avgLabor=computed(()=>filtered.value.length?filtered.value.reduce((sum,m)=>sum+m.labor_cost_percent,0)/filtered.value.length:null);
const maxSales=computed(()=>Math.max(1,...filtered.value.map(m=>m.sales)));
function money(n:number){return new Intl.NumberFormat(ui.language==='ar'?'ar-SA':'en-US',{style:'currency',currency:currency.value}).format(n);}
async function load(id:string|undefined){const n=++generation;metrics.value=[];error.value='';if(!id){loading.value=false;return;}loading.value=true;
  try{const rows=await reportService.getReportMetrics(id);if(n===generation)metrics.value=rows;}
  catch(e){if(n===generation)error.value=e instanceof Error?e.message:'Unable to retrieve report data.';}
  finally{if(n===generation)loading.value=false;}}
watch(()=>auth.currentRestaurant?.id,load,{immediate:true});
function printReport(){ window.print(); }
function exportCsv(){if(!filtered.value.length)return;
  const cells=['Date','Sales','Labor cost %','Customers','Average ticket','Table turn (min)','Food waste (kg)'];
  const safe=(value:string|number)=>{let s=String(value);if(/^[=+@-]/.test(s)&&typeof value==='string')s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
  const rows=filtered.value.map(m=>[m.date,m.sales,m.labor_cost_percent,m.customer_count,m.average_ticket,m.table_turn_time_minutes,m.food_waste_kg]);
  const content='\uFEFF'+[cells,...rows].map(row=>row.map(safe).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=`restoraintel-report-${auth.currentRestaurant?.id??'branch'}.csv`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
</script>
<template>
  <div class="report-print-sheet space-y-5">
    <header class="flex flex-wrap justify-between gap-3 items-start border-b border-slate-200 pb-4"><div><h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2"><BarChart3 class="w-6 h-6 text-teal-700"/>{{ ui.language==='ar'?'التقارير المالية والتشغيلية':'Financial & Operational Reports' }}</h1><p class="text-sm text-slate-500 mt-1">{{ ui.language==='ar'?'تقارير بيانات تاريخية تجريبية؛ النطاق محسوب نسبةً إلى آخر تاريخ في العينة.':'Historical sample data. Date ranges are relative to the newest sample record.' }}</p></div>
      <div class="flex flex-wrap items-end gap-2 print:hidden"><label class="text-xs text-slate-600 font-semibold">{{ ui.language==='ar'?'النطاق':'Range' }}<select v-model="range" class="block mt-1 border border-slate-200 rounded-xl px-3 py-2 text-sm"><option value="all">{{ ui.language==='ar'?'كل العينة':'All sample dates' }}</option><option value="7">{{ ui.language==='ar'?'آخر 7 أيام بالعينة':'Last 7 sample days' }}</option><option value="30">{{ ui.language==='ar'?'آخر 30 يومًا بالعينة':'Last 30 sample days' }}</option></select></label>
        <button type="button" :disabled="!filtered.length" class="px-3 py-2 rounded-xl bg-teal-700 text-white text-sm flex items-center gap-2 disabled:opacity-50" @click="exportCsv"><Download class="w-4 h-4"/>CSV</button><button type="button" class="px-3 py-2 border border-slate-200 rounded-xl text-sm flex items-center gap-2" @click="printReport"><Printer class="w-4 h-4"/>{{ ui.language==='ar'?'طباعة / حفظ PDF':'Print / Save PDF' }}</button></div></header>
    <p v-if="error" role="alert" class="p-3 bg-rose-50 text-rose-700 rounded-xl text-sm">{{ error }}</p><p v-if="loading" class="p-10 text-center">{{ ui.language==='ar'?'جارٍ تحميل التقارير…':'Loading reports…' }}</p>
    <template v-else><div class="grid grid-cols-2 lg:grid-cols-4 gap-3"><div v-for="(card,i) in [{ar:'إجمالي مبيعات العينة',en:'Sample sales',value:money(totalSales)},{ar:'العملاء',en:'Customers',value:String(customers)},{ar:'متوسط نسبة العمالة',en:'Avg labor %',value:avgLabor===null?'—':avgLabor.toFixed(1)+'%'},{ar:'آخر تاريخ في العينة',en:'Latest sample date',value:latestDate||'—'}]" :key="i" class="bg-white border border-slate-200 rounded-xl p-4"><p class="text-xs text-slate-500">{{ card[ui.language] }}</p><p class="text-xl font-bold mt-2 text-slate-900">{{ card.value }}</p></div></div>
      <p v-if="!filtered.length" class="p-10 bg-white border border-slate-200 rounded-2xl text-center text-slate-500">{{ ui.language==='ar'?'لا توجد سجلات للتقرير.':'No report data available.' }}</p>
      <section v-else class="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"><h2 class="text-sm font-bold text-slate-900">{{ ui.language==='ar'?'توزيع مبيعات أيام العينة':'Sample daily revenue' }}</h2>
        <div class="space-y-3"><div v-for="m in filtered" :key="m.id" class="flex items-center gap-3 text-xs"><span class="w-24 text-slate-500 font-mono shrink-0">{{ m.date }}</span><div class="flex-1 h-5 bg-slate-100 rounded-lg overflow-hidden"><div class="h-full bg-[#2F7F82] rounded-lg" :style="{width:(m.sales/maxSales*100)+'%'}"/></div><span class="w-24 text-end font-semibold">{{ money(m.sales) }}</span></div></div>
        <div class="overflow-x-auto border-t border-slate-100 pt-4"><table class="min-w-full text-xs"><thead class="bg-slate-50 text-slate-600"><tr><th class="text-start p-3">{{ ui.language==='ar'?'التاريخ':'Date' }}</th><th class="text-start p-3">{{ ui.language==='ar'?'المبيعات':'Sales' }}</th><th class="text-start p-3">{{ ui.language==='ar'?'العمالة':'Labor %' }}</th><th class="text-start p-3">{{ ui.language==='ar'?'العملاء':'Customers' }}</th><th class="text-start p-3">{{ ui.language==='ar'?'متوسط الفاتورة':'Avg ticket' }}</th></tr></thead><tbody class="divide-y divide-slate-100"><tr v-for="m in filtered" :key="m.id"><td class="p-3 font-mono">{{ m.date }}</td><td class="p-3 font-bold">{{ money(m.sales) }}</td><td class="p-3">{{ m.labor_cost_percent }}%</td><td class="p-3">{{ m.customer_count }}</td><td class="p-3">{{ money(m.average_ticket) }}</td></tr></tbody></table></div>
      </section></template>
  </div>
</template>
