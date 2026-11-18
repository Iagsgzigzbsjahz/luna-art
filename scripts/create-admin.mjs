// إنشاء حساب المشرف (أنت) بأمان من جهازك.
// الاستخدام:  npm run create-admin -- you@example.com "كلمة-مرور-قوية-طويلة"
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("تأكد من وجود NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SERVICE_ROLE_KEY في ملف .env.local");
  process.exit(1);
}
if (!email || !password) {
  console.error('الاستخدام: npm run create-admin -- you@example.com "كلمة-المرور"');
  process.exit(1);
}
if (password.length < 12) {
  console.error("كلمة المرور قصيرة. استخدم 12 حرفاً على الأقل.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });

if (error) {
  console.error("فشل إنشاء الحساب:", error.message);
  process.exit(1);
}
console.log("تم إنشاء حساب المشرف:", data.user.email);
console.log("إن كان هذا أول مستخدم في المشروع فقد أصبح المشرف تلقائياً.");
