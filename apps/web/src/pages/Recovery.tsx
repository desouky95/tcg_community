import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import AuthShell from "../components/AuthShell";

export default function Recovery() {
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [requested, setRequested] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (requested && password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setPending(true);
    try {
      await api.http.post(
        "/auth/password-recovery",
        requested
          ? {
              mobile: mobile.replace(/\s/g, ""),
              otp: code,
              password,
              passwordConfirmation: confirmation,
            }
          : { mobile: mobile.replace(/\s/g, "") },
      );
      if (requested) setDone(true);
      else setRequested(true);
    } catch {
      setError(
        "Could not complete this request. Check your details and try again.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      description="Use your verified mobile number to recover your account."
      asideTitle="Account recovery"
      asideDescription="Your existing sessions will be signed out after a reset."
      asideItems={[]}
      footer={<Link to="/login">Return to sign in</Link>}
    >
      {done ? (
        <p role="status">Password updated. You can now sign in.</p>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <label htmlFor="recovery-mobile">Mobile number</label>
          <input
            id="recovery-mobile"
            type="tel"
            autoComplete="tel"
            value={mobile}
            onChange={(event) => setMobile(event.target.value)}
            required
            disabled={pending || requested}
            className="ui-control"
          />
          {requested && (
            <>
              <p role="status">
                If the account is eligible, a verification code has been
                requested.
              </p>
              <label htmlFor="recovery-code">Verification code</label>
              <input
                id="recovery-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                pattern="[0-9]{6}"
                required
                className="ui-control"
              />
              <label htmlFor="recovery-password">New password</label>
              <input
                id="recovery-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={32}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="ui-control"
              />
              <label htmlFor="recovery-confirmation">Confirm password</label>
              <input
                id="recovery-confirmation"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={32}
                required
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="ui-control"
              />
            </>
          )}
          {error && <p role="alert">{error}</p>}
          <button className="ui-button" disabled={pending}>
            {requested ? "Reset password" : "Request code"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
