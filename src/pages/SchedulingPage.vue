<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { schedulingService } from '@/services/schedulingService';
import { employeeService } from '@/services/employeeService';
import { overlappingShifts, validateShiftDraft } from '@/data/providers/scheduling.rules';
import type { Shift, Employee } from '@/types/domain';
import { CalendarDays, Plus, Clock, ChevronLeft, ChevronRight, AlertTriangle, Users } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';

const ui = useUIStore();
const auth = useAuthStore();
const shifts = ref<Shift[]>([]);
const employees = ref<Employee[]>([]);
const selectedDay = ref('');
const loading = ref(false);
const saving = ref(false);
const error = ref('');
const showAdd = ref(false);
let generation = 0;

const isArabic = computed(() => ui.language === 'ar');
const canManage = computed(() => auth.can('restaurant.shifts.manage'));
const activeEmployees = computed(() => employees.value.filter(e => e.status === 'active'));
const sampleDays = computed(() => [...new Set(shifts.value.map(s => s.date))].sort());
const visible = computed(() => shifts.value.filter(s => s.date === selectedDay.value));
const stationGroups = computed(() => [...new Set(visible.value.map(s => s.station))]);
const staffedCount = computed(() => new Set(visible.value.filter(s => s.status !== 'gap_uncovered').map(s => s.employee_id)).size);
const uncoveredCount = computed(() => visible.value.filter(s => s.status === 'gap_uncovered').length);
const stations: Shift['station'][] = ['hot_line', 'prep', 'grill', 'expo', 'barista', 'cashier', 'floor_captain', 'hostess'];

const form = reactive({ employee_id: '', date: '', shift_name: '', station: 'prep' as Shift['station'], start_time: '08:00', end_time: '16:00' });
const formErrors = computed(() => validateShiftDraft(form));
const overlapping = computed(() => overlappingShifts(form, shifts.value));

