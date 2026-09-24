/**
 * Verified Mock Localization Catalog
 *
 * Provides confirmed Arabic and English display names for known mock entities.
 * Organized by entity type to prevent ID collision across database tables
 * (since Restaurant 1, User 1, and Employee 1 each have their own independent primary key sequence).
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

export const MOCK_RESTAURANT_LOCALIZATION: Record<number | string, EntityLocalizationRecord> = {
  1: {
    name: {
      ar: 'ريستورا سنترال - فرع العليا الرئيسي',
      en: 'Restora Downtown Flagship - Olaya',
    },
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'طريق الملك فهد، حي العليا، الرياض',
      en: 'King Fahd Road, Al-Olaya Commercial District',
    },
  },
  'rest-1': {
    name: {
      ar: 'ريستورا سنترال - فرع العليا الرئيسي',
      en: 'Restora Downtown Flagship - Olaya',
    },
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'طريق الملك فهد، حي العليا، الرياض',
      en: 'King Fahd Road, Al-Olaya Commercial District',
    },
  },
  2: {
    name: {
      ar: 'ريستورا مارينا - كورنيش جدة الواجهة',
      en: 'Restora Waterfront Bistro - Corniche',
    },
    city: { ar: 'جدة', en: 'Jeddah' },
    address: {
      ar: 'طريق الكورنيش الشمالي، جدة',
      en: 'North Corniche Road, Marina Front',
    },
  },
  'rest-2': {
    name: {
      ar: 'ريستورا مارينا - كورنيش جدة الواجهة',
      en: 'Restora Waterfront Bistro - Corniche',
    },
    city: { ar: 'جدة', en: 'Jeddah' },
    address: {
      ar: 'طريق الكورنيش الشمالي، جدة',
      en: 'North Corniche Road, Marina Front',
    },
  },
  3: {
    name: {
      ar: 'ريستورا واحة التراث - الدرعية التاريخية',
      en: 'Restora Cultural Oasis - Diriyah',
    },
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'حي البجيري التراثي، الدرعية',
      en: 'Al-Bujairi Heritage District, Historic Diriyah',
    },
  },
  'rest-3': {
    name: {
      ar: 'ريستورا واحة التراث - الدرعية التاريخية',
      en: 'Restora Cultural Oasis - Diriyah',
    },
    city: { ar: 'الرياض', en: 'Riyadh' },
    address: {
      ar: 'حي البجيري التراثي، الدرعية',
      en: 'Al-Bujairi Heritage District, Historic Diriyah',
    },
  },
  4: {
    name: {
      ar: 'ريستورا الخبر - الواجهة البحرية',
      en: 'Restora Khobar Seafront - Marina',
    },
    city: { ar: 'الخبر', en: 'Al-Khobar' },
    address: {
      ar: 'شارع الأمير تركي، الواجهة البحرية',
      en: 'Prince Turki Street, Seafront Walkway',
    },
  },
  'rest-4': {
    name: {
      ar: 'ريستورا الخبر - الواجهة البحرية',
      en: 'Restora Khobar Seafront - Marina',
    },
    city: { ar: 'الخبر', en: 'Al-Khobar' },
    address: {
      ar: 'شارع الأمير تركي، الواجهة البحرية',
      en: 'Prince Turki Street, Seafront Walkway',
    },
  },
};

export const MOCK_EMPLOYEE_LOCALIZATION: Record<number | string, EntityLocalizationRecord> = {
  101: {
    first_name: { ar: 'أحمد', en: 'Ahmed' },
    last_name: { ar: 'المنصور', en: 'Al-Mansoor' },
    position_title: { ar: 'رئيس الطهاة التنفيذي', en: 'Executive Head Chef' },
  },
  'emp-101': {
    first_name: { ar: 'أحمد', en: 'Ahmed' },
    last_name: { ar: 'المنصور', en: 'Al-Mansoor' },
    position_title: { ar: 'رئيس الطهاة التنفيذي', en: 'Executive Head Chef' },
  },
  102: {
    first_name: { ar: 'خالد', en: 'Khalid' },
    last_name: { ar: 'الغامدي', en: 'Al-Ghamdi' },
    position_title: { ar: 'طاهي تنفيذي مساعد / مشرف الخط', en: 'Sous Chef / Line Supervisor' },
  },
  'emp-102': {
    first_name: { ar: 'خالد', en: 'Khalid' },
    last_name: { ar: 'الغامدي', en: 'Al-Ghamdi' },
    position_title: { ar: 'طاهي تنفيذي مساعد / مشرف الخط', en: 'Sous Chef / Line Supervisor' },
  },
  103: {
    first_name: { ar: 'نورة', en: 'Noura' },
    last_name: { ar: 'الزهراني', en: 'Al-Zahrani' },
    position_title: { ar: 'مشرفة الصالة ومسؤولة الضيافة', en: 'Floor Captain & Guest Host' },
  },
  'emp-103': {
    first_name: { ar: 'نورة', en: 'Noura' },
    last_name: { ar: 'الزهراني', en: 'Al-Zahrani' },
    position_title: { ar: 'مشرفة الصالة ومسؤولة الضيافة', en: 'Floor Captain & Guest Host' },
  },
  104: {
    first_name: { ar: 'يوسف', en: 'Yousef' },
    last_name: { ar: 'المطيري', en: 'Al-Mutairi' },
  },
  'emp-104': {
    first_name: { ar: 'يوسف', en: 'Yousef' },
    last_name: { ar: 'المطيري', en: 'Al-Mutairi' },
  },
  105: {
    first_name: { ar: 'إبراهيم', en: 'Ibrahim' },
    last_name: { ar: 'الشمري', en: 'Al-Shammari' },
    position_title: { ar: 'طاهي تنفيذي مساعد / مشرف الخط', en: 'Sous Chef / Line Supervisor' },
  },
  'emp-105': {
    first_name: { ar: 'إبراهيم', en: 'Ibrahim' },
    last_name: { ar: 'الشمري', en: 'Al-Shammari' },
    position_title: { ar: 'طاهي تنفيذي مساعد / مشرف الخط', en: 'Sous Chef / Line Supervisor' },
  },
  201: {
    first_name: { ar: 'بندر', en: 'Bandar' },
    last_name: { ar: 'الشهري', en: 'Al-Shehri' },
    position_title: { ar: 'رئيس طهاة المأكولات البحرية', en: 'Head Chef - Seafood Specialist' },
  },
  'emp-201': {
    first_name: { ar: 'بندر', en: 'Bandar' },
    last_name: { ar: 'الشهري', en: 'Al-Shehri' },
    position_title: { ar: 'رئيس طهاة المأكولات البحرية', en: 'Head Chef - Seafood Specialist' },
  },
  202: {
    first_name: { ar: 'منى', en: 'Mona' },
    last_name: { ar: 'الحربي', en: 'Al-Harbi' },
    position_title: { ar: 'طاهية المعجنات والحلويات', en: 'Pastry & Dessert Chef' },
  },
  'emp-202': {
    first_name: { ar: 'منى', en: 'Mona' },
    last_name: { ar: 'الحربي', en: 'Al-Harbi' },
    position_title: { ar: 'طاهية المعجنات والحلويات', en: 'Pastry & Dessert Chef' },
  },
};

export const MOCK_USER_LOCALIZATION: Record<number | string, EntityLocalizationRecord> = {
  1: {
    first_name: { ar: 'طارق', en: 'Tariq' },
    last_name: { ar: 'العتيبي', en: 'Al-Otaibi' },
  },
  'usr-1': {
    first_name: { ar: 'طارق', en: 'Tariq' },
    last_name: { ar: 'العتيبي', en: 'Al-Otaibi' },
  },
  2: {
    first_name: { ar: 'سارة', en: 'Sara' },
    last_name: { ar: 'القحطاني', en: 'Al-Qahtani' },
  },
  'usr-2': {
    first_name: { ar: 'سارة', en: 'Sara' },
    last_name: { ar: 'القحطاني', en: 'Al-Qahtani' },
  },
  3: {
    first_name: { ar: 'أحمد', en: 'Ahmed' },
    last_name: { ar: 'المنصور', en: 'Al-Mansoor' },
  },
  'usr-3': {
    first_name: { ar: 'أحمد', en: 'Ahmed' },
    last_name: { ar: 'المنصور', en: 'Al-Mansoor' },
  },
  4: {
    first_name: { ar: 'خالد', en: 'Khalid' },
    last_name: { ar: 'الغامدي', en: 'Al-Ghamdi' },
  },
  'usr-4': {
    first_name: { ar: 'خالد', en: 'Khalid' },
    last_name: { ar: 'الغامدي', en: 'Al-Ghamdi' },
  },
};

/**
 * Backward compatibility combined catalog with prefix keys
 */
export const MOCK_LOCALIZATION_CATALOG: Record<string, EntityLocalizationRecord> = {
  ...Object.fromEntries(Object.entries(MOCK_RESTAURANT_LOCALIZATION).map(([k, v]) => [`rest-${k}`, v])),
  ...Object.fromEntries(Object.entries(MOCK_EMPLOYEE_LOCALIZATION).map(([k, v]) => [`emp-${k}`, v])),
  ...Object.fromEntries(Object.entries(MOCK_USER_LOCALIZATION).map(([k, v]) => [`usr-${k}`, v])),
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
