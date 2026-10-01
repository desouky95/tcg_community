import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell from "../components/AuthShell";
import { AxiosError } from "axios";
import { AuthField, AuthInput, Button } from "@tcg/ui-web";

const loginSchema = z.object({
  uid: z.string().min(3, "Username, email or mobile is required"),
  password: z.string().min(6, "Password is required"),
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      toast.success("Welcome back to TCG Nexus!");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (
        err instanceof AxiosError &&
        err.response?.status === 403 &&
        err.response?.data?.unverified
      ) {
        toast.error("Account not verified. Please verify your mobile.");
        navigate("/verify-otp", {
          state: { mobile: err.response.data.mobile },
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
    <AuthShell
      eyebrow="Welcome back"
      title={
        <>
          Open your <em>vault.</em>
        </>
      }
      description="Pick up where you left off. Your saved cards, swaps, and collector circles are waiting."
      asideTitle="A calmer way to collect."
      asideDescription="The place for serious collectors who still enjoy the thrill of the pull."
      asideItems={[
        "Track every card in one place",
        "Trade with collectors you can trust",
        "Keep your collection close",
      ]}
      footer={
        <>
          New to the club?{" "}
          <Link to="/signup" className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring">
            Create an account
          </Link>
        </>
      }
    >
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
        <Button type="submit" loading={loading} className="w-full">Sign in{!loading && <ArrowRight aria-hidden="true" />}</Button>
      </form>
    </AuthShell>
  );
}
