import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileEditForm from "./profile-edit-form";

export const dynamic = "force-dynamic";
export default async function EditProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?callbackUrl=%2Fprofile%2Fedit");
  return <ProfileEditForm initialName={session.user.name}/>;
}
