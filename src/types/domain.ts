/**
 * RestoraIntel Enterprise Domain Types
 * Aligned with the future Laravel backend entity structure.
 * Every persistent entity includes id, created_at, and updated_at.
 * Restaurant-scoped entities include restaurant_id.
 */

export interface Organization {
  id: string;
  name: { ar: string; en: string };
  code: string;
  tax_number: string;
  commercial_registration: string;
  country: string;
  city: { ar: string; en: string };
  subscription_plan: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  organization_id?: string;
  name: { ar: string; en: string };
  code: string;
  city: { ar: string; en: string };
  address?: { ar: string; en: string };
  branch_type: 'flagship' | 'express' | 'dine_in' | 'cloud_kitchen';
  timezone: string;
  currency: string;
  active_tables_count: number;
  capacity: number;
  manager_id: string;
  status: 'active' | 'maintenance' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export interface Branch {
  id: string;
  restaurant_id: string;
  name: { ar: string; en: string };
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type UserRole =
  | 'super_admin'
  | 'operations_director'
  | 'general_manager'
  | 'shift_supervisor'
  | 'chef'
  | 'inventory_manager';

export interface Permission {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: UserRole;
  display_name: { ar: string; en: string };
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  organization_id?: string;
  restaurant_id: string;
  name: { ar: string; en: string };
  email: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  preferences?: {
    language?: 'ar' | 'en';
    notifications_enabled?: boolean;
    dark_mode?: boolean;
  };
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Position {
  id: string;
  organization_id?: string;
  title: { ar: string; en: string };
  department: 'kitchen' | 'service' | 'bar' | 'management' | 'stewarding';
  hourly_rate_sar: number;
  min_experience_years: number;
  created_at?: string;
  updated_at?: string;
}

export interface Employee {
  id: string;
  restaurant_id?: string;
  employee_code: string;
  first_name: { ar: string; en: string };
  last_name: { ar: string; en: string };
  email: string;
  phone: string;
  position_id: string;
  position?: Position;
  hire_date: string;
  contract_type: 'full_time' | 'part_time' | 'seasonal' | 'contractor';
  status: 'active' | 'on_shift' | 'on_break' | 'off_duty' | 'on_leave';
  avatar_url: string;
  skills: string[];
  leave_balance: {
    annual_days: number;
    sick_days: number;
    emergency_days: number;
  };
  performance_score: number;
  hourly_rate: number;
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface Attendance {
  id: string;
  restaurant_id: string;
  employee_id: string;
  employee?: Employee;
  date: string; // YYYY-MM-DD
  scheduled_start: string; // HH:mm
  scheduled_end: string;
  actual_clock_in?: string;
  actual_clock_out?: string;
  break_duration_minutes: number;
  late_minutes: number;
  overtime_minutes: number;
  status: 'on_time' | 'late' | 'early_leave' | 'absent' | 'excused' | 'active_shift';
  manager_override_by?: string;
  manager_notes?: string;
  device_source?: 'kiosk' | 'mobile_geofence' | 'biometric' | 'manual_override';
  created_at?: string;
  updated_at?: string;
}

export interface Shift {
  id: string;
  restaurant_id: string;
  employee_id: string;
  employee?: Employee;
  date: string; // YYYY-MM-DD
  shift_name: { ar: string; en: string };
  role_id?: string;
  station: 'hot_line' | 'prep' | 'grill' | 'expo' | 'barista' | 'cashier' | 'floor_captain' | 'hostess';
  start_time: string; // HH:mm
  end_time: string;
  color_code: string;
  is_overtime: boolean;
  status: 'scheduled' | 'in_progress' | 'completed' | 'gap_uncovered' | 'ai_suggested';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LeaveRequest {
  id: string;
  restaurant_id: string;
  request_number: string;
  employee_id: string;
  employee?: Employee;
  type: 'annual' | 'sick' | 'unpaid' | 'emergency' | 'hajj' | 'paternity';
  start_date: string;
  end_date: string;
  total_days: number;
  reason: { ar: string; en: string };
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  submitted_at: string;
  actioned_by?: string;
  actioned_at?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id?: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  category: 'appetizers' | 'mains' | 'steaks' | 'pasta' | 'beverages' | 'desserts';
  price: number;
  cost: number;
  profit_margin_percent: number;
  is_available: boolean;
  is_featured: boolean;
  stock_alert_threshold: number;
  preparation_time_minutes: number;
  calories: number;
  allergens: string[];
  image_url?: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  menu_item_id: string;
  name: { ar: string; en: string };
  quantity: number;
  unit_price: number;
  notes?: string;
  is_prepared: boolean;
}

export interface Order {
  id: string;
  restaurant_id: string;
  order_number: string;
  order_type: 'dine_in' | 'takeaway' | 'delivery' | 'drive_thru';
  table_number?: string;
  server_name: string;
  customer_name?: string;
  status: 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  priority: 'normal' | 'rush' | 'vip';
  elapsed_minutes: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryItem {
  id: string;
  restaurant_id?: string;
  sku: string;
  name: { ar: string; en: string };
  category: 'meat_poultry' | 'dairy' | 'produce' | 'dry_goods' | 'beverages' | 'packaging';
  current_stock: number;
  unit: 'kg' | 'liter' | 'box' | 'bag' | 'unit';
  reorder_point: number;
  par_level: number;
  cost_per_unit: number;
  status: 'in_stock' | 'low_stock' | 'critical' | 'out_of_stock';
  supplier_name: string;
  last_restocked_at: string;
  predicted_days_remaining: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * AI Insight entity.
 * Appropriately marked as demo simulation / sample insight until backend ML is connected.
 */
export interface AIInsight {
  id: string;
  restaurant_id: string;
  category: 'staffing' | 'inventory' | 'scheduling' | 'waste' | 'revenue';
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  impact: { ar: string; en: string };
  urgency: 'high' | 'medium' | 'low';
  confidence_score: number; // e.g. 94
  data_points: string[];
  suggested_action: { ar: string; en: string };
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  preview_badge: { ar: string; en: string };
  created_at: string;
  updated_at: string;
}

export interface OperationalAlert {
  id: string;
  restaurant_id: string;
  title: { ar: string; en: string };
  message: { ar: string; en: string };
  type: 'critical' | 'operational' | 'simulation_insight';
  urgency: 'high' | 'medium' | 'low';
  read: boolean;
  action_route?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportMetric {
  id: string;
  restaurant_id: string;
  date: string;
  sales: number;
  labor_cost_percent: number;
  customer_count: number;
  average_ticket: number;
  table_turn_time_minutes: number;
  food_waste_kg: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardSummary {
  sales_today: number;
  sales_yesterday: number;
  employees_on_duty: number;
  total_shift_staff: number;
  attendance_rate: number;
  late_count: number;
  critical_inventory_alerts: number;
  pending_leave_requests: number;
  active_orders_count: number;
  station_coverage: {
    kitchen: number;
    floor: number;
    bar: number;
    stewarding: number;
  };
}
