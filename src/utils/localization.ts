import { Language } from '../types';

export const translateUnit = (unit: string, lang: Language): string => {
  const map: Record<string, { ar: string; en: string }> = {
    kg: { ar: 'كجم', en: 'kg' },
    'كجم': { ar: 'كجم', en: 'kg' },
    bag: { ar: 'كيس', en: 'bag' },
    'كيس': { ar: 'كيس', en: 'bag' },
    box: { ar: 'كرتون', en: 'box' },
    'كرتون': { ar: 'كرتون', en: 'box' },
    liter: { ar: 'لتر', en: 'L' },
    'لتر': { ar: 'لتر', en: 'L' },
    can: { ar: 'علبة', en: 'can' },
    'علبة': { ar: 'علبة', en: 'can' },
    unit: { ar: 'حبة', en: 'unit' },
    'حبة': { ar: 'حبة', en: 'unit' },
  };
  return map[unit]?.[lang] || unit;
};

export const translateInventoryCategory = (cat: string, lang: Language): string => {
  const map: Record<string, { ar: string; en: string }> = {
    meat_poultry: { ar: 'اللحوم والدواجن', en: 'Meat & Poultry' },
    dairy: { ar: 'الألبان والأجبان', en: 'Dairy & Cheese' },
    produce: { ar: 'الخضروات والفواكه', en: 'Fresh Produce' },
    dry_goods: { ar: 'المواد الجافة والحبوب', en: 'Dry Goods' },
    beverages: { ar: 'المشروبات والبن', en: 'Beverages & Coffee' },
    packaging: { ar: 'التعبئة والتغليف', en: 'Packaging & Disposables' },
  };
  return map[cat]?.[lang] || cat.replace('_', ' ');
};

export const translateTimestamp = (timeStr: string, lang: Language): string => {
  if (!timeStr) return '';
  const map: Record<string, { ar: string; en: string }> = {
    'منذ 15 دقيقة': { ar: 'منذ 15 دقيقة', en: '15m ago' },
    'منذ 40 دقيقة': { ar: 'منذ 40 دقيقة', en: '40m ago' },
    'منذ ساعتين': { ar: 'منذ ساعتين', en: '2h ago' },
    'منذ 3 ساعات': { ar: 'منذ 3 ساعات', en: '3h ago' },
    'قبل 12 دقيقة': { ar: 'قبل 12 دقيقة', en: '12m ago' },
    'قبل 15 دقيقة': { ar: 'قبل 15 دقيقة', en: '15m ago' },
    'قبل 35 دقيقة': { ar: 'قبل 35 دقيقة', en: '35m ago' },
    'قبل ساعة': { ar: 'قبل ساعة', en: '1h ago' },
    'قبل ساعتين': { ar: 'قبل ساعتين', en: '2h ago' },
    'قبل 3 ساعات': { ar: 'قبل 3 ساعات', en: '3h ago' },
    'قبل 4 ساعات': { ar: 'قبل 4 ساعات', en: '4h ago' },
  };
  if (map[timeStr]) {
    return map[timeStr][lang];
  }
  return timeStr;
};

export const translateTableName = (table: string | undefined, lang: Language): string => {
  if (!table) return '';
  const map: Record<string, { ar: string; en: string }> = {
    'طاولة 14 (صالة العوائل)': { ar: 'طاولة 14 (صالة العوائل)', en: 'Table 14 (Family Section)' },
    'مجلس الضيافة VIP 1': { ar: 'مجلس الضيافة VIP 1', en: 'VIP Majlis 1' },
    'طلب خارجي - استلام سيارة': { ar: 'طلب خارجي - استلام سيارة', en: 'Takeaway - Drive-thru' },
    'طاولة 06 (قسم الأفراد)': { ar: 'طاولة 06 (قسم الأفراد)', en: 'Table 06 (Singles Section)' },
  };
  return map[table]?.[lang] || table;
};

export const translateServerName = (name: string, lang: Language): string => {
  const map: Record<string, { ar: string; en: string }> = {
    'ريم القحطاني': { ar: 'ريم القحطاني', en: 'Reem Al-Qahtani' },
    'سعد الدوسري': { ar: 'سعد الدوسري', en: 'Saad Al-Dawsari' },
    'كاشير السفري (ناصر)': { ar: 'كاشير السفري (ناصر)', en: 'Takeout Cashier (Nasser)' },
    'خالد الدوسري': { ar: 'خالد الدوسري', en: 'Khalid Al-Dawsari' },
    'سلطان الدوسري': { ar: 'سلطان الدوسري', en: 'Sultan Al-Dawsari' },
    'سلطان بن فهد الدوسري': { ar: 'سلطان بن فهد الدوسري', en: 'Sultan Fahad Al-Dawsari' },
    'مبارك مسفر الدوسري': { ar: 'مبارك مسفر الدوسري', en: 'Mubarak Mesfer Al-Dawsari' },
    'الشيف خالد الدوسري': { ar: 'الشيف خالد الدوسري', en: 'Chef Khalid Al-Dawsari' },
  };
  return map[name]?.[lang] || name;
};

export const translateAllergen = (alg: string, lang: Language): string => {
  const map: Record<string, { ar: string; en: string }> = {
    'مكسرات': { ar: 'مكسرات', en: 'Nuts' },
    'حليب': { ar: 'حليب', en: 'Dairy' },
    'جلوتين': { ar: 'جلوتين', en: 'Gluten' },
    'جوز': { ar: 'جوز', en: 'Walnuts' },
    'سمسم': { ar: 'سمسم', en: 'Sesame' },
    'صويا': { ar: 'صويا', en: 'Soy' },
    'بيض': { ar: 'بيض', en: 'Eggs' },
  };
  return map[alg]?.[lang] || alg;
};

export const translateOrderNote = (note: string | undefined, lang: Language): string => {
  if (!note) return '';
  const map: Record<string, { ar: string; en: string }> = {
    'بدون بصل': { ar: 'بدون بصل', en: 'No onion' },
    'زيادة حار': { ar: 'زيادة حار', en: 'Extra spicy' },
    'بدون مكسرات': { ar: 'بدون مكسرات', en: 'No nuts' },
    'وسط الاستواء': { ar: 'وسط الاستواء', en: 'Medium rare' },
    'قليل السكر': { ar: 'قليل السكر', en: 'Less sugar' },
    'حار جداً': { ar: 'حار جداً', en: 'Very spicy' },
  };
  return map[note]?.[lang] || note;
};
