"use client";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {authClient} from "@/lib/auth-client";
export default function ProfileSignout(){const router=useRouter();async function signout(){const{error}=await authClient.signOut();if(error){toast.error("সাইন আউট করা যায়নি");return}toast.success("সাইন আউট সফল হয়েছে");router.push("/");router.refresh()}
 return <button onClick={signout} className="bd-button bd-button-outline">↩ সাইন আউট</button>}