function dateInRestaurantTimezone(): string {
  const timezone = auth.currentRestaurant?.timezone || 'Asia/Riyadh';
  const fields = new Intl.DateTimeFormat('en-US', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: string) => fields.find(item => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

async function load(restaurantId: string | undefined) {
  const current = ++generation;
  shifts.value = [];
  employees.value = [];
  error.value = '';
  selectedDay.value = '';
  showAdd.value = false;
  if (!restaurantId) { loading.value = false; return; }
  loading.value = true;
  try {
    const [schedule, staff] = await Promise.all([
      schedulingService.getShifts(restaurantId),
      employeeService.getEmployees(restaurantId),
    ]);
    if (current === generation) {
      shifts.value = schedule;
      employees.value = staff;
      // Open the latest sample date, not a stale hardcoded historical date.
      selectedDay.value = [...new Set(schedule.map(s => s.date))].sort().at(-1) ?? dateInRestaurantTimezone();
    }
  } catch (reason) {
    if (current === generation) error.value = reason instanceof Error ? reason.message : 'Unable to load demo shifts.';
  } finally {
    if (current === generation) loading.value = false;
  }
}
watch(() => auth.currentRestaurant?.id, load, { immediate: true });

function navigateDate(offset: number) {
  const base = selectedDay.value || dateInRestaurantTimezone();
  const date = new Date(`${base}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return;
  date.setUTCDate(date.getUTCDate() + offset);
  selectedDay.value = date.toISOString().slice(0, 10);
}

function openAdd() {
  if (!canManage.value) return;
  form.employee_id = activeEmployees.value[0]?.id ?? '';
  form.date = selectedDay.value || dateInRestaurantTimezone();
  form.shift_name = '';
  form.start_time = '08:00';
  form.end_time = '16:00';
  form.station = 'prep';
  error.value = '';
  showAdd.value = true;
}

async function create() {
  const restaurantId = auth.currentRestaurant?.id;
  if (!restaurantId || saving.value || !canManage.value) return;
  if (!form.employee_id || !form.shift_name.trim() || Object.keys(formErrors.value).length || overlapping.value.length) {
    error.value = isArabic.value ? 'راجع الموظف والتاريخ والتوقيت؛ لا يسمح بتداخل ورديات الموظف.' : 'Check employee, date and time. Overlapping shifts are not allowed.';
    return;
  }
  saving.value = true;
  error.value = '';
  try {
    const item: Omit<Shift, 'id' | 'created_at' | 'updated_at'> = {
      restaurant_id: restaurantId,
      employee_id: form.employee_id,
      date: form.date,
      shift_name: { ar: form.shift_name.trim(), en: form.shift_name.trim() },
      station: form.station,
      start_time: form.start_time,
      end_time: form.end_time,
      color_code: '#2F7F82',
      is_overtime: false,
      status: 'scheduled',
    };
    const added = await schedulingService.createShift(item);
    if (auth.currentRestaurant?.id !== restaurantId) return;
    shifts.value.push(added);
    selectedDay.value = form.date;
    showAdd.value = false;
    ui.addToast({ title: isArabic.value ? 'أضيفت الوردية التجريبية' : 'Demo shift added', type: 'success' });
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'Unable to add shift.';
  } finally { saving.value = false; }
}

function employeeName(id: string): string {
  const employee = employees.value.find(e => e.id === id);
  return employee ? `${employee.first_name[ui.language]} ${employee.last_name[ui.language]}` : (isArabic.value ? 'شاغر غير مغطى' : 'Uncovered position');
}

function statusLabel(status: Shift['status']): string {
  const ar: Record<Shift['status'], string> = { scheduled: 'مجدولة', in_progress: 'ضمن العينة', completed: 'مكتملة', gap_uncovered: 'شاغر غير مغطى', ai_suggested: 'اقتراح تجريبي' };
  const en: Record<Shift['status'], string> = { scheduled: 'Scheduled', in_progress: 'Sample in progress', completed: 'Completed', gap_uncovered: 'Uncovered', ai_suggested: 'Demo suggestion' };
  return isArabic.value ? ar[status] : en[status];
}
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2"><CalendarDays class="w-6 h-6 text-teal-700" />{{ isArabic ? 'إدارة الورديات' : 'Shift Scheduling' }}</h1>
        <p class="text-sm text-slate-500 mt-1">{{ isArabic ? 'مواعيد العينة التاريخية والورديات التي تضيفها للتجربة؛ دون اتصال بنظام حضور فعلي.' : 'Historical sample schedules and shifts you create in demo mode, not live workforce tracking.' }}</p>
      </div>
      <button v-if="canManage" type="button" class="bg-teal-700 hover:bg-teal-800 text-white rounded-xl px-4 py-2.5 text-sm font-semibold flex gap-2 items-center" @click="openAdd"><Plus class="w-4 h-4" />{{ isArabic ? 'إضافة وردية' : 'Add shift' }}</button>
    </header>

    <div class="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-5">
      <div class="flex flex-wrap gap-3 items-end justify-between">
        <div class="flex flex-wrap gap-2 items-end">
          <button type="button" class="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center" :aria-label="isArabic ? 'اليوم السابق' : 'Previous day'" @click="navigateDate(-1)"><ChevronRight v-if="isArabic" class="w-4 h-4" /><ChevronLeft v-else class="w-4 h-4" /></button>
          <label class="text-xs font-semibold text-slate-600">{{ isArabic ? 'التاريخ المختار' : 'Selected date' }}<input v-model="selectedDay" type="date" class="block mt-1 px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800" /></label>
          <button type="button" class="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center" :aria-label="isArabic ? 'اليوم التالي' : 'Next day'" @click="navigateDate(1)"><ChevronLeft v-if="isArabic" class="w-4 h-4" /><ChevronRight v-else class="w-4 h-4" /></button>
        </div>
        <div class="text-xs text-slate-500">{{ isArabic ? 'تواريخ العينة المتاحة:' : 'Available sample dates:' }} <span class="font-mono">{{ sampleDays.join(' · ') || '—' }}</span></div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div class="rounded-xl bg-teal-50 border border-teal-100 p-3"><p class="text-xs text-teal-700">{{ isArabic ? 'الموظفون المجدولون' : 'Scheduled staff' }}</p><p class="font-bold text-2xl text-teal-900">{{ staffedCount }}</p></div>
        <div class="rounded-xl bg-slate-50 border border-slate-200 p-3"><p class="text-xs text-slate-600">{{ isArabic ? 'إجمالي الورديات' : 'Total shifts' }}</p><p class="font-bold text-2xl text-slate-900">{{ visible.length }}</p></div>
        <div class="col-span-2 sm:col-span-1 rounded-xl border p-3" :class="uncoveredCount ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-800'"><p class="text-xs flex gap-1 items-center"><AlertTriangle class="w-3.5 h-3.5" />{{ isArabic ? 'الشواغر غير المغطاة' : 'Uncovered positions' }}</p><p class="font-bold text-2xl">{{ uncoveredCount }}</p></div>
      </div>

      <p v-if="error && !showAdd" role="alert" class="p-3 rounded-xl bg-rose-50 text-rose-700 text-sm">{{ error }}</p>
      <p v-if="loading" class="p-10 text-center text-slate-500">{{ isArabic ? 'جاري تحميل الجدول...' : 'Loading schedule...' }}</p>
      <p v-else-if="!visible.length" class="p-10 border border-dashed border-slate-200 rounded-xl text-center text-slate-500">{{ isArabic ? 'لا توجد ورديات لهذا اليوم في بيانات الفرع المختار.' : 'There are no shifts for this date in the selected restaurant.' }}</p>
      <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <section v-for="station in stationGroups" :key="station" class="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-3">
          <h2 class="font-bold text-sm text-slate-900 capitalize flex gap-2 items-center"><Users class="w-4 h-4 text-teal-700" />{{ station.replaceAll('_', ' ') }} <span class="text-xs text-slate-500">({{ visible.filter(s => s.station === station).length }})</span></h2>
          <article v-for="shift in visible.filter(s => s.station === station)" :key="shift.id" class="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
            <div class="flex flex-wrap justify-between items-start gap-2"><span class="font-semibold text-slate-900 text-sm">{{ employeeName(shift.employee_id) }}</span><span class="text-xs rounded-full px-2 py-1" :class="shift.status === 'gap_uncovered' ? 'bg-rose-100 text-rose-800' : 'bg-teal-50 text-teal-800'">{{ statusLabel(shift.status) }}</span></div>
            <p class="text-xs text-slate-600">{{ shift.shift_name[ui.language] }}</p><p class="text-xs flex items-center gap-1 text-slate-500"><Clock class="w-3.5 h-3.5" />{{ shift.start_time }}–{{ shift.end_time }}</p>
          </article>
        </section>
      </div>
    </div>

    <Dialog :is-open="showAdd" :title="isArabic ? 'إضافة وردية تجريبية' : 'Create demo shift'" @close="showAdd = false">
      <form class="space-y-4" @submit.prevent="create">
        <label class="block text-xs font-semibold text-slate-700">{{ isArabic ? 'الموظف النشط' : 'Active employee' }}<select v-model="form.employee_id" required class="block w-full mt-1 p-2.5 border border-slate-300 rounded-xl"><option disabled value="">{{ isArabic ? 'اختر موظفًا' : 'Select an employee' }}</option><option v-for="employee in activeEmployees" :key="employee.id" :value="employee.id">{{ employee.first_name[ui.language] }} {{ employee.last_name[ui.language] }}</option></select></label>
        <label class="block text-xs font-semibold text-slate-700">{{ isArabic ? 'اسم الوردية' : 'Shift name' }}<input v-model="form.shift_name" required maxlength="100" class="block w-full mt-1 p-2.5 border border-slate-300 rounded-xl" /></label>
        <label class="block text-xs font-semibold text-slate-700">{{ isArabic ? 'تاريخ الوردية' : 'Shift date' }}<input v-model="form.date" type="date" required class="block w-full mt-1 p-2.5 border border-slate-300 rounded-xl" /></label>
        <label class="block text-xs font-semibold text-slate-700">{{ isArabic ? 'المحطة' : 'Station' }}<select v-model="form.station" class="block w-full mt-1 p-2.5 border border-slate-300 rounded-xl"><option v-for="station in stations" :key="station" :value="station">{{ station.replaceAll('_', ' ') }}</option></select></label>
        <div class="grid grid-cols-2 gap-3"><label class="text-xs font-semibold text-slate-700">{{ isArabic ? 'البداية' : 'Start' }}<input v-model="form.start_time" type="time" required class="block w-full mt-1 p-2.5 border border-slate-300 rounded-xl" /></label><label class="text-xs font-semibold text-slate-700">{{ isArabic ? 'النهاية' : 'End' }}<input v-model="form.end_time" type="time" required class="block w-full mt-1 p-2.5 border border-slate-300 rounded-xl" /></label></div>
        <p v-if="overlapping.length" class="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 p-3 text-sm" role="alert">{{ isArabic ? 'توجد وردية متداخلة لهذا الموظف:' : 'This employee already has an overlapping shift:' }} {{ overlapping[0].start_time }}–{{ overlapping[0].end_time }}</p>
        <p v-else-if="Object.keys(formErrors).length" class="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 p-3 text-sm">{{ isArabic ? 'تأكد من صحة التاريخ وأن وقت النهاية بعد البداية.' : 'Check the date and make sure the shift ends after it begins.' }}</p>
        <p v-if="error" class="rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">{{ error }}</p>
        <div class="flex justify-end gap-2"><button type="button" class="px-4 py-2.5 border border-slate-200 rounded-xl text-sm" @click="showAdd = false">{{ isArabic ? 'إلغاء' : 'Cancel' }}</button><button type="submit" :disabled="saving || !!overlapping.length || !!Object.keys(formErrors).length || !activeEmployees.length" class="bg-teal-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50">{{ saving ? '…' : isArabic ? 'إضافة' : 'Add shift' }}</button></div>
      </form>
    </Dialog>
  </div>
</template>
