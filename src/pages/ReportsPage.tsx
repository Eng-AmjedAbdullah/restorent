import React, { useState } from 'react';
import {
  DollarSign,
  Receipt,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';

export const ReportsPage: React.FC = () => {
  const {
    t,
    language,
    selectedRestaurant,
    showToast,
  } = useApp();

  const [dateRange, setDateRange] = useState('7d');

  const weeklyRevenueData = [
    { day: language === 'ar' ? 'السبت' : 'Sat', revenue: 38200, labor: 24.1 },
    { day: language === 'ar' ? 'الأحد' : 'Sun', revenue: 42150, labor: 23.8 },
    { day: language === 'ar' ? 'الإثنين' : 'Mon', revenue: 36400, labor: 25.2 },
    { day: language === 'ar' ? 'الثلاثاء' : 'Tue', revenue: 39800, labor: 24.5 },
    { day: language === 'ar' ? 'الأربعاء' : 'Wed', revenue: 44200, labor: 23.4 },
    { day: language === 'ar' ? 'الخميس' : 'Thu', revenue: 58900, labor: 22.1 },
    { day: language === 'ar' ? 'الجمعة' : 'Fri', revenue: 64100, labor: 21.9 },
  ];

  const maxRevenue = Math.max(...weeklyRevenueData.map(d => d.revenue));

  const handleExport = (format: 'PDF' | 'Excel') => {
    showToast(
      language === 'ar'
        ? `جاري تصدير التقرير المالي والتشغيلي بصيغة ${format}...`
        : `Exporting operational report as ${format}...`
    );
  };

  return (
    <PageContainer
      title={t.reports.title}
      subtitle={`${selectedRestaurant.name[language]} - ${t.reports.subtitle}`}
      actions={
        <div className="flex items-center gap-2">
          <Select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            options={[
              { value: 'today', label: language === 'ar' ? 'اليوم الحالي' : 'Today' },
              { value: '7d', label: language === 'ar' ? 'آخر 7 أيام' : 'Last 7 Days' },
              { value: '30d', label: language === 'ar' ? 'آخر 30 يوم' : 'Last 30 Days' },
              { value: 'quarter', label: language === 'ar' ? 'الربع السنوي الحالي' : 'Current Quarter' },
            ]}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('Excel')}
            icon={<Download className="w-4 h-4" />}
          >
            {t.reports.downloadCsv}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('PDF')}
            icon={<Download className="w-4 h-4" />}
          >
            {t.reports.downloadPdf}
          </Button>
        </div>
      }
    >
      {/* 4 Financial & Efficiency Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{t.reports.totalSales}</span>
              <span className="p-1.5 rounded-lg bg-[#4edee3]/20 text-[#2c777c]">
                <DollarSign className="w-4 h-4 text-[#34abb1]" />
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              323,750 {t.common.sar}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#2c777c] font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5 text-[#34abb1]" />
              <span>{language === 'ar' ? '+12.4% مقارنة بالأسبوع السابق' : '+12.4% vs previous week'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Labor Cost % vs Target */}
        <Card className="bg-[#4edee3]/10 border-[#34abb1]/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-[#2c777c] font-medium">
              <span>{t.reports.laborCostTarget}</span>
              <Badge variant="success">{language === 'ar' ? 'ضمن الهدف' : 'On Target'}</Badge>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#2c777c]">23.6%</span>
              <span className="text-xs text-slate-500">({language === 'ar' ? 'الهدف: 25.0%' : 'Target: 25.0%'})</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-[#2c777c] font-semibold">
              <ArrowDownRight className="w-3.5 h-3.5 text-[#34abb1]" />
              <span>{language === 'ar' ? 'وفر 1.4% في تكلفة العمالة' : '1.4% labor cost savings'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Table Turn Time */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{t.reports.tableTurnTime}</span>
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                <Receipt className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              46 {language === 'ar' ? 'دقيقة' : 'min'}
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">
              {language === 'ar' ? 'معدل دوران الطاولة داخل الصالة' : 'Average table dwell time'}
            </p>
          </CardContent>
        </Card>

        {/* Food Waste */}
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{t.reports.foodWasteTrack}</span>
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                <Trash2 className="w-4 h-4" />
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              1.8%
            </h3>
            <p className="mt-1 text-[11px] text-[#2c777c] font-semibold">
              {language === 'ar' ? '-0.6% بفضل دقة التحضير المسبق' : '-0.6% via prep forecasting'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Labor Trend Bar Chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>{t.reports.hourlyHeatmap}</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'ar' ? 'مقارنة مبيعات الأيام السبعة ومؤشر كفاءة الجدولة' : '7-day revenue comparison with labor efficiency'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded bg-[#34abb1] inline-block" />
              {t.reports.totalSales}
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded bg-indigo-500 inline-block" />
              {language === 'ar' ? 'نسبة العمالة (%)' : 'Labor Cost (%)'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6">
            {weeklyRevenueData.map((item, idx) => {
              const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold text-slate-700 mb-1">
                    {item.revenue.toLocaleString()}
                  </div>
                  <div className="w-full max-w-[48px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-[#34abb1] rounded-t-xl transition-all duration-500 group-hover:bg-[#4edee3]"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-1">{item.day}</span>
                  <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                    {item.labor}%
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
