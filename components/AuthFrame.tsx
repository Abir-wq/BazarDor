import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function AuthFrame({title,subtitle,children,variant="signin"}:{title:string;subtitle:string;children:React.ReactNode;variant?:"signin"|"signup"}) {
  return <><Header/><main className={`bd-auth-layout ${variant==="signup"?"bd-auth-layout--signup":""}`}><div className="bd-auth-inner">
    <h1 className="text-[26px] leading-9 font-bold">{title}</h1><p className="mt-1 text-[14px] leading-6 bd-muted">{subtitle}</p>
    <div className="bd-auth-panel">{children}</div>
    <Link href="/" className="mt-6 block text-[14px] text-[#05893e] hover:underline">← হোম পেজে ফিরে যান</Link>
  </div></main><Footer/></>;
}
