import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
  variant?: 'icon' | 'initials';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
  variant = 'icon',
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs font-semibold',
    lg: 'w-11 h-11 text-sm font-semibold',
    xl: 'w-16 h-16 text-lg font-bold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-5.5 h-5.5',
    xl: 'w-8 h-8',
  };

  const statusStyles = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  const getInitials = (n: string) => {
    if (!n) return 'U';
    const parts = n.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`${sizeStyles[size]} rounded-full object-cover ring-1 ring-slate-200 dark:ring-[#1E3A5A]`}
        />
      ) : variant === 'initials' ? (
        <div
          className={`${sizeStyles[size]} rounded-full bg-emerald-100 text-emerald-800 dark:bg-[#0E2238] dark:text-[#39DCE6] flex items-center justify-center ring-1 ring-emerald-200 dark:ring-[#1D3E61] select-none`}
        >
          {getInitials(name)}
        </div>
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full bg-gradient-to-b from-[#132A42] to-[#0A1726] text-[#39DCE6] flex items-center justify-center ring-1 ring-[#1E3F61] shadow-xs select-none`}
          title={name}
        >
          <User className={`${iconSizes[size]} text-[#39DCE6]`} />
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#08131F] ${statusStyles[status]}`}
        />
      )}
    </div>
  );
};
