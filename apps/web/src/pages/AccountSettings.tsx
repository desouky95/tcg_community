import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTcgSession } from "@tcg/react-query";
import { api } from "../lib/api";
import { useTheme } from "../components/ThemeProvider";
import { useStore } from "../store/useStore";
import Layout from "../components/Layout";

type Preferences = {
  locale: "en" | "ar";
  theme: "system" | "light" | "dark";
  privacy: { showProfile?: boolean; showCollection?: boolean };
  communication: { email?: boolean; whatsapp?: boolean };
};
export default function AccountSettings() {
  const [draft, setPrefs] = useState<Preferences>();
  const [error, setError] = useState("");
  const preferences = useQuery<Preferences>({
    queryKey: ["account-preferences"],
    queryFn: async () => (await api.http.get("/account/preferences")).data.data,
  });
  const exports = useQuery<{ id: number }[]>({
    queryKey: ["privacy-exports"],
    queryFn: async () =>
      (await api.http.get("/account/privacy-exports")).data.data,
  });
  const prefs = draft ?? preferences.data;
  const [message, setMessage] = useState("");
  const [exportId, setExportId] = useState<number>();
  const [deletionConfirmation, setDeletionConfirmation] = useState("");
  const [deletionPassword, setDeletionPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const { i18n } = useTranslation();
  const { setTheme } = useTheme();
  const { clearSession } = useTcgSession();
  const navigate = useNavigate();
  const availableExportId = exportId ?? exports.data?.[0]?.id;
  async function save(event: FormEvent) {
    event.preventDefault();
    if (!prefs) return;
    setPending(true);
    setError("");
    try {
      await api.http.put("/account/preferences", prefs);
      await i18n.changeLanguage(prefs.locale);
      setTheme(prefs.theme);
      setMessage("Settings saved.");
    } catch {
      setError("Could not save settings.");
    } finally {
      setPending(false);
    }
  }
  async function deactivate() {
    setPending(true);
    setError("");
    try {
      await api.http.post("/account/deactivate", { confirmation });
      clearSession();
      useStore.getState().setUser(null);
      navigate("/login");
    } catch {
      setError("Could not deactivate the account.");
    } finally {
      setPending(false);
    }
  }
  async function requestExport() {
    setPending(true);
    setError("");
    try {
      const result = await api.http.post("/account/privacy-exports");
      setExportId(result.data.data.id);
      setMessage("Your export has been queued.");
    } catch {
      setError("Could not request your export.");
    } finally {
      setPending(false);
    }
  }
  async function downloadExport() {
    if (!availableExportId) return;
    setPending(true);
    setError("");
    try {
      const result = await api.http.get(
        `/account/privacy-exports/${availableExportId}`,
      );
      if (result.data.data.status !== "ready") {
        setMessage(`Export status: ${result.data.data.status}.`);
        return;
      }
      const file = await api.http.get(
        `/account/privacy-exports/${availableExportId}/download`,
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(file.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "nextpull-personal-data.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not download your export.");
    } finally {
      setPending(false);
    }
  }
  async function deleteAccount() {
    setPending(true);
    setError("");
    try {
      await api.http.post("/account/privacy-deletions", {
        confirmation: deletionConfirmation,
        password: deletionPassword,
      });
      clearSession();
      useStore.getState().setUser(null);
      navigate("/login");
    } catch {
      setError(
        "Could not delete the account. Check your password and confirmation.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Layout>
      <main className="mx-auto grid max-w-2xl gap-6 p-6">
        <h1>Account settings</h1>
        <Link to="/profile/edit">Edit profile and mobile number</Link>
        {(error || preferences.isError) && (
          <p role="alert">{error || "Could not load account settings."}</p>
        )}
        {message && <p role="status">{message}</p>}
        {prefs ? (
          <form onSubmit={save} className="grid gap-4">
            <label htmlFor="settings-language">Language</label>
            <select
              id="settings-language"
              value={prefs.locale}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  locale: e.target.value as Preferences["locale"],
                })
              }
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            <label htmlFor="settings-theme">Theme</label>
            <select
              id="settings-theme"
              value={prefs.theme}
              onChange={(e) =>
                setPrefs({
                  ...prefs,
                  theme: e.target.value as Preferences["theme"],
                })
              }
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <label>
              <input
                type="checkbox"
                checked={prefs.privacy.showProfile !== false}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    privacy: {
                      ...prefs.privacy,
                      showProfile: e.target.checked,
                    },
                  })
                }
              />{" "}
              Show public profile
            </label>
            <label>
              <input
                type="checkbox"
                checked={prefs.privacy.showCollection !== false}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    privacy: {
                      ...prefs.privacy,
                      showCollection: e.target.checked,
                    },
                  })
                }
              />{" "}
              Show collection
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!prefs.communication.email}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    communication: {
                      ...prefs.communication,
                      email: e.target.checked,
                    },
                  })
                }
              />{" "}
              Email updates
            </label>
            <label>
              <input
                type="checkbox"
                checked={!!prefs.communication.whatsapp}
                onChange={(e) =>
                  setPrefs({
                    ...prefs,
                    communication: {
                      ...prefs.communication,
                      whatsapp: e.target.checked,
                    },
                  })
                }
              />{" "}
              WhatsApp updates
            </label>
            <button type="submit" disabled={pending}>
              Save settings
            </button>
          </form>
        ) : (
          !error &&
          !preferences.isError && <p role="status">Loading settings…</p>
        )}
        <section className="grid gap-3">
          <h2>Export personal data</h2>
          <p>
            Request a seven-day download of your profile, collections and
            conversations.
          </p>
          <button type="button" disabled={pending} onClick={requestExport}>
            Request export
          </button>
          {availableExportId && (
            <button type="button" disabled={pending} onClick={downloadExport}>
              Check and download export
            </button>
          )}
        </section>
        <section className="grid gap-3">
          <h2>Delete personal data</h2>
          <p>
            Your profile will be anonymized and your account disabled.
            Collections and shared operational records remain.
          </p>
          <label htmlFor="delete-password">Password</label>
          <input
            id="delete-password"
            type="password"
            autoComplete="current-password"
            value={deletionPassword}
            onChange={(e) => setDeletionPassword(e.target.value)}
          />
          <label htmlFor="delete-confirmation">Type DELETE to confirm</label>
          <input
            id="delete-confirmation"
            value={deletionConfirmation}
            onChange={(e) => setDeletionConfirmation(e.target.value)}
          />
          <button
            type="button"
            disabled={
              pending || deletionConfirmation !== "DELETE" || !deletionPassword
            }
            onClick={deleteAccount}
          >
            Delete personal data
          </button>
        </section>
        <section className="grid gap-3">
          <h2>Deactivate account</h2>
          <p>
            Your account will be signed out and cannot sign in while
            deactivated.
          </p>
          <label htmlFor="deactivate-confirmation">
            Type DEACTIVATE to confirm
          </label>
          <input
            id="deactivate-confirmation"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
          <button
            type="button"
            disabled={pending || confirmation !== "DEACTIVATE"}
            onClick={deactivate}
          >
            Deactivate account
          </button>
        </section>
      </main>
    </Layout>
  );
}
