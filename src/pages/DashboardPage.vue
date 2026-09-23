<script setup lang="ts">
import { onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardStore } from '@/stores/dashboard';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import Card from '@/components/ui/Card.vue';
import StatCard from '@/components/ui/StatCard.vue';
import Table, { type Column } from '@/components/ui/Table.vue';
import Badge from '@/components/ui/Badge.vue';
import Button from '@/components/ui/Button.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import type { Order } from '@/types/domain';
import {
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  FileCheck,
  Sparkles,
  ArrowUpRight,
  ShoppingBag,
  ChefHat,
  Coffee,
  ShieldAlert,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next';
import { translateServerName, translateTableName, translateTimestamp } from '@/utils/localization';

const router = useRouter();
const dashboardStore = useDashboardStore();
const authStore = useAuthStore();
const uiStore = useUIStore();

const isArabic = computed(() => uiStore.language === 'ar');

// Table columns definition for Today's Floor Operations / KDS Orders
const orderColumns: Column<Order>[] = [
  { key: 'order_number', header: isArabic.value ? 'رقم الطلب' : 'Order #', width: 'w-24' },
  { key: 'details', header: isArabic.value ? 'تفاصيل الطلب' : 'Order Details' },
  { key: 'status', header: isArabic.value ? 'الحالة' : 'Status', width: 'w-28', align: 'center' },
  { key: 'elapsed_minutes', header: isArabic.value ? 'الوقت' : 'Elapsed', width: 'w-20', align: 'end' }
];

async function loadData() {
  const restId = authStore.currentRestaurant?.id || 'rest-1';
  await dashboardStore.fetchDashboardData(restId);
}

onMounted(() => {
  loadData();
});

watch(
  () => authStore.currentRestaurant?.id,
  () => {
    loadData();
  }
);

function handleAcceptRecommendation(id: string) {
  dashboardStore.acceptInsight(id);
  uiStore.addToast({
    title: isArabic.value ? 'تم الاعتماد' : 'Directive Accepted',
    message: isArabic.value
      ? 'تم اعتماد توصية RestoraAI وتحديث الجدول التشغيلي'
      : 'Accepted RestoraAI directive & updated schedule',
    type: 'success'
  });
}

function handleDismissRecommendation(id: string) {
  dashboardStore.rejectInsight(id);
  uiStore.addToast({
    title: isArabic.value ? 'تم الاستبعاد' : 'Dismissed',
    message: isArabic.value
      ? `تم تجاهل توصية الذكاء الاصطناعي #${id}`
      : `Dismissed recommendation #${id}`,
    type: 'info'
  });
}

function getOrderStatusLabel(status: Order['status']) {
  if (status === 'new') return isArabic.value ? 'جديد' : 'New';
  if (status === 'preparing') return isArabic.value ? 'قيد التجهيز' : 'Preparing';
  if (status === 'ready') return isArabic.value ? 'جاهز للتسليم' : 'Ready';
  if (status === 'delivered') return isArabic.value ? 'تم التسليم' : 'Delivered';
  if (status === 'cancelled') return isArabic.value ? 'ملغي' : 'Cancelled';
  return status;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header Banner & Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
      <div>
        <div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {{ isArabic ? 'لوحة القيادة التشغيلية' : 'Operations Dashboard' }}
          </h1>
          <Badge variant="cyan" size="sm" class="shrink-0">
            {{ isArabic ? 'مراقبة فورية RestoraAI' : 'RestoraAI Real-Time' }}
          </Badge>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          {{ authStore.currentRestaurant?.name[uiStore.language] || (isArabic ? 'الفرع الرئيسي' : 'Flagship Branch') }}
          -
          {{ isArabic ? 'متابعة شاملة لمؤشرات الأداء، تغطية الورديات وتوصيات الذكاء الاصطناعي التشغيلي' : 'Comprehensive performance KPIs, shift coverage and proactive operational AI insights' }}
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          class="flex-1 sm:flex-none"
          @click="router.push('/reports')"
        >
          {{ isArabic ? 'التقارير' : 'Reports' }}
        </Button>
        <Button
          variant="primary"
          size="sm"
          class="flex-1 sm:flex-none"
          @click="router.push('/orders')"
        >
          <ShoppingBag class="w-4 h-4 me-1.5" />
          <span>{{ isArabic ? 'الطلبات الحية' : 'Live Orders' }}</span>
        </Button>
      </div>
    </div>

    <!-- Loading State while fetching initial data -->
    <LoadingState
      v-if="dashboardStore.isLoading && !dashboardStore.summary"
      :message="isArabic ? 'جاري تحميل مؤشرات لوحة القيادة...' : 'Loading operational dashboard metrics...'"
      :rows="5"
    />

    <template v-else>
      <!-- Top 5 Metric Cards (Preserving exact React KPIs and calculations) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- 1. Sales Today -->
        <StatCard
          :title="isArabic ? 'مبيعات اليوم' : 'Today Sales'"
          :value="dashboardStore.salesToday.toLocaleString() + ' ' + (isArabic ? 'ر.س' : 'SAR')"
          :trend="'+14.8% ' + (isArabic ? 'مقارنة بالأمس' : 'vs yesterday')"
          :trend-up="true"
          icon-bg="bg-[#16C7C9]/15 text-[#0A5C61]"
        >
          <template #icon>
            <TrendingUp class="w-4 h-4 text-[#16C7C9]" />
          </template>
        </StatCard>

        <!-- 2. Employees Working -->
        <StatCard
          :title="isArabic ? 'الموظفون على رأس العمل' : 'Staff On Duty'"
          :value="dashboardStore.employeesWorking"
          :subtitle="'/ ' + dashboardStore.totalEmployees + ' ' + (isArabic ? 'إجمالي الموظفين' : 'Total Staff')"
          icon-bg="bg-[#08131F] text-[#4edee3]"
        >
          <template #icon>
            <Users class="w-4 h-4 text-[#4edee3]" />
          </template>
          <template #footer>
            <p class="text-[11px] text-slate-500 font-medium">
              {{ isArabic ? 'في الوردية الحالية' : 'On Shift Now' }}
            </p>
          </template>
        </StatCard>

        <!-- 3. Attendance Rate -->
        <StatCard
          :title="isArabic ? 'معدل الحضور والانضباط' : 'Attendance Rate'"
          :value="dashboardStore.attendanceRate + '%'"
          :subtitle="dashboardStore.lateAttendance + ' ' + (isArabic ? 'حالات تأخير مسجلة' : 'late arrivals recorded')"
          icon-bg="bg-[#4edee3]/10 text-[#2c777c]"
        >
          <template #icon>
            <Clock class="w-4 h-4 text-[#34abb1]" />
          </template>
        </StatCard>

        <!-- 4. Inventory Warnings -->
        <StatCard
          :title="isArabic ? 'تنبيهات المخزون الحرجة' : 'Inventory Warnings'"
          :value="dashboardStore.lowStockCount"
          :subtitle="dashboardStore.lowStockCount + ' ' + (isArabic ? 'أصناف قاربت النفاد' : 'items below par')"
          :icon-bg="dashboardStore.lowStockCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'"
        >
          <template #icon>
            <AlertTriangle class="w-4 h-4" />
          </template>
          <template #footer>
            <button
              type="button"
              class="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer text-start block mt-1"
              @click="router.push('/inventory')"
            >
              {{ isArabic ? 'عرض النواقص وإصدار طلب' : 'Inspect Stockouts' }}
            </button>
          </template>
        </StatCard>

        <!-- 5. Pending Requests -->
        <StatCard
          :title="isArabic ? 'طلبات بانتظار الاعتماد' : 'Pending Requests'"
          :value="dashboardStore.pendingRequestsCount"
          :subtitle="isArabic ? 'طلبات إجازة وتبديل ورديات' : 'Leave & shift requests'"
          icon-bg="bg-purple-100 text-purple-700"
        >
          <template #icon>
            <FileCheck class="w-4 h-4" />
          </template>
          <template #footer>
            <button
              type="button"
              class="text-[11px] font-bold text-[#2c777c] hover:text-[#34abb1] underline cursor-pointer text-start block mt-1"
              @click="router.push('/leave-requests')"
            >
              {{ isArabic ? 'اتخاذ قرار الاعتماد' : 'Review Requests' }}
            </button>
          </template>
        </StatCard>
      </div>

      <!-- AI RECOMMENDATIONS SECTION (Deep Refined AI Operations Design) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-purple-900/30">
              <Sparkles class="w-4 h-4" />
            </span>
            <div>
              <h2 class="text-base font-bold text-slate-900 tracking-tight">
                {{ isArabic ? 'توصيات الذكاء الاصطناعي التشغيلية' : 'AI Operations Recommendations' }}
              </h2>
              <p class="text-xs text-slate-500">
                {{ isArabic ? 'رؤى استباقية لرفع كفاءة الخدمة وضبط الفاقد والتكاليف' : 'Proactive insights to enhance throughput and control shrinkage' }}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            @click="router.push('/ai-intelligence')"
          >
            {{ isArabic ? 'شفافية وتحليل القرار' : 'Decision Explainability' }}
          </Button>
        </div>

        <!-- Recommendations Grid -->
        <div v-if="dashboardStore.insights.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            v-for="rec in dashboardStore.insights.slice(0, 3)"
            :key="rec.id"
            class="flex flex-col justify-between border-purple-200/70 hover:border-purple-300 hover:shadow-md transition-all bg-gradient-to-b from-white to-purple-50/20"
            padding="sm"
          >
            <div class="p-4 space-y-3.5 flex-1">
              <div class="flex items-center justify-between gap-2">
                <span class="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  {{ isArabic ? 'نسبة الثقة' : 'Confidence' }}: {{ rec.confidence_score }}%
                </span>
                <span
                  :class="[
                    'text-[10px] font-bold px-2 py-0.5 rounded-full font-mono',
                    rec.urgency === 'high'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  ]"
                >
                  {{ rec.urgency === 'high' ? (isArabic ? 'عالي' : 'High') : (isArabic ? 'متوسط' : 'Medium') }}
                </span>
              </div>

              <div>
                <h3 class="text-sm font-bold text-slate-900 leading-snug">
                  {{ rec.title[uiStore.language] }}
                </h3>
                <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {{ rec.description[uiStore.language] }}
                </p>
              </div>

              <div class="p-3 rounded-xl bg-purple-100/60 border border-purple-200/80 text-xs">
                <span class="font-bold text-purple-950 block mb-0.5">
                  {{ isArabic ? 'الأثر المتوقع:' : 'Projected Impact:' }}
                </span>
                <p class="text-purple-800 text-[11px] leading-relaxed">
                  {{ rec.impact[uiStore.language] }}
                </p>
              </div>
            </div>

            <div class="bg-purple-50/50 border-t border-purple-100 p-3.5 flex items-center justify-between gap-2 rounded-b-2xl">
              <template v-if="rec.status === 'accepted'">
                <span class="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check class="w-4 h-4" />
                  {{ isArabic ? 'تم اعتماد التوجيه بنجاح' : 'Directive Accepted' }}
                </span>
              </template>
              <template v-else-if="rec.status === 'rejected'">
                <span class="text-xs font-medium text-slate-400">
                  {{ isArabic ? 'تم التجاهل' : 'Dismissed' }}
                </span>
              </template>
              <template v-else>
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-xs text-slate-500 hover:text-slate-800"
                  @click="handleDismissRecommendation(rec.id)"
                >
                  {{ isArabic ? 'استبعاد' : 'Dismiss' }}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  @click="handleAcceptRecommendation(rec.id)"
                >
                  <Check class="w-3.5 h-3.5 me-1" />
                  <span>{{ isArabic ? 'اعتماد' : 'Accept' }}</span>
                </Button>
              </template>
            </div>
          </Card>
        </div>

        <EmptyState
          v-else
          :title="isArabic ? 'لا توجد توصيات ذكاء اصطناعي حالياً' : 'No AI Recommendations Available'"
          :description="isArabic ? 'جميع المؤشرات تعمل بكفاءة تامة ولم يتم رصد أي فجوات تشغيلية' : 'All operational parameters are optimal. No anomalies detected.'"
        />
      </div>

      <!-- MID SECTION: Today's Floor Operations & Staffing Coverage -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Today's Operations / KDS Live Progress -->
        <div class="lg:col-span-7">
          <Card padding="none">
            <div class="p-5 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 class="text-base font-bold text-slate-900 tracking-tight">
                  {{ isArabic ? 'سير العمليات لليوم' : "Today's Operations" }}
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ dashboardStore.orders.length }} {{ isArabic ? 'طلبات نشطة' : 'Active Orders' }}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                @click="router.push('/orders')"
              >
                <span>{{ isArabic ? 'شاشة المطبخ' : 'Kitchen KDS' }}</span>
                <ChevronLeft v-if="isArabic" class="w-3.5 h-3.5 ms-1" />
                <ChevronRight v-else class="w-3.5 h-3.5 ms-1" />
              </Button>
            </div>

            <div class="p-4">
              <Table
                :columns="orderColumns"
                :data="dashboardStore.orders.slice(0, 4)"
                :is-loading="dashboardStore.isLoading"
                :empty-message="isArabic ? 'لا توجد طلبات جارية حالياً' : 'No active orders in progress'"
              >
                <!-- Order Number Cell -->
                <template #cell-order_number="{ item }">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-800">
                    {{ item.order_number }}
                  </div>
                </template>

                <!-- Order Details Cell -->
                <template #cell-details="{ item }">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-slate-900">
                        {{
                          translateTableName(item.table_number, uiStore.language) ||
                          (item.order_type === 'takeaway'
                            ? (isArabic ? 'طلب خارجي' : 'Takeaway')
                            : item.order_type === 'delivery'
                            ? (isArabic ? 'توصيل' : 'Delivery')
                            : item.order_type)
                        }}
                      </span>
                      <span class="text-[11px] text-slate-400 font-normal">
                        • {{ translateServerName(item.server_name, uiStore.language) }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 mt-0.5 line-clamp-1">
                      {{ item.items.map(i => `${i.quantity}x ${i.name[uiStore.language]}`).join(', ') }}
                    </p>
                  </div>
                </template>

                <!-- Status Cell -->
                <template #cell-status="{ item }">
                  <span
                    :class="[
                      'text-xs font-bold px-2.5 py-1 rounded-md inline-block text-center',
                      item.status === 'new'
                        ? 'bg-sky-100 text-sky-800'
                        : item.status === 'preparing'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : item.status === 'ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    ]"
                  >
                    {{ getOrderStatusLabel(item.status) }}
                  </span>
                </template>

                <!-- Elapsed Minutes Cell -->
                <template #cell-elapsed_minutes="{ item }">
                  <span class="text-xs text-slate-400 font-mono">
                    {{ item.elapsed_minutes }}m
                  </span>
                </template>
              </Table>
            </div>
          </Card>
        </div>

        <!-- Staffing Coverage by Station -->
        <div class="lg:col-span-5">
          <Card padding="none">
            <div class="p-5 flex items-center justify-between border-b border-slate-100">
              <div>
                <h3 class="text-base font-bold text-slate-900 tracking-tight">
                  {{ isArabic ? 'تغطية طاقم العمل حسب المحطة' : 'Staffing Coverage by Station' }}
                </h3>
                <p class="text-xs text-slate-500 mt-0.5">
                  {{ isArabic ? 'جاهزية محطات الفرع حسب جدول اليوم' : 'Station readiness against scheduled par' }}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                @click="router.push('/scheduling')"
              >
                {{ isArabic ? 'الجدول' : 'Schedule' }}
              </Button>
            </div>

            <div class="p-5 space-y-4">
              <!-- Kitchen Station -->
              <div>
                <div class="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span class="flex items-center gap-1.5 text-slate-800">
                    <ChefHat class="w-4 h-4 text-[#2c777c]" />
                    {{ isArabic ? 'المطبخ والطهي' : 'Kitchen & Line' }}
                  </span>
                  <span class="text-slate-600 font-mono">
                    {{ isArabic ? '4 / 5 طهاة (80%)' : '4 / 5 Chefs (80%)' }}
                  </span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-amber-500 rounded-full w-4/5" />
                </div>
                <p class="text-[10px] text-amber-700 font-medium mt-1">
                  {{ isArabic ? 'فجوة في محطة الخط الساخن أثناء العشاء (19:30)' : 'Hot line cook gap at 19:30' }}
                </p>
              </div>

              <!-- Dining & Floor -->
              <div>
                <div class="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span class="flex items-center gap-1.5 text-slate-800">
                    <Users class="w-4 h-4 text-[#34abb1]" />
                    {{ isArabic ? 'الخدمة والصالة' : 'Front of House' }}
                  </span>
                  <span class="text-slate-600 font-mono">
                    {{ isArabic ? '5 / 5 طاقم (100%)' : '5 / 5 Staff (100%)' }}
                  </span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-[#34abb1] rounded-full w-full" />
                </div>
                <p class="text-[10px] text-[#2c777c] font-medium mt-1">
                  {{ isArabic ? 'تغطية كاملة ومثالية للصالة والمجالس' : 'Full optimal coverage' }}
                </p>
              </div>

              <!-- Bar & Barista -->
              <div>
                <div class="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span class="flex items-center gap-1.5 text-slate-800">
                    <Coffee class="w-4 h-4 text-amber-600" />
                    {{ isArabic ? 'المشروبات والباريستا' : 'Barista & Drinks' }}
                  </span>
                  <span class="text-slate-600 font-mono">
                    {{ isArabic ? '2 / 2 باريستا (100%)' : '2 / 2 Baristas (100%)' }}
                  </span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-[#34abb1] rounded-full w-full" />
                </div>
              </div>

              <!-- Stewarding -->
              <div>
                <div class="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span class="flex items-center gap-1.5 text-slate-800">
                    <ShieldAlert class="w-4 h-4 text-sky-600" />
                    {{ isArabic ? 'النظافة والسلامة' : 'Stewarding & Cleanliness' }}
                  </span>
                  <span class="text-slate-600 font-mono">
                    {{ isArabic ? '2 / 2 فريق (100%)' : '2 / 2 Stewards (100%)' }}
                  </span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-[#34abb1] rounded-full w-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- BOTTOM SECTION: Real-time Alerts Preview & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Real-time Alerts -->
        <div class="lg:col-span-6">
          <Card padding="none">
            <div class="p-5 flex items-center justify-between border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900 tracking-tight">
                {{ isArabic ? 'التنبيهات الفورية للفرع' : 'Restaurant Alerts' }}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                @click="router.push('/alerts')"
              >
                {{ isArabic ? 'كل التنبيهات' : 'All Alerts' }}
              </Button>
            </div>

            <div v-if="dashboardStore.alerts.length > 0" class="divide-y divide-slate-100">
              <div
                v-for="alert in dashboardStore.alerts.slice(0, 3)"
                :key="alert.id"
                class="p-4 flex items-start gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div
                  :class="[
                    'p-2 rounded-xl shrink-0 mt-0.5',
                    alert.type === 'critical'
                      ? 'bg-rose-100 text-rose-700'
                      : alert.type === 'operational'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-amber-100 text-amber-800'
                  ]"
                >
                  <AlertTriangle class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="text-xs font-bold text-slate-900 truncate">
                      {{ alert.title[uiStore.language] }}
                    </h4>
                    <span class="text-[10px] text-slate-400 shrink-0 font-mono">
                      {{ translateTimestamp(new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), uiStore.language) }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {{ alert.message[uiStore.language] }}
                  </p>
                </div>
              </div>
            </div>

            <div v-else class="p-8">
              <EmptyState
                :title="isArabic ? 'لا توجد تنبيهات جديدة' : 'No Active Alerts'"
                :description="isArabic ? 'جميع العمليات تجري بانسيابية تامة' : 'Operations running smoothly'"
              />
            </div>
          </Card>
        </div>

        <!-- Recent Activities Stream -->
        <div class="lg:col-span-6">
          <Card padding="none">
            <div class="p-5 flex items-center justify-between border-b border-slate-100">
              <h3 class="text-base font-bold text-slate-900 tracking-tight">
                {{ isArabic ? 'سجل العمليات الأخير' : 'Recent Operations Stream' }}
              </h3>
              <Badge variant="neutral" size="sm">
                {{ isArabic ? 'سجل العمليات' : 'Audit Trail' }}
              </Badge>
            </div>

            <div class="p-5 space-y-4">
              <div class="flex items-start gap-3 text-xs">
                <span class="w-2.5 h-2.5 rounded-full bg-[#4edee3] ring-4 ring-[#34abb1]/20 mt-1 shrink-0" />
                <div class="flex-1">
                  <p class="font-semibold text-slate-800">
                    {{ isArabic
                      ? 'اعتماد طلب إجازة طارئة للموظف سامي النجار'
                      : 'Emergency leave approved for Sami Al-Najjar'
                    }}
                  </p>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    {{ isArabic
                      ? 'قبل 15 دقيقة • بواسطة سلطان بن فهد الدوسري'
                      : '15m ago • by Sultan Fahad Al-Dawsari'
                    }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 text-xs">
                <span class="w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-purple-100 mt-1 shrink-0" />
                <div class="flex-1">
                  <p class="font-semibold text-slate-800">
                    {{ isArabic
                      ? 'نموذج RestoraAI قام بتحديث توقعات مبيعات نهاية الأسبوع (+18%)'
                      : 'RestoraAI recalibrated weekend sales forecast (+18%)'
                    }}
                  </p>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    {{ isArabic
                      ? 'قبل ساعة • خوارزمية التعلم الآلي'
                      : '1h ago • Machine Learning Core'
                    }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3 text-xs">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100 mt-1 shrink-0" />
                <div class="flex-1">
                  <p class="font-semibold text-slate-800">
                    {{ isArabic
                      ? 'إيقاف مؤقت (86) لطبق لحم حاشي محمر لنفاد المخزون اليومي'
                      : "Camel meat dish 86'd across digital menus due to depletion"
                    }}
                  </p>
                  <p class="text-[11px] text-slate-400 mt-0.5">
                    {{ isArabic
                      ? 'قبل ساعتين • رئيس الطهاة مبارك مسفر الدوسري'
                      : '2h ago • Head Chef Mubarak Mesfer Al-Dawsari'
                    }}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </template>
  </div>
</template>
