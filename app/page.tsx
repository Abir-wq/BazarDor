"use client";
import {useEffect,useMemo,useState} from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import LoadingCards from "@/components/LoadingCards";
import {fetchProducts,Product,categoryLinks,productCategory,productChange,productName,productPrice,bn} from "@/lib/products";

const icons:Record<string,string>={chal:"🍚",dal:"🫘",tel:"🛢️",sobji:"🥬",mach:"🐟",mangsho:"🍗","dim-dui":"🥛",mosla:"🌶️"};
export default function Home(){
 const [products,setProducts]=useState<Product[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
 const [query,setQuery]=useState(""),[category,setCategory]=useState("all"),[sort,setSort]=useState("default");
 const date = new Intl.DateTimeFormat("bn-BD",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(new Date());
 useEffect(()=>{const controller=new AbortController();fetchProducts(controller.signal).then(items=>{if(!items.length)throw new Error("No products returned");setProducts(items)}).catch(e=>{if(e.name!=="AbortError")setError("দুঃখিত, এই মুহূর্তে পণ্যের তথ্য লোড হচ্ছে না।")}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return ()=>controller.abort()},[]);
 const risers=useMemo(()=>products.filter(p=>productChange(p).direction==="up").sort((a,b)=>productChange(b).amount-productChange(a).amount).slice(0,6),[products]);
 const fallers=useMemo(()=>products.filter(p=>productChange(p).direction==="down").sort((a,b)=>productChange(b).amount-productChange(a).amount).slice(0,6),[products]);
 const allFiltered=useMemo(()=>products.filter(p=>{
   const matchesQuery=productName(p).toLowerCase().includes(query.trim().toLowerCase());
   const matchesCategory=category==="all" || productCategory(p)===category;
   return matchesQuery && matchesCategory;
 }).sort((a,b)=>{if(sort==="default")return 0;const ap=productPrice(a)??Infinity,bp=productPrice(b)??Infinity;return sort==="low"?ap-bp:bp-ap}),[products,query,category,sort]);
 const grid=(items:Product[])=>items.length?<div className="bd-product-grid">{items.map((p,i)=><ProductCard key={String(p.id??p.slug??i)} product={p}/>)}</div>:<div className="bd-card p-6 text-sm bd-muted">এই বিভাগে কোনো পণ্য পাওয়া যায়নি।</div>;
 return <><Header products={products}/><main className="bd-container pt-6 pb-2">
   <section className="bd-surface flex min-h-[283px] flex-col-reverse items-center justify-between gap-5 overflow-hidden px-4 py-6 md:flex-row md:items-start md:pl-4 md:pr-8 md:py-[10px]">
     <div className="max-w-[620px] flex-1">
       <span className="inline-flex rounded-lg bg-[#e5f6e9] px-3 py-1 text-[14px] font-medium text-[#05893e]">{date}</span>
       <h1 className="mt-2 text-[30px] leading-[1.25] font-bold md:text-[36px]">আজকের বাজারের দাম এক নজরে</h1>
       <p className="mt-3 max-w-[585px] text-[16px] leading-6 bd-muted">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক দাম এক জায়গায়।</p>
       <a href="#সব-পণ্য" className="bd-button mt-5">সব পণ্য দেখুন ↓</a>
     </div>
     <div className="flex w-full max-w-[315px] shrink-0 justify-center md:w-[315px]"><img src="/bazar-hero.png" alt="বাজারের পণ্যের ইলাস্ট্রেশন" className="h-auto max-h-[263px] w-full object-contain"/></div>
   </section>
   {error&&<div role="alert" className="bd-card mt-6 p-5 text-red-700">{error} <button onClick={()=>location.reload()} className="underline">আবার চেষ্টা করুন</button></div>}
   <section className="bd-section"><h2 className="bd-title mb-3 flex items-center gap-2"><span className="text-red-600">▲</span> আজ দাম বেড়েছে</h2>{loading?<LoadingCards/>:grid(risers)}</section>
   <section className="bd-section"><h2 className="bd-title mb-3 flex items-center gap-2"><span className="text-[#05893e]">▼</span> আজ দাম কমেছে</h2>{loading?<LoadingCards/>:grid(fallers)}</section>
   <section id="সব-পণ্য" className="bd-section scroll-mt-5"><h2 className="bd-title mb-3">সব পণ্য</h2>
     <div className="bd-card mb-4 flex flex-wrap items-center gap-2 p-3">
       <label className="relative min-w-[170px] flex-1"><span className="absolute top-2 left-3 text-sm">🔍</span><input aria-label="পণ্য খুঁজুন" value={query} onChange={e=>setQuery(e.target.value)} className="bd-input !pl-9" placeholder="পণ্যের নাম লিখুন…"/></label>
       <div className="flex max-w-full flex-wrap items-center gap-1" aria-label="ক্যাটাগরি ফিল্টার"><button onClick={()=>setCategory("all")} className={`bd-chip ${category==="all"?"bd-chip-active":""}`}>সব</button>{categoryLinks.map(c=><button key={c.slug} onClick={()=>setCategory(c.slug)} className={`bd-chip ${category===c.slug?"bd-chip-active":""}`}>{icons[c.slug]} {c.label}</button>)}</div>
       <label className="ml-auto flex items-center gap-2 text-[14px]">সাজান <select className="bd-input !w-auto min-w-28" value={sort} onChange={e=>setSort(e.target.value)}><option value="default">ডিফল্ট</option><option value="low">দাম: কম থেকে বেশি</option><option value="high">দাম: বেশি থেকে কম</option></select></label>
     </div>
     <p className="mb-4 text-[14px] bd-muted">{loading?"পণ্যের তথ্য লোড হচ্ছে...":`মোট ${bn(allFiltered.length)}টি পণ্য দেখানো হচ্ছে`}</p>
     {loading?<LoadingCards/>:grid(allFiltered)}
   </section>
 </main><Footer/></>;
}
