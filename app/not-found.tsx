import Link from "next/link";
export default function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
    <p className="text-7xl font-black text-emerald-700">404</p><h1 className="mt-3 text-2xl font-bold">এই পেজটি খুঁজে পাওয়া যায়নি</h1>
    <Link href="/" className="mt-6 rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white">হোম পেজে ফিরে যান</Link>
  </main>;
}
