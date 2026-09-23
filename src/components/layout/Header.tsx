import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Globe,
  Store,
  ChevronDown,
  Sparkles,
  CheckCheck,
  Building2,
  Check,
  User,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageId } from '../../types';
import { Avatar } from '../ui/Avatar';
import { translateTimestamp } from '../../utils/localization';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    t,
    currentPage,
    user,
    restaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    alerts,
    markAlertAsRead,
    markAllAlertsAsRead,
    setMobileMenuOpen,
    setCurrentPage,
    showToast,
  } = useApp();

  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setBranchDropdownOpen(false);
        setNotificationsOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadAlerts = alerts.filter(a => !a.read);

  // Map currentPage to localized title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return t.nav.dashboard;
      case 'employees':
        return t.nav.employees;
      case 'attendance':
        return t.nav.attendance;
      case 'scheduling':
        return t.nav.scheduling;
      case 'leave-requests':
        return t.nav.leaveRequests;
      case 'menu':
        return t.nav.menu;
      case 'orders':
        return t.nav.orders;
      case 'inventory':
        return t.nav.inventory;
      case 'alerts':
        return t.nav.alerts;
      case 'reports':
        return t.nav.reports;
      case 'ai-intelligence':
        return t.nav.aiIntelligence;
      case 'branding-preview':
        return language === 'ar' ? 'مراجعة واعتماد أصول الهوية الرقمية' : 'Brand Asset Review (Approval Gate)';
      case 'login':
        return t.nav.login;
      default:
        return 'RestoraIntel';
    }
  };

  return (
    <header
      ref={headerRef}
      className="h-16 bg-[#060E17] border-b border-[#122030] px-4 md:px-6 flex items-center justify-between z-20 shrink-0 select-none text-white shadow-md shadow-black/20"
    >
      {/* Start: Mobile Toggle & Breadcrumb / Location Badge */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0E2033] cursor-pointer transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Brand Icon on mobile */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <img
            src="/logo-mark.png"
            alt="RestoraIntel"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo.png';
            }}
            className="w-8 h-8 object-contain drop-shadow-[0_2px_8px_rgba(78,222,227,0.3)]"
          />
        </div>

        {/* Breadcrumb Area with Wadi Al-Dawasir indicator */}
        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold truncate">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0C1A2B] border border-[#162C42] text-[11px] font-mono text-[#4edee3]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edee3] animate-pulse" />
            <span>{selectedRestaurant.code}</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">/</span>

          <h1 className="text-white font-bold tracking-tight text-sm sm:text-base truncate">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* End: Controls, Branch Switcher, AI Status, Notifications, Language, Manager Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
        {/* RestoraAI Pulse Status Pill */}
        <button
          onClick={() => {
            setCurrentPage('ai-intelligence');
            showToast(
              language === 'ar'
                ? 'تم الانتقال لمركز الذكاء الاصطناعي - مصفوفة وادي الدواسر نشطة'
                : 'Switched to RestoraAI Intelligence Core - Wadi Al-Dawasir Matrix active'
            );
          }}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#140C24] border border-[#8B5CF6]/40 text-[#DDD6FE] text-xs font-semibold cursor-pointer hover:bg-[#1E1335] hover:border-[#8B5CF6]/70 transition-all shadow-xs"
          title="RestoraAI Neural Engine Active & Synchronized"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A78BFA]" />
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#C4B5FD]" />
          <span className="tracking-wide">RestoraAI Live</span>
        </button>

        {/* Branch Context Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setBranchDropdownOpen(!branchDropdownOpen);
              setNotificationsOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#162D46] bg-[#0A1726] hover:bg-[#0E2034] hover:border-[#4edee3]/50 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
            aria-label="Select Restaurant Branch"
          >
            <div className="w-5 h-5 rounded-lg bg-[#4edee3]/15 text-[#4edee3] flex items-center justify-center shrink-0">
              <Store className="w-3 h-3" />
            </div>
            <span className="hidden sm:inline max-w-[130px] md:max-w-[160px] truncate text-slate-100">
              {selectedRestaurant.name[language]}
            </span>
            <span className="sm:hidden font-mono text-[11px] text-[#4edee3] font-bold">
              {selectedRestaurant.code}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {branchDropdownOpen && (
            <div className="absolute end-0 mt-2 w-80 rounded-2xl bg-[#060E17] border border-[#182F48] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 text-slate-200">
              <div className="px-4 py-2 border-b border-[#122030] text-[10px] font-bold text-[#4edee3] uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'ar' ? 'فروع السلسلة المتاحة' : 'Active Chain Branches'}</span>
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <div className="max-h-72 overflow-y-auto py-1 divide-y divide-[#122030]/60">
                {restaurants.map(rest => {
                  const isSelected = rest.id === selectedRestaurant.id;
                  return (
                    <button
                      key={rest.id}
                      onClick={() => {
                        setSelectedRestaurant(rest);
                        setBranchDropdownOpen(false);
                        showToast(
                          language === 'ar'
                            ? `تم تبديل سياق العمليات إلى: ${rest.name.ar}`
                            : `Switched operational context to: ${rest.name.en}`
                        );
                      }}
                      className={`w-full text-start px-4 py-3 flex items-start gap-3 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#0B1E33] text-white font-bold border-s-2 border-[#4edee3]'
                          : 'text-slate-300 hover:bg-[#0A1726] hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          isSelected ? 'bg-[#4edee3] ring-2 ring-[#4edee3]/30' : 'bg-slate-600'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="truncate text-xs font-semibold text-white">{rest.name[language]}</p>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#4edee3] shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                          <span className="text-[#4edee3] font-bold">{rest.code}</span>
                          <span>•</span>
                          <span>{rest.city[language]}</span>
                          <span>•</span>
                          <span>{rest.active_tables_count} {language === 'ar' ? 'طاولة' : 'tables'}</span>
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher Button (Instant LTR / RTL) */}
        <button
          onClick={() => {
            toggleLanguage();
            showToast(
              language === 'ar'
                ? 'Switched language to English (LTR layout)'
                : 'تم التحويل إلى اللغة العربية (تنسيق RTL)'
            );
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#162D46] bg-[#0A1726] hover:bg-[#0E2034] hover:border-[#4edee3]/50 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
          title={language === 'ar' ? 'Switch to English (LTR)' : 'التحويل للعربية (RTL)'}
          aria-label="Toggle language"
        >
          <Globe className="w-3.5 h-3.5 text-[#4edee3]" />
          <span className="font-mono text-[11px] font-bold">
            {language === 'ar' ? 'EN' : 'عربي'}
          </span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setBranchDropdownOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0E2033] border border-transparent hover:border-[#162D46] transition-all cursor-pointer"
            aria-label="Incident Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#060E17]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#060E17] border border-[#182F48] shadow-2xl z-50 overflow-hidden animate-in fade-in text-white">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#122030] bg-[#0A1726] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{t.common.notifications}</span>
                  {unreadAlerts.length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      {unreadAlerts.length} {language === 'ar' ? 'جديد' : 'New'}
                    </span>
                  )}
                </div>
                {unreadAlerts.length > 0 && (
                  <button
                    onClick={markAllAlertsAsRead}
                    className="text-[11px] text-[#4edee3] hover:text-[#34abb1] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{t.alerts.markAllRead}</span>
                  </button>
                )}
              </div>

              {/* Alert Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-[#122030]">
                {alerts.slice(0, 5).map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      markAlertAsRead(alert.id);
                      if (alert.action_link) {
                        setCurrentPage(alert.action_link as PageId);
                        setNotificationsOpen(false);
                      }
                    }}
                    className={`p-3.5 text-start hover:bg-[#0C1A2B] cursor-pointer transition-colors ${
                      !alert.read ? 'bg-[#081524]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase font-mono ${
                          alert.type === 'critical'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                            : alert.type === 'ai'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {alert.type === 'critical'
                          ? language === 'ar' ? 'حرج' : 'CRITICAL'
                          : alert.type === 'ai'
                          ? language === 'ar' ? 'ذكاء اصطناعي' : 'AI SIGNAL'
                          : language === 'ar' ? 'تشغيلي' : 'OPERATIONAL'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {translateTimestamp(alert.timestamp, language)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-100 leading-tight">
                      {alert.title[language]}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {alert.message[language]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-2.5 border-t border-[#122030] bg-[#0A1726] text-center">
                <button
                  onClick={() => {
                    setCurrentPage('alerts');
                    setNotificationsOpen(false);
                  }}
                  className="text-xs text-[#4edee3] hover:text-[#34abb1] font-semibold cursor-pointer"
                >
                  {language === 'ar' ? 'عرض كافة التنبيهات والأحداث' : 'View All Incident Logs'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manager Profile Menu */}
        <div className="relative ps-1 border-s border-[#122030]">
          <button
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setNotificationsOpen(false);
              setBranchDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#0E2033] border border-transparent hover:border-[#162D46] transition-all cursor-pointer"
            aria-label="User Account Menu"
          >
            <Avatar src={user.avatar_url} name={user.name[language]} size="sm" status="online" />
            <div className="hidden xl:flex flex-col text-start leading-tight">
              <span className="text-xs font-bold text-slate-100">{user.name[language]}</span>
              <span className="text-[10px] text-[#4edee3] flex items-center gap-1 font-medium mt-0.5">
                <ShieldCheck className="w-2.5 h-2.5" />
                {t.common.userRole}
              </span>
            </div>
            <ChevronDown className="hidden xl:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute end-0 mt-2 w-64 rounded-2xl bg-[#060E17] border border-[#182F48] shadow-2xl py-2 z-50 animate-in fade-in text-white">
              <div className="px-4 py-3 border-b border-[#122030] bg-[#0A1726]/60 flex items-center gap-3">
                <Avatar src={user.avatar_url} name={user.name[language]} size="md" status="online" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{user.name[language]}</p>
                  <p className="text-[11px] text-slate-400 truncate font-mono mt-0.5">{user.email}</p>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#4edee3]/15 border border-[#34abb1]/40 text-[#4edee3] text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edee3]" />
                    <span>{t.common.userRole}</span>
                  </div>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentPage('dashboard');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-start px-4 py-2.5 text-xs text-slate-300 hover:bg-[#0C1A2B] hover:text-white flex items-center gap-2.5 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#4edee3]" />
                  <span>{language === 'ar' ? 'فرع وادي الدواسر الرئيسي' : 'Wadi Al-Dawasir Flagship'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentPage('login');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-start px-4 py-2.5 text-xs text-slate-300 hover:bg-[#0C1A2B] hover:text-white flex items-center gap-2.5 cursor-pointer border-t border-[#122030]"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{t.nav.login} / {language === 'ar' ? 'تبديل الحساب' : 'Switch Role'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
