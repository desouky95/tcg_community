"use client";
import { useState, type FormEvent } from "react";
import { useAuth } from "@tcg/react-query";
import { Button, AuthField, AuthInput } from "@tcg/ui-web";
import { destinationUrl, type AuthDestination } from "../lib/auth-destination";

export function VerifyOtpForm({
  mobile,
  destination,
  returnTo,
}: {
  mobile: string;
  destination: AuthDestination;
  returnTo: string;
}) {
  const { verifyOtp, requestOtp } = useAuth();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const otp = String(new FormData(event.currentTarget).get("otp") ?? "");
    try {
      await verifyOtp.mutateAsync({ mobile, otp });
      window.location.assign(destinationUrl(destination, returnTo));
    } catch {
      setError("Invalid or expired verification code. Please try again.");
    }
  }
  async function resend() {
    setError("");
    setNotice("");
    try {
      await requestOtp.mutateAsync(mobile);
      setNotice("A new verification code was requested.");
    } catch {
      setError("Could not request another code. Please wait and try again.");
    }
  }
  if (!mobile)
    return (
      <p role="alert">
        We need your mobile number. Please start again from sign in or signup.
      </p>
    );
  return (
    <form onSubmit={submit} className="grid gap-5">
      <p>Enter the verification code sent to {mobile}.</p>
      <AuthField id="otp" label="Verification code">
        <AuthInput
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          required
        />
      </AuthField>
      <Button
        type="submit"
        loading={verifyOtp.isPending}
        disabled={verifyOtp.isPending}
      >
        Verify and continue
      </Button>
      <button
        type="button"
        className="underline focus-ring"
        onClick={resend}
        disabled={requestOtp.isPending}
      >
        Request another code
      </button>
      {notice && <p role="status">{notice}</p>}
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
