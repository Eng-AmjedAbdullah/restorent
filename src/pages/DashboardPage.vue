<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  DollarSign,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-vue-next';

const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const uiStore = useUIStore();

onMounted(async () => {
  await dashboardStore.fetchDashboardData(authStore.currentRestaurant?.id || 'rest-1');
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">
            {{ uiStore.language === 'ar' ? 'لوحة القيادة التشغيلية' : 'Executive Operations Dashboard' }}
          </h1>
          <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Vue 3 Composition API
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1">
          {{ uiStore.language === 'ar' ? 'نظرة شمولية لحظية على المبيعات، الحضور، والمؤشرات التشغيلية' : 'Real-time overview of enterprise chain metrics, labor, and operations' }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-500">
          {{ uiStore.language === 'ar' ? 'الفرع النشط:' : 'Active Branch:' }}
        </span>
        <span class="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
          {{ authStore.currentRestaurant?.name[uiStore.language] || (uiStore.language === 'ar' ? 'الفرع الرئيسي' : 'Downtown Flagship') }}
        </span>
      </div>
    </div>

    <!-- Quick Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold">{{ uiStore.language === 'ar' ? 'مبيعات اليوم' : 'Today Sales' }}</span>
          <div class="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign class="w-4 h-4" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">
          {{ (dashboardStore.summary?.sales_today || 46800).toLocaleString() }} SAR
        </div>
        <div class="mt-2 flex items-center text-xs text-emerald-600 font-medium gap-1">
          <ArrowUpRight class="w-3.5 h-3.5" />
          <span>+11.2% {{ uiStore.language === 'ar' ? 'مقارنة بالأمس' : 'vs yesterday' }}</span>
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold">{{ uiStore.language === 'ar' ? 'طاقم العمل على رأس العمل' : 'Staff on Duty' }}</span>
          <div class="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Users class="w-4 h-4" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">
          {{ dashboardStore.summary?.employees_on_duty || 4 }} / {{ dashboardStore.summary?.total_shift_staff || 5 }}
        </div>
        <div class="mt-2 text-xs text-slate-500 font-medium">
          {{ uiStore.language === 'ar' ? 'تغطية الوردية 95%' : 'Shift coverage 95%' }}
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold">{{ uiStore.language === 'ar' ? 'نسبة الالتزام بالحضور' : 'Attendance Rate' }}</span>
          <div class="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Clock class="w-4 h-4" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900">
          {{ dashboardStore.summary?.attendance_rate || 96.5 }}%
        </div>
        <div class="mt-2 text-xs text-amber-600 font-medium">
          {{ dashboardStore.summary?.late_count || 1 }} {{ uiStore.language === 'ar' ? 'تأخير مسجل اليوم' : 'late arrival today' }}
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
        <div class="flex items-center justify-between text-slate-500 mb-2">
          <span class="text-xs font-semibold">{{ uiStore.language === 'ar' ? 'توصيات الذكاء الاصطناعي' : 'AI Action Items' }}</span>
          <div class="p-2 rounded-xl bg-cyan-50 text-cyan-600">
            <Sparkles class="w-4 h-4" />
          </div>
        </div>
        <div class="text-2xl font-bold text-[#2c777c]">
          3 {{ uiStore.language === 'ar' ? 'تنبيهات نشطة' : 'Active Insights' }}
        </div>
        <div class="mt-2 text-xs text-cyan-700 font-medium">
          {{ uiStore.language === 'ar' ? 'تحسين الهدر وتوزيع الورديات' : 'Waste optimization & shift balancing' }}
        </div>
      </div>
    </div>

    <!-- Migration Status Card -->
    <div class="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      <div class="flex items-start gap-4">
        <div class="p-3 rounded-xl bg-[#34abb1]/10 text-[#2c777c]">
          <LayoutDashboard class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-base font-bold text-slate-900">
            {{ uiStore.language === 'ar' ? 'مؤسسة Vue 3 جاهزة للربط مع واجهات Laravel' : 'Vue 3 Foundation Initialized for Laravel API' }}
          </h3>
          <p class="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            {{ uiStore.language === 'ar'
              ? 'تم تحويل النواة المعمارية بنجاح إلى Vue 3 Composition API، Pinia، و Vue Router. يتم جلب البيانات حالياً عبر طبقة الخدمات Service Layer ومستودعات Mocks المنفصلة، وهي مهيأة مباشرة للربط مع Laravel Sanctum في المراحل التالية.'
              : 'The architectural core has been successfully migrated to Vue 3 Composition API, Pinia, and Vue Router. Data is currently retrieved through the Service Layer and separated Mocks, fully structured for upcoming Laravel Sanctum integration.'
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
