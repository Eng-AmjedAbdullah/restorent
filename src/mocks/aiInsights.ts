import type { AIInsight, OperationalAlert } from '@/types/domain';

export const mockAIInsights: Record<string, AIInsight[]> = {
  'rest-1': [
    {
      id: 'ins-101',
      restaurant_id: 'rest-1',
      category: 'staffing',
      title: {
        ar: 'اقتراح إعادة توزيع وردية الغداء (محاكاة نموذجية)',
        en: 'Lunch Shift Rebalancing (Simulation Preview)'
      },
      description: {
        ar: 'بناءً على وتيرة الحجوزات المتوقعة يوم الخميس بين 1:00م - 3:30م، يُنصح بتعزيز محطة الخط الساخن بمساعد طاهٍ إضافي لتجنب تجاوز زمن تجهيز طلبات الستيك عن 18 دقيقة.',
        en: 'Simulated demand curve projects elevated volume on Thursday 1:00 PM - 3:30 PM. Adding 1 prep cook reduces steak ticket times by an estimated 4.2 minutes.'
      },
      impact: {
        ar: 'تقليص وقت الانتظار بمقدار 4 دقائق وتفادي ازدحام المطبخ',
        en: 'Estimated -4 mins wait time, smoother kitchen throughput'
      },
      urgency: 'high',
      confidence_score: 93,
      data_points: ['38 طاولة محجوزة مسبقًا', 'توقع تدفق 140 زائر', 'متوسط زمن التجهيز الحالي 21 دقيقة'],
      suggested_action: {
        ar: 'تقديم بداية وردية ريم الشهري بمقدار 45 دقيقة',
        en: 'Advance Reem Al-Shehri shift start by 45 mins'
      },
      status: 'pending',
      preview_badge: {
        ar: 'تنبؤ تشغيلي ذكي',
        en: 'AI Shift Optimization'
      },
      created_at: '2026-03-22T08:00:00Z',
      updated_at: '2026-03-22T08:00:00Z'
    },
    {
      id: 'ins-102',
      restaurant_id: 'rest-1',
      category: 'inventory',
      title: {
        ar: 'تنبيه طلب توريد معجون الكمأة واللحم الاستباقي',
        en: 'Truffle & Prime Angus Predictive Reorder Advisory'
      },
      description: {
        ar: 'المخزون الحالي من معجون الكمأة (3.2 كجم) وريب آي الأنجوس يقترب من حد الأمان. تشير توقعات مبيعات عطلة نهاية الأسبوع إلى نفاذ الكمية مساء الجمعة ما لم يتم إصدار أمر توريد اليوم.',
        en: 'Black truffle paste (3.2kg) and Angus ribeye are trending near par threshold. Weekend forecast projects stockout by Friday night unless a purchase order is placed today.'
      },
      impact: {
        ar: 'حماية إيرادات متوقعة بقيمة 18,500 ر.س لعطلة نهاية الأسبوع',
        en: 'Protects approx. 18,500 SAR in projected weekend revenue'
      },
      urgency: 'high',
      confidence_score: 96,
      data_points: ['المتبقي من معجون الكمأة: 1.2 يوم', 'الريب آي: 2.5 يوم استهلاك', 'مدة توصيل المورد: 24 ساعة'],
      suggested_action: {
        ar: 'إنشاء مسودة طلب توريد آلي معتمد للموردين',
        en: 'Generate automated purchase order draft'
      },
      status: 'pending',
      preview_badge: {
        ar: 'تحليل استباقي للمخزون',
        en: 'Predictive Stock Analysis'
      },
      created_at: '2026-03-22T08:15:00Z',
      updated_at: '2026-03-22T08:15:00Z'
    },
    {
      id: 'ins-103',
      restaurant_id: 'rest-1',
      category: 'waste',
      title: {
        ar: 'تحليل ضبط هدر الخضار الورقية والأعشاب الطازجة',
        en: 'Leafy Greens & Fresh Herbs Waste Optimization'
      },
      description: {
        ar: 'سجل هدر الأعشاب العطرية وصل إلى 5.5 كجم هذا الأسبوع نتيجة التجهيز المسبق الزائد. تعديل وتيرة التحضير إلى فترتين صباحية ومسائية يقلل الفاقد بنسبة 35%.',
        en: 'Herb preparation shrinkage reached 5.5kg this week due to single-batch morning prep. Shifting to split-prep cycles cuts waste by an estimated 35%.'
      },
      impact: {
        ar: 'توفير شهري تقديري 2,400 ر.س وخفض الهدر بنسبة 35%',
        en: 'Estimated 2,400 SAR monthly savings and 35% waste reduction'
      },
      urgency: 'medium',
      confidence_score: 89,
      data_points: ['الهدر المسجل 5.5 كجم', 'التجهيز الحالي: دفعة واحدة 8:00 صباحًا'],
      suggested_action: {
        ar: 'تطبيق جدول التقطيع المجزأ (11:30 ص و 5:30 م)',
        en: 'Adopt split-batch prep workflow (11:30 AM & 5:30 PM)'
      },
      status: 'accepted',
      preview_badge: {
        ar: 'استدامة وخفض التكاليف',
        en: 'Cost Efficiency Optimization'
      },
      created_at: '2026-03-21T18:00:00Z',
      updated_at: '2026-03-22T09:00:00Z'
    }
  ],
  'rest-2': [
    {
      id: 'ins-201',
      restaurant_id: 'rest-2',
      category: 'staffing',
      title: {
        ar: 'تنبيه تغطية جلسات الشرفة البحرية الخارجية بالذكاء الاصطناعي',
        en: 'Waterfront Terrace Weather Staffing Forecast'
      },
      description: {
        ar: 'تشير بيانات الطقس إلى انخفاض درجات الحرارة مساء اليوم إلى 24°م، مما يرجح ارتفاع الإقبال على الشرفة البحرية الخارجية بنسبة 40%.',
        en: 'Evening coastal forecast of 24°C indicates higher outdoor terrace demand. Projected +40% table requests from 6:30 PM.'
      },
      impact: {
        ar: 'تحسين سرعة خدمة الجلسات الخارجية وزيادة دورة الطاولات',
        en: 'Improves terrace table turns and guest service cadence'
      },
      urgency: 'medium',
      confidence_score: 91,
      data_points: ['حرارة المساء 24°م', 'حجوزات الشرفة 85% ممتلئة'],
      suggested_action: {
        ar: 'تكليف نادل إضافي لتغطية طاولات الواجهة',
        en: 'Allocate 1 additional server to terrace zone'
      },
      status: 'pending',
      preview_badge: {
        ar: 'توصية تشغيلية ذكية',
        en: 'AI Operations Forecast'
      },
      created_at: '2026-03-22T08:30:00Z',
      updated_at: '2026-03-22T08:30:00Z'
    }
  ],
  'rest-3': [
    {
      id: 'ins-301',
      restaurant_id: 'rest-3',
      category: 'revenue',
      title: {
        ar: 'اقتراح حزمة الوجبات السريعة لفترة ذروة الأعمال',
        en: 'Express Lunch Combo Velocity Model'
      },
      description: {
        ar: 'يُظهر تحليل نمط طلبات الشركات المجاورة بين 12:00 و 2:00 ظهرًا إمكانية رفع متوسط قيمة التذكرة بنسبة 18% عند دمج البطاطس بالكمأة كخيار افتراضي مخفض.',
        en: 'Corporate lunch rush data suggests bundling truffle fries at +15 SAR lifts lunch ticket average by 18%.'
      },
      impact: {
        ar: 'زيادة متوقعة في إيراد وجبات الغداء بنسبة 18%',
        en: 'Projected +18% revenue during 12:00 - 2:00 PM peak'
      },
      urgency: 'medium',
      confidence_score: 88,
      data_points: ['تركز الطلبات 12:30م', 'إقبال 65% على البطاطس بالكمأة'],
      suggested_action: {
        ar: 'تفعيل خيار الترقية السريعة على شاشات الكاشير',
        en: 'Enable quick-upsell button on POS terminals'
      },
      status: 'pending',
      preview_badge: {
        ar: 'تحسين الإيرادات',
        en: 'Revenue Velocity Insight'
      },
      created_at: '2026-03-22T08:00:00Z',
      updated_at: '2026-03-22T08:00:00Z'
    }
  ]
};

