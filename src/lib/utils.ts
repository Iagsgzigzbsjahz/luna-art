import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** يحوّل اسم التصنيف إلى رابط مختصر يدعم العربية. */
export function slugify(input: string) {
  const s = input
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return s || `cat-${Math.random().toString(36).slice(2, 8)}`;
}

/** توحيد النص العربي للبحث: يتجاهل التشكيل ويوحّد الهمزات والياء والتاء المربوطة. */
export function normalizeArabic(s: string) {
  return s
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

const dateFormatter = new Intl.DateTimeFormat("ar-u-ca-gregory-nu-latn", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatDate(iso: string) {
  try {
    return dateFormatter.format(new Date(iso));
  } catch {
    return "";
  }
}
