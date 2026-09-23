import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Users,
  Briefcase,
  Award,
  Calendar,
  Clock,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle2,
  CalendarCheck,
  Plane,
  X,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Table, Column } from '../components/ui/Table';
import { Dialog } from '../components/ui/Dialog';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Tabs } from '../components/ui/Tabs';
import { Employee } from '../types';
import { mockPositions } from '../data/mockData';

export const EmployeesPage: React.FC = () => {
  const {
    t,
    language,
    employees,
    selectedEmployee,
    setSelectedEmployee,
    addEmployee,
    attendance,
    shifts,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'skills' | 'attendance' | 'schedule' | 'leave'>('profile');

  // New employee form state
  const [newFirstNameAr, setNewFirstNameAr] = useState('');
  const [newFirstNameEn, setNewFirstNameEn] = useState('');
  const [newLastNameAr, setNewLastNameAr] = useState('');
  const [newLastNameEn, setNewLastNameEn] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPositionId, setNewPositionId] = useState(mockPositions[0].id);
  const [newContractType, setNewContractType] = useState<'full_time' | 'part_time'>('full_time');
  const [newHourlyRate, setNewHourlyRate] = useState('40');

  // Filtered employees
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name[language]} ${emp.last_name[language]} ${emp.employee_code}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.position?.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // KPI calculations
  const totalCount = employees.length;
  const onDutyCount = employees.filter(e => e.status === 'on_shift').length;
  const onLeaveCount = employees.filter(e => e.status === 'on_leave').length;
  const contractorsCount = employees.filter(e => e.contract_type === 'part_time' || e.contract_type === 'contractor').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenPos = mockPositions.find(p => p.id === newPositionId) || mockPositions[0];

    addEmployee({
      first_name: {
        ar: newFirstNameAr || 'موظف',
        en: newFirstNameEn || 'Staff',
      },
      last_name: {
        ar: newLastNameAr || 'جديد',
        en: newLastNameEn || 'New',
      },
      email: newEmail || 'employee@restoraintel.com',
      phone: newPhone || '+966 50 123 0000',
      position_id: chosenPos.id,
      position: chosenPos,
      contract_type: newContractType,
      hourly_rate: Number(newHourlyRate) || 40,
    });

    setIsAddDialogOpen(false);
    showToast(
      language === 'ar'
        ? `تم تسجيل الموظف ${newFirstNameAr || 'الجديد'} بنجاح في فرع وادي الدواسر`
        : `Employee ${newFirstNameEn || 'New'} added to Wadi Al-Dawasir branch`
    );
    // Reset form
    setNewFirstNameAr('');
    setNewFirstNameEn('');
    setNewLastNameAr('');
    setNewLastNameEn('');
    setNewEmail('');
    setNewPhone('');
  };

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'on_shift':
        return <Badge variant="success" dot>{language === 'ar' ? 'على رأس العمل' : 'On Shift'}</Badge>;
      case 'active':
        return <Badge variant="info" dot>{language === 'ar' ? 'متاح ومجدول' : 'Active'}</Badge>;
      case 'on_leave':
        return <Badge variant="warning" dot>{language === 'ar' ? 'في إجازة' : 'On Leave'}</Badge>;
      case 'off_duty':
        return <Badge variant="neutral">{language === 'ar' ? 'خارج الوردية' : 'Off Duty'}</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const tableColumns: Column<Employee>[] = [
    {
      key: 'employee',
      header: t.employees.columns.employee,
      render: emp => (
        <div className="flex items-center gap-3">
          <Avatar src={emp.avatar_url} name={emp.first_name[language]} size="md" />
          <div>
            <span className="font-bold text-slate-900 block">
              {emp.first_name[language]} {emp.last_name[language]}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{emp.employee_code}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'position',
      header: t.employees.columns.position,
      render: emp => (
        <div>
          <span className="font-medium text-slate-800 block text-xs">{emp.position?.title[language] || '-'}</span>
          <span className="text-[11px] text-slate-400 capitalize">{emp.position ? (t.employees[emp.position.department] || emp.position.department) : ''}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: t.employees.columns.status,
      render: emp => getStatusBadge(emp.status),
    },
    {
      key: 'skills',
      header: t.employees.columns.skills,
      render: emp => (
        <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
          {emp.skills.slice(0, 2).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
            >
              {skill}
            </span>
          ))}
          {emp.skills.length > 2 && (
            <span className="text-[10px] text-slate-400 font-medium">+{emp.skills.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      key: 'performance',
      header: t.employees.columns.performance,
      render: emp => (
        <div className="flex items-center gap-1">
          <span className="font-bold text-xs text-slate-800">{emp.performance_score}</span>
          <span className="text-amber-500 text-xs">★</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: t.employees.columns.actions,
      align: 'end',
      render: emp => (
        <Button
          variant="outline"
          size="sm"
          onClick={e => {
            e.stopPropagation();
            setSelectedEmployee(emp);
          }}
        >
          {t.common.details}
        </Button>
      ),
    },
  ];

  return (
    <PageContainer
      title={t.employees.title}
      subtitle={t.employees.subtitle}
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddDialogOpen(true)}
          icon={<UserPlus className="w-4 h-4" />}
        >
          {t.employees.addEmployee}
        </Button>
      }
    >
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">{t.employees.totalEmployees}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/30 border-emerald-200/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 font-medium">{t.employees.onDuty}</p>
              <h3 className="text-2xl font-black text-emerald-900 mt-1">{onDutyCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/30 border-amber-200/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-800 font-medium">{t.employees.onLeave}</p>
              <h3 className="text-2xl font-black text-amber-900 mt-1">{onLeaveCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Plane className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium">{t.employees.contractors}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{contractorsCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200/70 flex items-center justify-center text-slate-700">
              <Briefcase className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3 justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder={t.employees.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              options={[
                { value: 'all', label: t.employees.allDepartments },
                { value: 'kitchen', label: t.employees.kitchen },
                { value: 'service', label: t.employees.service },
                { value: 'bar', label: t.employees.bar },
                { value: 'management', label: t.employees.management },
                { value: 'stewarding', label: t.employees.stewarding },
              ]}
            />

            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: t.common.all },
                { value: 'on_shift', label: t.employees.onDuty },
                { value: 'on_leave', label: t.employees.onLeave },
                { value: 'active', label: t.common.active },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table
          columns={tableColumns}
          data={filteredEmployees}
          keyExtractor={emp => emp.id}
          onRowClick={emp => setSelectedEmployee(emp)}
        />
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {filteredEmployees.map(emp => (
          <Card
            key={emp.id}
            onClick={() => setSelectedEmployee(emp)}
            className="p-4 cursor-pointer hover:border-emerald-300"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar src={emp.avatar_url} name={emp.first_name[language]} size="md" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {emp.first_name[language]} {emp.last_name[language]}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {emp.position?.title[language] || '-'}
                  </p>
                </div>
              </div>
              <div>{getStatusBadge(emp.status)}</div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">{emp.employee_code}</span>
              <span className="text-emerald-700 font-bold">{t.common.details} →</span>
            </div>
          </Card>
        ))}
      </div>

      {/* ADD EMPLOYEE DIALOG */}
      <Dialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title={t.employees.addEmployee}
        description={language === 'ar' ? 'تسجيل كادر جديد وتخصيص المنصب والرصيد في قاعدة البيانات' : 'Register new employee with localized credentials'}
        maxWidth="lg"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={language === 'ar' ? 'الاسم الأول (بالعربية)' : 'First Name (Arabic)'}
              value={newFirstNameAr}
              onChange={e => setNewFirstNameAr(e.target.value)}
              placeholder="مثال: فيصل"
              required
            />
            <Input
              label={language === 'ar' ? 'الاسم الأول (بالإنجليزي)' : 'First Name (English)'}
              value={newFirstNameEn}
              onChange={e => setNewFirstNameEn(e.target.value)}
              placeholder="e.g. Faisal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={language === 'ar' ? 'اسم العائلة (بالعربية)' : 'Last Name (Arabic)'}
              value={newLastNameAr}
              onChange={e => setNewLastNameAr(e.target.value)}
              placeholder="مثال: القحطاني"
              required
            />
            <Input
              label={language === 'ar' ? 'اسم العائلة (بالإنجليزي)' : 'Last Name (English)'}
              value={newLastNameEn}
              onChange={e => setNewLastNameEn(e.target.value)}
              placeholder="e.g. Al-Qahtani"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={language === 'ar' ? 'البريد الإلكتروني المهني' : 'Work Email'}
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="faisal@restoraintel.com"
              required
            />
            <Input
              label={language === 'ar' ? 'رقم الهاتف الجوال' : 'Mobile Phone'}
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              placeholder="+966 50 000 0000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={language === 'ar' ? 'المسمى الوظيفي والقسم' : 'Position & Department'}
              value={newPositionId}
              onChange={e => setNewPositionId(e.target.value)}
              options={mockPositions.map(p => ({
                value: p.id,
                label: `${p.title[language]} (${p.department})`,
              }))}
            />

            <Select
              label={language === 'ar' ? 'نوع التعاقد' : 'Contract Type'}
              value={newContractType}
              onChange={e => setNewContractType(e.target.value as any)}
              options={[
                { value: 'full_time', label: language === 'ar' ? 'دوام كامل' : 'Full-Time' },
                { value: 'part_time', label: language === 'ar' ? 'دوام جزئي' : 'Part-Time' },
              ]}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddDialogOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {t.employees.addEmployee}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* EMPLOYEE DETAILS DRAWER */}
      <Drawer
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        title={selectedEmployee ? `${selectedEmployee.first_name[language]} ${selectedEmployee.last_name[language]}` : ''}
        subtitle={selectedEmployee ? `${selectedEmployee.employee_code} • ${selectedEmployee.position?.title[language] || ''}` : ''}
        width="xl"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Drawer Tabs */}
            <Tabs
              activeTab={drawerTab}
              onChange={tab => setDrawerTab(tab as any)}
              tabs={[
                { id: 'profile', label: t.employees.drawer.profileTab },
                { id: 'skills', label: t.employees.drawer.skillsTab },
                { id: 'attendance', label: t.employees.drawer.attendanceTab },
                { id: 'schedule', label: t.employees.drawer.scheduleTab },
                { id: 'leave', label: t.employees.drawer.leaveTab },
              ]}
            />

            {/* Profile Tab */}
            {drawerTab === 'profile' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                  <Avatar src={selectedEmployee.avatar_url} name={selectedEmployee.first_name[language]} size="xl" />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedEmployee.first_name[language]} {selectedEmployee.last_name[language]}
                    </h4>
                    <p className="text-xs text-slate-500">{selectedEmployee.position?.title[language] || ''}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {getStatusBadge(selectedEmployee.status)}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                        {selectedEmployee.contract_type === 'full_time'
                          ? language === 'ar' ? 'دوام كامل' : 'Full-Time'
                          : language === 'ar' ? 'دوام جزئي' : 'Part-Time'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-1">{t.employees.drawer.contactInfo}</span>
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedEmployee.email}
                    </p>
                    <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedEmployee.phone}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block mb-1">{t.employees.drawer.contractInfo}</span>
                    <p className="text-slate-600">
                      {language === 'ar' ? 'تاريخ التعيين:' : 'Hire Date:'}{' '}
                      <strong className="text-slate-900">{selectedEmployee.hire_date}</strong>
                    </p>
                    <p className="text-slate-600 mt-1">
                      {language === 'ar' ? 'الأجر بالساعة:' : 'Hourly Rate:'}{' '}
                      <strong className="text-slate-900">{selectedEmployee.hourly_rate} {t.common.sar}</strong>
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">
                    {language === 'ar' ? 'جهة الاتصال في حالات الطوارئ:' : 'Emergency Contact:'}
                  </span>
                  <p className="text-amber-800">
                    {selectedEmployee.emergency_contact.name} ({selectedEmployee.emergency_contact.relationship}) - {selectedEmployee.emergency_contact.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Skills Tab */}
            {drawerTab === 'skills' && (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'المهارات المعتمدة والشهادات المهنية:' : 'Certified Skills & Competencies:'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <span>{language === 'ar' ? 'تقييم الأداء التراكمي:' : 'Performance Rating:'}</span>
                    <span className="text-sm font-black">{selectedEmployee.performance_score} / 5.0</span>
                  </div>
                  <p className="text-purple-800 leading-relaxed">
                    {language === 'ar'
                      ? 'يتمتع الموظف بسجل عالي الانضباط في سرعة إنجاز التذاكر والالتزام بمعايير سلامة الأغذية والصحة العامة.'
                      : 'Maintains disciplined compliance with food safety hygiene, ticket turnaround, and station teamwork.'}
                  </p>
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {drawerTab === 'attendance' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'سجل حضور الموظف لليوم:' : "Today's Attendance Record:"}
                </h4>
                {attendance.filter(a => a.employee_id === selectedEmployee.id).length > 0 ? (
                  attendance
                    .filter(a => a.employee_id === selectedEmployee.id)
                    .map(att => (
                      <div key={att.id} className="p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{att.date}</span>
                          <Badge variant={att.status === 'late' ? 'warning' : 'success'}>
                            {att.status === 'late'
                              ? language === 'ar' ? `متأخر (${att.late_minutes} دقيقة)` : `Late (${att.late_minutes} min)`
                              : language === 'ar' ? 'حضور في الموعد' : 'On Time'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-600">
                          <div>{language === 'ar' ? 'المجدول:' : 'Scheduled:'} {att.scheduled_start} - {att.scheduled_end}</div>
                          <div>{language === 'ar' ? 'البصمة الفعلية:' : 'Clock-In:'} {att.actual_clock_in || '-'}</div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    {language === 'ar' ? 'لا توجد سجلات حضور مسجلة لهذا اليوم' : 'No attendance logs recorded for today'}
                  </p>
                )}
              </div>
            )}

            {/* Schedule Tab */}
            {drawerTab === 'schedule' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700">
                  {language === 'ar' ? 'الورديات المجدولة للأسبوع:' : 'Weekly Scheduled Shifts:'}
                </h4>
                {shifts.filter(s => s.employee_id === selectedEmployee.id).map(shift => (
                  <div key={shift.id} className="p-3.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{shift.shift_name[language]}</span>
                      <span className="text-slate-500">{shift.date} • {shift.start_time} - {shift.end_time}</span>
                    </div>
                    <Badge variant="success">{language === 'ar' ? 'مجدول' : 'Scheduled'}</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Leave Balance Tab */}
            {drawerTab === 'leave' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="text-2xl font-black text-emerald-800">
                      {selectedEmployee.leave_balance.annual_days}
                    </span>
                    <span className="text-xs text-emerald-700 block mt-1 font-semibold">
                      {t.employees.drawer.annualLeave}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                    <span className="text-2xl font-black text-sky-800">
                      {selectedEmployee.leave_balance.sick_days}
                    </span>
                    <span className="text-xs text-sky-700 block mt-1 font-semibold">
                      {t.employees.drawer.sickLeave}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="text-2xl font-black text-amber-800">
                      {selectedEmployee.leave_balance.emergency_days}
                    </span>
                    <span className="text-xs text-amber-700 block mt-1 font-semibold">
                      {t.employees.drawer.emergencyLeave}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </PageContainer>
  );
};
