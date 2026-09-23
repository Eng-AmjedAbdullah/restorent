import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  UserX,
  PlusCircle,
  Fingerprint,
  Calendar,
  Search,
  Check,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Attendance } from '../types';

export const AttendancePage: React.FC = () => {
  const {
    t,
    language,
    attendance,
    employees,
    markAttendanceExcuse,
    manualClockIn,
    showToast,
  } = useApp();

  const [selectedRecordForExcuse, setSelectedRecordForExcuse] = useState<Attendance | null>(null);
  const [excuseNotes, setExcuseNotes] = useState('');
  const [isManualClockInOpen, setIsManualClockInOpen] = useState(false);
  const [manualEmpId, setManualEmpId] = useState(employees[0]?.id || '');
  const [manualTime, setManualTime] = useState('08:00');
  const [filterType, setFilterType] = useState('all');

  const onTimeCount = attendance.filter(a => a.status === 'on_time' || a.status === 'active_shift').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const missingCount = Math.max(0, employees.length - attendance.length);

  const filteredAttendance = attendance.filter(a => {
    if (filterType === 'late') return a.status === 'late';
    if (filterType === 'on_time') return a.status === 'on_time' || a.status === 'active_shift';
    if (filterType === 'excused') return a.status === 'excused';
    return true;
  });

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecordForExcuse) {
      markAttendanceExcuse(selectedRecordForExcuse.id, excuseNotes || 'تم قبول العذر من المشرف');
      showToast(
        language === 'ar'
          ? 'تم اعتماد وقبول عذر التأخير وتحديث السجل'
          : 'Tardiness excuse accepted and logged'
      );
      setSelectedRecordForExcuse(null);
      setExcuseNotes('');
    }
  };

  const handleManualClockInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    manualClockIn(manualEmpId, manualTime);
    showToast(
      language === 'ar'
        ? `تم تسجيل الحضور اليدوي بنجاح الساعة ${manualTime}`
        : `Manual clock-in recorded at ${manualTime}`
    );
    setIsManualClockInOpen(false);
  };

  return (
    <PageContainer
      title={t.attendance.title}
      subtitle={t.attendance.subtitle}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsManualClockInOpen(true)}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            {t.attendance.manualClockIn}
          </Button>
        </div>
      }
    >
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#34abb1]/40 bg-[#4edee3]/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#2c777c] font-semibold">{t.attendance.onTime}</p>
              <h3 className="text-2xl font-black text-[#2c777c] mt-1">{onTimeCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#34abb1]/15 flex items-center justify-center text-[#2c777c]">
              <CheckCircle2 className="w-5 h-5 text-[#34abb1]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200/60 bg-amber-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-800 font-semibold">{t.attendance.late}</p>
              <h3 className="text-2xl font-black text-amber-950 mt-1">{lateCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-semibold">
                {language === 'ar' ? 'بانتظار تسجيل البصمة' : 'Pending Clock-In'}
              </p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{missingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
              <UserX className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Log Table */}
      <Card>
        <CardContent className="p-0 divide-y divide-slate-100">
          <div className="p-4 bg-slate-50/70 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">
                {language === 'ar' ? 'سجل البصمة اليومي المعتمد' : 'Verified Daily Biometric Log'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.common.all}
              </button>
              <button
                onClick={() => setFilterType('late')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === 'late' ? 'bg-amber-700 text-white' : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                {t.attendance.late} ({lateCount})
              </button>
              <button
                onClick={() => setFilterType('excused')}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  filterType === 'excused' ? 'bg-sky-700 text-white' : 'text-sky-800 hover:bg-sky-100'
                }`}
              >
                {language === 'ar' ? 'معذور' : 'Excused'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-800 text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-start">{language === 'ar' ? 'الموظف' : 'Employee'}</th>
                  <th className="py-3 px-4 text-start">{t.attendance.scheduledShift}</th>
                  <th className="py-3 px-4 text-start">{t.attendance.clockInTime}</th>
                  <th className="py-3 px-4 text-start">{t.attendance.variance}</th>
                  <th className="py-3 px-4 text-start">{t.attendance.verificationMethod}</th>
                  <th className="py-3 px-4 text-start">{t.common.status}</th>
                  <th className="py-3 px-4 text-end">{t.attendance.managerActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAttendance.map(record => {
                  const emp = record.employee || employees.find(e => e.id === record.employee_id);
                  return (
                    <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar src={emp?.avatar_url} name={emp?.first_name[language] || 'U'} size="sm" />
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {emp?.first_name[language]} {emp?.last_name[language]}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{emp?.employee_code}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {record.scheduled_start} - {record.scheduled_end}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {record.actual_clock_in || '-'}
                      </td>

                      <td className="py-3.5 px-4">
                        {record.late_minutes > 0 ? (
                          <span className="text-amber-700 font-bold">
                            +{record.late_minutes} {language === 'ar' ? 'دقيقة' : 'min'}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium">
                            {language === 'ar' ? 'في الموعد' : 'On Time'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono border border-slate-200">
                          {record.device_source || 'biometric'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {record.status === 'late' ? (
                          <Badge variant="warning" dot>{t.attendance.late}</Badge>
                        ) : record.status === 'excused' ? (
                          <Badge variant="info">{language === 'ar' ? 'معذور رسمياً' : 'Excused'}</Badge>
                        ) : (
                          <Badge variant="success" dot>{t.attendance.onTime}</Badge>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-end">
                        {record.status === 'late' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecordForExcuse(record)}
                            className="text-xs"
                          >
                            {t.attendance.excuseLate}
                          </Button>
                        )}
                        {record.status === 'excused' && (
                          <span className="text-[11px] text-slate-400 italic">
                            {record.manager_notes || (language === 'ar' ? 'عذر مقبول' : 'Accepted excuse')}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* EXCUSE LATENESS MODAL */}
      <Dialog
        isOpen={!!selectedRecordForExcuse}
        onClose={() => setSelectedRecordForExcuse(null)}
        title={language === 'ar' ? 'احتساب عذر تأخير رسمي' : 'Log Official Tardiness Excuse'}
        description={
          language === 'ar'
            ? 'تسجيل مبرر التأخير في السجل وحذف الخصم التلقائي'
            : 'Record reason to update log and waive automatic deductions'
        }
        maxWidth="md"
      >
        {selectedRecordForExcuse && (
          <form onSubmit={handleExcuseSubmit} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <p className="font-bold text-amber-900">
                {language === 'ar' ? 'الموظف:' : 'Employee:'} {selectedRecordForExcuse.employee?.first_name[language]} {selectedRecordForExcuse.employee?.last_name[language]}
              </p>
              <p className="text-amber-800 mt-1">
                {language === 'ar'
                  ? `تأخير مسجل: ${selectedRecordForExcuse.late_minutes} دقيقة (وقت البصمة: ${selectedRecordForExcuse.actual_clock_in})`
                  : `Recorded tardiness: ${selectedRecordForExcuse.late_minutes} min (Clock-in time: ${selectedRecordForExcuse.actual_clock_in})`}
              </p>
            </div>

            <Input
              label={language === 'ar' ? 'سبب أو مبرر التأخير المقبول' : 'Valid Reason or Justification'}
              placeholder={
                language === 'ar'
                  ? 'مثال: تعطل سيارة الموظف / تكليف خارجي عاجل'
                  : 'e.g. Vehicle breakdown / urgent external errand'
              }
              value={excuseNotes}
              onChange={e => setExcuseNotes(e.target.value)}
              required
            />

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedRecordForExcuse(null)}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {language === 'ar' ? 'اعتماد العذر' : 'Approve Excuse'}
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* MANUAL CLOCK IN MODAL */}
      <Dialog
        isOpen={isManualClockInOpen}
        onClose={() => setIsManualClockInOpen(false)}
        title={t.attendance.manualClockIn}
        description={
          language === 'ar'
            ? 'تسجيل بصمة حضور يدوي بتفويض من المشرف المسؤول'
            : 'Record manual clock-in under supervisor authorization'
        }
        maxWidth="md"
      >
        <form onSubmit={handleManualClockInSubmit} className="space-y-4">
          <Select
            label={language === 'ar' ? 'اختر الموظف' : 'Select Employee'}
            value={manualEmpId}
            onChange={e => setManualEmpId(e.target.value)}
            options={employees.map(e => ({
              value: e.id,
              label: `${e.first_name[language]} ${e.last_name[language]} (${e.employee_code})`,
            }))}
          />

          <Input
            label={language === 'ar' ? 'وقت الحضور الفعلي (HH:mm)' : 'Actual Clock-In Time (HH:mm)'}
            type="time"
            value={manualTime}
            onChange={e => setManualTime(e.target.value)}
            required
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsManualClockInOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {language === 'ar' ? 'تسجيل البصمة' : 'Record Clock-In'}
            </Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
