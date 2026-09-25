import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell from "../components/AuthShell";

const loginSchema = z.object({ uid: z.string().min(3, "Username, email or mobile is required"), password: z.string().min(6, "Password is required") });
type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data);
      toast.success("Welcome back to TCG Nexus!");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.unverified) {
        toast.error("Account not verified. Please verify your mobile.");
        navigate("/verify-otp", { state: { mobile: err.response.data.mobile } });
      } else toast.error(err.response?.data?.error || "Invalid credentials");
    }
  };
  const loading = login.isPending;
  return (
    <AuthShell eyebrow="Welcome back" title={<>Open your <em>vault.</em></>} description="Pick up where you left off. Your saved cards, swaps, and collector circles are waiting." asideTitle="A calmer way to collect." asideDescription="The place for serious collectors who still enjoy the thrill of the pull." asideItems={["Track every card in one place", "Trade with collectors you can trust", "Keep your collection close"]} footer={<>New to the club? <Link to="/signup" className="wax-auth-link focus-ring">Create an account</Link></>}>
      <form onSubmit={handleSubmit(onLoginSubmit)} className="wax-auth-form">
        <div className="wax-auth-field"><label htmlFor="login-uid" className="wax-auth-label">Email, username, or mobile</label><div className="wax-auth-input-wrap"><Mail aria-hidden="true" /><input id="login-uid" {...register("uid")} type="text" placeholder="hello@nexus.com" className={`wax-auth-input${errors.uid ? " is-invalid" : ""}`} disabled={loading} /></div>{errors.uid && <p className="wax-auth-error">{errors.uid.message}</p>}</div>
        <div className="wax-auth-field"><div className="wax-auth-label-row"><label htmlFor="login-password" className="wax-auth-label">Password</label><Link to="/forgot-password" className="wax-auth-small-link focus-ring">Forgot password?</Link></div><div className="wax-auth-input-wrap"><LockKeyhole aria-hidden="true" /><input id="login-password" {...register("password")} type="password" placeholder="••••••••" className={`wax-auth-input${errors.password ? " is-invalid" : ""}`} disabled={loading} /></div>{errors.password && <p className="wax-auth-error">{errors.password.message}</p>}</div>
        <button type="submit" disabled={loading} className="wax-button wax-button-primary wax-auth-submit">{loading ? "Opening vault…" : "Sign in"}{!loading && <ArrowRight aria-hidden="true" />}</button>
      </form>
    </AuthShell>
  );
}
