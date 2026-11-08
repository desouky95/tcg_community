import { redirect } from "next/navigation";
import { buildAppUrl } from "@tcg/auth-client";

export default async function VerifyOtpPage({ searchParams }: { searchParams: Promise<{ mobile?: string }> }) {
  const { mobile } = await searchParams;
  const path = mobile ? `/verify-otp?mobile=${encodeURIComponent(mobile)}` : "/verify-otp";
  redirect(buildAppUrl(process.env.NEXT_PUBLIC_APP_URL!, path));
}
