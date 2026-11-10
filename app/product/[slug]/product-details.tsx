"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {Product,productChange,productImage,productName,productPrice,money,unitName,toNumber,unwrapArray,unwrapOne,bn} from "@/lib/products";
type Market={name:string;district:string;minimum:number|null;maximum:number|null;average:number|null};
function extractMarkets(p:Product):Market[]{
 const raw=p.markets??p.bazars??p.marketPrices??p.bazarPrices;
 if(!raw)return [];
 const rows=Array.isArray(raw)?raw:typeof raw==="object"?Object.entries(raw).map(([market,value])=>typeof value==="object"&&value!==null?{market,...value}:{market,price:value}):[];
 return rows.map((entry,index)=>{
  if(typeof entry==="number"||typeof entry==="string"){const v=toNumber(entry);return{name:`বাজার ${index+1}`,district:"—",minimum:v,maximum:v,average:v}}
  const d=entry as Record<string,unknown>;
  const name=String(d.nameBn??d.bazarName??d.marketName??d.marketBn??d.market??d.bazar??d.name??`বাজার ${index+1}`);
  const district=String(d.divisionBn??d.districtBn??d.division??d.district??d.city??"—");
  const value=toNumber(d.today??d.todayPrice??d.currentPrice??d.price??d.average);
  const minimum=toNumber(d.minimumPrice??d.minPrice??d.min)??value;
  const maximum=toNumber(d.maximumPrice??d.maxPrice??d.max)??value;
  const average=toNumber(d.averagePrice??d.avgPrice??d.avg)??value;
  return{name,district,minimum,maximum,average};
 });
}
export default function ProductDetails({slug}:{slug:string}){
 const [product,setProduct]=useState<Product|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
 useEffect(()=>{const controller=new AbortController();async function load(){try{
  const res=await fetch(`/api/bazardor/products/${encodeURIComponent(slug)}`,{signal:controller.signal});if(!res.ok)throw new Error("Product API unavailable");
  const one=unwrapOne(await res.json());if(!one)throw new Error("Product missing");if(!controller.signal.aborted)setProduct(one);
 }catch(e){if(e instanceof Error&&e.name==="AbortError")return;
  try{const res=await fetch("/api/bazardor/products",{signal:controller.signal});if(!res.ok)throw new Error("Products unavailable");
  const all=unwrapArray(await res.json());const one=all.find(p=>String(p.id??p.slug??p._id)===slug);
  if(!controller.signal.aborted){if(one)setProduct(one);else setError("এই পণ্যটি খুঁজে পাওয়া যায়নি।")}}
  catch{if(!controller.signal.aborted)setError("পণ্যের বিস্তারিত লোড করা যায়নি।")}
 }finally{if(!controller.signal.aborted)setLoading(false)}}void load();return()=>controller.abort()},[slug]);
 const image=product?productImage(product):"",markets=product?extractMarkets(product):[];
 const lower=markets.map(m=>m.minimum).filter((v):v is number=>v!==null),upper=markets.map(m=>m.maximum).filter((v):v is number=>v!==null),avgs=markets.map(m=>m.average).filter((v):v is number=>v!==null);
 const minimum=product?toNumber(product.minimumPrice??product.minPrice)??(lower.length?Math.min(...lower):productPrice(product)):null;
 const maximum=product?toNumber(product.maximumPrice??product.maxPrice)??(upper.length?Math.max(...upper):productPrice(product)):null;
 const average=product?toNumber(product.averagePrice??product.avgPrice)??(avgs.length?avgs.reduce((a,b)=>a+b,0)/avgs.length:productPrice(product)):null;
 const change=product?productChange(product):null;
 return <><Header/><main className="bd-container min-h-[1217px] pt-6 pb-4">
  <div className="flex gap-2 text-[14px] bd-muted"><Link href="/" className="hover:text-[#05893e]">হোম</Link><span>›</span><span>{product?.categoryNameBn??product?.category??"পণ্য"}</span><span>›</span><span>{product?productName(product):"বিস্তারিত"}</span></div>
  {loading?<div className="bd-card mt-10 h-44 animate-pulse"/>:error||!product?<div className="bd-card mt-10 p-10 text-center"><h1 className="text-xl font-bold">{error||"পণ্য পাওয়া যায়নি"}</h1><Link href="/" className="bd-button mt-5">হোম পেজে ফিরে যান</Link></div>:<>
   <section className="bd-card mt-10 flex flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center">
    <div className="flex items-center gap-6"><div className="grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f0f5f0] text-[40px]">{/^https?:\/\//.test(image)?<img src={image} className="h-full w-full object-contain" alt=""/>:image}</div>
     <div><h1 className="text-[26px] leading-9 font-bold">{productName(product)}</h1><p className="text-[14px] bd-muted">প্রতি {unitName(product.unit)} · {product.categoryNameBn||product.category||"পণ্য"}</p>
      <p className="mt-2 text-[14px] bd-muted">{change?.direction==="up"?"গতকালের তুলনায় আজ দাম বেড়েছে":change?.direction==="down"?"গতকালের তুলনায় আজ দাম কমেছে":"আজকের বাজারদর"} · {change?bn(change.amount.toFixed(1)):"০"}%</p></div>
    </div>
    <div className="min-w-32 rounded-xl bg-[#f0f5f0] p-4"><p className="text-[12px] bd-muted">আজকের দাম</p><p className="text-[30px] leading-9 font-bold text-[#05893e]">{productPrice(product)===null?"—":bn(productPrice(product)??0)}</p><p className="text-[13px] bd-muted">টাকা / {unitName(product.unit)}</p></div>
   </section>
   <h2 className="bd-title mt-10 mb-4">দামের সারসংক্ষেপ</h2>
   <section className="bd-summary-grid">{[{label:"সর্বনিম্ন দাম",value:minimum},{label:"সর্বাধিক দাম",value:maximum},{label:"গড় দাম",value:average}].map((v,i)=><div key={v.label} className="bd-card p-6"><p className="text-[14px] bd-muted">{v.label}</p><p className="mt-1 text-[24px] font-bold text-[#05893e]">{money(v.value)}</p><p className="mt-2 text-[12px] bd-muted">{i===0?"পর্যবেক্ষিত সর্বনিম্ন মূল্য":i===1?"পর্যবেক্ষিত সর্বাধিক মূল্য":`প্রতি ${unitName(product.unit)}-এর হিসাবে`}</p></div>)}</section>
   <h2 className="bd-title mt-10 mb-4">বাজারভিত্তিক আজকের দাম</h2>
   {markets.length?<div className="bd-table-wrap"><table className="bd-table"><thead><tr><th>বাজার</th><th>বিভাগ</th><th>সর্বনিম্ন</th><th>সর্বাধিক</th><th>গড়</th></tr></thead><tbody>{markets.map((m,i)=><tr key={i}><td>{m.name}</td><td>{m.district}</td><td>{money(m.minimum)}</td><td>{money(m.maximum)}</td><td>{money(m.average)}</td></tr>)}</tbody></table></div>
    :<div className="bd-card p-6 text-sm bd-muted">এই পণ্যের বাজারভিত্তিক আলাদা দাম API-তে পাওয়া যায়নি।</div>}
   <p className="mt-5 text-[12px] bd-muted">উৎস: Bazar Dor API। অঞ্চল ও সময় অনুযায়ী পণ্যের মূল্য পরিবর্তিত হতে পারে।</p>
  </>}
 </main><Footer/></>;
}
