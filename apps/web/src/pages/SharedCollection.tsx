import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useTranslation } from "react-i18next";
import { Surface } from "@tcg/ui-web";

type Shared = {
  checklistName: string;
  username: string;
  missing: { id: number; number: string; name: string }[];
  duplicates: { id: number; number: string; name: string; quantity: number }[];
};
export default function SharedCollection() {
  const { token, userId, checklistId } = useParams();
  const { t } = useTranslation();
  const [data, setData] = useState<Shared>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    const path = token
      ? `/shared/collections/${encodeURIComponent(token)}`
      : `/users/${encodeURIComponent(userId ?? "")}/collections/${encodeURIComponent(checklistId ?? "")}`;
    api.http
      .get(path)
      .then((result) => {
        if (alive) setData(result.data.data);
      })
      .catch(() => {
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, [token, userId, checklistId]);
  if (error)
    return (
      <main>
        <h1>Collection unavailable</h1>
      </main>
    );
  if (!data) return <main role="status">Loading collection…</main>;
  return (
    <main className="mx-auto grid max-w-3xl gap-4 p-6">
      <h1>{data.checklistName}</h1>
      <p>Collection by {data.username}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Surface className="rounded-xl p-5">
          <h2 className="font-display text-xl font-bold">
            {t("shared_collection.missing")}
          </h2>
          {data.missing.length === 0 ? (
            <p className="mt-4 text-wax-muted">
              {t("shared_collection.no_missing")}
            </p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {data.missing.map((card) => (
                <li key={card.id}>
                  {card.number} — {card.name}
                </li>
              ))}
            </ul>
          )}
        </Surface>
        <Surface className="rounded-xl p-5">
          <h2 className="font-display text-xl font-bold">
            {t("shared_collection.duplicates")}
          </h2>
          {data.duplicates.length === 0 ? (
            <p className="mt-4 text-wax-muted">
              {t("shared_collection.no_duplicates")}
            </p>
          ) : (
            <ul className="mt-4 grid gap-2">
              {data.duplicates.map((card) => (
                <li key={card.id}>
                  {card.number} — {card.name}{" "}
                  <span className="text-wax-muted">
                    ({t("shared_collection.quantity", { count: card.quantity })}
                    )
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Surface>
      </div>
    </main>
  );
}
