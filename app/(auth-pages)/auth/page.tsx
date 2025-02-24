import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AuthForm } from "./auth-form";
import type { Message } from "@/components/form-message";
import Footer from "@/components/main/footer";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Message;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/${user.user_metadata.username}`);
  }

  return <div><AuthForm searchParams={searchParams} /><Footer /></div>;
}
