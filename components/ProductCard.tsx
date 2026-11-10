import Link from "next/link";
import { Product, productChange, productId, productImage, productName, productPrice, money, unitName, bn } from "@/lib/products";
export default function ProductCard({product}:{product:Product}) {
  const change=productChange(product), image=productImage(product), id=productId(product);
  return <Link href={id ? `/product/${encodeURIComponent(id)}` : "#"} className="bd-card bd-product-card" aria-label={`${productName(product)}-এর দাম ও বিস্তারিত`}>
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0f5f0] text-[24px]">
        {/^https?:\/\//.test(image) ? <img src={image} className="h-full w-full object-contain" alt=""/> : image}
      </div>
      <div className="min-w-0"><h3 className="truncate text-[16px] leading-6 font-semibold">{productName(product)}</h3><p className="text-[12px] leading-4 bd-muted">প্রতি {unitName(product.unit)}</p></div>
    </div>
    <div className="mt-3 flex items-end justify-between gap-2">
      <div><p className="text-[12px] leading-4 bd-muted">আজকের দাম</p><p className="text-[20px] leading-7 font-bold">{money(productPrice(product))}</p></div>
      <span className={`rounded-full px-2 py-1 text-[12px] font-semibold ${change.direction==="up" ? "bg-[#fff1f1] text-[#dc2626]" : change.direction==="down" ? "bg-[#e9f9ee] text-[#05893e]" : "bg-[#f0f5f0] text-[#69766b]"}`}>{change.direction==="up" ? "▲" : change.direction==="down" ? "▼" : "—"} {bn(change.amount.toFixed(1))}%</span>
    </div>
  </Link>;
}
