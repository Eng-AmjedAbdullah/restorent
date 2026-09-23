import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Search,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Dialog } from '../components/ui/Dialog';
import { Select } from '../components/ui/Select';
import { InventoryItem } from '../types';
import { translateInventoryCategory, translateUnit } from '../utils/localization';

export const InventoryPage: React.FC = () => {
  const {
    t,
    language,
    inventory,
    adjustInventoryStock,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRestockItem, setSelectedRestockItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState('20');

  const criticalItems = inventory.filter(i => i.status === 'critical' || i.status === 'out_of_stock');
  const lowStockItems = inventory.filter(i => i.status === 'low_stock');
  const healthyItems = inventory.filter(i => i.status === 'in_stock');

  const filteredItems = inventory.filter(item => {
    const matchesSearch =
      item.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRestockItem) {
      const addedQuantity = Number(restockAmount) || 10;
      adjustInventoryStock(selectedRestockItem.id, selectedRestockItem.current_stock + addedQuantity);
      showToast(
        language === 'ar'
          ? `تم توريد واستلام ${addedQuantity} ${selectedRestockItem.unit} من (${selectedRestockItem.name.ar}) إلى مستودع وادي الدواسر`
          : `Restocked +${addedQuantity} ${selectedRestockItem.unit} of ${selectedRestockItem.name.en}`
      );
      setSelectedRestockItem(null);
    }
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'critical':
      case 'out_of_stock':
        return <Badge variant="error" dot>{language === 'ar' ? 'حرج / نفد' : 'Critical'}</Badge>;
      case 'low_stock':
        return <Badge variant="warning" dot>{language === 'ar' ? 'منخفض' : 'Low Stock'}</Badge>;
      case 'in_stock':
      default:
        return <Badge variant="success" dot>{language === 'ar' ? 'متوفر' : 'In Stock'}</Badge>;
    }
  };

  return (
    <PageContainer
      title={t.inventory.title}
      subtitle={t.inventory.subtitle}
      badge={
        <Badge variant="ai" size="md">
          {language === 'ar' ? 'محرك التنبؤ بالمخزون نشط' : 'Par Prediction Engine Active'}
        </Badge>
      }
    >
      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-rose-200/80 bg-rose-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-rose-800 font-semibold">{t.inventory.lowStockItems}</p>
              <h3 className="text-2xl font-black text-rose-950 mt-1">{criticalItems.length}</h3>
              <p className="text-[11px] text-rose-700 mt-0.5">
                {language === 'ar' ? 'يحتاج لإصدار أمر توريد فوري' : 'Immediate PO issuance required'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200/80 bg-amber-50/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-800 font-semibold">{language === 'ar' ? 'دون حد الأمان' : 'Below Par'}</p>
              <h3 className="text-2xl font-black text-amber-950 mt-1">{lowStockItems.length}</h3>
              <p className="text-[11px] text-amber-700 mt-0.5">
                {language === 'ar' ? 'أصناف تقترب من نقطة إعادة الطلب' : 'Approaching reorder point'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Boxes className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#34abb1]/40 bg-[#4edee3]/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#2c777c] font-semibold">{language === 'ar' ? 'مخزون صحي ومستقر' : 'Healthy Stock'}</p>
              <h3 className="text-2xl font-black text-[#2c777c] mt-1">{healthyItems.length}</h3>
              <p className="text-[11px] text-[#2c777c] mt-0.5">
                {language === 'ar' ? 'يكفي لتغطية 5-8 أيام تشغيل' : '5-8 operational days coverage'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#34abb1]/15 flex items-center justify-center text-[#2c777c]">
              <CheckCircle2 className="w-5 h-5 text-[#34abb1]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-80">
            <Input
              placeholder={language === 'ar' ? 'بحث باسم المادة أو كود SKU...' : 'Search item name or SKU...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: t.common.all },
                { value: 'meat_poultry', label: language === 'ar' ? 'اللحوم والدواجن' : 'Meat & Poultry' },
                { value: 'dairy', label: language === 'ar' ? 'الألبان والأجبان' : 'Dairy & Cheese' },
                { value: 'produce', label: language === 'ar' ? 'الخضروات والفواكه' : 'Fresh Produce' },
                { value: 'dry_goods', label: language === 'ar' ? 'المواد الجافة والحبوب' : 'Dry Goods' },
                { value: 'beverages', label: language === 'ar' ? 'المشروبات والبن' : 'Beverages & Coffee' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-slate-800 text-start">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-start">{t.inventory.item}</th>
                <th className="py-3 px-4 text-start">{t.inventory.category}</th>
                <th className="py-3 px-4 text-start">{t.inventory.currentStock}</th>
                <th className="py-3 px-4 text-start">{t.inventory.reorderPoint}</th>
                <th className="py-3 px-4 text-start">{language === 'ar' ? 'المورد' : 'Supplier'}</th>
                <th className="py-3 px-4 text-start">{t.common.status}</th>
                <th className="py-3 px-4 text-end">{t.common.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                const percentage = Math.min(100, Math.round((item.current_stock / item.par_level) * 100));

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.name[language]}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-600 capitalize">
                        {translateInventoryCategory(item.category, language)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-black text-slate-900 font-mono text-sm">
                          {item.current_stock} {translateUnit(item.unit, language)}
                        </span>
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.status === 'critical' || item.status === 'out_of_stock'
                                ? 'bg-rose-500'
                                : item.status === 'low_stock'
                                ? 'bg-amber-500'
                                : 'bg-[#34abb1]'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {item.reorder_point} {translateUnit(item.unit, language)} (Par: {item.par_level})
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {item.supplier_name}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="py-3.5 px-4 text-end">
                      <Button
                        variant={item.status === 'in_stock' ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => {
                          setSelectedRestockItem(item);
                          setRestockAmount(String(Math.max(10, item.par_level - item.current_stock)));
                        }}
                      >
                        {t.inventory.adjustStock}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QUICK RESTOCK DIALOG */}
      <Dialog
        isOpen={!!selectedRestockItem}
        onClose={() => setSelectedRestockItem(null)}
        title={t.inventory.adjustStock}
        description={language === 'ar' ? 'تسجيل استلام شحنة أو إضافة كمية جديدة للرصيد' : 'Register shipment arrival and increment balance'}
        maxWidth="md"
      >
        {selectedRestockItem && (
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block text-sm">
                {selectedRestockItem.name[language]}
              </span>
              <div className="mt-2 flex items-center justify-between text-slate-600">
                <span>
                  {language === 'ar' ? 'الرصيد الحالي' : 'Current Stock'}:{' '}
                  <strong>{selectedRestockItem.current_stock} {translateUnit(selectedRestockItem.unit, language)}</strong>
                </span>
                <span>
                  {language === 'ar' ? 'الحد المثالي (Par)' : 'Par Level'}:{' '}
                  <strong>{selectedRestockItem.par_level} {translateUnit(selectedRestockItem.unit, language)}</strong>
                </span>
              </div>
            </div>

            <Input
              label={
                language === 'ar'
                  ? `الكمية المضافة (${translateUnit(selectedRestockItem.unit, language)})`
                  : `Quantity to add (${translateUnit(selectedRestockItem.unit, language)})`
              }
              type="number"
              value={restockAmount}
              onChange={e => setRestockAmount(e.target.value)}
              required
            />

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedRestockItem(null)}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="primary" size="sm">
                {language === 'ar' ? 'تحديث الرصيد' : 'Confirm Stock'}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </PageContainer>
  );
};
