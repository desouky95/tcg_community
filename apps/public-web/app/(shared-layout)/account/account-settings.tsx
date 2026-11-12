"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthField, AuthInput, AuthSelect, Button } from "@tcg/ui-web";
import { api } from "../../../src/lib/api";

type Preferences = {
  locale: "en" | "ar";
  theme: "system" | "light" | "dark";
  privacy: { showProfile?: boolean; showCollection?: boolean };
  communication: { whatsapp?: boolean; email?: boolean };
};
type ExportRecord = {
  id: number;
  status: string;
  createdAt: string;
  expiresAt: string;
};
type Response<T> = { data: T; version?: number };
const panel = "rounded-xl border border-wax-line bg-card p-5 sm:p-7";

function failure(error: unknown) {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  if (status === 401 || status === 403)
    return "Your session has expired. Sign in again to continue.";
  if (status === 409)
    return "Your account changed in another session. Refresh this page and try again.";
  if (status === 422)
    return "Check your confirmation and password, then try again.";
  return "We couldn't complete that request. Please try again.";
}

export function PreferencesSection({ userId }: { userId: string }) {
  const client = useQueryClient();
  const key = ["account-preferences", userId];
  const query = useQuery({
    queryKey: key,
    queryFn: async () =>
      (await api.http.get<Response<Preferences>>("/account/preferences")).data,
    retry: false,
  });
  const [notice, setNotice] = useState("");
  const save = useMutation({
    mutationFn: async (values: Preferences) =>
      (
        await api.http.put<Response<Preferences>>(
          "/account/preferences",
          values,
        )
      ).data,
    onSuccess: (data) => {
      client.setQueryData(key, data);
      setNotice("Preferences saved.");
    },
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    const form = new FormData(event.currentTarget);
    save.mutate({
      locale: form.get("locale") as Preferences["locale"],
      theme: form.get("theme") as Preferences["theme"],
      privacy: {
        showProfile: form.has("showProfile"),
        showCollection: form.has("showCollection"),
      },
      communication: {
        email: form.has("email"),
        whatsapp: form.has("whatsapp"),
      },
    });
  }
  if (query.isPending)
    return (
      <div className={panel} role="status">
        Loading preferences…
      </div>
    );
  if (query.isError)
    return (
      <div className={panel} role="alert">
        <p>{failure(query.error)}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => void query.refetch()}
        >
          Try again
        </Button>
      </div>
    );
  const prefs = query.data.data;
  return (
    <form
      key={JSON.stringify(prefs)}
      onSubmit={submit}
      className={`${panel} grid gap-6`}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <AuthField id="account-locale" label="Language">
          <AuthSelect
            id="account-locale"
            name="locale"
            defaultValue={prefs.locale}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </AuthSelect>
        </AuthField>
        <AuthField id="account-theme" label="Theme">
          <AuthSelect
            id="account-theme"
            name="theme"
            defaultValue={prefs.theme}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </AuthSelect>
        </AuthField>
      </div>
      <fieldset className="grid gap-3">
        <legend className="mb-3 font-semibold">Privacy</legend>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="showProfile"
            defaultChecked={prefs.privacy.showProfile !== false}
          />{" "}
          Show my public profile
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="showCollection"
            defaultChecked={prefs.privacy.showCollection !== false}
          />{" "}
          Show my collection
        </label>
      </fieldset>
      <fieldset className="grid gap-3">
        <legend className="mb-3 font-semibold">Communications</legend>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="email"
            defaultChecked={prefs.communication.email === true}
          />{" "}
          Email
        </label>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="whatsapp"
            defaultChecked={prefs.communication.whatsapp === true}
          />{" "}
          WhatsApp
        </label>
      </fieldset>
      <div>
        <Button
          type="submit"
          loading={save.isPending}
          disabled={save.isPending}
        >
          Save preferences
        </Button>
      </div>
      {notice && <p role="status">{notice}</p>}
      {save.isError && (
        <p role="alert" className="text-danger-600">
          {failure(save.error)}
        </p>
      )}
    </form>
  );
}

