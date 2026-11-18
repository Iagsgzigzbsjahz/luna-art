# Luna Art | معرض فني خاص

موقع معرض رسمات أنيق (Next.js 14 + TypeScript + Tailwind + Supabase + Vercel)، عربي RTL بالكامل.
اسم الفنانة المعروض واسمك وكل النصوص تتغير من لوحة التحكم دون لمس الأكواد.
لا يوجد في المشروع أي اسم حقيقي أو صورة حقيقية.

---
## Vr#DJ/3&ws/@q9s   passowrd
## 1) المتطلبات
- Node.js 20 أو أحدث
- حساب مجاني على [Supabase](https://supabase.com) و[Vercel](https://vercel.com) و[GitHub](https://github.com)

## 2) إنشاء مشروع Supabase
1. من Supabase اضغط **New project**، اختر اسماً ومنطقة قريبة، وضع **كلمة مرور قوية** لقاعدة البيانات واحفظها.
2. انتظر اكتمال الإنشاء (دقيقة تقريباً).
3. من **Project Settings > API** انسخ: `Project URL` و `anon public key` و `service_role key`.

## 3) تشغيل ملف SQL
1. افتح **SQL Editor > New query**.
2. انسخ محتوى `supabase/migrations/01_init.sql` كاملاً والصقه ثم اضغط **Run**.
3. هذا الملف ينشئ: الجداول (`categories`, `artworks`, `site_settings`, `profiles`)، سياسات الأمان (القراءة للجميع والكتابة للمشرف فقط)، التصنيفات الأربعة الأولى، والإعدادات الافتراضية، وحاويتي التخزين.

## 4) حاويات التخزين (Buckets)
تُنشأ تلقائياً من ملف SQL: `artworks` و `avatars` (عامتان، الرفع للمشرف فقط). للتأكد افتح **Storage** وستجدهما.
إن لم تظهرا أنشئهما يدوياً بنفس الاسمين مع تفعيل **Public bucket**، ثم أعد تشغيل ملف SQL.

## 5) إيقاف التسجيل العام (مهم للأمان)
من **Authentication > Sign In / Providers** أوقف خيار **Allow new users to sign up**.
هكذا لا يستطيع أحد إنشاء حساب سواك.

## 6) إنشاء حساب المشرف
1. انسخ `.env.example` إلى `.env.local` واملأ القيم الثلاث.
2. بعد تثبيت الحزم (الخطوة التالية) شغّل:
   ```bash
   npm run create-admin -- you@example.com "كلمة-مرور-قوية-وطويلة"
   ```
   يعمل هذا الأمر على جهازك فقط، ويصبح أول حساب يُنشأ هو المشرف تلقائياً.
   (بديل: **Authentication > Users > Add user** من لوحة Supabase، مع تفعيل Auto Confirm.)

## 7) التشغيل محلياً
```bash
npm install
npm run dev
```
افتح http://localhost:3000 ثم http://localhost:3000/admin/login وسجّل الدخول.

## 8) أول استخدام
1. **إعدادات الموقع**: غيّر اسم الفنانة (الافتراضي Luna Art) واسمك ونبذتها ورسالتك، وأضف رسماً توضيحياً كصورة رمزية.
2. **التصنيفات**: أضف ما تريد (حب، حزن، ذكريات...) وستظهر في الفلاتر فوراً.
3. **إضافة رسمة**: ارفع الصورة واكتب قصتها. فعّل «مميزة» لتظهر في شريط الصفحة الرئيسية.

## 9) النشر على Vercel
1. ارفع المشروع إلى مستودع **خاص** على GitHub (ملف `.gitignore` يمنع رفع `.env.local`).
2. في Vercel: **Add New > Project** واختر المستودع.
3. في **Environment Variables** أضف:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = رابط موقعك النهائي (مثل `https://luna-art.vercel.app`)
   - `NEXT_PUBLIC_ALLOW_INDEXING` = `false`
   - لا تضف `SUPABASE_SERVICE_ROLE_KEY` إلى Vercel أبداً.
4. اضغط **Deploy**.
5. في Supabase: **Authentication > URL Configuration** ضع رابط الموقع في Site URL.

## الخصوصية والأمان المضمّنان
- الموقع مخفي عن محركات البحث افتراضياً (`noindex` و `robots.txt`). غيّر `NEXT_PUBLIC_ALLOW_INDEXING` إلى `true` فقط إن أردت العكس.
- تُحذف بيانات الصور الخفية (EXIF مثل موقع التصوير) تلقائياً قبل الرفع، وتُصغّر الصور وتُحوّل إلى WebP.
- RLS مفعّل على كل الجداول: الزوار يقرؤون فقط، والكتابة للمشرف وحده (فحص `is_admin()` في قاعدة البيانات).
- لوحة التحكم محمية بثلاث طبقات: middleware، وفحص على الخادم، وسياسات RLS.
- رؤوس أمان (CSP, HSTS, X-Frame-Options...) في `next.config.mjs`.
- لا توجد سياسة تسمح بسرد ملفات التخزين؛ الصور تُفتح فقط بروابطها المباشرة العشوائية.
- فعّل المصادقة الثنائية (2FA) على حسابات GitHub وVercel وSupabase.

## هيكل المشروع
```
src/app/(site)/      الصفحات العامة: / و /gallery و /artwork/[id] و /about
src/app/admin/       تسجيل الدخول ولوحة التحكم
src/components/      المكوّنات (home, gallery, admin, ui, layout)
src/lib/             البيانات وعملاء Supabase ومعالجة الصور
supabase/migrations/ ملف قاعدة البيانات
scripts/             سكربت إنشاء المشرف
```

## استكشاف الأخطاء
- **الصور لا تظهر**: تأكد أن `NEXT_PUBLIC_SUPABASE_URL` صحيح ثم أعد تشغيل `npm run dev`.
- **لا أستطيع الدخول**: تأكد أنك أنشأت الحساب بخطوة 6 وأن ملف SQL شُغّل قبل إنشائه.
- **تعديل لا يظهر**: يتحدث الموقع فوراً بعد الحفظ، وإلا فحدّث الصفحة.
