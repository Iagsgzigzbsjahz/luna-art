import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return allow
    ? { rules: { userAgent: "*", allow: "/", disallow: ["/admin"] } }
    : { rules: { userAgent: "*", disallow: "/" } };
}
