import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, iconPosition = 'start', className = '', id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && iconPosition === 'start' && (
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-lg bg-white border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#34abb1] focus:border-[#34abb1] disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
            } ${icon && iconPosition === 'start' ? 'ps-9' : 'ps-3'} ${
              icon && iconPosition === 'end' ? 'pe-9' : 'pe-3'
            } py-2 ${className}`}
            {...props}
          />
          {icon && iconPosition === 'end' && (
            <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
