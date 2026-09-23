import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Search,
  Plus,
  Flame,
  Clock,
  Coins,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';
import { MenuItem } from '../types';
import { translateAllergen } from '../utils/localization';

export const MenuPage: React.FC = () => {
  const {
    t,
    language,
    menuItems,
    toggleMenuItemAvailability,
    showToast,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<'all' | MenuItem['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const availableCount = menuItems.filter(i => i.is_available).length;
  const eightySixCount = menuItems.filter(i => !i.is_available).length;

  return (
    <PageContainer
      title={t.menu.title}
      subtitle={t.menu.subtitle}
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          {t.menu.addItem}
        </Button>
      }
    >
      {/* Top Filter & Metric Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'all', label: t.menu.categories.all },
            { id: 'mains', label: t.menu.categories.mains },
            { id: 'appetizers', label: t.menu.categories.appetizers },
            { id: 'steaks', label: t.menu.categories.steaks },
            { id: 'pasta', label: t.menu.categories.pasta },
            { id: 'beverages', label: t.menu.categories.beverages },
            { id: 'desserts', label: t.menu.categories.desserts },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 86 Count indicator */}
        <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-end">
          <span className="text-[#2c777c] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34abb1]" />
            {availableCount} {t.menu.availableCount}
          </span>
          {eightySixCount > 0 && (
            <span className="text-rose-700 font-bold px-2 py-0.5 rounded-full bg-rose-100 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {eightySixCount} {t.menu.soldOutCount}
            </span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder={language === 'ar' ? 'البحث عن صنف أو مكون...' : 'Search dish name or ingredient...'}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card
            key={item.id}
            className={`overflow-hidden transition-all ${
              !item.is_available ? 'opacity-75 border-rose-200 bg-slate-50/80' : 'hover:border-slate-300'
            }`}
          >
            <div className="p-5 flex flex-col justify-between h-full space-y-4">
              <div>
                {/* Header: Name + 86 Switch */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.name[language]}
                    </h3>
                    <p className="text-[11px] text-slate-400 capitalize mt-0.5">
                      {t.menu.categories[item.category] || item.category}
                    </p>
                  </div>

                  {/* 86 Toggle */}
                  <button
                    onClick={() => {
                      toggleMenuItemAvailability(item.id);
                      showToast(
                        language === 'ar'
                          ? item.is_available
                            ? `تم إيقاف الطبق (86) مؤقتاً في النظام الرقمي: ${item.name.ar}`
                            : `تمت استعادة تفعيل الطبق في القائمة: ${item.name.ar}`
                          : item.is_available
                          ? `Dish 86'd across digital ordering: ${item.name.en}`
                          : `Dish restored to active menu: ${item.name.en}`
                      );
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      item.is_available
                        ? 'bg-[#4edee3]/20 text-[#2c777c] hover:bg-[#4edee3]/30 border border-[#34abb1]/30'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                    title="Toggle 86 status"
                  >
                    <span>{item.is_available ? t.menu.statusAvailable : t.menu.statusUnavailable}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {item.description[language]}
                </p>
              </div>

              {/* Financial & Kitchen Metrics */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{language === 'ar' ? 'سعر البيع' : 'Price'}:</span>
                  <span className="font-extrabold text-slate-900 font-mono">
                    {item.price} {t.common.sar}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{language === 'ar' ? 'تكلفة المكونات' : 'Food Cost'}:</span>
                  <span className="text-slate-600 font-mono">
                    {item.cost} {t.common.sar} ({item.profit_margin_percent}% {t.menu.margin})
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {t.menu.prepTime}:
                  </span>
                  <span className="font-mono text-slate-700">
                    {item.preparation_time_minutes} {language === 'ar' ? 'دقيقة' : 'min'}
                  </span>
                </div>

                {/* Allergens */}
                {item.allergens.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-400">
                      {language === 'ar' ? 'مسببات الحساسية:' : 'Allergens:'}
                    </span>
                    {item.allergens.map((alg, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                      >
                        {translateAllergen(alg, language)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ADD ITEM MODAL */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t.menu.addItem}
        description={
          language === 'ar'
            ? 'إضافة صنف جديد لقائمة الطعام وتحديد التكلفة ووقت التحضير'
            : 'Add a new culinary item with pricing and prep requirements'
        }
        maxWidth="md"
      >
        <div className="space-y-4">
          <Input label={language === 'ar' ? 'اسم الصنف (بالعربية)' : 'Item Name (Arabic)'} placeholder="مثال: ريب آي ستيك واغيو" required />
          <Input label={language === 'ar' ? 'اسم الصنف (بالإنجليزية)' : 'Item Name (English)'} placeholder="e.g. Wagyu Ribeye Steak" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label={`${language === 'ar' ? 'سعر البيع' : 'Sale Price'} (${t.common.sar})`} type="number" placeholder="125" required />
            <Input label={`${language === 'ar' ? 'تكلفة المكونات' : 'Food Cost'} (${t.common.sar})`} type="number" placeholder="42" required />
          </div>
          <Input label={language === 'ar' ? 'وقت التحضير المعياري (بالدقائق)' : 'Standard Prep Time (minutes)'} type="number" placeholder="18" required />

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsAddOpen(false);
                showToast(
                  language === 'ar'
                    ? 'تمت إضافة الصنف بنجاح إلى قائمة الطعام'
                    : 'Dish successfully registered in menu catalogue'
                );
              }}
            >
              {language === 'ar' ? 'حفظ في القائمة' : 'Save Item'}
            </Button>
          </div>
        </div>
      </Dialog>
    </PageContainer>
  );
};
