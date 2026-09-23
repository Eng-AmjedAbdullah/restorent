import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
  AlertTriangle,
  Clock,
  Users,
  Check,
  X,
  SlidersHorizontal,
  Flame,
  ChefHat,
  Coffee,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Shift } from '../types';

export const SchedulingPage: React.FC = () => {
  const {
    t,
    language,
    shifts,
    employees,
    acceptAIShift,
    rejectAIShift,
    showToast,
  } = useApp();

  const [selectedDay, setSelectedDay] = useState('2026-09-20');
  const daysOfWeek = [
    { date: '2026-09-19', label: language === 'ar' ? 'السبت' : 'Sat', num: '19' },
    { date: '2026-09-20', label: language === 'ar' ? 'الأحد' : 'Sun', num: '20' },
    { date: '2026-09-21', label: language === 'ar' ? 'الإثنين' : 'Mon', num: '21' },
    { date: '2026-09-22', label: language === 'ar' ? 'الثلاثاء' : 'Tue', num: '22' },
    { date: '2026-09-23', label: language === 'ar' ? 'الأربعاء' : 'Wed', num: '23' },
    { date: '2026-09-24', label: language === 'ar' ? 'الخميس' : 'Thu', num: '24' },
    { date: '2026-09-25', label: language === 'ar' ? 'الجمعة' : 'Fri', num: '25' },
  ];

  const aiShift = shifts.find(s => s.status === 'ai_suggested');
  const uncoveredGaps = shifts.filter(s => s.status === 'gap_uncovered');

  return (
    <PageContainer
      title={t.scheduling.title}
      subtitle={t.scheduling.subtitle}
      badge={
        <Badge variant="ai" size="sm" dot>
          {language === 'ar' ? 'مجدول RestoraAI الذكي' : 'RestoraAI Scheduler'}
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="ai"
            size="sm"
            onClick={() => {
              showToast(
                language === 'ar'
                  ? 'تم تشغيل نموذج الجدولة الذكي ومزامنة التغطية لفرع وادي الدواسر'
                  : 'RestoraAI scheduling model recalibrated coverage for Wadi Al-Dawasir'
              );
            }}
            icon={<Sparkles className="w-4 h-4" />}
          >
            {t.scheduling.generateAISchedule}
          </Button>
        </div>
      }
    >
      {/* AI Suggested Shift Banner (Purple) */}
      {aiShift && (
        <Card variant="ai" className="p-4 border-purple-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {aiShift.shift_name[language]}
                  </h4>
                  <Badge variant="ai">{language === 'ar' ? 'توصية الذكاء الاصطناعي' : 'AI Recommendation'}</Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {language === 'ar'
                    ? `تتوقع النماذج زيادة في طلبات التحضير والطهي البارد ليوم ${aiShift.date} بنسبة 28%. يقترح النظام إضافة مناوبة من 17:00 إلى 22:00 لتفادي تأخير تجهيز أطباق المقبلات.`
                    : `Models forecast a 28% increase in cold prep and appetizer orders for ${aiShift.date}. RestoraAI suggests an overlay shift from 17:00 to 22:00 to avert prep bottlenecks.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  rejectAIShift(aiShift.id);
                  showToast(
                    language === 'ar'
                      ? 'تم رفض وتجاهل مقترح الوردية الذكية'
                      : 'AI shift suggestion rejected'
                  );
                }}
                className="text-xs text-slate-500 hover:text-rose-600"
              >
                {t.scheduling.rejectSuggestion}
              </Button>
              <Button
                variant="ai"
                size="sm"
                onClick={() => {
                  acceptAIShift(aiShift.id);
                  showToast(
                    language === 'ar'
                      ? 'تم اعتماد الوردية الذكية وإضافتها إلى جدول العمليات'
                      : 'AI shift suggestion approved and scheduled'
                  );
                }}
                icon={<Check className="w-3.5 h-3.5" />}
              >
                {t.scheduling.acceptSuggestion}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Week Selector Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-2 px-3">
          <CalendarIcon className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">
            {t.scheduling.weekOf} {language === 'ar' ? '19 - 25 سبتمبر 2026' : 'Sep 19 - 25, 2026'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {daysOfWeek.map(d => {
            const isSelected = d.date === selectedDay;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDay(d.date)}
                className={`flex flex-col items-center justify-center min-w-[54px] py-1.5 px-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2c777c] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="text-[10px] opacity-80">{d.label}</span>
                <span className="text-sm font-extrabold">{d.num}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Roster Lanes by Station */}
      <div className="space-y-4">
        {/* Hot Line & Kitchen Lane */}
        <Card>
          <CardHeader className="bg-slate-50/70 py-3">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#2c777c]" />
              <CardTitle className="text-sm">
                {language === 'ar' ? 'المطبخ والطهي الساخن (Hot Line & Grill)' : 'Hot Line & Grill Station'}
              </CardTitle>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {language === 'ar' ? 'الهدف: 3 طهاة / الفعلي: 2' : 'Target: 3 Chefs / Actual: 2'}
            </span>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {shifts
              .filter(s => s.station === 'hot_line' || s.station === 'grill')
              .map(shift => {
                const emp = shift.employee;
                if (shift.status === 'gap_uncovered') {
                  return (
                    <div
                      key={shift.id}
                      className="p-3.5 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <div>
                          <span className="font-bold text-xs text-rose-900 block">
                            {shift.shift_name[language]}
                          </span>
                          <span className="text-[11px] text-rose-700">
                            {shift.start_time} - {shift.end_time} • {language === 'ar' ? 'لم يتم تعيين موظف بعد' : 'Unassigned shift'}
                          </span>
                        </div>
                      </div>
                      <Button variant="danger" size="sm">
                        {language === 'ar' ? 'تسكين موظف' : 'Assign Staff'}
                      </Button>
                    </div>
                  );
                }

                return (
                  <div
                    key={shift.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={emp?.avatar_url} name={emp?.first_name[language] || 'Chef'} size="sm" />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {emp?.first_name[language]} {emp?.last_name[language]}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {shift.shift_name[language]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-slate-700 font-bold">
                        {shift.start_time} - {shift.end_time}
                      </span>
                      <Badge variant="success">{language === 'ar' ? 'مؤكد' : 'Confirmed'}</Badge>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Floor Captain & Dining Lane */}
        <Card>
          <CardHeader className="bg-slate-50/70 py-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#34abb1]" />
              <CardTitle className="text-sm">
                {language === 'ar' ? 'خدمة الصالة وإشراف الطاولات (Dining Floor)' : 'Dining Room & Floor Captain'}
              </CardTitle>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {language === 'ar' ? 'الهدف: 3 طاقم / الفعلي: 3 (مكتمل)' : 'Target: 3 Staff / Actual: 3 (Full)'}
            </span>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {shifts
              .filter(s => s.station === 'floor_captain')
              .map(shift => {
                const emp = shift.employee;
                return (
                  <div
                    key={shift.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={emp?.avatar_url} name={emp?.first_name[language] || 'Server'} size="sm" />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {emp?.first_name[language]} {emp?.last_name[language]}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {shift.shift_name[language]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-slate-700 font-bold">
                        {shift.start_time} - {shift.end_time}
                      </span>
                      <Badge variant="success">{language === 'ar' ? 'مؤكد' : 'Confirmed'}</Badge>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>

        {/* Barista & Beverage Lane */}
        <Card>
          <CardHeader className="bg-slate-50/70 py-3">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-amber-600" />
              <CardTitle className="text-sm">
                {language === 'ar' ? 'المشروبات والقهوة المختصة (Espresso & Bar)' : 'Espresso & Beverage Bar'}
              </CardTitle>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {language === 'ar' ? 'الهدف: 2 / الفعلي: 2' : 'Target: 2 / Actual: 2'}
            </span>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {shifts
              .filter(s => s.station === 'barista')
              .map(shift => {
                const emp = shift.employee;
                return (
                  <div
                    key={shift.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={emp?.avatar_url} name={emp?.first_name[language] || 'Barista'} size="sm" />
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">
                          {emp?.first_name[language]} {emp?.last_name[language]}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {shift.shift_name[language]}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-slate-700 font-bold">
                        {shift.start_time} - {shift.end_time}
                      </span>
                      <Badge variant="success">{language === 'ar' ? 'مؤكد' : 'Confirmed'}</Badge>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
