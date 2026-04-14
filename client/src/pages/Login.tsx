import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock as LockIcon, ArrowRight, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { BackButton } from "../components/common/BackButton";

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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      toast.success("Welcome back to TCG Nexus!");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        toast.error("Account not verified. Please verify your mobile.");
        navigate("/verify-otp", {
          state: { mobile: err.response.data.mobile },
        });
      } else {
        toast.error(err.response?.data?.error || "Invalid credentials");
      }
    }
  };

  const loading = login.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-green-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="fixed top-8 left-8 z-50">
        <BackButton />
      </div>

      <div className="w-full max-w-md bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative z-10 transition-all duration-500">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-linear-to-br from-primary-500 to-green-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/30 transform rotate-3">
            <UserCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic mb-2 leading-none">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Access your personal collection vault
          </p>
        </div>

        <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1 group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("uid")}
                  type="text"
                  placeholder="hello@nexus.com or +1..."
                  className={`w-full bg-input/40 border-2 ${errors.uid ? "border-danger-500/50" : "border-border/50"} rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary-500 transition-all font-medium text-sm`}
                  disabled={loading}
                />
              </div>
              {errors.uid && (
                <p className="text-danger-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-2">
                  {errors.uid.message}
                </p>
              )}
            </div>

            <div className="space-y-1 group">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 hover:underline transition-all"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full bg-input/40 border-2 ${errors.password ? "border-danger-500/50" : "border-border/50"} rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary-500 transition-all font-medium text-sm`}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-danger-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-400 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 mt-4"
          >
            <span>{loading ? "Authenticating..." : "Sign In Now"}</span>
            {!loading && (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
            )}
          </button>

          <div className="text-center pt-4">
            <Link
              to="/signup"
              className="text-xs text-foreground/50 hover:text-primary-500 font-bold transition-all tracking-wide"
            >
              First time here?{" "}
              <span className="text-primary-500 underline underline-offset-4">
                Create an Account
              </span>
            </Link>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-border/50 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-input/30 rounded-full border border-border/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Trading Vault Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
