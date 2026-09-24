<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { attendanceService } from '@/services/attendanceService';
import type { LeaveRequest } from '@/types/domain';
import { FileCheck, Check, X, Calendar, AlertTriangle } from 'lucide-vue-next';
import Dialog from '@/components/ui/Dialog.vue';
const ui = useUIStore();
const auth = useAuthStore();
const requests = ref<LeaveRequest[]>([]);
const loading = ref(false);
const busyId = ref<string | null>(null);
const error = ref('');
const filter = ref<'all' | LeaveRequest['status']>('all');
const rejecting = ref<LeaveRequest | null>(null);
const rejectionReason = ref('');
let generation = 0;
const filtered = computed(() => requests.value.filter(r => filter.value === 'all' || r.status === filter.value));
const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length);
const canManage = computed(() => auth.can('restaurant.leave.manage'));
const tabs = [
  { id: 'all', ar: 'الكل', en: 'All' }, { id: 'pending', ar: 'معلقة', en: 'Pending' },
  { id: 'approved', ar: 'مقبولة', en: 'Approved' }, { id: 'rejected', ar: 'مرفوضة', en: 'Rejected' },
] as const;
async function load(id: string | undefined) {
  const stamp = ++generation;
  requests.value = []; error.value = '';
  if (!id) { loading.value = false; return; }
  loading.value = true;
  try { const data = await attendanceService.getLeaveRequests(id); if (stamp === generation) requests.value = data; }
  catch (e) { if (stamp === generation) error.value = e instanceof Error ? e.message : 'Unable to load leave requests.'; }
  finally { if (stamp === generation) loading.value = false; }
}
watch(() => auth.currentRestaurant?.id, load, { immediate: true });
async function approve(req: LeaveRequest) {
  const rest = auth.currentRestaurant?.id; if (!rest || busyId.value) return;
  busyId.value = req.id; error.value = '';
  try { const updated = await attendanceService.approveLeaveRequest(rest, req.id); requests.value = requests.value.map(r => r.id === updated.id ? {...r,...updated} : r); }
  catch (e) { error.value = e instanceof Error ? e.message : 'Approval failed.'; }
  finally { busyId.value = null; }
}
async function reject() {
  const rest = auth.currentRestaurant?.id; const req = rejecting.value;
  if (!rest || !req || busyId.value) return;
  if (!rejectionReason.value.trim()) { error.value = ui.language === 'ar' ? 'سبب الرفض مطلوب' : 'A rejection reason is required.'; return; }
  busyId.value = req.id; error.value = '';
  try {
    const updated = await attendanceService.rejectLeaveRequest(rest, req.id, rejectionReason.value.trim());
    requests.value = requests.value.map(r => r.id === updated.id ? {...r,...updated} : r);
    rejecting.value = null; rejectionReason.value = '';
  } catch (e) { error.value = e instanceof Error ? e.message : 'Rejection failed.'; }
  finally { busyId.value = null; }
}
</script>

