import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthShell from "../components/AuthShell";

export default function OtpLogin() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const { requestOtp } = useAuth();
  const navigate = useNavigate();
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await requestOtp.mutateAsync(mobile.replace(/\s/g, ""));
      navigate("/verify-otp", { state: { mobile: mobile.replace(/\s/g, "") } });
    } catch {
      setError("Could not request a code. Check your number and try again.");
    }
  }
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Sign in with a code"
      description="Request a code for your verified mobile number."
      asideTitle="Your collector account"
      asideDescription="Use your registered mobile number."
      asideItems={[]}
      footer={<Link to="/login">Sign in with a password</Link>}
    >
      <form onSubmit={submit} className="grid gap-4">
        <label htmlFor="otp-mobile">Mobile number</label>
        <input
          id="otp-mobile"
          type="tel"
          autoComplete="tel"
          value={mobile}
          onChange={(event) => setMobile(event.target.value)}
          required
          disabled={requestOtp.isPending}
          className="ui-control"
        />
        {error && <p role="alert">{error}</p>}
        <button className="ui-button" disabled={requestOtp.isPending}>
          Request code
        </button>
      </form>
    </AuthShell>
  );
}
