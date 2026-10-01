"use client";

import { AxiosError } from "@tcg/api-contracts";
import { buildAppUrl } from "@tcg/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useAuth } from "@tcg/react-query";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LockKeyhole, Mail } from "lucide-react";
import { AuthField, AuthInput, Button } from "@tcg/ui-web";

const loginSchema = z.object({
  uid: z.string().min(3, "Username, email or mobile is required"),
  password: z.string().min(6, "Password is required"),
});
type LoginFormData = z.infer<typeof loginSchema>;
export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      toast.success("Welcome back to TCG Nexus!");
      window.location.assign(
        buildAppUrl(
          process.env.NEXT_PUBLIC_APP_URL!,
          searchParams.get("returnTo"),
        ),
      );
    } catch (err: unknown) {
      if (
        err instanceof AxiosError &&
        err.response?.status === 403 &&
        err.response?.data?.unverified
      ) {
        toast.error("Account not verified. Please verify your mobile.");
        router.replace("/verify-otp", {
          // state: { mobile: err.response.data.mobile },
        });
      } else {
        const message =
          err instanceof AxiosError ? err.response?.data?.error : undefined;
        toast.error(message || "Invalid credentials");
      }
    }
  };

  const loading = login.isPending;
  return (
    <form onSubmit={handleSubmit(onLoginSubmit)} className="grid gap-5">
      <AuthField id="login-uid" label="Email, username, or mobile" icon={<Mail aria-hidden="true" />} error={errors.uid?.message}>
          <AuthInput
            id="login-uid"
            {...register("uid")}
            type="text"
            autoComplete="username"
            placeholder="hello@nexus.com"
            invalid={Boolean(errors.uid)}
            aria-invalid={Boolean(errors.uid)}
            aria-describedby={errors.uid ? "login-uid-error" : undefined}
            disabled={loading}
          />
      </AuthField>
      <AuthField id="login-password" label="Password" icon={<LockKeyhole aria-hidden="true" />} error={errors.password?.message}>
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

      <Button type="submit" loading={loading} className="w-full">Sign in</Button>
    </form>
  );
}