export const mockAlerts: OperationalAlert[] = [
  {
    id: 'alt-101',
    restaurant_id: 'rest-1',
    title: { ar: 'مخزون حرج: معجون الكمأة السوداء', en: 'Critical Stock: Black Truffle Paste' },
    message: { ar: 'المتبقي 3.2 كجم فقط - يكفي لمدة 1.2 يوم تشغيل بالوتيرة الحالية.', en: 'Only 3.2kg remaining - estimated 1.2 days coverage.' },
    type: 'critical',
    urgency: 'high',
    read: false,
    action_route: '/inventory',
    created_at: '2026-03-22T08:15:00Z',
    updated_at: '2026-03-22T08:15:00Z'
  },
  {
    id: 'alt-102',
    restaurant_id: 'rest-1',
    title: { ar: 'تسجيل حالة تأخير: خالد العتيبي', en: 'Late Check-in: Khalid Al-Otaibi' },
    message: { ar: 'تسجيل الحضور في 09:12 (تأخير 12 دقيقة عن موعد الوردية).', en: 'Clock-in at 09:12 (12 minutes past scheduled shift).' },
    type: 'operational',
    urgency: 'medium',
    read: false,
    action_route: '/attendance',
    created_at: '2026-03-22T09:12:00Z',
    updated_at: '2026-03-22T09:12:00Z'
  },
  {
    id: 'alt-103',
    restaurant_id: 'rest-1',
    title: { ar: 'توقعات الذكاء الاصطناعي: ضغط وردية الغداء', en: 'AI Forecast: Lunch Peak Traffic' },
    message: { ar: 'تشير التوقعات الذكية إلى وصول 38 طاولة محجوزة في ساعة الذروة.', en: 'Predictive intelligence forecasts 38 reserved tables peak between 1:00-3:00 PM.' },
    type: 'operational',
    urgency: 'low',
    read: true,
    action_route: '/ai-intelligence',
    created_at: '2026-03-22T08:00:00Z',
    updated_at: '2026-03-22T08:00:00Z'
  },
  {
    id: 'alt-201',
    restaurant_id: 'rest-2',
    title: { ar: 'مخزون منخفض: سمك سيباس طازج', en: 'Low Stock: Fresh Sea Bass' },
    message: { ar: 'الكمية الحالية 12 كجم تحت حد إعادة الطلب (20 كجم).', en: 'Current stock 12kg below reorder point (20kg).' },
    type: 'critical',
    urgency: 'high',
    read: false,
    action_route: '/inventory',
    created_at: '2026-03-22T08:00:00Z',
    updated_at: '2026-03-22T08:00:00Z'
  }
];
