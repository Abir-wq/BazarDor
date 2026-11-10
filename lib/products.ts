// Shared helpers for the API. The assignment's product API may nest its results.

export type Product = {
  id?: number | string; _id?: string; slug?: string;
  name?: string; nameBn?: string; title?: string;
  category?: string; categorySlug?: string; categoryName?: string; categoryNameBn?: string;
  unit?: string; emoji?: string; image?: string; imageUrl?: string;
  today?: number | string; price?: number | string; currentPrice?: number | string;
  minPrice?: number | string; maxPrice?: number | string; avgPrice?: number | string;
  minimumPrice?: number | string; maximumPrice?: number | string; averagePrice?: number | string;
  yesterday?: number | string; lastWeek?: number | string; lastMonth?: number | string;
  description?: string;
  change?: { dir?: string; pct?: number | string };
  priceChange?: number | string;
  markets?: unknown; bazars?: unknown; marketPrices?: unknown; bazarPrices?: unknown;
};

// Bengali digits must be converted before numeric sorting or calculations.
export function toNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const normalized = String(value)
    .replace(/[০-৯]/g, ch => String("০১২৩৪৫৬৭৮৯".indexOf(ch)))
    .replace(/[,৳\s]/g, "");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

export function bn(value: string | number): string {
  return String(value).replace(/\d/g, digit => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}
export function money(value: number | null) {
  return value === null ? "তথ্য নেই" : `${bn(value.toLocaleString("en-US"))} টাকা`;
}
export function productPrice(p: Product) { return toNumber(p.today ?? p.currentPrice ?? p.price); }
export function productName(p: Product) { return p.nameBn || p.name || p.title || "পণ্যের নাম"; }
export function productId(p: Product) { return String(p.id ?? p.slug ?? p._id ?? ""); }
export function productImage(p: Product) { return p.emoji || p.image || p.imageUrl || "🛒"; }
export function productCategory(p: Product) { return p.categorySlug || p.category || "other"; }
export function unitName(unit?: string) {
  const map: Record<string, string> = { kg: "কেজি", kilogram: "কেজি", litre: "লিটার", liter: "লিটার", dozen: "ডজন", piece: "পিস", pcs: "পিস" };
  return map[unit?.toLowerCase() || ""] || unit || "কেজি";
}
export function productChange(p: Product): { direction: "up" | "down" | "same"; amount: number } {
  const pct = toNumber(p.change?.pct ?? p.priceChange);
  if (p.change?.dir === "up") return { direction: "up", amount: Math.abs(pct ?? 0) };
  if (p.change?.dir === "down") return { direction: "down", amount: Math.abs(pct ?? 0) };
  if (pct !== null && pct !== 0) return { direction: pct > 0 ? "up" : "down", amount: Math.abs(pct) };
  const today = productPrice(p), yesterday = toNumber(p.yesterday);
  if (today !== null && yesterday !== null && yesterday > 0) {
    const delta = 100 * (today - yesterday) / yesterday;
    return { direction: delta > 0 ? "up" : delta < 0 ? "down" : "same", amount: Math.abs(delta) };
  }
  return { direction: "same", amount: 0 };
}
export function unwrapArray(response: unknown): Product[] {
  if (Array.isArray(response)) return response as Product[];
  if (!response || typeof response !== "object") return [];
  const obj = response as Record<string, unknown>;
  for (const key of ["data", "products", "result", "items"]) {
    if (Array.isArray(obj[key])) return obj[key] as Product[];
    if (obj[key] && typeof obj[key] === "object") {
      const nested = unwrapArray(obj[key]);
      if (nested.length) return nested;
    }
  }
  return [];
}
export function unwrapOne(response: unknown): Product | null {
  if (!response || typeof response !== "object") return null;
  const obj = response as Record<string, unknown>;
  if (obj.product && typeof obj.product === "object") return obj.product as Product;
  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) return unwrapOne(obj.data) || obj.data as Product;
  if (obj.name || obj.nameBn || obj.today || obj.price) return obj as Product;
  return null;
}

export const categoryLinks = [
  { slug: "chal", label: "চাল" }, { slug: "dal", label: "ডাল" },
  { slug: "tel", label: "তেল" }, { slug: "sobji", label: "সবজি" },
  { slug: "mach", label: "মাছ" }, { slug: "mangsho", label: "মাংস" },
  { slug: "dim-dui", label: "ডিম-দুধ" }, { slug: "mosla", label: "মসলা" },
];

export async function fetchProducts(signal?: AbortSignal) {
  const res = await fetch("/api/bazardor/products", { signal, cache: "no-store" });
  if (!res.ok) throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  return unwrapArray(await res.json());
}
