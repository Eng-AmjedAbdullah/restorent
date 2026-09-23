import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  CheckCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { translateTimestamp } from '../utils/localization';

export const AlertsPage: React.FC = () => {
  const {
    t,
    language,
    direction,
    alerts,
    markAlertAsRead,
    markAllAlertsAsRead,
    setCurrentPage,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'operational' | 'ai'>('all');

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const aiCount = alerts.filter(a => a.type === 'ai').length;

  const filteredAlerts = alerts.filter(a => {
    if (activeFilter === 'all') return true;
    return a.type === activeFilter;
  });

  return (
    <PageContainer
      title={t.alerts.title}
      subtitle={t.alerts.subtitle}
      actions={
        unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              markAllAlertsAsRead();
              showToast(
                language === 'ar'
                  ? 'تم تحديد كافة الإشعارات كمقروءة وتحديث سجل العمليات'
                  : 'All operational alerts marked as read'
              );
            }}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            {t.alerts.markAllRead}
          </Button>
        ) : undefined
      }
    >
      {/* Top Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveFilter('all')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {t.common.all} ({alerts.length})
        </button>

        <button
          onClick={() => setActiveFilter('critical')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            activeFilter === 'critical'
              ? 'bg-rose-600 text-white'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          {t.alerts.filterCritical} ({criticalCount})
        </button>

        <button
          onClick={() => setActiveFilter('operational')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            activeFilter === 'operational'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          {t.alerts.filterOperational}
        </button>

        <button
          onClick={() => setActiveFilter('ai')}
          className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
            activeFilter === 'ai'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
          }`}
        >
          {t.alerts.filterAI} ({aiCount})
        </button>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <Card
            key={alert.id}
            className={`p-5 transition-all ${
              !alert.read
                ? 'border-slate-300 bg-white ring-1 ring-[#4edee3]/30 shadow-xs'
                : 'bg-slate-50/60 border-slate-200/70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    alert.type === 'critical'
                      ? 'bg-rose-100 text-rose-700'
                      : alert.type === 'ai'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {alert.type === 'ai' ? (
                    <Sparkles className="w-5 h-5" />
                  ) : alert.type === 'critical' ? (
                    <ShieldAlert className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">
                      {alert.title[language]}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        alert.type === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.type === 'ai'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.type === 'critical'
                        ? (language === 'ar' ? 'حرج' : 'CRITICAL')
                        : alert.type === 'ai'
                        ? (language === 'ar' ? 'ذكاء اصطناعي' : 'AI')
                        : (language === 'ar' ? 'تشغيلي' : 'OPERATIONAL')}
                    </span>
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-[#4edee3] animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-2xl">
                    {alert.message[language]}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-2 font-mono">
                    {translateTimestamp(alert.timestamp, language)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!alert.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      markAlertAsRead(alert.id);
                      showToast(
                        language === 'ar' ? 'تم تحديد الإشعار كمقروء' : 'Alert marked as read'
                      );
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    {language === 'ar' ? 'تحديد كمقروء' : 'Mark as Read'}
                  </Button>
                )}

                {alert.action_link && (
                  <Button
                    variant={alert.type === 'ai' ? 'ai' : 'outline'}
                    size="sm"
                    onClick={() => {
                      markAlertAsRead(alert.id);
                      setCurrentPage(alert.action_link as any);
                    }}
                    icon={direction === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    iconPosition="end"
                  >
                    {language === 'ar' ? 'معالجة الإشعار' : 'Take Action'}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
