import React from 'react';
import {
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Flame,
  ChefHat,
  Coffee,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Sparkle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { translateServerName, translateTableName, translateTimestamp } from '../utils/localization';

export const DashboardPage: React.FC = () => {
  const {
    t,
    language,
    direction,
    selectedRestaurant,
    employees,
    attendance,
    inventory,
    leaveRequests,
    alerts,
    orders,
    aiRecommendations,
    acceptAIRecommendation,
    rejectAIRecommendation,
    setCurrentPage,
    showToast,
  } = useApp();

  // Compute live stats
  const salesToday = 42150;
  const employeesWorking = employees.filter(e => e.status === 'on_shift').length;
  const lateAttendance = attendance.filter(a => a.status === 'late').length;
  const attendanceRate = Math.round(((attendance.length - lateAttendance) / (attendance.length || 1)) * 100);
  const lowStockCount = inventory.filter(i => i.status === 'critical' || i.status === 'low_stock').length;
  const pendingRequestsCount = leaveRequests.filter(l => l.status === 'pending').length;

  return (
    <PageContainer
      title={t.dashboard.title}
      subtitle={`${selectedRestaurant.name[language]} - ${t.dashboard.subtitle}`}
      badge={
        <Badge variant="cyan" size="sm" dot>
          {language === 'ar' ? 'مراقبة فورية RestoraAI' : 'RestoraAI Real-Time'}
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage('reports')}
          >
            {t.nav.reports}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentPage('orders')}
            icon={<ShoppingBag className="w-4 h-4" />}
          >
            {t.orders.title}
          </Button>
        </div>
      }
    >
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Sales Today */}
        <Card className="border-slate-200 hover:border-[#16C7C9]/60 hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t.dashboard.salesToday}</span>
              <span className="w-9 h-9 rounded-xl bg-[#16C7C9]/15 text-[#0A5C61] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-[#16C7C9]" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {salesToday.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-slate-500">{t.common.sar}</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#2c777c] font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#34abb1]" />
              <span>+14.8% {t.dashboard.vsYesterday}</span>
            </div>
          </CardContent>
        </Card>

        {/* Employees Working */}
        <Card className="border-slate-200 hover:border-[#4edee3]/60 hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t.dashboard.employeesWorking}</span>
              <span className="w-9 h-9 rounded-xl bg-[#08131F] text-[#4edee3] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-[#4edee3]" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {employeesWorking}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ {employees.length} {t.employees.totalEmployees}</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500 font-medium">{t.dashboard.onShiftNow}</p>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t.dashboard.attendanceRate}</span>
              <span className="w-9 h-9 rounded-xl bg-[#4edee3]/10 text-[#2c777c] flex items-center justify-center shrink-0 border border-[#34abb1]/30">
                <Clock className="w-4 h-4 text-[#34abb1]" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {attendanceRate}%
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
              <span>{lateAttendance} {t.dashboard.lateCount}</span>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Warnings */}
        <Card className={lowStockCount > 0 ? 'border-amber-300/80 bg-amber-50/20' : 'border-slate-200'}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t.dashboard.inventoryWarnings}</span>
              <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-900 font-mono tracking-tight">
                {lowStockCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">{t.dashboard.itemsBelowPar}</span>
            </div>
            <button
              onClick={() => setCurrentPage('inventory')}
              className="mt-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer text-start"
            >
              {language === 'ar' ? 'عرض النواقص وإصدار طلب' : 'Inspect Stockouts'}
            </button>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border-slate-200 hover:border-purple-300 hover:shadow-md transition-all">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{t.dashboard.pendingRequests}</span>
              <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200">
                <FileCheck2 className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                {pendingRequestsCount}
              </span>
              <span className="text-xs text-slate-400 font-medium">{t.dashboard.leaveAndShift}</span>
            </div>
            <button
              onClick={() => setCurrentPage('leave-requests')}
              className="mt-1.5 text-[11px] font-bold text-[#2c777c] hover:text-[#34abb1] underline cursor-pointer text-start"
            >
              {language === 'ar' ? 'اتخاذ قرار الاعتماد' : 'Review Requests'}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* AI RECOMMENDATIONS SECTION (Deep Refined AI Design) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white flex items-center justify-center shadow-md shadow-purple-900/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {t.dashboard.aiSectionTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {t.dashboard.aiSectionSubtitle}
              </p>
            </div>
          </div>
          <Button
            variant="ai"
            size="sm"
            onClick={() => setCurrentPage('ai-intelligence')}
          >
            {t.ai.explainability}
          </Button>
        </div>

        {/* Recommendations Grid in Purple Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiRecommendations.map(rec => (
            <Card
              key={rec.id}
              variant="ai"
              hoverEffect
              className="flex flex-col justify-between"
            >
              <CardContent className="p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="ai" size="sm">
                    {t.common.confidence}: {rec.confidence_score}%
                  </Badge>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                      rec.urgency === 'high'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {rec.urgency === 'high' ? t.common.high : t.common.medium}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {rec.title[language]}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {rec.description[language]}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-100/60 border border-purple-200/80 text-xs">
                  <span className="font-bold text-purple-950 block mb-0.5">
                    {t.common.impact}:
                  </span>
                  <p className="text-purple-800 text-[11px] leading-relaxed">
                    {rec.impact[language]}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="bg-purple-50/50 border-purple-100 p-3.5 flex items-center justify-between gap-2">
                {rec.status === 'accepted' ? (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    {language === 'ar' ? 'تم اعتماد التوجيه بنجاح' : 'Directive Accepted'}
                  </span>
                ) : rec.status === 'rejected' ? (
                  <span className="text-xs font-medium text-slate-400">
                    {language === 'ar' ? 'تم التجاهل' : 'Dismissed'}
                  </span>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        rejectAIRecommendation(rec.id);
                        showToast(
                          language === 'ar'
                            ? `تم تجاهل توصية الذكاء الاصطناعي #${rec.id}`
                            : `Dismissed recommendation #${rec.id}`
                        );
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      {t.common.dismiss}
                    </Button>
                    <Button
                      variant="ai"
                      size="sm"
                      onClick={() => {
                        acceptAIRecommendation(rec.id);
                        showToast(
                          language === 'ar'
                            ? `تم اعتماد توصية RestoraAI وتحديث الجدول التشغيلي`
                            : `Accepted RestoraAI directive & updated schedule`
                        );
                      }}
                      icon={<Check className="w-3.5 h-3.5" />}
                    >
                      {t.common.accept}
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* MID SECTION: Today's Floor Operations & Staffing Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Operations / KDS Live Progress */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{t.dashboard.todayOperations}</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  {orders.length} {t.orders.activeOrders}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('orders')}
                icon={direction === 'rtl' ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                iconPosition="end"
              >
                {t.orders.title}
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 p-0">
              {orders.slice(0, 4).map(order => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-800 shrink-0">
                      {order.order_number}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {translateTableName(order.table_number, language) ||
                            (order.order_type === 'takeaway'
                              ? language === 'ar' ? 'طلب خارجي' : 'Takeaway'
                              : order.order_type === 'delivery'
                              ? language === 'ar' ? 'توصيل' : 'Delivery'
                              : order.order_type)}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          • {translateServerName(order.server_name, language)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {order.items.map(i => `${i.quantity}x ${i.name[language]}`).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                        order.status === 'new'
                          ? 'bg-sky-100 text-sky-800'
                          : order.status === 'preparing'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : order.status === 'ready'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {order.status === 'cancelled' ? (language === 'ar' ? 'ملغي' : 'Cancelled') : t.orders[order.status]}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {order.elapsed_minutes}m
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Staffing Coverage by Station */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{t.dashboard.staffingCoverage}</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ar' ? 'جاهزية محطات فرع وادي الدواسر حسب جدول اليوم' : 'Station readiness against scheduled par'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('scheduling')}
              >
                {t.nav.scheduling}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Kitchen Station */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <ChefHat className="w-4 h-4 text-[#2c777c]" />
                    {t.dashboard.kitchenCoverage}
                  </span>
                  <span className="text-slate-600 font-mono">
                    {language === 'ar' ? '4 / 5 طهاة (80%)' : '4 / 5 Chefs (80%)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-4/5" />
                </div>
                <p className="text-[10px] text-amber-700 font-medium mt-1">
                  {language === 'ar' ? 'فجوة في محطة الخط الساخن أثناء العشاء (19:30)' : 'Hot line cook gap at 19:30'}
                </p>
              </div>

              {/* Dining & Floor */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Users className="w-4 h-4 text-[#34abb1]" />
                    {t.dashboard.floorCoverage}
                  </span>
                  <span className="text-slate-600 font-mono">
                    {language === 'ar' ? '5 / 5 طاقم (100%)' : '5 / 5 Staff (100%)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#34abb1] rounded-full w-full" />
                </div>
                <p className="text-[10px] text-[#2c777c] font-medium mt-1">
                  {language === 'ar' ? 'تغطية كاملة ومثالية للصالة والمجالس' : 'Full optimal coverage'}
                </p>
              </div>

              {/* Bar & Barista */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Coffee className="w-4 h-4 text-amber-600" />
                    {t.dashboard.barCoverage}
                  </span>
                  <span className="text-slate-600 font-mono">
                    {language === 'ar' ? '2 / 2 باريستا (100%)' : '2 / 2 Baristas (100%)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#34abb1] rounded-full w-full" />
                </div>
              </div>

              {/* Stewarding */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <ShieldAlert className="w-4 h-4 text-sky-600" />
                    {t.dashboard.stewardingCoverage}
                  </span>
                  <span className="text-slate-600 font-mono">
                    {language === 'ar' ? '2 / 2 فريق (100%)' : '2 / 2 Stewards (100%)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-[#34abb1] rounded-full w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* BOTTOM SECTION: Live Alerts Preview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Alerts */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.alertsTitle}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage('alerts')}
              >
                {t.alerts.title}
              </Button>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 p-0">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="p-4 flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      alert.type === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : alert.type === 'ai'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {alert.title[language]}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {translateTimestamp(alert.timestamp, language)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {alert.message[language]}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities Stream */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.recentActivities}</CardTitle>
              <Badge variant="neutral" size="sm">{language === 'ar' ? 'سجل العمليات' : 'Audit Trail'}</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#4edee3] ring-2 ring-[#34abb1]/30 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {language === 'ar'
                      ? 'اعتماد طلب إجازة طارئة للموظف سامي النجار'
                      : 'Emergency leave approved for Sami Al-Najjar'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'قبل 15 دقيقة • بواسطة سلطان بن فهد الدوسري' : '15m ago • by Sultan Fahad Al-Dawsari'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {language === 'ar'
                      ? 'نموذج RestoraAI قام بتحديث توقعات مبيعات نهاية الأسبوع (+18%)'
                      : 'RestoraAI recalibrated weekend sales forecast (+18%)'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'قبل ساعة • خوارزمية التعلم الآلي' : '1h ago • Machine Learning Core'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {language === 'ar'
                      ? 'إيقاف مؤقت (86) لطبق لحم حاشي محمر لنفاد المخزون اليومي'
                      : "Camel meat dish 86'd across digital menus due to depletion"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'قبل ساعتين • رئيس الطهاة مبارك مسفر الدوسري' : '2h ago • Head Chef Mubarak Mesfer Al-Dawsari'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
