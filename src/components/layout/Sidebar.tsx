import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  FileText,
  UtensilsCrossed,
  ShoppingBag,
  Boxes,
  BellRing,
  BarChart3,
  Sparkles,
  Palette,
  ChevronLeft,
  ChevronRight,
  LogIn,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

interface TooltipState {
  id: string;
  top: number;
  label: string;
  badge?: number | string;
  isAi?: boolean;
}

export const Sidebar: React.FC = () => {
  const {
    t,
    currentPage,
    setCurrentPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    direction,
    language,
    selectedRestaurant,
    alerts,
    leaveRequests,
  } = useApp();

  const [tooltipData, setTooltipData] = useState<TooltipState | null>(null);

  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const navItems: {
    id: PageId;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    isAi?: boolean;
  }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { id: 'employees', label: t.nav.employees, icon: <Users className="w-[18px] h-[18px]" /> },
    { id: 'attendance', label: t.nav.attendance, icon: <Clock className="w-[18px] h-[18px]" /> },
    { id: 'scheduling', label: t.nav.scheduling, icon: <Calendar className="w-[18px] h-[18px]" /> },
    {
      id: 'leave-requests',
      label: t.nav.leaveRequests,
      icon: <FileText className="w-[18px] h-[18px]" />,
      badge: pendingLeaves > 0 ? pendingLeaves : undefined,
    },
    { id: 'menu', label: t.nav.menu, icon: <UtensilsCrossed className="w-[18px] h-[18px]" /> },
    {
      id: 'orders',
      label: t.nav.orders,
      icon: <ShoppingBag className="w-[18px] h-[18px]" />,
      badge: language === 'ar' ? 'مباشر' : 'LIVE',
    },
    { id: 'inventory', label: t.nav.inventory, icon: <Boxes className="w-[18px] h-[18px]" /> },
    {
      id: 'alerts',
      label: t.nav.alerts,
      icon: <BellRing className="w-[18px] h-[18px]" />,
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
    },
    { id: 'reports', label: t.nav.reports, icon: <BarChart3 className="w-[18px] h-[18px]" /> },
    {
      id: 'ai-intelligence',
      label: t.nav.aiIntelligence,
      icon: <Sparkles className="w-[18px] h-[18px]" />,
      isAi: true,
      badge: language === 'ar' ? 'ذكاء' : 'AI',
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#060E17] text-slate-200 border-e border-[#122030] transition-all duration-300 z-30 shrink-0 select-none h-full ${
        sidebarCollapsed ? 'w-[74px]' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-16 flex items-center border-b border-[#122030] shrink-0 ${
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <div
          onClick={() => setCurrentPage('dashboard')}
          className={`flex items-center gap-3 cursor-pointer overflow-hidden min-w-0 ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          title="RestoraIntel Dashboard"
        >
          {/* Logo Mark - Direct, transparent, no container or border */}
          <div className="relative shrink-0 flex items-center justify-center">
            <img
              src="/logo-mark.png"
              alt="RestoraIntel"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logo.png';
              }}
              className="w-9 h-9 object-contain drop-shadow-[0_2px_10px_rgba(78,222,227,0.35)] transition-transform duration-200 hover:scale-105"
            />
            <span className="absolute -bottom-0.5 -end-0.5 w-2 h-2 rounded-full bg-[#4edee3] ring-2 ring-[#060E17]" />
          </div>

          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white truncate">
                  Restora<span className="text-[#4edee3]">Intel</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#4edee3]/15 text-[#4edee3] border border-[#34abb1]/40 uppercase font-mono">
                  v4.2
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {language === 'ar' ? 'الذكاء التشغيلي للمطاعم' : 'Restaurant Intelligence'}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Button when expanded */}
        {!sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(true)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#0E2033] transition-colors cursor-pointer shrink-0"
            title={language === 'ar' ? 'طي القائمة الجانبية' : 'Collapse Sidebar'}
            aria-label="Collapse Sidebar"
          >
            {direction === 'rtl' ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Branch Context Pill (Expanded Only) */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="px-3 py-2.5 rounded-xl bg-[#0A1726] border border-[#162C44] flex items-center gap-2.5 text-xs text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-[#4edee3]/15 text-[#4edee3] flex items-center justify-center shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="truncate min-w-0 flex-1">
              <p className="font-semibold text-white truncate text-[11px] leading-tight">
                {selectedRestaurant.name[language]}
              </p>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="text-[#4edee3] font-bold">{selectedRestaurant.code}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">
                  {language === 'ar' ? '🟢 مباشر' : '🟢 Active'}
                </span>
                <span>•</span>
                <span>{selectedRestaurant.active_tables_count} {language === 'ar' ? 'طاولة' : 'tables'}</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links with custom scrollbar */}
      <div className={`flex-1 overflow-y-auto py-3 space-y-1 sidebar-scrollbar min-h-0 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          const isAiItem = !!item.isAi;

          if (sidebarCollapsed) {
            // Collapsed Mode: Centered icon button with mathematically placed fixed tooltip
            return (
              <div key={item.id} className="relative flex justify-center py-0.5">
                <button
                  onClick={() => setCurrentPage(item.id)}
                  aria-label={item.label}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipData({
                      id: item.id,
                      top: rect.top + rect.height / 2,
                      label: item.label,
                      badge: item.badge,
                      isAi: isAiItem,
                    });
                  }}
                  onMouseLeave={() => setTooltipData(null)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                    isActive
                      ? isAiItem
                        ? 'bg-[#8B5CF6]/25 text-[#DDD6FE] ring-1 ring-[#8B5CF6]/70 shadow-lg shadow-purple-950/50'
                        : 'bg-[#34abb1]/20 text-[#4edee3] ring-1 ring-[#4edee3]/50 shadow-lg shadow-[#2c777c]/30'
                      : isAiItem
                      ? 'text-purple-300 hover:bg-[#1A102E] hover:text-purple-100'
                      : 'text-slate-400 hover:bg-[#0B192A] hover:text-slate-100'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>

                  {/* Dot indicator for badges in collapsed mode */}
                  {item.badge && (
                    <span
                      className={`absolute top-1.5 end-1.5 w-2 h-2 rounded-full ring-2 ring-[#060E17] ${
                        isAiItem
                          ? 'bg-purple-400 animate-pulse'
                          : item.badge === 'LIVE'
                          ? 'bg-amber-400 animate-ping'
                          : 'bg-rose-500'
                      }`}
                    />
                  )}
                </button>
              </div>
            );
          }

          // Expanded Mode: Full horizontal row with leading active edge
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer select-none border ${
                isActive
                  ? isAiItem
                    ? 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#7C3AED]/15 text-white border-[#8B5CF6]/50 border-s-[3px] border-s-[#8B5CF6] shadow-sm shadow-purple-950/30 font-semibold'
                    : 'bg-gradient-to-r from-[#2c777c]/35 to-[#34abb1]/20 text-white border-[#4edee3]/40 border-s-[3px] border-s-[#4edee3] shadow-sm shadow-[#2c777c]/20 font-semibold'
                  : isAiItem
                  ? 'text-purple-300 hover:bg-[#160E28] hover:text-purple-100 border-transparent'
                  : 'text-slate-300 hover:bg-[#0A1726] hover:text-white border-transparent'
              }`}
            >
              <span className={`shrink-0 ${isActive ? (isAiItem ? 'text-[#C4B5FD]' : 'text-[#4edee3]') : ''}`}>
                {item.icon}
              </span>
              <span className="truncate flex-1 text-start leading-none font-medium">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none font-mono ${
                    isAiItem
                      ? 'bg-purple-600 text-white shadow-xs'
                      : item.badge === 'LIVE'
                      ? 'bg-amber-400 text-slate-950 font-black animate-pulse'
                      : isActive
                      ? 'bg-[#4edee3] text-[#060E17] font-bold'
                      : 'bg-[#102338] text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Floating Tooltip in Collapsed Mode (Fixed positioning prevents clipping) */}
      {sidebarCollapsed && tooltipData && (
        <div
          className="fixed z-50 px-3 py-1.5 rounded-xl bg-[#081524] border border-[#1C3652] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 pointer-events-none whitespace-nowrap -translate-y-1/2 animate-in fade-in duration-150"
          style={{
            top: tooltipData.top,
            [direction === 'rtl' ? 'right' : 'left']: '82px',
          }}
        >
          <span>{tooltipData.label}</span>
          {tooltipData.badge && (
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                tooltipData.isAi
                  ? 'bg-purple-700 text-purple-100'
                  : tooltipData.badge === 'LIVE'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {tooltipData.badge}
            </span>
          )}
        </div>
      )}

      {/* Footer Section with Expand Toggle in Collapsed Mode */}
      <div className={`p-2.5 border-t border-[#122030] shrink-0 space-y-1 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
        {sidebarCollapsed ? (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="w-10 h-10 rounded-xl bg-[#0A1726] border border-[#162D46] hover:border-[#4edee3]/60 hover:bg-[#0E2034] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-xs"
            title={language === 'ar' ? 'توسيع القائمة الجانبية' : 'Expand Sidebar'}
            aria-label="Expand Sidebar"
          >
            {direction === 'rtl' ? (
              <ChevronLeft className="w-4 h-4 text-[#4edee3]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#4edee3]" />
            )}
          </button>
        ) : (
          <>
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-[#0A1726] transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{t.nav.login} / {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
            <button
              onClick={() => setCurrentPage('branding-preview')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                currentPage === 'branding-preview'
                  ? 'bg-[#0E2338] text-[#4edee3] border border-[#1d4a63]'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-[#0A1726]'
              }`}
              title="Development-only brand assets review & approval gate"
            >
              <span className="flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400/70" />
                <span>Dev: Brand Approval</span>
              </span>
              <span className="text-[9px] bg-slate-800 text-cyan-400 px-1 py-0.2 rounded font-mono">02R</span>
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
