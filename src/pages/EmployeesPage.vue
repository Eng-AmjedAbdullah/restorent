<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useEmployeeStore } from '@/stores/employee';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { attendanceService } from '@/services/attendanceService';
import { schedulingService } from '@/services/schedulingService';
import type { Employee, Attendance, Shift, LeaveRequest } from '@/types/domain';
import { Users, UserPlus, Search, Mail, Phone } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';
import Drawer from '@/components/ui/Drawer.vue';

const store = useEmployeeStore();
const auth = useAuthStore();
const ui = useUIStore();
const showAdd = ref(false);
const selected = ref<Employee | null>(null);
const detailTab = ref<'profile' | 'skills' | 'attendance' | 'schedule' | 'leave'>('profile');
const related = reactive<{attendance: Attendance[]; shifts: Shift[]; leaves: LeaveRequest[]}>({attendance: [],shifts: [],leaves: []});
const form = reactive({ first_name: '', last_name: '', email: '', phone: '', employee_number: '', position_id: '', hire_date: '' });
const canManage = computed(() => auth.can('restaurant.employees.manage'));
const isArabic = computed(() => ui.language === 'ar');
const tabs = [
  {id:'profile',ar:'الملف الشخصي',en:'Profile'}, {id:'skills',ar:'المهارات',en:'Skills'},
  {id:'attendance',ar:'الحضور',en:'Attendance'}, {id:'schedule',ar:'الجدول',en:'Schedule'},
  {id:'leave',ar:'الإجازات',en:'Leave'}
] as const;
const statuses = [
  {value:'all',ar:'كل الحالات',en:'All statuses'}, {value:'active',ar:'نشط',en:'Active'},
  {value:'on_leave',ar:'في إجازة',en:'On leave'}, {value:'inactive',ar:'غير نشط',en:'Inactive'},
  {value:'suspended',ar:'موقوف',en:'Suspended'}, {value:'terminated',ar:'منتهي',en:'Terminated'},
];
watch(() => auth.currentRestaurant?.id, id => { selected.value = null; void store.fetchEmployees(id); }, {immediate:true});
let detailGeneration = 0;
async function openDetail(emp: Employee) {
  selected.value = emp; detailTab.value = 'profile';
  const generation = ++detailGeneration;
  const id = auth.currentRestaurant?.id; if (!id) return;
  const [attendance, shifts, leaves] = await Promise.all([
    attendanceService.getAttendances(id), schedulingService.getShifts(id), attendanceService.getLeaveRequests(id)
  ]);
  if (generation !== detailGeneration || selected.value?.id !== emp.id) return;
  related.attendance = attendance.filter(a => a.employee_id === emp.id);
  related.shifts = shifts.filter(s => s.employee_id === emp.id);
  related.leaves = leaves.filter(l => l.employee_id === emp.id);
}
async function create() {
  if (!canManage.value || !form.first_name.trim() || !form.last_name.trim()) return;
  const created = await store.addEmployee({
    first_name: {ar: form.first_name.trim(),en: form.first_name.trim()},
    last_name: {ar: form.last_name.trim(),en: form.last_name.trim()},
    email: form.email.trim(), phone: form.phone.trim(),
    employee_code: form.employee_number.trim(), position_id: form.position_id,
    hire_date: form.hire_date, status:'active'
  });
  if (created) { showAdd.value = false; Object.assign(form,{first_name:'',last_name:'',email:'',phone:'',employee_number:'',position_id:'',hire_date:''}); }
}
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap justify-between gap-3 items-center border-b border-slate-200 pb-4">
      <div><h1 class="text-2xl font-bold text-slate-900">{{ isArabic ? 'الموظفون والكوادر' : 'Employees & Staff' }}</h1><p class="text-sm text-slate-500 mt-1">{{ isArabic ? 'موظفو الفرع المختار، من مصدر بيانات تجريبي موحّد' : 'Staff for the selected branch, from the shared demo provider' }}</p></div>
      <button v-if="canManage" type="button" class="inline-flex gap-2 items-center px-4 py-2 bg-[#176e74] text-white rounded-xl text-sm font-semibold" @click="showAdd = true"><UserPlus class="w-4 h-4"/>{{ isArabic ? 'إضافة موظف' : 'Add employee' }}</button>
    </header>
    <p v-if="store.error" role="alert" class="p-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-xl text-sm">{{ store.error }}</p>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <div v-for="(card, i) in [{ar:'إجمالي الموظفين',en:'Staff',value:store.totalEmployeesCount},{ar:'في إجازة',en:'On leave',value:store.onLeaveCount},{ar:'نشط',en:'Active',value:store.employees.filter(e => e.status === 'active').length}]" :key="i" class="bg-white border border-slate-200 rounded-2xl p-4"><p class="text-xs text-slate-500">{{ card[ui.language] }}</p><p class="text-2xl text-slate-900 font-bold mt-2">{{ card.value }}</p></div>
    </div>
    <div class="bg-white rounded-2xl p-5 border border-slate-200 space-y-4">
      <div class="flex flex-col md:flex-row gap-3"><label class="relative flex-1"><Search class="w-4 h-4 text-slate-400 absolute start-3 top-3"/><input v-model="store.searchQuery" type="search" :placeholder="isArabic ? 'ابحث بالاسم أو الرقم أو البريد…' : 'Search name, number or email…'" class="w-full ps-10 pe-3 py-2 border border-slate-200 rounded-xl text-sm" /></label>
        <select v-model="store.departmentFilter" class="px-3 py-2 rounded-xl border border-slate-200 text-sm"><option value="all">{{ isArabic ? 'كل الأقسام' : 'All departments' }}</option><option v-for="d in ['kitchen','service','bar','management','stewarding']" :key="d" :value="d">{{ d }}</option></select>
        <select v-model="store.statusFilter" class="px-3 py-2 rounded-xl border border-slate-200 text-sm"><option v-for="s in statuses" :key="s.value" :value="s.value">{{ s[ui.language] }}</option></select>
      </div>
      <p v-if="store.isLoading" class="p-8 text-center text-slate-500">{{ isArabic ? 'تحميل الموظفين…' : 'Loading staff…' }}</p>
      <p v-else-if="store.filteredEmployees.length === 0" class="p-10 text-center text-slate-500">{{ isArabic ? 'لا يوجد موظفون مطابقون للبحث.' : 'No matching employees.' }}</p>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        <button v-for="emp in store.filteredEmployees" :key="emp.id" type="button" class="text-start bg-slate-50/70 border border-slate-200 hover:border-teal-500 rounded-xl p-4 space-y-3" @click="openDetail(emp)">
          <div class="flex items-center gap-3"><img v-if="emp.avatar_url" :src="emp.avatar_url" :alt="emp.first_name[ui.language]" class="w-11 h-11 rounded-xl object-cover"/><span v-else class="w-11 h-11 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">{{ emp.first_name[ui.language].slice(0,1) }}</span>
            <div class="min-w-0"><p class="font-bold text-slate-900 text-sm truncate">{{ emp.first_name[ui.language] }} {{ emp.last_name[ui.language] }}</p><p class="text-xs text-slate-500 truncate">{{ emp.position?.title[ui.language] || (isArabic ? 'دون منصب محدد' : 'Unassigned') }}</p></div></div>
          <div class="flex items-center justify-between gap-2 border-t border-slate-200 pt-3"><span class="font-mono text-xs text-slate-500">{{ emp.employee_code }}</span><span class="text-xs font-semibold text-teal-700">{{ emp.status }}</span></div>
        </button>
      </div>
    </div>
    <Dialog :is-open="showAdd" :title="isArabic ? 'إضافة موظف تجريبي' : 'Add demo employee'" @close="showAdd = false">
      <form class="space-y-3" @submit.prevent="create">
        <p class="text-xs text-slate-500">{{ isArabic ? 'يُحفظ الاسم كما تكتبه في السجل الرئيسي، دون إنشاء ترجمة تلقائية.' : 'The entered name is stored as-is; no fabricated translation.' }}</p>
        <div class="grid grid-cols-2 gap-3"><label class="text-xs font-semibold">{{ isArabic ? 'الاسم الأول' : 'First name' }}<input v-model="form.first_name" required maxlength="100" class="w-full block mt-1 border border-slate-200 p-2 rounded-xl" /></label><label class="text-xs font-semibold">{{ isArabic ? 'اسم العائلة' : 'Last name' }}<input v-model="form.last_name" required maxlength="100" class="w-full block mt-1 border border-slate-200 p-2 rounded-xl" /></label></div>
        <label class="block text-xs font-semibold">{{ isArabic ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)' }}<input v-model="form.email" type="email" class="w-full block mt-1 border border-slate-200 p-2 rounded-xl" /></label>
        <label class="block text-xs font-semibold">{{ isArabic ? 'الهاتف (اختياري)' : 'Phone (optional)' }}<input v-model="form.phone" maxlength="32" class="w-full block mt-1 border border-slate-200 p-2 rounded-xl" /></label>
        <label class="block text-xs font-semibold">{{ isArabic ? 'الرقم الوظيفي (اختياري)' : 'Employee number (optional)' }}<input v-model="form.employee_number" maxlength="64" class="w-full block mt-1 border border-slate-200 p-2 rounded-xl" /></label>
        <label class="block text-xs font-semibold">{{ isArabic ? 'المنصب' : 'Position' }}<select v-model="form.position_id" class="w-full block mt-1 border border-slate-200 p-2 rounded-xl"><option value="">{{ isArabic ? 'غير محدد' : 'Unassigned' }}</option><option v-for="p in store.positions" :key="p.id" :value="p.id">{{ p.title[ui.language] }}</option></select></label>
        <label class="block text-xs font-semibold">{{ isArabic ? 'تاريخ التعيين (اختياري)' : 'Hire date (optional)' }}<input v-model="form.hire_date" type="date" class="w-full block mt-1 border border-slate-200 p-2 rounded-xl" /></label>
        <p v-if="store.error" role="alert" class="text-rose-700 text-xs">{{ store.error }}</p>
        <button type="submit" :disabled="store.isLoading" class="px-5 py-2 bg-[#176e74] text-white rounded-xl text-sm disabled:opacity-50">{{ isArabic ? 'حفظ الموظف' : 'Save employee' }}</button>
      </form>
    </Dialog>
    <Drawer :is-open="!!selected" :title="selected ? `${selected.first_name[ui.language]} ${selected.last_name[ui.language]}` : ''" width="xl" @close="selected = null; detailGeneration++">
      <div v-if="selected" class="space-y-4"><div class="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3"><button v-for="tab in tabs" :key="tab.id" type="button" :class="['px-2.5 py-2 rounded-lg text-xs',detailTab === tab.id ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700']" @click="detailTab = tab.id">{{ tab[ui.language] }}</button></div>
        <div v-if="detailTab === 'profile'" class="text-sm text-slate-700 space-y-3"><p class="font-mono text-xs">{{ selected.employee_code }} · {{ selected.status }}</p><p class="flex gap-2 items-center"><Mail class="w-4 h-4"/>{{ selected.email || '—' }}</p><p class="flex gap-2 items-center"><Phone class="w-4 h-4"/>{{ selected.phone || '—' }}</p><p>{{ isArabic ? 'تاريخ التعيين' : 'Hire date' }}: {{ selected.hire_date || '—' }}</p><p>{{ isArabic ? 'المنصب' : 'Position' }}: {{ selected.position?.title[ui.language] || '—' }}</p></div>
        <div v-else-if="detailTab === 'skills'" class="space-y-2"><p v-for="skill in selected.skills" :key="skill" class="text-sm">• {{ skill }}</p><p v-if="!selected.skills.length" class="text-sm text-slate-500">{{ isArabic ? 'لم تُسجل مهارات في البيانات التجريبية.' : 'No skills recorded in demo data.' }}</p></div>
        <div v-else-if="detailTab === 'attendance'" class="space-y-2"><p v-for="a in related.attendance" :key="a.id" class="text-sm border-b py-2">{{ a.date }} · {{ a.status }} · {{ a.actual_clock_in || '—' }}</p><p v-if="!related.attendance.length" class="text-sm text-slate-500">{{ isArabic ? 'لا توجد سجلات' : 'No records' }}</p></div>
        <div v-else-if="detailTab === 'schedule'" class="space-y-2"><p v-for="s in related.shifts" :key="s.id" class="text-sm border-b py-2">{{ s.date }} · {{ s.start_time }}–{{ s.end_time }} · {{ s.station }}</p><p v-if="!related.shifts.length" class="text-sm text-slate-500">{{ isArabic ? 'لا توجد ورديات' : 'No shifts' }}</p></div>
        <div v-else class="space-y-2"><p v-for="l in related.leaves" :key="l.id" class="text-sm border-b py-2">{{ l.start_date }} → {{ l.end_date }} · {{ l.status }}</p><p v-if="!related.leaves.length" class="text-sm text-slate-500">{{ isArabic ? 'لا توجد إجازات' : 'No leave records' }}</p></div>
      </div>
    </Drawer>
  </div>
</template>
