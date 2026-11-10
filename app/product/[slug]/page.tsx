import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProductDetails from "./product-details";

export const dynamic = "force-dynamic";

// Run this on the SERVER before rendering the product details.
// This prevents someone from bypassing login by directly opening the URL.
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/signin?callbackUrl=${encodeURIComponent(`/product/${slug}`)}`);
  return <ProductDetails slug={slug}/>;
}
