import React, { useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Order } from '../types';
import { translateServerName, translateTableName, translateOrderNote } from '../utils/localization';

export const OrdersPage: React.FC = () => {
  const {
    t,
    language,
    direction,
    orders,
    advanceOrderStatus,
    showToast,
  } = useApp();

  type OrderStatusType = Order['status'];

  const columns: { status: OrderStatusType; label: string; icon: React.ReactNode; color: string }[] = [
    {
      status: 'new',
      label: t.orders.new,
      icon: <Bell className="w-4 h-4 text-sky-600" />,
      color: 'border-sky-300 bg-sky-50/20',
    },
    {
      status: 'preparing',
      label: t.orders.preparing,
      icon: <Flame className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50/20',
    },
    {
      status: 'ready',
      label: t.orders.ready,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-300 bg-emerald-50/20',
    },
    {
      status: 'delivered',
      label: t.orders.delivered,
      icon: <ShoppingBag className="w-4 h-4 text-slate-500" />,
      color: 'border-slate-300 bg-slate-50/20',
    },
  ];

  const getNextStatusButtonLabel = (curr: OrderStatusType) => {
    switch (curr) {
      case 'new':
        return t.orders.markPreparing;
      case 'preparing':
        return t.orders.markReady;
      case 'ready':
        return t.orders.markDelivered;
      default:
        return '';
    }
  };

  return (
    <PageContainer
      title={t.orders.title}
      subtitle={t.orders.subtitle}
      badge={
        <Badge variant="info" size="sm" dot>
          {language === 'ar' ? 'مزامنة شاشات المطبخ الفورية' : 'KDS Real-Time Synchronizer'}
        </Badge>
      }
    >
      {/* 4-Column KDS Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map(col => {
          const colOrders = orders.filter(o => o.status === col.status);
          return (
            <div key={col.status} className="space-y-3">
              {/* Column Header */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  {col.icon}
                  <span className="font-bold text-xs text-slate-900">{col.label}</span>
                </div>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {colOrders.length}
                </span>
              </div>

              {/* Tickets Stack */}
              <div className="space-y-3 min-h-[300px]">
                {colOrders.map(order => {
                  const hasNext = order.status !== 'delivered' && order.status !== 'cancelled';
                  const isDelayed = order.elapsed_minutes > 15 && order.status !== 'delivered';

                  return (
                    <Card
                      key={order.id}
                      className={`transition-all shadow-xs ${
                        isDelayed ? 'border-rose-400 bg-rose-50/20' : 'hover:border-slate-300'
                      }`}
                    >
                      {/* Ticket Header */}
                      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-black text-sm text-slate-900 block">
                            #{order.order_number}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {translateTableName(order.table_number, language) ||
                              (order.order_type === 'takeaway'
                                ? language === 'ar' ? 'طلب خارجي' : 'Takeaway'
                                : order.order_type === 'delivery'
                                ? language === 'ar' ? 'توصيل' : 'Delivery'
                                : order.order_type)}{' '}
                            • {translateServerName(order.server_name, language)}
                          </span>
                        </div>

                        {/* Elapsed Timer */}
                        <div
                          className={`flex items-center gap-1 text-xs font-mono font-bold px-2 py-1 rounded-lg ${
                            isDelayed
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{order.elapsed_minutes}m</span>
                        </div>
                      </div>

                      {/* Items List */}
                      <CardContent className="p-3.5 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#2c777c] font-mono">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-slate-800">
                                {item.name[language]}
                              </span>
                            </div>
                            {item.notes && (
                              <span className="text-[10px] text-amber-700 font-mono bg-amber-50 px-1 rounded">
                                {translateOrderNote(item.notes, language)}
                              </span>
                            )}
                          </div>
                        ))}
                      </CardContent>

                      {/* Ticket Footer Action */}
                      {hasNext && (
                        <CardFooter className="p-2.5 bg-slate-50 border-t border-slate-100">
                          <Button
                            variant={order.status === 'ready' ? 'primary' : 'outline'}
                            size="sm"
                            className="w-full text-xs font-bold"
                            onClick={() => {
                              advanceOrderStatus(order.id);
                              showToast(
                                language === 'ar'
                                  ? `تم تحديث الطلب #${order.order_number} (${getNextStatusButtonLabel(order.status)})`
                                  : `Advanced order #${order.order_number} to next KDS stage`
                              );
                            }}
                            icon={direction === 'rtl' ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                            iconPosition="end"
                          >
                            {getNextStatusButtonLabel(order.status)}
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  );
                })}

                {colOrders.length === 0 && (
                  <div className="h-32 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
                    {language === 'ar' ? 'لا توجد تذاكر في هذه المرحلة' : 'No tickets in this stage'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
};
