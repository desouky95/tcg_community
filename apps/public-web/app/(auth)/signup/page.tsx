import { redirect } from "next/navigation";
import { buildAppUrl } from "@tcg/auth-client";

export default function SignupPage() {
  redirect(buildAppUrl(process.env.NEXT_PUBLIC_APP_URL!, "/signup"));
}
