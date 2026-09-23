import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'ai' | 'bordered' | 'flat' | 'dark';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const base = 'rounded-2xl transition-all duration-200';

  const variants = {
    default: 'bg-white border border-slate-200/90 shadow-xs text-slate-900',
    bordered: 'bg-white border border-slate-300/80 text-slate-900 shadow-xs',
    flat: 'bg-slate-50/80 border border-slate-200/60 text-slate-900',
    dark: 'bg-[#08131F] border border-[#182F48] text-white shadow-md shadow-slate-950/20',
    ai: 'bg-gradient-to-br from-purple-50/90 via-white to-purple-50/40 border border-purple-200/90 shadow-sm shadow-purple-900/5 text-slate-900 ring-1 ring-purple-500/15',
  };

  const hover = hoverEffect
    ? variant === 'ai'
      ? 'hover:shadow-md hover:shadow-purple-600/10 hover:border-purple-300 hover:-translate-y-0.5'
      : variant === 'dark'
      ? 'hover:border-[#4edee3]/50 hover:shadow-[#2c777c]/20 hover:-translate-y-0.5'
      : 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5'
    : '';

  return (
    <div className={`${base} ${variants[variant]} ${hover} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`px-5 py-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex items-center justify-between gap-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-bold text-slate-900 tracking-tight leading-snug ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-5 sm:p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`px-5 py-3.5 sm:px-6 sm:py-4 bg-slate-50/70 border-t border-slate-100 rounded-b-2xl flex items-center justify-between gap-3 ${className}`} {...props}>
    {children}
  </div>
);
