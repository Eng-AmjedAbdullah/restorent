import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Direction,
  PageId,
  Restaurant,
  User,
  Employee,
  Attendance,
  LeaveRequest,
  Shift,
  MenuItem,
  Order,
  InventoryItem,
  AIRecommendation,
  AlertItem,
} from '../types';
import {
  mockRestaurants,
  currentUser,
  mockEmployees,
  mockAttendance,
  mockLeaveRequests,
  mockShifts,
  mockMenuItems,
  mockOrders,
  mockInventory,
  mockAIRecommendations,
  mockAlerts,
} from '../data/mockData';
import { translations } from '../locales/translations';

interface AppContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations['ar'];
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  selectedRestaurant: Restaurant;
  setSelectedRestaurant: (restaurant: Restaurant) => void;
  restaurants: Restaurant[];
  user: User;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Data states & actions
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  addEmployee: (emp: Partial<Employee>) => void;

  attendance: Attendance[];
  markAttendanceExcuse: (attendanceId: string, notes: string) => void;
  manualClockIn: (employeeId: string, time: string) => void;

  leaveRequests: LeaveRequest[];
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string, reason: string) => void;

  shifts: Shift[];
  acceptAIShift: (shiftId: string) => void;
  rejectAIShift: (shiftId: string) => void;

  menuItems: MenuItem[];
  toggleMenuItemAvailability: (id: string) => void;

  orders: Order[];
  advanceOrderStatus: (orderId: string) => void;

  inventory: InventoryItem[];
  adjustInventoryStock: (itemId: string, newStock: number) => void;

  alerts: AlertItem[];
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;

  aiRecommendations: AIRecommendation[];
  acceptAIRecommendation: (id: string) => void;
  rejectAIRecommendation: (id: string) => void;

  // Toast / notification banner
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [direction, setDirection] = useState<Direction>('rtl');
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant>(mockRestaurants[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Entities
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>(mockAIRecommendations);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';
    setDirection(dir);
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const t = translations[language];

  // Employee actions
  const addEmployee = (emp: Partial<Employee>) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employee_code: `RST-${Math.floor(100 + Math.random() * 900)}`,
      first_name: emp.first_name || { ar: 'جديد', en: 'New' },
      last_name: emp.last_name || { ar: 'موظف', en: 'Staff' },
      email: emp.email || 'staff@restoraintel.com',
      phone: emp.phone || '+966 50 000 0000',
      position_id: emp.position_id || 'pos-05',
      position: emp.position || mockEmployees[0].position,
      restaurant_id: selectedRestaurant.id,
      hire_date: new Date().toISOString().split('T')[0],
      contract_type: emp.contract_type || 'full_time',
      status: 'active',
      avatar_url: emp.avatar_url || '',
      skills: emp.skills || ['Food Safety', 'Customer Care'],
      leave_balance: { annual_days: 21, sick_days: 14, emergency_days: 5 },
      performance_score: 4.8,
      hourly_rate: emp.hourly_rate || 35,
      emergency_contact: emp.emergency_contact || { name: 'جهة اتصال', relationship: 'طوارئ', phone: '+966 50 111 2222' },
    };
    setEmployees(prev => [newEmp, ...prev]);
    showToast(language === 'ar' ? 'تمت إضافة الموظف بنجاح إلى قاعدة البيانات' : 'Employee successfully registered');
  };

  // Attendance actions
  const markAttendanceExcuse = (attendanceId: string, notes: string) => {
    setAttendance(prev =>
      prev.map(item =>
        item.id === attendanceId
          ? { ...item, status: 'excused', manager_notes: notes }
          : item
      )
    );
    showToast(language === 'ar' ? 'تم قبول العذر وتعديل السجل بنجاح' : 'Late arrival excused successfully');
  };

  const manualClockIn = (employeeId: string, time: string) => {
    const emp = employees.find(e => e.id === employeeId);
    const newRecord: Attendance = {
      id: `att-${Date.now()}`,
      employee_id: employeeId,
      employee: emp,
      restaurant_id: selectedRestaurant.id,
      date: new Date().toISOString().split('T')[0],
      scheduled_start: '08:00',
      scheduled_end: '16:30',
      actual_clock_in: time || '08:00',
      break_duration_minutes: 0,
      late_minutes: 0,
      overtime_minutes: 0,
      status: 'active_shift',
      device_source: 'manual_override',
      manager_override_by: currentUser.name[language],
    };
    setAttendance(prev => [newRecord, ...prev]);
    showToast(language === 'ar' ? 'تم تسجيل الحضور اليدوي بنجاح' : 'Manual clock-in registered');
  };

  // Leave actions
  const approveLeaveRequest = (id: string) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'approved',
              actioned_by: currentUser.name[language],
              actioned_at: new Date().toISOString(),
            }
          : req
      )
    );
    showToast(language === 'ar' ? 'تمت الموافقة على طلب الإجازة وتحديث الرصيد' : 'Leave request approved successfully');
  };

  const rejectLeaveRequest = (id: string, reason: string) => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === id
          ? {
              ...req,
              status: 'rejected',
              rejection_reason: reason,
              actioned_by: currentUser.name[language],
              actioned_at: new Date().toISOString(),
            }
          : req
      )
    );
    showToast(language === 'ar' ? 'تم رفض طلب الإجازة' : 'Leave request rejected');
  };

  // Shift actions
  const acceptAIShift = (shiftId: string) => {
    setShifts(prev =>
      prev.map(s =>
        s.id === shiftId
          ? { ...s, status: 'scheduled', color_code: '#059669', employee_id: 'emp-02', employee: mockEmployees[1] }
          : s
      )
    );
    showToast(language === 'ar' ? 'تم اعتماد الوردية المقترحة وجدولتها للموظف' : 'AI shift suggestion approved & rostered');
  };

  const rejectAIShift = (shiftId: string) => {
    setShifts(prev => prev.filter(s => s.id !== shiftId));
    showToast(language === 'ar' ? 'تم رفض مقترح الوردية' : 'AI shift suggestion discarded');
  };

  // Menu actions
  const toggleMenuItemAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.is_available;
          showToast(
            nextState
              ? (language === 'ar' ? `تم تفعيل توفر الصنف: ${item.name.ar}` : `Menu item made active: ${item.name.en}`)
              : (language === 'ar' ? `تم إيقاف الصنف مؤقتاً (86'd): ${item.name.ar}` : `Item 86'd (Unavailable): ${item.name.en}`)
          );
          return { ...item, is_available: nextState };
        }
        return item;
      })
    );
  };

  // Orders action
  const advanceOrderStatus = (orderId: string) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          let nextStatus: Order['status'] = 'preparing';
          if (order.status === 'new') nextStatus = 'preparing';
          else if (order.status === 'preparing') nextStatus = 'ready';
          else if (order.status === 'ready') nextStatus = 'delivered';
          else nextStatus = 'delivered';

          showToast(language === 'ar' ? `تم تحديث حالة الطلب ${order.order_number}` : `Order ${order.order_number} status updated`);
          return { ...order, status: nextStatus };
        }
        return order;
      })
    );
  };

  // Inventory adjustment
  const adjustInventoryStock = (itemId: string, newStock: number) => {
    setInventory(prev =>
      prev.map(inv => {
        if (inv.id === itemId) {
          const status =
            newStock <= 0
              ? 'out_of_stock'
              : newStock <= inv.reorder_point
              ? 'critical'
              : newStock < inv.par_level * 0.5
              ? 'low_stock'
              : 'in_stock';
          return { ...inv, current_stock: newStock, status };
        }
        return inv;
      })
    );
    showToast(language === 'ar' ? 'تم تسوية وتحديث رصيد المخزون' : 'Stock level adjusted successfully');
  };

  // Alerts actions
  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    showToast(language === 'ar' ? 'تم تحديد كافة التنبيهات كمقروءة' : 'All alerts marked as resolved');
  };

  // AI actions
  const acceptAIRecommendation = (id: string) => {
    setAIRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status: 'accepted' } : rec))
    );
    showToast(language === 'ar' ? 'تم قبول التوصية وتطبيق الإجراءات التشغيلية الذكية' : 'AI recommendation accepted & queued');
  };

  const rejectAIRecommendation = (id: string) => {
    setAIRecommendations(prev =>
      prev.map(rec => (rec.id === id ? { ...rec, status: 'rejected' } : rec))
    );
    showToast(language === 'ar' ? 'تم تجاهل توصية الذكاء الاصطناعي' : 'AI recommendation dismissed');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
        currentPage,
        setCurrentPage,
        selectedRestaurant,
        setSelectedRestaurant,
        restaurants: mockRestaurants,
        user: currentUser,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,

        employees,
        selectedEmployee,
        setSelectedEmployee,
        addEmployee,

        attendance,
        markAttendanceExcuse,
        manualClockIn,

        leaveRequests,
        approveLeaveRequest,
        rejectLeaveRequest,

        shifts,
        acceptAIShift,
        rejectAIShift,

        menuItems,
        toggleMenuItemAvailability,

        orders,
        advanceOrderStatus,

        inventory,
        adjustInventoryStock,

        alerts,
        markAlertAsRead,
        markAllAlertsAsRead,

        aiRecommendations,
        acceptAIRecommendation,
        rejectAIRecommendation,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
