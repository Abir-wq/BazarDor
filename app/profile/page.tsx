import {headers} from "next/headers";
import {redirect} from "next/navigation";
import Link from "next/link";
import {auth} from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSignout from "@/components/ProfileSignout";
export const dynamic="force-dynamic";
export default async function Profile(){
  const session=await auth.api.getSession({headers:await headers()});
  if(!session)redirect("/signin?callbackUrl=%2Fprofile");
  return <><Header/><main className="bd-container min-h-[775px] pt-[124px] pb-12">
    <div className="bd-profile-wrap"><h1 className="text-[26px] font-bold">আমার প্রোফাইল</h1><p className="mt-1 text-[14px] bd-muted">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      <section className="bd-card mt-7 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e1e8e1] px-6 py-7">
          <div className="flex items-center gap-5"><div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#e1f4e5] text-[32px] font-bold text-[#05893e]">{session.user.name?.slice(0,1).toUpperCase()||"👤"}</div>
          <div><h2 className="text-[20px] leading-7 font-bold">{session.user.name}</h2><p className="mt-1 break-all text-[14px] bd-muted">{session.user.email}</p></div></div>
          <ProfileSignout/>
        </div>
        <div className="p-6"><h2 className="mb-5 text-[18px] font-bold">তথ্য</h2>
          <div className="space-y-4"><div><p className="mb-1 text-[14px] bd-muted">নাম</p><p className="bd-input flex items-center !h-[44px]">{session.user.name}</p></div><div><p className="mb-1 text-[14px] bd-muted">ইমেইল</p><p className="bd-input flex items-center !h-[44px]">{session.user.email}</p></div></div>
          <div className="mt-6 flex justify-end"><Link href="/profile/edit" className="bd-button min-w-32">তথ্য আপডেট করুন</Link></div>
        </div>
      </section>
    </div>
  </main><Footer/></>;
}
