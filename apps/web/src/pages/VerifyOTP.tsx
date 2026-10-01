import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import AuthShell from "../components/AuthShell";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Button, OtpField } from "@tcg/ui-web";

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Verification code must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, requestOtp } = useAuth();

  const mobileNumber =
    location.state?.mobile ||
    new URLSearchParams(location.search).get("mobile") ||
    "";

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    requestOtp.mutate(mobileNumber);
  }, []);

  const onOtpSubmit = async (data: OtpFormData) => {
    try {
      await verifyOtp.mutateAsync({ mobile: mobileNumber, otp: data.otp });
      toast.success("Account verified successfully!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError ? err.response?.data?.error : undefined;
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
      title={
        <>
          Keep your <em>vault</em> close.
        </>
      }
      description="One quick check keeps every collection, swap, and conversation tied to you."
      asideTitle="Trust is part of the collection."
      asideDescription="A verified number helps the club stay useful, local, and made for real collectors."
      asideItems={[
        "One code for a secure session",
        "WhatsApp-first verification",
        "Your cards stay yours",
      ]}
      footer={
        <>
          Need to start over?{" "}
          <Link to="/login" className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring">
            Return to sign in
          </Link>
        </>
      }
    >
      {!mobileNumber ? (
        <div className="grid gap-5 border-y border-wax-line py-6 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:uppercase [&_p]:max-w-md [&_p]:leading-relaxed [&_p]:text-wax-muted" role="status">
          <span className="inline-flex size-control-sm items-center justify-center bg-wax-gold text-primary-600 [&_svg]:size-5">
            <MessageCircle aria-hidden="true" />
          </span>
          <div>
            <h2>We need your mobile number.</h2>
            <p>
              Start from sign in or account creation so we can send the
              verification code to the right WhatsApp number.
            </p>
          </div>
          <Button asChild><Link to="/login">Return to sign in <ArrowRight aria-hidden="true" /></Link></Button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onOtpSubmit)} className="grid gap-5">
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <>
                  <OtpField
                    {...field}
                    id="verify-otp"
                    label="6-digit verification code"
                    type="text"
                    placeholder="000000"
                    autoFocus
                    icon={<ShieldCheck aria-hidden="true" />}
                    aria-describedby={
                      errors.otp
                        ? "verify-otp-help verify-otp-error"
                        : "verify-otp-help"
                    }
                    aria-invalid={Boolean(errors.otp)}
                    disabled={loading}
                    help={
                      <>
                        <MessageCircle aria-hidden="true" /> Code sent to{" "}
                        <strong>{mobileNumber}</strong>
                      </>
                    }
                  />
                  {errors.otp && (
                    <p
                      id="verify-otp-error"
                      className="m-0 text-xs font-semibold text-danger-600"
                      role="alert"
                    >
                      {errors.otp.message}
                    </p>
                  )}
                </>
              )}
            />

            <Button type="submit" loading={loading} className="w-full">Verify and continue{!loading && <ArrowRight aria-hidden="true" />}</Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-sm text-wax-muted [&_button]:min-h-control-sm [&_button]:p-1.5 [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-50">
            <span>Didn't receive a code?</span>
            <button
              type="button"
              onClick={onResend}
              disabled={loading}
              className="font-mono text-utility uppercase text-wax-red hover:underline focus-ring"
            >
              Resend via WhatsApp
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}
