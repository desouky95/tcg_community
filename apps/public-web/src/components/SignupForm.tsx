"use client";

import { useState, type FormEvent } from "react";
import { AxiosError } from "@tcg/api-contracts";
import { useAuth } from "@tcg/react-query";
import { AuthField, AuthInput, AuthSelect, Button } from "@tcg/ui-web";
import { authQuery, type AuthDestination } from "../lib/auth-destination";

const governorates = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Monufia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "Sharqia",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "Sohag",
  "North Sinai",
];

export function SignupForm({
  destination,
  returnTo,
}: {
  destination: AuthDestination;
  returnTo: string;
}) {
  const { signup } = useAuth();
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const values = new FormData(event.currentTarget);
    const data = Object.fromEntries(values.entries()) as Record<string, string>;
    data.mobile = data.mobile?.replace(/\s/g, "") ?? "";
    if (data.password !== data.passwordConfirmation) {
      setError("Passwords don't match.");
      return;
    }
    try {
      await signup.mutateAsync({
        fullName: data.fullName!,
        username: data.username!,
        email: data.email!,
        mobile: data.mobile!,
        password: data.password!,
        passwordConfirmation: data.passwordConfirmation!,
        governorate: data.governorate!,
      });
      window.location.assign(
        `/verify-otp?${authQuery(destination, returnTo)}&mobile=${encodeURIComponent(data.mobile!)}`,
      );
    } catch (cause) {
      const body =
        cause instanceof AxiosError ? cause.response?.data?.error : undefined;
      const details =
        typeof body === "object" && Array.isArray(body?.details)
          ? body.details
          : [];
      setError(
        details
          .map((item: { message?: string }) => item.message)
          .filter(Boolean)
          .join(" ") ||
          (typeof body === "string" ? body : body?.message) ||
          "Registration could not be completed. Please check your details and try again.",
      );
    }
  }
  return (
    <>
      <form onSubmit={submit} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField id="signup-name" label="Full name">
            <AuthInput
              id="signup-name"
              name="fullName"
              autoComplete="name"
              required
              minLength={3}
              maxLength={255}
            />
          </AuthField>
          <AuthField id="signup-username" label="Username">
            <AuthInput
              id="signup-username"
              name="username"
              autoComplete="username"
              required
              minLength={3}
              maxLength={50}
              pattern="[a-zA-Z0-9_]+"
            />
          </AuthField>
          <AuthField id="signup-email" label="Email">
            <AuthInput
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
          </AuthField>
          <AuthField id="signup-mobile" label="Mobile / WhatsApp">
            <AuthInput
              id="signup-mobile"
              name="mobile"
              type="tel"
              autoComplete="tel"
              placeholder="+20 100 000 0000"
              required
              maxLength={20}
            />
          </AuthField>
          <AuthField id="signup-password" label="Password">
            <AuthInput
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={32}
            />
          </AuthField>
          <AuthField id="signup-confirm" label="Confirm password">
            <AuthInput
              id="signup-confirm"
              name="passwordConfirmation"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={32}
            />
          </AuthField>
          <AuthField
            id="signup-region"
            label="Region"
            className="sm:col-span-2"
          >
            <AuthSelect
              id="signup-region"
              name="governorate"
              required
              defaultValue=""
            >
              <option value="">Select your governorate</option>
              {governorates.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </AuthSelect>
          </AuthField>
        </div>
        {error && (
          <p role="alert" className="text-sm text-danger-600">
            {error}
          </p>
        )}
        <Button
          type="submit"
          loading={signup.isPending}
          disabled={signup.isPending}
          className="w-full"
        >
          Create my profile
        </Button>
      </form>
    </>
  );
}
