import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import AuthShell from "../components/AuthShell";

export default function DeleteDeactivated() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await api.http.post("/auth/deactivated-privacy-deletion", {
        mobile: mobile.replace(/\s/g, ""),
        password,
        confirmation,
      });
      setMessage("Your profile has been anonymized.");
    } catch {
      setError("Could not verify this deactivated account.");
    } finally {
      setPending(false);
    }
  }
  return (
    <AuthShell
      eyebrow="Privacy"
      title="Delete a deactivated account"
      description="Anonymize your profile using your deactivated account credentials."
      asideTitle="Your data"
      asideDescription="Collections and shared operational records remain."
      asideItems={[]}
      footer={<Link to="/login">Return to sign in</Link>}
    >
      {message ? (
        <p role="status">{message}</p>
      ) : (
        <form onSubmit={submit} className="grid gap-4">
          <label htmlFor="delete-mobile">Mobile number</label>
          <input
            id="delete-mobile"
            type="tel"
            required
            autoComplete="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <label htmlFor="delete-deactivated-password">Password</label>
          <input
            id="delete-deactivated-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="delete-deactivated-confirmation">
            Type DELETE to confirm
          </label>
          <input
            id="delete-deactivated-confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={pending || confirmation !== "DELETE"}>
            Delete personal data
          </button>
        </form>
      )}
    </AuthShell>
  );
}
