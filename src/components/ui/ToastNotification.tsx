import React from 'react';
import { CheckCircle2, Sparkles, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastNotification: React.FC = () => {
  const { toastMessage, showToast, direction } = useApp();

  if (!toastMessage) return null;

  const isAi =
    toastMessage.includes('الذكاء') ||
    toastMessage.includes('AI') ||
    toastMessage.includes('RestoraAI') ||
    toastMessage.includes('تنبؤ') ||
    toastMessage.includes('neural') ||
    toastMessage.includes('recalibration');

  const isWarning =
    toastMessage.includes('تحذير') ||
    toastMessage.includes('نفد') ||
    toastMessage.includes('رفض') ||
    toastMessage.includes('dismissed') ||
    toastMessage.includes('تعارض');

  const isInfo =
    toastMessage.includes('جاري') ||
    toastMessage.includes('Ingesting') ||
    toastMessage.includes('Exporting');

  return (
    <div
      dir={direction}
      className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none max-w-[92vw] sm:max-w-md w-full px-4"
    >
      <div
        className={`flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          isAi
            ? 'bg-[#120B24]/95 border-[#8B5CF6]/50 text-purple-100 shadow-purple-950/60 ring-1 ring-[#8B5CF6]/30'
            : isWarning
            ? 'bg-[#1C1210]/95 border-amber-600/40 text-amber-100 shadow-amber-950/50'
            : isInfo
            ? 'bg-[#081524]/95 border-[#4edee3]/40 text-cyan-100 shadow-cyan-950/50'
            : 'bg-[#08131F]/95 border-[#182F48] text-white shadow-slate-950/60'
        }`}
      >
        {/* Icon Pill */}
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
            isAi
              ? 'bg-[#8B5CF6]/25 text-[#C4B5FD] border border-[#8B5CF6]/40'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : isInfo
              ? 'bg-[#4edee3]/20 text-[#4edee3] border border-[#34abb1]/40'
              : 'bg-[#34abb1]/25 text-[#4edee3] border border-[#4edee3]/30'
          }`}
        >
          {isAi ? (
            <Sparkles className="w-4 h-4 animate-pulse" />
          ) : isWarning ? (
            <AlertTriangle className="w-4 h-4" />
          ) : isInfo ? (
            <Info className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold leading-relaxed tracking-wide">
            {toastMessage}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
            RestoraIntel Live Notification
          </span>
        </div>

        {/* Close Button */}
        <button
          onClick={() => showToast('')}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
