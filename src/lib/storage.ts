import type { SupabaseClient } from "@supabase/supabase-js";

type Bucket = "artworks" | "avatars";

/**
 * يعالج الصورة داخل المتصفح قبل الرفع:
 *  - يعيد رسمها على canvas فتُحذف كل بيانات EXIF (ومنها موقع التصوير GPS) حفاظا على الخصوصية.
 *  - يصغّر الأبعاد الكبيرة ويحوّلها إلى WebP لسرعة التحميل.
 */
export async function processImage(file: File, maxSide = 2400, quality = 0.88): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("تعذر قراءة الصورة. جرّب صورة بصيغة JPG أو PNG أو WebP.");
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("المتصفح لا يدعم معالجة الصور.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const toBlob = (type: string) => new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality));
  let blob = await toBlob("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await toBlob("image/jpeg");
  if (!blob) throw new Error("تعذر تجهيز الصورة للرفع.");
  return blob;
}

export async function uploadImage(supabase: SupabaseClient, bucket: Bucket, blob: Blob) {
  const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    throw new Error("تعذر رفع الصورة. تأكد من الاتصال ومن أن حجمها أقل من 10 ميجابايت.");
  }
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function removeImage(supabase: SupabaseClient, bucket: Bucket, url?: string | null) {
  if (!url) return;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i < 0) return;
  const path = decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
  try {
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // لا نوقف العملية إن تعذر حذف الملف القديم.
  }
}
