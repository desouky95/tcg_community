import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { Smartphone, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { BackButton } from "../components/common/BackButton";

const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, requestOtp } = useAuth();

  const mobileNumber = location.state?.mobile || "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (!mobileNumber) {
      toast.error("Mobile number missing. Please log in.");
      navigate("/login");
    }
  }, [mobileNumber, navigate]);

  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      await verifyOtp.mutateAsync({ mobile: mobileNumber, otp: data.otp });
      toast.success("Account verified successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid verification code");
    }
  };

  const onResend = async () => {
    try {
      await requestOtp.mutateAsync(mobileNumber);
      toast.success("New code sent to WhatsApp");
    } catch (err: any) {
      toast.error("Failed to resend code");
    }
  };

  const loading = verifyOtp.isPending || requestOtp.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-green-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="fixed top-8 left-8 z-50">
        <BackButton />
      </div>

      <div className="w-full max-w-md bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative z-10">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 bg-linear-to-br from-primary-500 to-green-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary-500/30 transform -rotate-3">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic mb-2">
            Verify Access
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            We've sent a 4-digit security code to
            <span className="block text-foreground font-black mt-1 text-lg">
              {mobileNumber}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-primary-500 to-green-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
            <div className="relative">
              <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-muted-foreground z-10 group-focus-within:text-primary-500 transition-colors" />
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="000000"
                    autoFocus
                    autoComplete="one-time-code"
                    className={`w-full bg-input/40 border-2 ${errors.otp ? "border-danger-500/50" : "border-border/50"} rounded-2xl pl-16 pr-6 py-5 text-center text-4xl tracking-[0.6em] font-black focus:outline-none focus:border-primary-500 transition-all placeholder:text-muted-foreground/30`}
                    disabled={loading}
                    maxLength={6}
                  />
                )}
              />
            </div>
          </div>

          {errors.otp && (
            <p className="text-danger-500 text-xs text-center font-black uppercase tracking-widest animate-bounce">
              {errors.otp.message}
            </p>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-400 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3"
            >
              <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={onResend}
              disabled={loading}
              className="w-full text-xs text-foreground/50 hover:text-primary-500 font-bold tracking-widest uppercase transition-colors py-2"
            >
              Didn't receive code?{" "}
              <span className="text-primary-500 underline underline-offset-4">
                Resend via WhatsApp
              </span>
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-border/50 text-center">
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
            Secure Verification System
          </p>
        </div>
      </div>
    </div>
  );
}
