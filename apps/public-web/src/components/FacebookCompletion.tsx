"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AxiosError, type FacebookPendingResponse } from "@tcg/api-contracts";
import { authDestination, destinationUrl } from "../lib/auth-destination";
import { Button } from "@tcg/ui-web";
import { api } from "../lib/api";

const governorates = ["Cairo", "Alexandria", "Giza", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Monufia", "Minya", "Qalyubia", "New Valley", "Sharqia", "Suez", "Aswan", "Assiut", "Beni Suef", "Port Said", "Damietta", "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "Sohag", "North Sinai"];
const fieldClass = "w-full rounded border border-current bg-transparent px-3 py-2 focus-ring";

export function FacebookCompletion() {
  const [provider, setProvider] = useState<"facebook" | "google">("facebook");
  const providerName = provider === "google" ? "Google" : "Facebook";
  const [pending, setPending] = useState<FacebookPendingResponse | null>(null);
  const [mode, setMode] = useState<"choose" | "signup" | "verify" | "login" | "confirm">("choose");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const selected = new URLSearchParams(window.location.search).get("provider");
    if (selected && selected !== "facebook" && selected !== "google") { setError("This sign-in provider is not supported."); return; }
    const current = selected === "google" ? "google" : "facebook";
    setProvider(current);
    api.http.get<FacebookPendingResponse>(`/auth/oauth/${current}/pending`).then(({ data }) => { setPending(data); if (data.signupStarted && data.mobile) { setMobile(data.mobile); setMode("verify"); } }).catch(() => setError("Social sign-in expired. Please start again."));
  }, []);
  const finish = () => window.location.assign(destinationUrl(authDestination(pending?.destination), pending?.returnTo ?? "/"));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      if (mode === "signup") {
        await api.http.post(`/auth/oauth/${provider}/signup`, data);
        setMobile(String(data.mobile)); setMode("verify");
      } else if (mode === "verify") {
        await api.http.post(`/auth/oauth/${provider}/verify`, { mobile, otp: data.otp }); finish();
      } else if (mode === "login") {
        await api.http.post("/auth/login", data); setMode("confirm");
      } else if (mode === "confirm") {
        await api.http.post(`/auth/oauth/${provider}/link`); finish();
      }
    } catch (cause) {
      const body = cause instanceof AxiosError ? cause.response?.data : undefined;
      const message = typeof body?.error === "string" ? body.error : body?.error?.message;
      setError(message || "We couldn't complete this step. Check your details and try again.");
    } finally { setBusy(false); }
  }
  const input = (name: string, label: string, type = "text", extra?: { defaultValue?: string; autoComplete?: string }) => <label className="grid gap-1 text-sm">{label}<input className={fieldClass} name={name} type={type} required {...extra} /></label>;
  return <div className="grid gap-4">
    {error && <p role="alert" className="text-sm text-wax-red">{error} <a className="underline" href="/login">Return to sign in</a></p>}
    {!pending && !error && <p role="status">Loading your social sign-in…</p>}
    {pending && mode === "choose" && <><p>Choose how to continue. Your account will never be linked by email alone.</p><Button onClick={() => setMode("signup")}>Create a new account</Button><Button onClick={() => setMode("login")}>Connect an existing account</Button></>}
    {pending && mode !== "choose" && <form onSubmit={submit} className="grid gap-4">
      {mode === "signup" && <>{input("fullName", "Full name", "text", { autoComplete: "name" })}{input("username", "Username", "text", { autoComplete: "username" })}{input("email", "Email", "email", { defaultValue: pending.email ?? "", autoComplete: "email" })}{input("mobile", "Egyptian mobile number", "tel", { autoComplete: "tel" })}{input("password", "Password", "password", { autoComplete: "new-password" })}{input("passwordConfirmation", "Confirm password", "password", { autoComplete: "new-password" })}<label className="grid gap-1 text-sm">Governorate<select className={fieldClass} name="governorate" required defaultValue=""><option value="" disabled>Select governorate</option>{governorates.map((g) => <option key={g} value={g}>{g}</option>)}</select></label></>}
      {mode === "verify" && <><p>Enter the verification code sent to {mobile}.</p>{input("otp", "Verification code", "text", { autoComplete: "one-time-code" })}</>}
      {mode === "login" && <>{input("uid", "Email, username, or mobile", "text", { autoComplete: "username" })}{input("password", "Password", "password", { autoComplete: "current-password" })}</>}
      {mode === "confirm" && <p>You are signed in. Confirm that you want to connect this {providerName} identity to your Next Pull account.</p>}
      <Button type="submit" loading={busy}>{mode === "signup" ? "Create account" : mode === "verify" ? "Verify mobile" : mode === "login" ? "Sign in" : "Confirm connection"}</Button>
    </form>}
  </div>;
}
