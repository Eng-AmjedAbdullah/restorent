<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { attendanceService } from '@/services/attendanceService';
import { employeeService } from '@/services/employeeService';
import type { Attendance, Employee } from '@/types/domain';
import { Clock, CheckCircle2, FileCheck, Plus } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';
const ui=useUIStore();const auth=useAuthStore();
const attendance=ref<Attendance[]>([]);const employees=ref<Employee[]>([]);
const filter=ref('all');const loading=ref(false);const busy=ref(false);const error=ref('');let generation=0;
const canManage=computed(()=>auth.can('restaurant.attendance.manage'));
const filtered=computed(()=>attendance.value.filter(a=>filter.value==='all'||a.status===filter.value));
const checkIns=computed(()=>attendance.value.filter(a=>Boolean(a.actual_clock_in)));
const punctuality=computed(()=>checkIns.value.length?Math.round(checkIns.value.filter(a=>a.late_minutes===0).length/checkIns.value.length*100):null);
const selected=ref<Attendance|null>(null);const reason=ref('');
const showClockIn=ref(false);const employeeId=ref('');const clockTime=ref('08:00');
async function load(id:string|undefined){const n=++generation;attendance.value=[];employees.value=[];error.value='';if(!id){loading.value=false;return;}loading.value=true;
 try{const [records,staff]=await Promise.all([attendanceService.getAttendances(id),employeeService.getEmployees(id)]);if(n===generation){attendance.value=records;employees.value=staff;employeeId.value=staff.find(s=>s.status==='active')?.id??'';}}
 catch(e){if(n===generation)error.value=e instanceof Error?e.message:'Unable to load attendance.';}
 finally{if(n===generation)loading.value=false;}}
watch(()=>auth.currentRestaurant?.id,load,{immediate:true});
async function submitClockIn(){const id=auth.currentRestaurant?.id;if(!id||!employeeId.value||busy.value)return;
 busy.value=true;error.value='';try{await attendanceService.recordClockIn(employeeId.value,id,clockTime.value);showClockIn.value=false;await load(id);}catch(e){error.value=e instanceof Error?e.message:'Clock-in failed.';}finally{busy.value=false;}}
async function submitExcuse(){const id=auth.currentRestaurant?.id,record=selected.value;if(!id||!record||busy.value)return;
 busy.value=true;error.value='';try{await attendanceService.excuseAttendance(id,record.id,reason.value);selected.value=null;reason.value='';await load(id);}catch(e){error.value=e instanceof Error?e.message:'Unable to excuse record.';}finally{busy.value=false;}}
