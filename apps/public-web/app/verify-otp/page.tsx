"use client";

import { MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@tcg/ui-web";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(""); const [pending, setPending] = useState(false); const mobile = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("mobile") ?? "";
  return <AuthShell eyebrow="Verification / 02" title={<>Keep your <em>vault</em> close.</>} description="One quick check keeps every collection, swap, and conversation tied to you." asideTitle="Trust is part of the collection." asideDescription="A verified number helps the club stay useful, local, and made for real collectors." asideItems={["One code for a secure session", "WhatsApp-first verification", "Your cards stay yours"]} footer={<>Need to start over? <a href="/login" className="wax-auth-link focus-ring">Return to sign in</a></>}><form className="wax-auth-form" onSubmit={(event) => { event.preventDefault(); setPending(true); }}><div className="wax-auth-field"><label htmlFor="verify-otp" className="wax-auth-label">6-digit verification code</label><div className="wax-otp-input-wrap"><ShieldCheck aria-hidden="true" /><input id="verify-otp" className="wax-otp-input" inputMode="numeric" pattern="[0-9]*" maxLength={6} autoComplete="one-time-code" value={otp} onChange={(event) => setOtp(event.target.value)} disabled={pending} required /></div><p className="wax-otp-help"><MessageCircle aria-hidden="true" /> Code sent to <strong>{mobile || "your WhatsApp number"}</strong></p></div><button className="wax-button wax-button-primary wax-auth-submit" disabled={pending || otp.length !== 6}>{pending ? "Checking code…" : "Verify and continue"}</button></form></AuthShell>;
}
