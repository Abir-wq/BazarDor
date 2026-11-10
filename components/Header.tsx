"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { categoryLinks, Product, productChange, productName, productPrice, money, bn } from "@/lib/products";

const categoryIcons: Record<string, string> = {chal:"🍚",dal:"🫘",tel:"🛢️",sobji:"🥬",mach:"🐟",mangsho:"🍗","dim-dui":"🥛",mosla:"🌶️"};
const fallbackTicker = ["বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর", "সর্বশেষ তথ্য দেখতে একটি পণ্য নির্বাচন করুন"];

export default function Header({ products = [] }: { products?: Product[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const date = new Intl.DateTimeFormat("bn-BD",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
  const [tickerProducts, setTickerProducts] = useState<Product[]>([]);
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const menuOpen = openMenuPath === pathname;
  useEffect(()=>{if(products.length)return;const controller=new AbortController();fetch("/api/bazardor/products",{signal:controller.signal}).then(r=>r.ok?r.json():null).then(data=>{if(!controller.signal.aborted&&data){const items=Array.isArray(data)?data:Array.isArray(data.data)?data.data:Array.isArray(data.data?.products)?data.data.products:Array.isArray(data.products)?data.products:[];setTickerProducts(items);}}).catch(()=>{});return()=>controller.abort()},[products.length]);
  async function logout() {
    const { error } = await authClient.signOut();
    if (error) {toast.error("সাইন আউট করা যায়নি");return;}
    setOpenMenuPath(null);toast.success("সাইন আউট সফল হয়েছে");router.push("/");router.refresh();
  }
  const currentProducts = products.length ? products : tickerProducts;
  const ticker = currentProducts.length ? currentProducts.slice(0, 14).map(p=>{const change=productChange(p);return `${productName(p)} · ${money(productPrice(p))} ${change.direction === "up" ? "▲" : change.direction === "down" ? "▼" : "—"} ${bn(change.amount.toFixed(1))}%`;}) : fallbackTicker;
  return <>
    <header className="bd-header relative z-30">
      <div className="bd-container flex h-[68px] items-center justify-between">
        <Link href="/" aria-label="বাজার দর হোম" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#05893e] text-[20px] text-white"><img src="/logo-icon.png" alt="" className="h-6 w-6 object-contain"/></span>
          <span className="flex flex-col"><span className="text-[20px] leading-7 font-bold">বাজার দর</span><span className="text-[12px] leading-4 bd-muted">{date}</span></span>
        </Link>
        {isPending ? <span className="text-xs bd-muted">লোড হচ্ছে...</span> : session?.user ? <div className="relative">
          <button type="button" onClick={()=>setOpenMenuPath(v=>v===pathname?null:pathname)} aria-expanded={menuOpen} aria-label="অ্যাকাউন্ট মেনু" className="flex h-10 items-center gap-2 rounded-lg px-2 hover:bg-[#f0f5f0]">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-[#e1e8e1] bg-[#e3f1e7] font-bold text-[#047f39]">{session.user.name?.slice(0,1).toUpperCase() || "👤"}</span>
            <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">{session.user.name?.split(" ")[0]}</span><span className="text-sm">▾</span>
          </button>
          {menuOpen && <div className="absolute right-0 top-12 z-50 min-w-60 rounded-xl border border-[#e1e8e1] bg-[#fafcfa] p-2 shadow-xl">
            <div className="border-b border-[#e1e8e1] px-3 py-2"><p className="truncate text-sm font-semibold">{session.user.name}</p><p className="truncate text-xs bd-muted">{session.user.email}</p></div>
            <Link href="/profile" className="mt-1 block rounded-md px-3 py-2 text-sm hover:bg-[#f0f5f0]">👤 আমার প্রোফাইল</Link>
            <button type="button" className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[#f0f5f0]" onClick={logout}>↩ সাইন আউট</button>
          </div>}
        </div> : <div className="flex items-center gap-2"><Link href="/signin" className="bd-button bd-button-outline">সাইন ইন</Link><Link href="/signup" className="bd-button">সাইন আপ</Link></div>}
      </div>
      <nav className="border-t border-[#e1e8e1]" aria-label="পণ্যের বিভাগ">
        <div className="bd-container flex h-[49px] items-center gap-1 overflow-x-auto whitespace-nowrap">
          {categoryLinks.map(category=><Link key={category.slug} href={`/category/${category.slug}`} className={`bd-chip ${pathname===`/category/${category.slug}` ? "bd-chip-active" : ""}`}><span>{categoryIcons[category.slug]}</span>{category.label}</Link>)}
        </div>
      </nav>
    </header>
    <div className="bd-ticker" aria-label="সাম্প্রতিক বাজারদর"><div className="bd-ticker-track">{[...ticker,...ticker].map((item,i)=><span key={`${i}-${item}`}>{item}</span>)}</div></div>
  </>;
}
