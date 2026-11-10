"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

// These buttons need OAuth credentials created by the project owner.
// The public endpoint returns only true/false, never Client Secrets.
type Provider = "google" | "github";
type ProviderState = { google: boolean; github: boolean };

export default function SocialButtons({ returnTo = "/" }: { returnTo?: string }) {
  const [available, setAvailable] = useState<ProviderState | null>(null);
  const [working, setWorking] = useState<Provider | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/providers", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Provider status unavailable");
        return response.json();
      })
      .then((result: ProviderState) => { if (!controller.signal.aborted) setAvailable(result); })
      .catch(() => { if (!controller.signal.aborted) setAvailable({ google: false, github: false }); });
    return () => controller.abort();
  }, []);

  async function login(provider: Provider) {
    if (!available?.[provider]) {
      toast.error(`${provider === "google" ? "Google" : "GitHub"} login needs OAuth credentials in .env.local`);
      return;
    }
    setWorking(provider);
    try {
      const { error } = await authClient.signIn.social({ provider, callbackURL: returnTo });
      if (error) toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে।");
    } catch {
      toast.error("OAuth সেটিংস পরীক্ষা করুন।");
    } finally {
      setWorking(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" disabled={!available?.google || working !== null} onClick={() => login("google")}
          title={available?.google ? "Sign in with Google" : "Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first"}
          className="bd-button bd-button-outline w-full whitespace-nowrap">
          <span className="font-bold text-[#4285f4]">G</span> Google দিয়ে লগইন
        </button>
        <button type="button" disabled={!available?.github || working !== null} onClick={() => login("github")}
          title={available?.github ? "Sign in with GitHub" : "Configure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET first"}
          className="bd-button bd-button-outline w-full whitespace-nowrap">
          <span className="text-lg text-black">●</span> GitHub দিয়ে লগইন
        </button>
      </div>
      {available && (!available.google || !available.github) && (
        <p className="mt-2 text-center text-[11px] bd-muted">
          Social login চালু করতে আপনার Google/GitHub OAuth credentials যোগ করুন।
        </p>
      )}
    </div>
  );
}
