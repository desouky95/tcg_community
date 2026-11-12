import { ComponentType, forwardRef, useEffect, useState } from "react";
import { useFetchClient } from "@strapi/strapi/admin";

type Collection = { id: string; title: string };
type Props = {
  name: string;
  value?: string;
  onChange: (event: {
    target: { name: string; value: string; type: string };
  }) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string | { id?: string; defaultMessage?: string };
};

const MedusaCollectionInput = forwardRef<HTMLInputElement, Props>(function MedusaCollectionInput({
  name,
  value,
  onChange,
  disabled,
  required,
  error,
}, ref) {
  const { get } = useFetchClient();
  const [query, setQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<Collection[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<Collection | null>(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (!value) {
      setSelected(null);
      setMissing(false);
      return;
    }
    let active = true;
    get<any>("/medusa-collections/collections", { params: { id: value } })
      .then(({ data }) => {
        if (active) {
          setSelected(data.collections[0] ?? null);
          setMissing(data.collections.length === 0);
        }
      })
      .catch(() => {
        if (active) setMissing(false);
      });
    return () => {
      active = false;
    };
  }, [get, value]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    const timer = window.setTimeout(() => {
      get<any>("/medusa-collections/collections", { params: { q: query, offset } })
        .then(({ data }) => {
          if (!active) return;
          setItems(data.collections);
          setCount(data.count);
          const match = data.collections.find(
            (item: Collection) => item.id === value,
          );
          if (match) setSelected(match);
        })
        .catch(() => {
          if (active) setFailed(true);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query, offset, get, value]);
  return (
    <div>
      <label htmlFor={`${name}-search`}>Search Medusa collections</label>
      <input
        ref={ref}
        id={`${name}-search`}
        value={query}
        disabled={disabled}
        onChange={(event) => {
          setQuery(event.target.value);
          setOffset(0);
        }}
      />
      {value && (
        <p>
          Selected: {selected?.id === value ? selected.title : value}{" "}
          {missing
            ? "(no longer available)"
            : !selected
              ? "(checking selection)"
              : ""}
        </p>
      )}
      {loading ? (
        <p role="status">Loading collections…</p>
      ) : failed ? (
        <p role="alert">
          Collections are unavailable. Check Medusa configuration and try again.
        </p>
      ) : items.length === 0 ? (
        <p>No collections found.</p>
      ) : (
        <select
          aria-label="Medusa collection"
          value={items.some((item) => item.id === value) ? value : ""}
          disabled={disabled}
          required={required && !value}
          onChange={(event) => {
            const item = items.find((entry) => entry.id === event.target.value);
            setSelected(item ?? null);
            onChange({
              target: { name, value: event.target.value, type: "string" },
            });
          }}
        >
          <option value="">Select a collection</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      )}
      <div>
        <button
          type="button"
          disabled={disabled || loading || offset === 0}
          onClick={() => setOffset(Math.max(0, offset - 20))}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={disabled || loading || offset + 20 >= count}
          onClick={() => setOffset(offset + 20)}
        >
          Next
        </button>
      </div>
      {error && <p role="alert">{typeof error === "string" ? error : error.defaultMessage ?? error.id ?? "Invalid selection"}</p>}
    </div>
  );
});

export default MedusaCollectionInput as any as ComponentType;
