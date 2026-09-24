# RestoraIntel — Vue-only source (cleaned release candidate)

**هذه نسخة مصدرية من مشروعك المُصلح**: يعمل التطبيق النشط بـVue 3 + TypeScript + Vite + Pinia + Vue Router. أُزيلت جميع ملفات React/TSX واعتمادياتها المباشرة، وحُذفت الصور المكررة أو غير المستخدمة بعد فحص مراجع الصور في الواجهة. أُبقيت الصور الأصلية المستخدمة في معرض الهوية والشعار الحقيقي دون تغيير رسومي، مع تصحيح حواف أيقونات المتصفح وPWA لتصبح مربعة بلا تشويه.

**هذا مشروع محاكاة (mock-first)**، وليس خادم مطاعم حقيقيًا: لا يوجد اتصال بقاعدة Laravel أو جهاز بصمة أو نموذج AI حقيقي، ولا ينبغي نشر المصادقة التجريبية كنظام إنتاجي.

## المتطلبات والتشغيل

يفضَّل Node.js 22 مع Bun متوافق مع `bun.lock`. بعد فك الضغط، من داخل مجلد `RestoraIntel`:

```bash
bun install --frozen-lockfile
bun test
npm run typecheck
npm run lint
npm run build
npm run dev
```

افتح الرابط المحلي الذي يعرضه Vite. حسابات العرض التجريبي في شاشة الدخول، وكلمة المرور المشتركة `Demo!12345` **للمحاكاة فقط**.

### فحوص إضافية عند تعذّر تثبيت جميع الحزم

```bash
npm run verify:assets
npm run verify:offline
npm run verify:core
```

`verify:offline` يستخدم TypeScript المثبت محليًا أو عالميًا، ومشغّل توافق Node لاختبارات `bun:test`. **هذا ليس بديلًا عن اختبارات Bun الحقيقية أو فحص قوالب Vue أو البناء الإنتاجي أو اختبار المتصفح.** أمر `npm run lint` في هذا المشروع يشغّل `tsc --noEmit`، وليس ESLint مستقلًا.

## أين تجد التقرير؟

- `docs/FINAL_DELIVERY_REPORT.md`: ما أنجز بالفعل وحدود التحقق.
- `docs/LEGACY_REACT_VUE_PARITY_MATRIX.md`: حالة كل صفحة والملاحظات المتبقية.
- `docs/REACT_REMOVAL_MANIFEST.md`: قائمة ملفات React المحذوفة.
- `docs/ASSET_MANIFEST.md`: الصور الباقية والمحذوفة وسبب الاحتفاظ بها.
- `docs/MOCK_DATA_ARCHITECTURE.md`: الخدمات وMockDataProvider والأخطاء والصلاحيات.
- `docs/archive/`: تقارير قديمة للرجوع التاريخي فقط؛ لا تصف النسخة الحالية.

**النسخ الاحتياطية خارج هذا المشروع:** ملف ZIP الأصلي السابق يحتوي على ملفات React. يوجد كذلك ملف منفصل للصور المحذوفة `restoraintel-unused-branding-backup.zip`. كلاهما محفوظ خارج هذا المجلد النظيف حتى لا يعيدا زيادة حجم النسخة النشطة.
