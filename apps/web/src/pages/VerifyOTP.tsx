import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell from "../components/AuthShell";
import { AxiosError } from "axios";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, requestOtp } = useAuth();

  const mobileNumber = location.state?.mobile || new URLSearchParams(location.search).get("mobile") || "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      await verifyOtp.mutateAsync({ mobile: mobileNumber, otp: data.otp });
      toast.success("Account verified successfully!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof AxiosError ? err.response?.data?.error : undefined;
      toast.error(message || "Invalid verification code");
    }
  };

  const onResend = async () => {
    try {
      await requestOtp.mutateAsync(mobileNumber);
      toast.success("New code sent to WhatsApp");
    } catch {
      toast.error("Failed to resend code");
    }
  };

  const loading = verifyOtp.isPending || requestOtp.isPending;

  return (
    <AuthShell
      eyebrow="Verification / 02"
      title={<>Keep your <em>vault</em> close.</>}
      description="One quick check keeps every collection, swap, and conversation tied to you."
      asideTitle="Trust is part of the collection."
      asideDescription="A verified number helps the club stay useful, local, and made for real collectors."
      asideItems={["One code for a secure session", "WhatsApp-first verification", "Your cards stay yours"]}
      footer={
        <>
          Need to start over? <Link to="/login" className="wax-auth-link focus-ring">Return to sign in</Link>
        </>
      }
    >
      {!mobileNumber ? (
        <div className="wax-auth-recovery" role="status">
          <span className="wax-auth-recovery-icon"><MessageCircle aria-hidden="true" /></span>
          <div>
            <h2>We need your mobile number.</h2>
            <p>Start from sign in or account creation so we can send the verification code to the right WhatsApp number.</p>
          </div>
          <Link to="/login" className="wax-button wax-button-primary focus-ring">Return to sign in <ArrowRight aria-hidden="true" /></Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onOtpSubmit)} className="wax-auth-form">
            <div className="wax-auth-field">
              <label htmlFor="verify-otp" className="wax-auth-label">6-digit verification code</label>
              <div className={`wax-otp-input-wrap${errors.otp ? " is-invalid" : ""}`}>
                <ShieldCheck aria-hidden="true" />
                <Controller
                  control={control}
                  name="otp"
                  render={({ field }) => (
                    <input
                      {...field}
                      id="verify-otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="000000"
                      autoFocus
                      autoComplete="one-time-code"
                      className="wax-otp-input"
                      aria-describedby={errors.otp ? "verify-otp-help verify-otp-error" : "verify-otp-help"}
                      aria-invalid={Boolean(errors.otp)}
                      disabled={loading}
                      maxLength={6}
                    />
                  )}
                />
              </div>
              <p id="verify-otp-help" className="wax-otp-help">
                <MessageCircle aria-hidden="true" /> Code sent to <strong>{mobileNumber}</strong>
              </p>
              {errors.otp && <p id="verify-otp-error" className="wax-auth-error" role="alert">{errors.otp.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="wax-button wax-button-primary wax-auth-submit">
              {loading ? "Checking code…" : "Verify and continue"}
              {!loading && <ArrowRight aria-hidden="true" />}
            </button>
          </form>

          <div className="wax-otp-resend">
            <span>Didn't receive a code?</span>
            <button type="button" onClick={onResend} disabled={loading} className="wax-auth-link focus-ring">
              Resend via WhatsApp
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}
