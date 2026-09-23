export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export type RouteId =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'scheduling'
  | 'leave-requests'
  | 'menu'
  | 'orders'
  | 'inventory'
  | 'alerts'
  | 'reports'
  | 'ai-intelligence'
  | 'branding-preview'
  | 'login';

export type BadgeVariant = 'neutral' | 'cyan' | 'teal' | 'success' | 'warning' | 'danger';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (row: T) => any;
}

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface NavItemConfig {
  id: RouteId;
  labelKey: string;
  route: string;
  icon: string;
  badge?: string | number;
  badgeVariant?: BadgeVariant;
}
