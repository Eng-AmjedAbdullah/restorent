<script setup lang="ts">
import { onMounted } from 'vue';
import { useEmployeeStore } from '@/stores/employee';
import { useUIStore } from '@/stores/ui';
import { Users, UserPlus, Search, Filter } from 'lucide-vue-next';

const employeeStore = useEmployeeStore();
const uiStore = useUIStore();

onMounted(async () => {
  await employeeStore.fetchEmployees();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'إدارة الموظفين والكوادر' : 'Employee & Staff Management' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Pinia Employee Store Ready
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'سجل العاملين، العقود، الورديات، والمهارات في شبكة الفروع' : 'Directory of staff, employment contracts, shifts, and culinary certifications' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
          {{ employeeStore.totalEmployeesCount }} {{ uiStore.language === 'ar' ? 'موظف مسجل' : 'Registered Staff' }}
        </span>
      </div>
    </div>

    <!-- Employee quick summary table / cards placeholder -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="relative w-full sm:w-80">
          <Search class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="employeeStore.searchQuery"
            type="text"
            :placeholder="uiStore.language === 'ar' ? 'البحث عن موظف بالاسم أو الكود...' : 'Search staff by name or code...'"
            class="w-full ps-10 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#34abb1]"
          />
        </div>

        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            ● {{ employeeStore.onDutyCount }} {{ uiStore.language === 'ar' ? 'على رأس العمل' : 'On Shift' }}
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 font-semibold border border-amber-200">
            ● {{ employeeStore.onLeaveCount }} {{ uiStore.language === 'ar' ? 'في إجازة' : 'On Leave' }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div
          v-for="emp in employeeStore.filteredEmployees.slice(0, 6)"
          :key="emp.id"
          class="p-4 rounded-xl border border-slate-200/80 hover:border-[#34abb1] transition-colors bg-slate-50/50"
        >
          <div class="flex items-center gap-3">
            <img :src="emp.avatar_url" :alt="emp.first_name[uiStore.language]" class="w-11 h-11 rounded-xl object-cover border border-slate-200" />
            <div>
              <h4 class="font-bold text-sm text-slate-900">{{ emp.first_name[uiStore.language] }} {{ emp.last_name[uiStore.language] }}</h4>
              <p class="text-xs text-slate-500 font-medium">{{ emp.position?.title[uiStore.language] }}</p>
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
            <span class="font-mono text-[11px]">{{ emp.employee_code }}</span>
            <span class="text-xs font-semibold text-emerald-700">{{ emp.status }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
