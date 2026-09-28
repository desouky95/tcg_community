"use client";

import { useState, type FormEvent } from "react";
import { createApiClient } from "@tcg/api-contracts";
import { safeReturnTo } from "@tcg/auth-client";

const api = createApiClient({ baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1", withCredentials: true });

export function LoginForm() {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.login({ uid, password });
      const returnTo = safeReturnTo(new URLSearchParams(window.location.search).get("returnTo"), "/dashboard");
      window.location.assign(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173"}${returnTo}`);
    } catch {
      setError("We could not sign you in. Check your details and try again.");
    } finally {
      setPending(false);
    }
  }

  return <form onSubmit={submit} className="wax-auth-form">
    <div className="wax-auth-field"><label htmlFor="uid" className="wax-auth-label">Email, username, or mobile</label><div className="wax-auth-input-wrap"><input id="uid" className="wax-auth-input" value={uid} onChange={(event) => setUid(event.target.value)} autoComplete="username" required /></div></div>
    <div className="wax-auth-field"><label htmlFor="password" className="wax-auth-label">Password</label><div className="wax-auth-input-wrap"><input id="password" className="wax-auth-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></div></div>
    {error && <p className="wax-auth-error" role="alert">{error}</p>}<button className="wax-button wax-button-primary wax-auth-submit" disabled={pending}>{pending ? "Opening vault…" : "Sign in"}</button>
  </form>;
}