<template>
  <div class="space-y-5">
    <header class="flex flex-wrap justify-between items-start gap-3 border-b border-slate-200 pb-4">
      <div><h1 class="text-2xl font-bold text-slate-900">{{ ui.language === 'ar' ? 'طلبات الإجازات' : 'Leave Requests' }}</h1>
        <p class="text-sm text-slate-500 mt-1">{{ ui.language === 'ar' ? 'بيانات تجريبية للفرع المختار؛ لا تُرسل إشعارات حقيقية.' : 'Branch-scoped demo records; no real notifications are sent.' }}</p></div>
      <div class="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-sm font-semibold"><FileCheck class="w-4 h-4 inline me-1" />{{ pendingCount }} {{ ui.language === 'ar' ? 'قيد المراجعة' : 'pending' }}</div>
    </header>
    <div class="flex flex-wrap gap-2" role="group" :aria-label="ui.language === 'ar' ? 'تصفية طلبات الإجازة' : 'Filter leave requests'">
      <button v-for="tab in tabs" :key="tab.id" type="button" :aria-pressed="filter === tab.id" :class="['px-4 py-2 rounded-xl text-sm font-semibold border', filter === tab.id ? 'bg-[#176e74] border-[#176e74] text-white' : 'bg-white border-slate-200 text-slate-600']" @click="filter = tab.id">{{ tab[ui.language] }} ({{ tab.id === 'all' ? requests.length : requests.filter(r => r.status === tab.id).length }})</button>
    </div>
    <p v-if="error" role="alert" class="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm">{{ error }}</p>
    <p v-if="loading" class="p-8 rounded-xl bg-white text-center text-sm text-slate-500">{{ ui.language === 'ar' ? 'جارٍ تحميل الطلبات…' : 'Loading requests…' }}</p>
    <div v-else-if="filtered.length === 0" class="rounded-2xl p-12 text-center border border-slate-200 bg-white text-slate-500">
      <FileCheck class="w-10 h-10 mx-auto mb-3 text-teal-600" /><p>{{ ui.language === 'ar' ? 'لا توجد طلبات تطابق التصفية للفرع الحالي.' : 'No matching requests for the selected restaurant.' }}</p>
    </div>
    <div v-else class="grid gap-3">
      <article v-for="req in filtered" :key="req.id" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div class="flex flex-wrap justify-between items-start gap-3">
          <div><p class="font-bold text-slate-900">{{ req.employee ? `${req.employee.first_name[ui.language]} ${req.employee.last_name[ui.language]}` : req.employee_id }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ req.request_number }} · {{ req.type }} · {{ req.total_days }} {{ ui.language === 'ar' ? 'أيام' : 'days' }}</p></div>
          <span :class="['text-xs font-semibold px-3 py-1 rounded-full', req.status === 'pending' ? 'bg-amber-100 text-amber-800' : req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700']">{{ req.status }}</span>
        </div>
        <p class="text-xs text-slate-600 flex items-center gap-2"><Calendar class="w-4 h-4" />{{ req.start_date }} → {{ req.end_date }}</p>
        <p class="text-sm text-slate-700">{{ req.reason[ui.language] }}</p>
        <p v-if="req.rejection_reason" class="text-xs text-rose-700 border-s-2 border-rose-400 ps-3">{{ req.rejection_reason }}</p>
        <div v-if="req.status === 'pending' && canManage" class="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
          <button type="button" :disabled="!!busyId" class="px-4 py-2 text-sm rounded-xl text-white bg-teal-700 disabled:opacity-50" @click="approve(req)"><Check class="w-4 h-4 inline" />{{ ui.language === 'ar' ? 'اعتماد الطلب' : 'Approve' }}</button>
          <button type="button" :disabled="!!busyId" class="px-4 py-2 text-sm rounded-xl text-rose-700 border border-rose-200 disabled:opacity-50" @click="rejecting = req; rejectionReason = ''; error = ''"><X class="w-4 h-4 inline" />{{ ui.language === 'ar' ? 'رفض مع توضيح السبب' : 'Reject with reason' }}</button>
        </div>
        <p v-else-if="req.status === 'pending'" class="text-xs text-amber-700 flex items-center gap-1"><AlertTriangle class="w-3 h-3" />{{ ui.language === 'ar' ? 'لا تمتلك صلاحية معالجة الطلب.' : 'You do not have permission to decide this request.' }}</p>
      </article>
    </div>
    <Dialog :is-open="!!rejecting" :title="ui.language === 'ar' ? 'سبب الرفض' : 'Rejection reason'" @close="rejecting = null">
      <form class="space-y-4" @submit.prevent="reject"><label class="block text-sm font-semibold text-slate-700">{{ ui.language === 'ar' ? 'أدخل سبب الرفض' : 'Explain the decision' }}
        <textarea v-model="rejectionReason" required rows="4" class="block w-full mt-2 p-3 border border-slate-200 rounded-xl text-sm" maxlength="500" /></label>
        <button type="submit" :disabled="!!busyId" class="px-4 py-2 bg-rose-700 text-white rounded-xl text-sm disabled:opacity-50">{{ ui.language === 'ar' ? 'تأكيد الرفض' : 'Confirm rejection' }}</button>
      </form>
    </Dialog>
  </div>
</template>
