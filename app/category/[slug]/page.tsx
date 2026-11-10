"use client";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import LoadingCards from "@/components/LoadingCards";
import {categoryLinks,Product,fetchProducts,productPrice,unwrapArray,bn} from "@/lib/products";
const icons:Record<string,string>={chal:"🍚",dal:"🫘",tel:"🛢️",sobji:"🥬",mach:"🐟",mangsho:"🍗","dim-dui":"🥛",mosla:"🌶️"};
export default function CategoryPage(){
 const {slug}=useParams<{slug:string}>();
 const category=categoryLinks.find(c=>c.slug===slug);
 const [products,setProducts]=useState<Product[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(""),[sort,setSort]=useState("default");
 useEffect(()=>{
  if(!category)return;
  const controller=new AbortController();
  async function load(){try{
   const res=await fetch(`/api/bazardor/products?category=${encodeURIComponent(slug)}`,{signal:controller.signal});
   if(!res.ok)throw new Error("Category API unavailable");
   const items=unwrapArray(await res.json());if(!controller.signal.aborted)setProducts(items);
  }catch(e){if(e instanceof Error&&e.name==="AbortError")return;
   try{const all=await fetchProducts(controller.signal);if(!controller.signal.aborted)setProducts(all.filter(p=>(p.categorySlug||p.category||"").toLowerCase()===slug));}
   catch{if(!controller.signal.aborted)setError("ক্যাটাগরির তথ্য লোড করা যায়নি।");}
  }finally{if(!controller.signal.aborted)setLoading(false)}}void load();return()=>controller.abort();
 },[slug,category]);
 const sorted=[...products].sort((a,b)=>sort==="default"?0:sort==="low"?(productPrice(a)??Infinity)-(productPrice(b)??Infinity):(productPrice(b)??Infinity)-(productPrice(a)??Infinity));
 return <><Header/><main className="bd-container min-h-[620px] pt-[40px] pb-6">
   {category?<><div className="mb-12 flex items-start gap-3"><div className="grid h-12 w-12 place-items-center rounded-xl bg-[#e0f2e5] text-[27px]">{icons[slug]}</div><div><h1 className="text-[26px] leading-8 font-bold">{category.label}</h1><p className="mt-1 text-[14px] bd-muted">{loading?"পণ্যের তথ্য লোড হচ্ছে...":`${bn(sorted.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}</p></div></div>
   <div className="mb-5 flex justify-end"><label className="flex items-center gap-2 text-[14px]">সাজান <select className="bd-input !w-auto min-w-36" value={sort} onChange={e=>setSort(e.target.value)}><option value="default">ডিফল্ট</option><option value="low">দাম: কম থেকে বেশি</option><option value="high">দাম: বেশি থেকে কম</option></select></label></div>
   <p className="mb-4 text-[14px] bd-muted">{loading?"অপেক্ষা করুন...":`মোট ${bn(sorted.length)}টি পণ্য দেখানো হচ্ছে`}</p>
   {loading?<LoadingCards/>:error?<div role="alert" className="bd-card p-6 text-red-700">{error}</div>:sorted.length?<div className="bd-product-grid">{sorted.map((p,i)=><ProductCard key={String(p.id??p.slug??i)} product={p}/>)}</div>:<div className="bd-card p-10 text-center"><h2 className="text-xl font-bold">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</h2><Link href="/" className="bd-button mt-5">হোম পেজে ফিরে যান</Link></div>}
   </>:<div className="bd-card p-10 text-center"><h1 className="text-xl font-bold">এই বিভাগটি পাওয়া যায়নি</h1><Link href="/" className="bd-button mt-5">হোম পেজে ফিরে যান</Link></div>}
 </main><Footer/></>;
}
