import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Check,
  Layers,
  HelpCircle,
  Zap,
  Activity,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const AIIntelligencePage: React.FC = () => {
  const {
    t,
    language,
    aiRecommendations,
    acceptAIRecommendation,
    rejectAIRecommendation,
    showToast,
  } = useApp();

  const [isRecalibrating, setIsRecalibrating] = useState(false);

  const translateDataPoint = (dp: string, lang: 'ar' | 'en'): string => {
    const map: Record<string, { ar: string; en: string }> = {
      '165 حجز مؤكد (+42% أعلى من متوسط الأسبوع)': {
        ar: '165 حجز مؤكد (+42% أعلى من متوسط الأسبوع)',
        en: '165 confirmed bookings (+42% above weekly average)',
      },
      'سجل تاريخي مماثل أنتج 340 طبق كبسة ومضغوط خلال 3 ساعات': {
        ar: 'سجل تاريخي مماثل أنتج 340 طبق كبسة ومضغوط خلال 3 ساعات',
        en: 'Historical pattern produced 340 Kabsa & Madghout dishes in 3 hours',
      },
      'فجوة مجدولة: محطة الشواية والقدور تحتاج طاهي مساند': {
        ar: 'فجوة مجدولة: محطة الشواية والقدور تحتاج طاهي مساند',
        en: 'Scheduled gap: Grill and pot station requires backup cook',
      },
      'رصيد الحاشي: 14.5 كجم مقابل حد إعادة الطلب 25 كجم': {
        ar: 'رصيد الحاشي: 14.5 كجم مقابل حد إعادة الطلب 25 كجم',
        en: 'Hashi inventory: 14.5 kg vs 25 kg reorder point',
      },
      'زمن التوريد من مسلخ وادي الدواسر: 6 ساعات': {
        ar: 'زمن التوريد من مسلخ وادي الدواسر: 6 ساعات',
        en: 'Lead time from Wadi Al-Dawasir abattoir: 6 hours',
      },
      'نسبة مبيعات كبسة الحاشي تمثل 38% من مجمل المبيعات المسائية': {
        ar: 'نسبة مبيعات كبسة الحاشي تمثل 38% من مجمل المبيعات المسائية',
        en: 'Hashi Kabsa accounts for 38% of total evening sales',
      },
      'هدر متكرر للأرز المطهو بمتوسط 4.2 كجم في الورديات المتأخرة': {
        ar: 'هدر متكرر للأرز المطهو بمتوسط 4.2 كجم في الورديات المتأخرة',
        en: 'Repeated cooked rice waste averaging 4.2 kg on late shifts',
      },
      'انخفاض حركة طلبات الكبسة بعد الساعة 23:00 بنسبة 60%': {
        ar: 'انخفاض حركة طلبات الكبسة بعد الساعة 23:00 بنسبة 60%',
        en: '60% drop in Kabsa orders post 23:00',
      },
    };
    return map[dp]?.[lang] || dp;
  };

  const translateRecCategory = (cat: string, lang: 'ar' | 'en'): string => {
    const map: Record<string, { ar: string; en: string }> = {
      staffing: { ar: 'إدارة الطاقم والعمالة', en: 'Staffing & Labor' },
      inventory: { ar: 'المخزون وسلاسل الإمداد', en: 'Inventory & Supply' },
      scheduling: { ar: 'الورديات والجدولة', en: 'Shift Scheduling' },
      waste: { ar: 'الحد من الهدر الغذائي', en: 'Food Waste Mitigation' },
      revenue: { ar: 'تعظيم الإيرادات', en: 'Revenue Optimization' },
    };
    return map[cat]?.[lang] || cat;
  };

  const handleRecalibrate = () => {
    setIsRecalibrating(true);
    showToast(
      language === 'ar'
        ? 'جاري سحب تدفقات البيانات اللحظية وإعادة تدريب مصفوفة وادي الدواسر...'
        : 'Ingesting telemetry streams and recalibrating Wadi Al-Dawasir neural matrix...'
    );

    setTimeout(() => {
      setIsRecalibrating(false);
      showToast(
        language === 'ar'
          ? 'تمت معايرة نموذج RestoraAI بنجاح! نسبة دقة التنبؤ المحدثة: 95.6%'
          : 'RestoraAI model recalibrated successfully! Updated predictive accuracy: 95.6%'
      );
    }, 1500);
  };

  return (
    <PageContainer
      title={t.ai.title}
      subtitle={t.ai.subtitle}
      badge={
        <Badge variant="ai" size="md" dot>
          RestoraAI Deep Core v4.2
        </Badge>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="ai"
            size="sm"
            isLoading={isRecalibrating}
            onClick={handleRecalibrate}
            icon={isRecalibrating ? <RotateCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          >
            {language === 'ar' ? 'إعادة معايرة النماذج التنبؤية' : 'Recalibrate Neural Models'}
          </Button>
        </div>
      }
    >
      {/* Neural Performance Overview Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#08131F] via-[#121A30] to-[#1E1535] text-white border border-[#8B5CF6]/40 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 end-0 w-80 h-80 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 w-80 h-80 bg-[#4edee3]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#DDD6FE] text-xs font-semibold">
              <BrainCircuit className="w-4 h-4 text-[#C4B5FD]" />
              <span>{language === 'ar' ? 'محرك الذكاء التشغيلي التنبؤي' : 'Predictive Operations Engine'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {language === 'ar'
                ? 'تحليلات الذكاء الاصطناعي القابلة للتفسير (Explainable AI)'
                : 'Explainable AI Decision Intelligence'}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'يربط RestoraAI بيانات نقاط البيع (POS) وحركة الطقس في وادي الدواسر ومواسم التمور التاريخية لتوقع أعباء المطبخ وتقديم مقترحات استباقية قابلة للاعتماد بضغطة زر.'
                : 'RestoraAI fuses POS stream data, local weather telemetry, and regional seasonal patterns to forecast kitchen loads and surface actionable directives with 1-click execution.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-4 rounded-xl bg-[#08131F]/90 border border-[#182F48] text-center shadow-md">
              <span className="text-2xl font-black text-[#C4B5FD] font-mono">94.8%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                {language === 'ar' ? 'دقة التنبؤ بالطلب' : 'Forecast Accuracy'}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#08131F]/90 border border-[#182F48] text-center shadow-md">
              <span className="text-2xl font-black text-[#4edee3] font-mono">18.2%</span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                {language === 'ar' ? 'توفير الهدر الفعلي' : 'Waste Reduced'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Demand Predictions & Surges for Saudi Branch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="ai" hoverEffect>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">
                {language === 'ar' ? 'ذروة عشاء الجمعة (مهرجان التمور)' : 'Friday Night Surge (Dates Festival)'}
              </span>
              <Badge variant="ai">20:00 - 23:30</Badge>
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">+36% {language === 'ar' ? 'طلبات' : 'Orders'}</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'توقع إقبال مرتفع على كبسة حاشي بلدي ومظبي الدجاج. يوصى بمضاعفة تتبيل اللحوم بنسبة 35% بحلول الساعة 16:00.'
                : 'High influx anticipated for Hashi Kabsa and Madhbi. Recommended pre-marinating extra meat batches by 16:00.'}
            </p>
          </CardContent>
        </Card>

        <Card variant="ai" hoverEffect>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">
                {language === 'ar' ? 'إشغال صالة العوائل والمجالس' : 'Family Section & Majlis Saturation'}
              </span>
              <Badge variant="ai">{language === 'ar' ? 'الخميس 19:30' : 'Thursday 19:30'}</Badge>
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">100% {language === 'ar' ? 'إشغال' : 'Par'}</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'الحجوزات المسبقة تغطي 28 طاولة عائلية. تم توجيه الكابتن بإضافة مقاعد خدمة سريعة واستدعاء مضيف إضافي.'
                : 'Advance bookings cover 28 family tables. Suggests placing an additional floor captain on service duty.'}
            </p>
          </CardContent>
        </Card>

        <Card variant="ai" hoverEffect>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">
                {language === 'ar' ? 'توقع نفاد مخزون لحم الحاشي' : 'Hashi Meat Par Depletion'}
              </span>
              <Badge variant="error">{language === 'ar' ? 'خلال 24 ساعة' : 'Within 24h'}</Badge>
            </div>
            <p className="text-2xl font-black text-slate-900 font-mono">14.5 {language === 'ar' ? 'كجم متبقي' : 'kg left'}</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ar'
                ? 'معدل الاستهلاك تجاوز حد الأمان. تم إعداد مسودة أمر شراء تلقائي من مسلخ وادي الدواسر النموذجي.'
                : 'Consumption velocity exceeds safety threshold. PO draft generated for regional accredited abattoir.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deep Explainable AI Directive Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>{language === 'ar' ? 'التوجيهات التشغيلية التنبؤية القابلة للتطبيق (Live Directives)' : 'Live Predictive Directives & Telemetry'}</span>
        </h3>

        <div className="space-y-4">
          {aiRecommendations.map(rec => (
            <Card
              key={rec.id}
              variant="ai"
              className="border-purple-200/80 shadow-xs"
            >
              <div className="p-5 space-y-4">
                {/* Directive Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-purple-600 text-white shadow-xs">
                      <Zap className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {rec.title[language]}
                      </h4>
                      <p className="text-xs text-slate-500 capitalize">
                        {language === 'ar' ? 'الفئة التشغيلية' : 'Category'}: {translateRecCategory(rec.category, language)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="ai" size="sm">
                      {language === 'ar' ? 'درجة الثقة' : 'Confidence'}: {rec.confidence_score}%
                    </Badge>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        rec.urgency === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {language === 'ar'
                        ? rec.urgency === 'high'
                          ? 'أولوية قصوى'
                          : 'أولوية متوسطة'
                        : `${rec.urgency.toUpperCase()} URGENCY`}
                    </span>
                  </div>
                </div>

                {/* 3-Pillar Explainable AI Layout: Reasoning, Evidence, Business Impact */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Reasoning */}
                  <div className="p-3.5 rounded-xl bg-white border border-purple-100 space-y-1">
                    <span className="font-bold text-purple-950 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                      {language === 'ar' ? 'التفسير المنطقي (Why):' : 'Causal Reasoning (Why):'}
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {rec.description[language]}
                    </p>
                  </div>

                  {/* Evidence & Data Signals */}
                  <div className="p-3.5 rounded-xl bg-white border border-purple-100 space-y-1">
                    <span className="font-bold text-purple-950 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      {language === 'ar' ? 'إشارات البيانات الداعمة:' : 'Supporting Data Signals:'}
                    </span>
                    <ul className="text-slate-600 space-y-1 list-disc list-inside">
                      {rec.data_points?.map((dp: string, i: number) => (
                        <li key={i} className="leading-relaxed">
                          {translateDataPoint(dp, language)}
                        </li>
                      )) || (
                        <li>{language === 'ar' ? 'بيانات أجهزة نقاط البيع وحركة المبيعات اللحظية' : 'POS order stream & hourly foot traffic'}</li>
                      )}
                    </ul>
                  </div>

                  {/* Business Impact */}
                  <div className="p-3.5 rounded-xl bg-purple-100/60 border border-purple-200 space-y-1">
                    <span className="font-bold text-purple-950 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-purple-700" />
                      {language === 'ar' ? 'الأثر المالي والتشغيلي:' : 'Projected Operational Impact:'}
                    </span>
                    <p className="text-purple-900 font-semibold leading-relaxed">
                      {rec.impact[language]}
                    </p>
                  </div>
                </div>

                {/* Execution Footer */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                  <div className="text-xs text-slate-500 font-medium">
                    {language === 'ar' ? 'الحالة الحالية: ' : 'Status: '}
                    {rec.status === 'accepted' ? (
                      <span className="text-emerald-700 font-bold">
                        {language === 'ar' ? '✅ تم اعتماد الإجراء وتحديث جداول الفرع' : '✅ Directive accepted and synchronized'}
                      </span>
                    ) : rec.status === 'rejected' ? (
                      <span className="text-slate-400">
                        {language === 'ar' ? '❌ تم رفض المقترح' : '❌ Directive dismissed'}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-semibold">
                        {language === 'ar' ? '⏳ بانتظار اعتماد مدير التشغيل' : '⏳ Pending manager validation'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {rec.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            rejectAIRecommendation(rec.id);
                            showToast(language === 'ar' ? 'تم تجاهل التوصية التشغيلية' : 'Directive dismissed');
                          }}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          {language === 'ar' ? 'تجاهل المقترح' : 'Dismiss'}
                        </Button>
                        <Button
                          variant="ai"
                          size="sm"
                          onClick={() => {
                            acceptAIRecommendation(rec.id);
                            showToast(language === 'ar' ? 'تم اعتماد التوصية وتحديث منظومة وادي الدواسر فورا' : 'Directive approved and deployed to branch schedule');
                          }}
                          icon={<Check className="w-4 h-4" />}
                        >
                          {language === 'ar' ? 'اعتماد التوصية وتطبيقها' : 'Accept & Deploy'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};
