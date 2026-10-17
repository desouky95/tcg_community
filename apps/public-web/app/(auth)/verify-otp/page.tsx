"use client";

import { MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AuthShell, Button, OtpField } from "@tcg/ui-web";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(""); const [pending, setPending] = useState(false); const mobile = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("mobile") ?? "";
  return <AuthShell eyebrow="Verification / 02" title={<>Keep your <em>vault</em> close.</>} description="One quick check keeps every collection, swap, and conversation tied to you." asideTitle="Trust is part of the collection." asideDescription="A verified number helps the club stay useful, local, and made for real collectors." asideItems={["One code for a secure session", "WhatsApp-first verification", "Your cards stay yours"]} footer={<>Need to start over? <a href="/login" className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring">Return to sign in</a></>}><form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); setPending(true); }}><OtpField id="verify-otp" label="6-digit verification code" icon={<ShieldCheck aria-hidden="true" />} value={otp} onChange={(event) => setOtp(event.target.value)} disabled={pending} required help={<><MessageCircle aria-hidden="true" /> Code sent to <strong>{mobile || "your WhatsApp number"}</strong></>} /><Button type="submit" loading={pending} disabled={otp.length !== 6} className="w-full">Verify and continue</Button></form></AuthShell>;
}
