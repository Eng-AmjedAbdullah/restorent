import React from 'react';
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
  X,
  Globe,
  LogIn,
  Store,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';

export const MobileNavigation: React.FC = () => {
  const {
    t,
    currentPage,
    setCurrentPage,
    mobileMenuOpen,
    setMobileMenuOpen,
    language,
    toggleLanguage,
    selectedRestaurant,
    alerts,
    leaveRequests,
  } = useApp();

  const unreadAlerts = alerts.filter(a => !a.read).length;
  const pendingLeaves = leaveRequests.filter(l => l.status === 'pending').length;

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: number | string; isAi?: boolean }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'employees', label: t.nav.employees, icon: <Users className="w-5 h-5" /> },
    { id: 'attendance', label: t.nav.attendance, icon: <Clock className="w-5 h-5" /> },
    { id: 'scheduling', label: t.nav.scheduling, icon: <Calendar className="w-5 h-5" /> },
    { id: 'leave-requests', label: t.nav.leaveRequests, icon: <FileText className="w-5 h-5" />, badge: pendingLeaves > 0 ? pendingLeaves : undefined },
    { id: 'menu', label: t.nav.menu, icon: <UtensilsCrossed className="w-5 h-5" /> },
    {
      id: 'orders',
      label: t.nav.orders,
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: language === 'ar' ? 'مباشر' : 'LIVE',
    },
    { id: 'inventory', label: t.nav.inventory, icon: <Boxes className="w-5 h-5" /> },
    { id: 'alerts', label: t.nav.alerts, icon: <BellRing className="w-5 h-5" />, badge: unreadAlerts > 0 ? unreadAlerts : undefined },
    { id: 'reports', label: t.nav.reports, icon: <BarChart3 className="w-5 h-5" /> },
    {
      id: 'ai-intelligence',
      label: t.nav.aiIntelligence,
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      isAi: true,
      badge: language === 'ar' ? 'ذكاء' : 'AI',
    },
    { id: 'login', label: t.nav.login, icon: <LogIn className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 start-0 max-w-xs w-full bg-[#08131F] text-white shadow-2xl flex flex-col z-50 border-e border-[#142334]">
            {/* Header */}
            <div className="p-4 border-b border-[#142334] flex items-center justify-between bg-[#0C1A2A]">
              <div className="flex items-center gap-3">
                <div className="shrink-0 flex items-center justify-center">
                  <img
                    src="/logo-mark.png"
                    alt="RestoraIntel"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/logo.png';
                    }}
                    className="w-9 h-9 object-contain drop-shadow-[0_2px_8px_rgba(78,222,227,0.3)]"
                  />
                </div>
                <div>
                  <h2 className="font-extrabold text-sm text-white tracking-tight">
                    Restora<span className="text-[#4edee3]">Intel</span>
                  </h2>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Store className="w-3 h-3 text-[#4edee3]" />
                    <span>{selectedRestaurant.name[language]}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#0E2033]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1 sidebar-scrollbar">
              {navItems.map(item => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? item.isAi
                          ? 'bg-gradient-to-r from-[#8B5CF6]/30 to-[#7C3AED]/20 text-[#DDD6FE] border border-[#8B5CF6]/40'
                          : 'bg-gradient-to-r from-[#2c777c]/35 to-[#34abb1]/25 text-white border border-[#4edee3]/40'
                        : item.isAi
                        ? 'text-purple-300 hover:bg-[#1E1535]'
                        : 'text-slate-300 hover:bg-[#0E2033] hover:text-white'
                    }`}
                  >
                    <span className={isActive ? (item.isAi ? 'text-[#C4B5FD]' : 'text-[#4edee3]') : ''}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-start">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          item.isAi
                            ? 'bg-purple-600 text-white'
                            : item.badge === 'LIVE'
                            ? 'bg-amber-400 text-slate-950 font-extrabold'
                            : 'bg-[#4edee3] text-[#08131F] font-bold'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-[#142334] bg-[#0C1A2A] space-y-2">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0E2033] hover:bg-[#132A44] border border-[#182F48] text-xs font-semibold text-slate-200 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#4edee3]" />
                <span>{language === 'ar' ? 'English (LTR)' : 'العربية (RTL)'}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage('branding-preview');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[10px] font-mono text-slate-500 hover:text-cyan-400 cursor-pointer"
              >
                <span>Dev: Brand Approval Gate (02R)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#08131F] border-t border-[#142334] z-30 px-3 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentPage === 'dashboard' ? 'text-[#4edee3] font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>{t.nav.dashboard}</span>
        </button>

        <button
          onClick={() => setCurrentPage('orders')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors relative ${
            currentPage === 'orders' ? 'text-[#4edee3] font-bold' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute top-1 end-2 w-2 h-2 rounded-full bg-amber-400" />
          <span>{t.nav.orders}</span>
        </button>

        <button
          onClick={() => setCurrentPage('employees')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentPage === 'employees' ? 'text-[#4edee3] font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>{t.nav.employees}</span>
        </button>

        <button
          onClick={() => setCurrentPage('ai-intelligence')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors ${
            currentPage === 'ai-intelligence' ? 'text-[#C4B5FD] font-bold' : 'text-purple-400'
          }`}
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>RestoraAI</span>
        </button>

        <button
          onClick={() => setCurrentPage('alerts')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-medium transition-colors relative ${
            currentPage === 'alerts' ? 'text-[#4edee3] font-bold' : 'text-slate-400'
          }`}
        >
          <BellRing className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute top-1 end-1.5 w-2 h-2 rounded-full bg-rose-500" />
          )}
          <span>{t.nav.alerts}</span>
        </button>
      </nav>
    </>
  );
};
