import React from 'react';

export interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'جاري المعالجة...',
  rows = 4,
}) => {
  return (
    <div className="w-full space-y-3 p-6 bg-white rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-5 h-5 border-2 border-[#34abb1] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-600">{message}</span>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4 space-s-4">
          <div className="rounded-full bg-slate-200 h-10 w-10 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-3 bg-slate-200 rounded w-3/4" />
            <div className="space-y-1">
              <div className="h-2 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
