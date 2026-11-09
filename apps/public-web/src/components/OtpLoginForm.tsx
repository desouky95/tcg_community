"use client";
import { useState, type FormEvent } from "react";
import { useAuth } from "@tcg/react-query";
import { AuthField, AuthInput, Button } from "@tcg/ui-web";
import { authQuery, type AuthDestination } from "../lib/auth-destination";

export function OtpLoginForm({
  destination,
  returnTo,
}: {
  destination: AuthDestination;
  returnTo: string;
}) {
  const { requestOtp } = useAuth();
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const mobile = String(
      new FormData(event.currentTarget).get("mobile") ?? "",
    ).replace(/\s/g, "");
    try {
      await requestOtp.mutateAsync(mobile);
      window.location.assign(
        `/verify-otp?${authQuery(destination, returnTo)}&mobile=${encodeURIComponent(mobile)}`,
      );
    } catch {
      setError("Could not request a code. Check your number and try again.");
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-5">
      <AuthField id="otp-mobile" label="Mobile number">
        <AuthInput
          id="otp-mobile"
          name="mobile"
          type="tel"
          autoComplete="tel"
          required
          disabled={requestOtp.isPending}
        />
      </AuthField>
      {error && <p role="alert">{error}</p>}
      <Button
        type="submit"
        disabled={requestOtp.isPending}
        loading={requestOtp.isPending}
      >
        Request code
      </Button>
    </form>
  );
}
