"use client";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {authClient} from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";
import AuthFrame from "@/components/AuthFrame";
export default function SignUp(){
 const router=useRouter();
 const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[busy,setBusy]=useState(false);
 async function handleRegister(event:React.FormEvent<HTMLFormElement>){
   event.preventDefault();
   if(!name.trim()){toast.error("আপনার নাম লিখুন");return;}
   if(password.length<8){toast.error("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে");return;}
   if(password!==confirm){toast.error("দুটি পাসওয়ার্ড মিলছে না");return;}
   setBusy(true);
   try{
     const {error}=await authClient.signUp.email({name:name.trim(),email:email.trim(),password});
     if(error){toast.error(error.message||"অ্যাকাউন্ট তৈরি করা যায়নি");return;}
     toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এখন সাইন ইন করুন।");
     await authClient.signOut();router.push("/signin");router.refresh();
   }catch{toast.error("সার্ভারের সঙ্গে যোগাযোগ করা যায়নি");}
   finally{setBusy(false);}
 }
 return <AuthFrame variant="signup" title="অ্যাকাউন্ট তৈরি করুন" subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।">
   <form onSubmit={handleRegister}>
     <div className="bd-auth-field"><label htmlFor="signup-name" className="bd-auth-label">নাম</label><input id="signup-name" className="bd-input" type="text" placeholder="যেমন: রহিম উদ্দিন" autoComplete="name" required value={name} onChange={e=>setName(e.target.value)}/></div>
     <div className="bd-auth-field"><label htmlFor="signup-email" className="bd-auth-label">ইমেইল</label><input id="signup-email" className="bd-input" type="email" placeholder="you@example.com" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></div>
     <div className="bd-auth-field"><label htmlFor="signup-password" className="bd-auth-label">পাসওয়ার্ড</label><input id="signup-password" className="bd-input" type="password" placeholder="কমপক্ষে ৮ অক্ষর" minLength={8} autoComplete="new-password" required value={password} onChange={e=>setPassword(e.target.value)}/></div>
     <div className="bd-auth-field"><label htmlFor="signup-confirm" className="bd-auth-label">পাসওয়ার্ড নিশ্চিত করুন</label><input id="signup-confirm" className="bd-input" type="password" placeholder="আবার লিখুন" minLength={8} autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/></div>
     <button className="bd-button mt-4 w-full" disabled={busy} type="submit">{busy?"অপেক্ষা করুন...":"অ্যাকাউন্ট তৈরি করুন"}</button>
   </form>
   <div className="bd-divider my-4">অথবা</div><SocialButtons/>
   <p className="mt-4 text-center text-[14px] bd-muted">অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-[#05893e] hover:underline">সাইন ইন করুন</Link></p>
 </AuthFrame>;
}
