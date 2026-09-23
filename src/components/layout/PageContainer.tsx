import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export interface PageContainerProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  badge,
  actions,
  children,
}) => {
  const { toastMessage } = useApp();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/60 pb-16 md:pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 start-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-700 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#4edee3] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header Banner */}
      <div className="bg-white border-b border-slate-200/70 px-4 md:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h1>
              {badge && <div>{badge}</div>}
            </div>
            {subtitle && (
              <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="flex items-center gap-2.5 flex-wrap">{actions}</div>}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {children}
      </main>
    </div>
  );
};
