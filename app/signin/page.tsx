"use client";
import {Suspense,useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {authClient} from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";
import AuthFrame from "@/components/AuthFrame";
function SignInForm(){
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[busy,setBusy]=useState(false);
 const router=useRouter(),search=useSearchParams();
 const requested=search.get("callbackUrl")||"/";
 const returnTo=requested.startsWith("/")&&!requested.startsWith("//")?requested:"/";
 async function handleLogin(event:React.FormEvent<HTMLFormElement>){
   event.preventDefault();
   if(!email.trim()||!password){toast.error("ইমেইল ও পাসওয়ার্ড দিন");return;}
   setBusy(true);
   try{
     const {error}=await authClient.signIn.email({email:email.trim(),password});
     if(error){toast.error(error.message||"সাইন ইন করা যায়নি");return;}
     toast.success("সাইন ইন সফল হয়েছে!");router.push(returnTo);router.refresh();
   }catch{toast.error("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি");}
   finally{setBusy(false);}
 }
 return <AuthFrame title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
   <form onSubmit={handleLogin}>
     <div className="bd-auth-field"><label htmlFor="signin-email" className="bd-auth-label">ইমেইল</label><input id="signin-email" className="bd-input" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e=>setEmail(e.target.value)}/></div>
     <div className="bd-auth-field"><label htmlFor="signin-password" className="bd-auth-label">পাসওয়ার্ড</label><input id="signin-password" className="bd-input" type="password" autoComplete="current-password" placeholder="কমপক্ষে ৮ অক্ষর" required value={password} onChange={e=>setPassword(e.target.value)}/></div>
     <button className="bd-button mt-4 w-full" type="submit" disabled={busy}>{busy?"অপেক্ষা করুন...":"সাইন ইন"}</button>
   </form>
   <div className="bd-divider my-4">অথবা</div><SocialButtons returnTo={returnTo}/>
   <p className="mt-4 text-center text-[14px] bd-muted">অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-[#05893e] hover:underline">সাইন আপ করুন</Link></p>
 </AuthFrame>;
}
export default function SignIn(){return <Suspense fallback={<p className="p-10 text-center">লোড হচ্ছে...</p>}><SignInForm/></Suspense>}
