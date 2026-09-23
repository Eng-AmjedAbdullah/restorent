import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ai' | 'brand' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'start',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#2c777c] via-[#34abb1] to-[#4edee3] hover:from-[#1e5458] hover:via-[#2c777c] hover:to-[#34abb1] text-white font-bold shadow-sm shadow-[#2c777c]/25 border border-[#4edee3]/50 focus-visible:ring-[#34abb1]',
    brand:
      'bg-[#34abb1] text-white hover:bg-[#2c777c] font-bold shadow-sm shadow-[#2c777c]/20 focus-visible:ring-[#34abb1] border border-[#4edee3]/30',
    dark:
      'bg-[#08131F] text-white hover:bg-[#0E2033] border border-[#182F48] shadow-sm shadow-slate-950/30 focus-visible:ring-[#4edee3]',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 focus-visible:ring-slate-400',
    outline:
      'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus-visible:ring-slate-400',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-400',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm shadow-rose-700/20 focus-visible:ring-rose-500',
    ai:
      'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] shadow-sm shadow-purple-900/30 focus-visible:ring-[#8B5CF6] border border-purple-400/30 font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
          {children}
          {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
