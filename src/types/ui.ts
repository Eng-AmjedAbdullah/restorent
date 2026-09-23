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

export type PageId = RouteId;

export interface AIRecommendation {
  id: string;
  category: 'staffing' | 'inventory' | 'scheduling' | 'waste' | 'revenue';
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  impact: { ar: string; en: string };
  urgency: 'high' | 'medium' | 'low';
  confidence_score: number;
  data_points: string[];
  suggested_action: { ar: string; en: string };
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  created_at?: string;
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'ai' | 'operational';
  urgency?: 'high' | 'medium' | 'low';
  title: { ar: string; en: string };
  message: { ar: string; en: string };
  timestamp: string;
  read: boolean;
  action_link?: string;
  created_at?: string;
}

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
