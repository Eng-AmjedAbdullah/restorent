/**
 * Verified Mock Localization Catalog
 *
 * Provides confirmed Arabic and English display names for known mock entities.
 * Keyed by stable entity identifiers (e.g., 'rest-1', 'emp-101', 'usr-1').
 *
 * CRITICAL LOCALIZATION RULE:
 * This catalog is only used when running in mock mode for known fixture IDs.
 * When an entity ID is not present in this catalog (such as records returned
 * from a live Laravel backend), mappers MUST NOT fabricate artificial translations;
 * they must use the canonical backend value as the fallback.
 */

import type { LocalizedString } from '../presentation/restaurant.presentation';

export interface EntityLocalizationRecord {
  name?: LocalizedString;
  first_name?: LocalizedString;
  last_name?: LocalizedString;
  city?: LocalizedString;
  address?: LocalizedString;
  position_title?: LocalizedString;
}

export const MOCK_LOCALIZATION_CATALOG: Record<string, EntityLocalizationRecord> = {
  // Restaurants
  'rest-1': {
    name: {
      ar: 'ريستورا سنترال - فرع العليا الرئيسي',
      en: 'Restora Downtown Flagship - Olaya',
    },
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'طريق الملك فهد، حي العليا، الرياض',
      en: 'King Fahd Road, Al Olaya District, Riyadh',
    },
  },
  'rest-2': {
    name: {
      ar: 'ريستورا مارينا - كورنيش جدة الواجهة',
      en: 'Restora Marina Waterfront - Jeddah',
    },
    city: { ar: 'جدة', en: 'Jeddah' },
    address: {
      ar: 'طريق الكورنيش الشمالي، الشاطئ، جدة',
      en: 'North Corniche Road, Al Shati, Jeddah',
    },
  },
  'rest-3': {
    name: {
      ar: 'ريستورا بيسترو - التخصصي إكسبريس',
      en: 'Restora Bistro - Takhassusi Express',
    },
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'شارع التخصصي، المعذر الشمالي، الرياض',
      en: 'Takhassusi St, Al Maather Al Shamali, Riyadh',
    },
  },

  // Employees
  'emp-101': {
    first_name: { ar: 'أحمد', en: 'Ahmed' },
    last_name: { ar: 'المنصور', en: 'Al-Mansoor' },
    position_title: { ar: 'رئيس الطهاة التنفيذي', en: 'Executive Head Chef' },
  },
  'emp-102': {
    first_name: { ar: 'ريم', en: 'Reem' },
    last_name: { ar: 'الشهري', en: 'Al-Shehri' },
    position_title: { ar: 'طاهي مساعد أول', en: 'Senior Sous Chef' },
  },
  'emp-103': {
    first_name: { ar: 'خالد', en: 'Khalid' },
    last_name: { ar: 'العتيبي', en: 'Al-Otaibi' },
    position_title: { ar: 'مشرف الصالة والخدمة', en: 'Floor Captain / Supervisor' },
  },
  'emp-104': {
    first_name: { ar: 'نورة', en: 'Noura' },
    last_name: { ar: 'الدوسري', en: 'Al-Dossary' },
    position_title: { ar: 'باريستا رئيسي وخبير مشروبات', en: 'Head Barista & Mixologist' },
  },
  'emp-105': {
    first_name: { ar: 'فيصل', en: 'Faisal' },
    last_name: { ar: 'الغامدي', en: 'Al-Ghamdi' },
    position_title: { ar: 'طاهي محطة ساخنة', en: 'Line Cook' },
  },
  'emp-201': {
    first_name: { ar: 'يوسف', en: 'Yousef' },
    last_name: { ar: 'العمري', en: 'Al-Omari' },
    position_title: { ar: 'رئيس الطهاة التنفيذي', en: 'Executive Head Chef' },
  },
  'emp-202': {
    first_name: { ar: 'منى', en: 'Mona' },
    last_name: { ar: 'الحربي', en: 'Al-Harbi' },
  },

  // Users
  'usr-1': {
    first_name: { ar: 'سارة', en: 'Sara' },
    last_name: { ar: 'القحطاني', en: 'Al-Qahtani' },
  },
  'usr-2': {
    first_name: { ar: 'طارق', en: 'Tariq' },
    last_name: { ar: 'الغامدي', en: 'Al-Ghamdi' },
  },
  'usr-3': {
    first_name: { ar: 'عبدالله', en: 'Abdullah' },
    last_name: { ar: 'الشهري', en: 'Al-Shehri' },
  },
};

/**
 * Standard status badge labels for Restaurant Statuses
 */
export const RESTAURANT_STATUS_LABELS: Record<string, { label: LocalizedString; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  active: {
    label: { ar: 'نشط وتشغيلي', en: 'Active & Operational' },
    variant: 'success',
  },
  inactive: {
    label: { ar: 'غير نشط', en: 'Inactive' },
    variant: 'default',
  },
  suspended: {
    label: { ar: 'معلق إدارياً', en: 'Suspended' },
    variant: 'danger',
  },
  archived: {
    label: { ar: 'مؤرشف', en: 'Archived' },
    variant: 'default',
  },
};

/**
 * Standard status badge labels for Employee Statuses
 */
export const EMPLOYEE_STATUS_LABELS: Record<string, { label: LocalizedString; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  active: {
    label: { ar: 'نشط بالخدمة', en: 'Active' },
    variant: 'success',
  },
  inactive: {
    label: { ar: 'غير نشط', en: 'Inactive' },
    variant: 'default',
  },
  on_leave: {
    label: { ar: 'في إجازة رسمية', en: 'On Leave' },
    variant: 'warning',
  },
  terminated: {
    label: { ar: 'منتهي العقد', en: 'Terminated' },
    variant: 'danger',
  },
  suspended: {
    label: { ar: 'موقوف مؤقتاً', en: 'Suspended' },
    variant: 'danger',
  },
};

/**
 * Standard status badge labels for User Account Statuses
 */
export const USER_STATUS_LABELS: Record<string, { label: LocalizedString; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  active: {
    label: { ar: 'حساب مفعّل', en: 'Active' },
    variant: 'success',
  },
  suspended: {
    label: { ar: 'معلق', en: 'Suspended' },
    variant: 'danger',
  },
  pending: {
    label: { ar: 'قيد التفعيل', en: 'Pending Activation' },
    variant: 'warning',
  },
};
