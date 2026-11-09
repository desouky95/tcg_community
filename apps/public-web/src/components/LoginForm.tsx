"use client";

import { AxiosError } from "@tcg/api-contracts";
import { authQuery, destinationUrl, type AuthDestination } from "../lib/auth-destination";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuth } from "@tcg/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LockKeyhole, Mail } from "lucide-react";
import { AuthField, AuthInput, Button, SocialAuthButton } from "@tcg/ui-web";
import styles from "./LoginForm.module.css";

const loginSchema = z.object({
  uid: z.string().min(3, "Username, email or mobile is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
});
type LoginFormData = z.infer<typeof loginSchema>;
export function LoginForm({ destination, returnTo, socialError }: { destination: AuthDestination; returnTo: string; socialError: boolean }) {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      toast.success("Welcome back to Next Pull!");
      window.location.assign(destinationUrl(destination, returnTo));
    } catch (err: unknown) {
      if (
        err instanceof AxiosError &&
        err.response?.status === 403 &&
        err.response?.data?.unverified
      ) {
        toast.error("Account not verified. Please verify your mobile.");
        window.location.assign(`/verify-otp?${authQuery(destination, returnTo)}&mobile=${encodeURIComponent(err.response.data.mobile)}`);
      } else {
        const message =
          err instanceof AxiosError ? err.response?.data?.error : undefined;
        toast.error(typeof message === "string" ? message : message?.message || "Invalid credentials");
      }
    }
  };

  const loading = login.isPending;
  const socialUrl = (provider: "facebook" | "google") => {
    const url = new URL(`/api/v1/auth/oauth/${provider}/redirect`, process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333");
    url.searchParams.set("returnTo", returnTo);
    url.searchParams.set("destination", destination);
    return url.toString();
  };
  return (
    <form onSubmit={handleSubmit(onLoginSubmit)} className={styles.form}>
      {socialError && <p role="alert" className="text-sm text-wax-red">Social sign-in could not be completed. Please try again or sign in with your password.</p>}
      <SocialAuthButton provider="google" href={socialUrl("google")} className={styles.social} />
      <SocialAuthButton provider="facebook" href={socialUrl("facebook")} className={styles.social} />
      <div className="text-center text-sm text-wax-muted">or sign in with your account</div>
      <AuthField
        id="login-uid"
        label="Email, username, or mobile"
        icon={<Mail aria-hidden="true" />}
        error={errors.uid?.message}
      >
        <AuthInput
          id="login-uid"
          {...register("uid")}
          type="text"
          autoComplete="username"
          placeholder="hello@nextpull.co"
          invalid={Boolean(errors.uid)}
          aria-invalid={Boolean(errors.uid)}
          aria-describedby={errors.uid ? "login-uid-error" : undefined}
          disabled={loading}
        />
      </AuthField>
      <AuthField
        id="login-password"
        label="Password"
        icon={<LockKeyhole aria-hidden="true" />}
        error={errors.password?.message}
      >
        <AuthInput
          id="login-password"
          {...register("password")}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          invalid={Boolean(errors.password)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "login-password-error" : undefined
          }
          disabled={loading}
        />
      </AuthField>

      <div className="flex flex-wrap justify-between gap-3 text-sm"><a href={`/login/otp?${authQuery(destination, returnTo)}`}>Sign in with a code</a><a href={new URL("/forgot-password", process.env.NEXT_PUBLIC_APP_URL!).toString()}>Forgot password?</a></div>
      <a href={new URL("/delete-deactivated", process.env.NEXT_PUBLIC_APP_URL!).toString()} className="text-sm">Delete a deactivated account</a>
      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
    </form>
  );
}