</script>
<template>
  <div class="space-y-5">
    <header class="flex flex-wrap justify-between gap-3 border-b border-slate-200 pb-4"><div><h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2"><Clock class="w-6 h-6 text-teal-700"/>{{ ui.language==='ar'?'الحضور والانصراف':'Attendance Records' }}</h1><p class="text-sm text-slate-500 mt-1">{{ ui.language==='ar'?'عرض تاريخي من بيانات تجريبية؛ لا توجد أجهزة بصمة أو تحديد موقع متصلة.':'Historical demo records; no biometric or geofence hardware is connected.' }}</p></div>
      <button v-if="canManage" type="button" class="bg-teal-700 text-white rounded-xl px-4 py-2 text-sm font-semibold flex gap-2 items-center" @click="showClockIn=true"><Plus class="w-4 h-4"/>{{ ui.language==='ar'?'تسجيل حضور يدوي':'Manual clock-in' }}</button></header>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3"><div class="bg-white border border-slate-200 rounded-xl p-4"><span class="text-xs text-slate-500">{{ ui.language==='ar'?'سجلات العينة':'Sample records' }}</span><p class="text-2xl font-bold">{{ attendance.length }}</p></div><div class="bg-white border border-slate-200 rounded-xl p-4"><span class="text-xs text-slate-500">{{ ui.language==='ar'?'الحضور المسجل':'Clock-ins' }}</span><p class="text-2xl font-bold">{{ checkIns.length }}</p></div><div class="bg-white border border-slate-200 rounded-xl p-4"><span class="text-xs text-slate-500">{{ ui.language==='ar'?'الالتزام ضمن السجلات المسجلة':'On-time recorded check-ins' }}</span><p class="text-2xl font-bold">{{ punctuality===null?'—':punctuality+'%' }}</p></div></div>
    <section class="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"><div class="flex gap-2 flex-wrap"><button v-for="s in ['all','on_time','late','excused','absent','active_shift']" :key="s" type="button" :aria-pressed="filter===s" :class="['px-3 py-1.5 rounded-lg border text-xs font-semibold',filter===s?'bg-teal-700 text-white border-teal-700':'bg-white border-slate-200 text-slate-600']" @click="filter=s">{{ s }}</button></div>
      <p v-if="error" role="alert" class="p-3 text-sm bg-rose-50 text-rose-700 rounded-lg">{{ error }}</p>
      <p v-if="loading" class="p-10 text-center text-slate-500">{{ ui.language==='ar'?'تحميل السجلات…':'Loading records…' }}</p><p v-else-if="!filtered.length" class="p-10 text-center text-slate-500">{{ ui.language==='ar'?'لا توجد سجلات مطابقة.':'No matching records.' }}</p>
      <div v-else class="divide-y divide-slate-100"><article v-for="rec in filtered" :key="rec.id" class="py-3 flex flex-col sm:flex-row justify-between gap-3"><div><p class="font-semibold text-slate-900 text-sm">{{ rec.employee?`${rec.employee.first_name[ui.language]} ${rec.employee.last_name[ui.language]}`:rec.employee_id }}</p><p class="text-xs text-slate-500 mt-1">{{ rec.date }} · {{ rec.scheduled_start }}–{{ rec.scheduled_end }} · {{ rec.device_source||'—' }} (demo)</p></div><div class="flex flex-wrap items-center gap-3 text-xs"><span class="font-mono">{{ rec.actual_clock_in||'—' }}</span><span :class="['px-2 py-1 rounded-lg font-bold',rec.status==='late'?'bg-amber-100 text-amber-800':rec.status==='excused'?'bg-blue-100 text-blue-700':'bg-emerald-50 text-teal-800']">{{ rec.status }}</span><button v-if="canManage && rec.status==='late'" type="button" class="text-teal-800 font-semibold hover:underline" @click="selected=rec;reason='';error=''">{{ ui.language==='ar'?'تسجيل عذر':'Add excuse' }}</button></div></article></div>
    </section>
    <Dialog :is-open="showClockIn" :title="ui.language==='ar'?'حضور يدوي تجريبي':'Demo manual clock-in'" @close="showClockIn=false"><form class="space-y-4" @submit.prevent="submitClockIn"><label class="text-sm font-semibold block">{{ ui.language==='ar'?'الموظف':'Employee' }}<select v-model="employeeId" required class="block w-full mt-2 border border-slate-200 p-2 rounded-xl"><option disabled value="">{{ ui.language==='ar'?'اختر':'Select' }}</option><option v-for="emp in employees.filter(e=>e.status==='active')" :key="emp.id" :value="emp.id">{{ emp.first_name[ui.language] }} {{ emp.last_name[ui.language] }}</option></select></label><label class="text-sm font-semibold block">{{ ui.language==='ar'?'الوقت المحلي للفرع':'Restaurant-local time' }}<input v-model="clockTime" type="time" required class="block w-full mt-2 border border-slate-200 p-2 rounded-xl"/></label><p v-if="error" class="text-xs text-rose-700" role="alert">{{ error }}</p><button type="submit" :disabled="busy" class="px-4 py-2 bg-teal-700 text-white rounded-xl text-sm disabled:opacity-50">{{ ui.language==='ar'?'تسجيل':'Record' }}</button></form></Dialog>
    <Dialog :is-open="!!selected" :title="ui.language==='ar'?'تسجيل سبب العذر':'Excuse details'" @close="selected=null"><form class="space-y-4" @submit.prevent="submitExcuse"><label class="text-sm font-semibold block">{{ ui.language==='ar'?'السبب':'Reason' }}<textarea v-model="reason" required rows="3" class="block w-full mt-2 border border-slate-200 p-3 rounded-xl" /></label><p v-if="error" class="text-xs text-rose-700" role="alert">{{ error }}</p><button type="submit" :disabled="busy" class="px-4 py-2 bg-teal-700 text-white rounded-xl text-sm disabled:opacity-50"><FileCheck class="w-4 h-4 inline"/>{{ ui.language==='ar'?'حفظ العذر':'Save excuse' }}</button></form></Dialog>
  </div>
</template>