export function PrivacySection({ userId }: { userId: string }) {
  const client = useQueryClient();
  const key = ["account-exports", userId];
  const exports = useQuery({
    queryKey: key,
    queryFn: async () =>
      (await api.http.get<Response<ExportRecord[]>>("/account/privacy-exports"))
        .data.data,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.some((item) => item.status === "queued") ? 5000 : false,
  });
  const version = useQuery({
    queryKey: ["account-preferences", userId],
    queryFn: async () =>
      (await api.http.get<Response<Preferences>>("/account/preferences")).data,
    retry: false,
  });
  const [action, setAction] = useState<"deactivate" | "delete" | null>(null);
  const [downloadError, setDownloadError] = useState("");
  const create = useMutation({
    mutationFn: () => api.http.post("/account/privacy-exports"),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
  const perform = useMutation({
    mutationFn: ({
      confirmation,
      password,
    }: {
      confirmation: string;
      password: string;
    }) =>
      api.http.post(
        action === "delete"
          ? "/account/privacy-deletions"
          : "/account/deactivate",
        {
          confirmation,
          ...(action === "delete" ? { password } : {}),
          ...(version.data?.version !== undefined
            ? { expectedVersion: version.data.version }
            : {}),
        },
      ),
    onSuccess: () => {
      client.clear();
      window.location.assign("/login");
    },
  });
  async function download(id: number) {
    setDownloadError("");
    try {
      const response = await api.http.get<Blob>(
        `/account/privacy-exports/${id}/download`,
        { responseType: "blob" },
      );
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "nextpull-personal-data.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(failure(error));
    }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    perform.mutate({
      confirmation: String(data.get("confirmation") ?? ""),
      password: String(data.get("password") ?? ""),
    });
  }
  return (
    <div className={`${panel} space-y-8`}>
      <div>
        <h3 className="font-display text-lg font-semibold">
          Download your data
        </h3>
        <p className="mt-2 text-sm text-wax-muted">
          Request an export of your profile, collections and conversations.
          Downloads expire after seven days.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => create.mutate()}
          loading={create.isPending}
          disabled={create.isPending}
        >
          Request export
        </Button>
        {create.isError && (
          <p role="alert" className="mt-3 text-danger-600">
            {failure(create.error)}
          </p>
        )}
        {exports.isPending ? (
          <p className="mt-4" role="status">
            Loading exports…
          </p>
        ) : exports.isError ? (
          <div className="mt-4" role="alert">
            <p>{failure(exports.error)}</p>
            <Button
              className="mt-3"
              variant="outline"
              onClick={() => void exports.refetch()}
            >
              Try again
            </Button>
          </div>
        ) : exports.data.length === 0 ? (
          <p className="mt-4 text-sm text-wax-muted">
            No exports requested yet.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-wax-line">
            {exports.data.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-semibold capitalize">{item.status}</p>
                  <p className="text-sm text-wax-muted">
                    Requested {new Date(item.createdAt).toLocaleDateString()} ·
                    expires {new Date(item.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                {item.status === "ready" && (
                  <Button
                    variant="outline"
                    onClick={() => void download(item.id)}
                  >
                    Download
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
        {downloadError && (
          <p role="alert" className="mt-3 text-danger-600">
            {downloadError}
          </p>
        )}
      </div>
      <div className="border-t border-wax-line pt-6">
        <h3 className="font-display text-lg font-semibold">Account actions</h3>
        <p className="mt-2 text-sm text-wax-muted">
          Deactivate your account to disable sign-in, or permanently anonymize
          your personal data. Some records may be retained.
        </p>
        {!action && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setAction("deactivate")}>
              Deactivate account
            </Button>
            <Button variant="outline" onClick={() => setAction("delete")}>
              Delete personal data
            </Button>
          </div>
        )}
        {action && (
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <p>
              {action === "delete"
                ? "This permanently anonymizes your account. Enter your password and type DELETE to confirm."
                : "You will be signed out and unable to sign in. Type DEACTIVATE to confirm."}
            </p>
            {action === "delete" && (
              <AuthField id="privacy-password" label="Password">
                <AuthInput
                  id="privacy-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </AuthField>
            )}
            <AuthField
              id="privacy-confirmation"
              label={`Type ${action === "delete" ? "DELETE" : "DEACTIVATE"}`}
            >
              <AuthInput
                id="privacy-confirmation"
                name="confirmation"
                required
                pattern={action === "delete" ? "DELETE" : "DEACTIVATE"}
              />
            </AuthField>
            {perform.isError && (
              <p role="alert" className="text-danger-600">
                {failure(perform.error)}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                loading={perform.isPending}
                disabled={perform.isPending}
              >
                {action === "delete"
                  ? "Delete personal data"
                  : "Deactivate account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={perform.isPending}
                onClick={() => {
                  setAction(null);
                  perform.reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
