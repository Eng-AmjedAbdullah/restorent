import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { ToastNotification } from './components/ui/ToastNotification';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { AttendancePage } from './pages/AttendancePage';
import { LeaveRequestsPage } from './pages/LeaveRequestsPage';
import { SchedulingPage } from './pages/SchedulingPage';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AIIntelligencePage } from './pages/AIIntelligencePage';
import { BrandingPreviewPage } from './pages/BrandingPreviewPage';

const MainLayout: React.FC = () => {
  const { currentPage, direction } = useApp();

  // Handle standalone login view
  if (currentPage === 'login') {
    return <LoginPage />;
  }

  // Dynamic page router
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'employees':
        return <EmployeesPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'leave-requests':
        return <LeaveRequestsPage />;
      case 'scheduling':
        return <SchedulingPage />;
      case 'menu':
        return <MenuPage />;
      case 'orders':
        return <OrdersPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'ai-intelligence':
        return <AIIntelligencePage />;
      case 'branding-preview':
        return <BrandingPreviewPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100/70 antialiased selection:bg-[#34abb1] selection:text-white" dir={direction}>
      {/* Desktop Collapsible Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area with Header & Scrollable Body */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto min-w-0">
          {renderCurrentPage()}
        </div>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNavigation />

      {/* Global Interactive Toast Notification */}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
