import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  User,
  Check,
  X,
  FileCheck,
  Send,
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
import { LeaveRequest } from '../types';

export const LeaveRequestsPage: React.FC = () => {
  const {
    t,
    language,
    leaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest,
    showToast,
  } = useApp();

  const [rejectDialogId, setRejectDialogId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const pendingCount = leaveRequests.filter(l => l.status === 'pending').length;
  const approvedCount = leaveRequests.filter(l => l.status === 'approved').length;
  const rejectedCount = leaveRequests.filter(l => l.status === 'rejected').length;

  const filteredRequests = leaveRequests.filter(req => {
    if (activeFilter === 'all') return true;
    return req.status === activeFilter;
  });

  const handleRejectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectDialogId) {
      rejectLeaveRequest(rejectDialogId, rejectReason || 'تعارض في الجدولة ونقص في التغطية');
      showToast(
        language === 'ar'
          ? 'تم رفض طلب الإجازة وإشعار الموظف بالسبب الإداري'
          : 'Leave request rejected and employee notified'
      );
      setRejectDialogId(null);
      setRejectReason('');
    }
  };

  const getLeaveTypeLabel = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'annual':
        return language === 'ar' ? 'إجازة سنوية' : 'Annual Leave';
      case 'sick':
        return language === 'ar' ? 'إجازة مرضية' : 'Sick Leave';
      case 'emergency':
        return language === 'ar' ? 'إجازة طارئة' : 'Emergency Leave';
      case 'unpaid':
        return language === 'ar' ? 'إجازة بدون راتب' : 'Unpaid Leave';
      default:
        return type;
    }
  };

  return (
    <PageContainer
      title={t.leave.title}
      subtitle={t.leave.subtitle}
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="ai" size="md">
            {language === 'ar' ? 'مقيّم تعارضات الذكاء الاصطناعي نشط' : 'AI Conflict Evaluator Active'}
          </Badge>
        </div>
      }
    >
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-amber-200/70 bg-amber-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-800 font-semibold">{t.leave.pendingApprovals}</p>
              <h3 className="text-2xl font-black text-amber-950 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#34abb1]/40 bg-[#4edee3]/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#2c777c] font-semibold">{t.leave.approvedThisMonth}</p>
              <h3 className="text-2xl font-black text-[#2c777c] mt-1">{approvedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#34abb1]/15 flex items-center justify-center text-[#2c777c]">
              <CheckCircle2 className="w-5 h-5 text-[#34abb1]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600 font-semibold">{t.leave.rejectedCount}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{rejectedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-600">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {t.common.all} ({leaveRequests.length})
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {language === 'ar' ? 'قيد الانتظار' : 'Pending'} ({pendingCount})
        </button>
        <button
          onClick={() => setActiveFilter('approved')}
          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
            activeFilter === 'approved' ? 'bg-[#34abb1] text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {language === 'ar' ? 'معتمدة' : 'Approved'} ({approvedCount})
        </button>
      </div>

      {/* Requests Queue */}
      <div className="space-y-3">
        {filteredRequests.map(req => {
          const emp = req.employee;
          return (
            <Card key={req.id} className="p-5 hover:border-slate-300">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Employee info & request details */}
                <div className="flex items-start gap-3.5">
                  <Avatar src={emp?.avatar_url} name={emp?.first_name[language] || 'U'} size="lg" />
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">
                        {emp?.first_name[language]} {emp?.last_name[language]}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">({req.request_number})</span>
                      <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                        {getLeaveTypeLabel(req.type)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      {req.reason[language]}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {req.start_date} ← {req.end_date}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-800">
                        {req.total_days} {language === 'ar' ? 'أيام' : 'days'}
                      </span>
                      {emp && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">
                            {language === 'ar'
                              ? `الرصيد المتبقي: ${emp.leave_balance.annual_days} يوم`
                              : `Remaining balance: ${emp.leave_balance.annual_days} days`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Conflict Evaluation & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                  {req.status === 'pending' ? (
                    <>
                      <div className="text-end sm:text-start p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs">
                        <span className="font-bold text-purple-900 block text-[11px]">
                          {language === 'ar' ? 'تقييم الذكاء الاصطناعي:' : 'AI Evaluation:'}
                        </span>
                        <span className="text-purple-700 text-[10px]">
                          {language === 'ar'
                            ? 'تأثير خفيف على طاقم المطبخ (مخاطر 12%)'
                            : 'Low impact on kitchen line (12% risk)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRejectDialogId(req.id)}
                          icon={<X className="w-3.5 h-3.5" />}
                          className="text-rose-700 hover:bg-rose-50 hover:border-rose-300"
                        >
                          {t.common.reject}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            approveLeaveRequest(req.id);
                            showToast(
                              language === 'ar'
                                ? `تم اعتماد إجازة ${emp?.first_name.ar || 'الموظف'} وتحديث الوردية بنجاح`
                                : `Approved leave for ${emp?.first_name.en || 'staff'}`
                            );
                          }}
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          {t.common.approve}
                        </Button>
                      </div>
                    </>
                  ) : req.status === 'approved' ? (
                    <div className="text-end">
                      <Badge variant="success" size="md">
                        {language === 'ar'
                          ? `معتمد بواسطة ${req.actioned_by || 'المشرف'}`
                          : `Approved by ${req.actioned_by || 'Manager'}`}
                      </Badge>
                      <p className="text-[10px] text-slate-400 mt-1">{req.actioned_at?.split('T')[0]}</p>
                    </div>
                  ) : (
                    <div className="text-end">
                      <Badge variant="error" size="md">
                        {language === 'ar' ? 'تم الرفض' : 'Rejected'}
                      </Badge>
                      {req.rejection_reason && (
                        <p className="text-[10px] text-slate-500 mt-1">{req.rejection_reason}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* REJECT MODAL */}
      <Dialog
        isOpen={!!rejectDialogId}
        onClose={() => setRejectDialogId(null)}
        title={language === 'ar' ? 'رفض طلب الإجازة' : 'Reject Leave Request'}
        description={
          language === 'ar'
            ? 'يرجى توضيح سبب الرفض ليتم إشعار الموظف به في حسابه'
            : 'Please specify the reason for rejection to notify the employee'
        }
        maxWidth="md"
      >
        <form onSubmit={handleRejectConfirm} className="space-y-4">
          <Input
            label={language === 'ar' ? 'سبب الرفض الإداري' : 'Administrative Rejection Reason'}
            placeholder={
              language === 'ar'
                ? 'مثال: نقص في تغطية الطهاة خلال عطلة نهاية الأسبوع'
                : 'e.g. Insufficient chef line coverage for weekend rush'
            }
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            required
          />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectDialogId(null)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" variant="danger" size="sm">
              {language === 'ar' ? 'تأكيد الرفض' : 'Confirm Rejection'}
            </Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
