"use client";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {authClient} from "@/lib/auth-client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function ProfileEditForm({initialName}:{initialName:string}){
 const [name,setName]=useState(initialName),[busy,setBusy]=useState(false),router=useRouter();
 async function update(event:React.FormEvent<HTMLFormElement>){event.preventDefault();if(!name.trim()){toast.error("নাম ফাঁকা রাখা যাবে না");return}setBusy(true);
 try{const{error}=await authClient.updateUser({name:name.trim()});if(error){toast.error(error.message||"আপডেট ব্যর্থ হয়েছে");return}toast.success("প্রোফাইল আপডেট হয়েছে");router.push("/profile");router.refresh();}
 catch{toast.error("প্রোফাইল আপডেট করা যায়নি")}finally{setBusy(false)}}
 return <><Header/><main className="bd-container min-h-[630px] pt-12"><div className="mx-auto max-w-[416px]"><h1 className="text-[26px] font-bold">প্রোফাইল আপডেট</h1><p className="mt-1 text-sm bd-muted">আপনার নাম পরিবর্তন করুন।</p>
  <form onSubmit={update} className="bd-auth-panel"><label htmlFor="profile-name" className="bd-auth-label">নাম</label><input id="profile-name" className="bd-input" required autoComplete="name" value={name} onChange={e=>setName(e.target.value)}/><button className="bd-button mt-5 w-full" disabled={busy} type="submit">{busy?"অপেক্ষা করুন...":"তথ্য আপডেট করুন"}</button></form><Link className="mt-6 block text-[14px] text-[#05893e]" href="/profile">← আমার প্রোফাইলে ফিরে যান</Link>
 </div></main><Footer/></>}
