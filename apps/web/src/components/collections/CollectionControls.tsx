import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useTcgSession } from "@tcg/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Field, Input, Select, Surface } from "@tcg/ui-web";

type Details = {
  version: number;
  visibility: "private" | "unlisted" | "public";
  shareToken: string | null;
};

export default function CollectionControls({
  id,
  revision,
  onChanged,
}: {
  id: string;
  revision: number;
  onChanged?: () => void;
}) {
  const { user } = useTcgSession();
  const queryClient = useQueryClient();
  const [details, setDetails] = useState<Details | null>();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  async function load() {
    try {
      const response = await api.http.get(`/user-checklists/${id}/details`);
      setDetails(response.data.data);
    } catch (e: any) {
      if (e.response?.status === 404) setDetails(null);
      else setError("Could not load collection controls.");
    }
  }
  useEffect(() => {
    void load();
  }, [id, revision]);
  async function start() {
    setPending(true);
    setError("");
    try {
      await api.http.post(`/user-checklists/${id}/start`);
      await load();
      onChanged?.();
      void queryClient.invalidateQueries({
        queryKey: ["collection-summaries"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["checklists", "cards", id],
      });
    } catch {
      setError("Could not start collection.");
    } finally {
      setPending(false);
    }
  }
  async function updateVisibility(visibility: Details["visibility"]) {
    if (!details) return;
    setPending(true);
    setError("");
    try {
      await api.http.put(`/user-checklists/${id}/visibility`, {
        expectedVersion: details.version,
        visibility,
      });
      await load();
      setMessage("Visibility updated.");
    } catch {
      setError("Could not change visibility. Refresh and try again.");
    } finally {
      setPending(false);
    }
  }
  async function reset() {
    if (!details) return;
    setPending(true);
    setError("");
    try {
      await api.http.post(`/user-checklists/${id}/reset`, {
        expectedVersion: details.version,
        confirmation,
      });
      setDetails(null);
      onChanged?.();
      void queryClient.invalidateQueries({
        queryKey: ["collection-summaries"],
      });
      void queryClient.invalidateQueries({
        queryKey: ["checklists", "cards", id],
      });
      setConfirmation("");
      setMessage("Collection removed.");
    } catch {
      setError("Could not remove collection. Refresh and try again.");
    } finally {
      setPending(false);
    }
  }
  async function download() {
    setPending(true);
    setError("");
    try {
      const response = await api.http.get(`/user-checklists/${id}/export`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "collection.xlsx";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Could not export collection.");
    } finally {
      setPending(false);
    }
  }
  return (
    <Surface
      role="region"
      className="grid min-w-0 gap-5 rounded-xl p-5 sm:p-7"
      aria-label="Collection controls"
    >
      <h2 className="font-display text-xl font-bold text-wax-ink">
        Collection controls
      </h2>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      {details === undefined ? (
        <p role="status">Loading collection…</p>
      ) : details === null ? (
        <Button
          type="button"
          onClick={start}
          disabled={pending}
          className="w-fit"
        >
          Start collection
        </Button>
      ) : (
        <>
          <Field label="Visibility" htmlFor="collection-visibility">
            <Select.Root
              value={details.visibility}
              disabled={pending}
              onValueChange={(value) =>
                void updateVisibility(value as Details["visibility"])
              }
            >
              <Select.Trigger
                id="collection-visibility"
                className="min-w-0 text-base sm:text-sm"
              >
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="private">Private</Select.Item>
                <Select.Item value="unlisted">Unlisted</Select.Item>
                <Select.Item value="public">Public</Select.Item>
              </Select.Content>
            </Select.Root>
          </Field>
          {details.visibility === "public" && user && (
            <p>
              Public link:{" "}
              <a
                href={`${window.location.origin}/collectors/${user.id}/collections/${encodeURIComponent(id)}`}
              >{`${window.location.origin}/collectors/${user.id}/collections/${encodeURIComponent(id)}`}</a>
            </p>
          )}
          {details.visibility === "unlisted" && details.shareToken && (
            <p>
              Share link:{" "}
              <a
                href={`${window.location.origin}/shared/collection/${details.shareToken}`}
              >{`${window.location.origin}/shared/collection/${details.shareToken}`}</a>
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={download}
            className="w-fit"
          >
            Export my collection
          </Button>
          <div className="grid gap-3 border-t border-wax-line pt-5">
            <Field label="Type RESET to remove this collection">
              <Input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </Field>
            <Button
              type="button"
              variant="outline"
              className="w-fit"
              disabled={pending || confirmation !== "RESET"}
              onClick={reset}
            >
              Remove collection
            </Button>
          </div>
        </>
      )}
    </Surface>
  );
}
