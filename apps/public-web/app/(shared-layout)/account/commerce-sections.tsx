"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, AuthField, AuthInput } from "@tcg/ui-web";
import { api } from "../../../src/lib/api";

type Order = { id: string; display_id: number; status: string; created_at: string; currency_code: string; items?: { id: string; title: string; quantity: number }[] };
type Address = { id: string; first_name: string; last_name: string; address_1: string; address_2: string | null; city: string; province: string | null; postal_code: string | null; country_code: string; phone: string | null };
type AddressInput = Omit<Address, "id">;
const addressFields = [
  ["first_name", "First name", true], ["last_name", "Last name", true], ["address_1", "Address line 1", true], ["address_2", "Address line 2", false], ["city", "City", true], ["province", "Governorate / region", false], ["postal_code", "Postal code", false], ["country_code", "Country code (e.g. EG)", true], ["phone", "Phone", false],
] as const;

function ErrorState({ retry }: { retry: () => void }) {
  return <div role="alert"><p>Commerce is temporarily unavailable. Please try again.</p><Button variant="outline" className="mt-4" onClick={retry}>Try again</Button></div>;
}

export function OrdersSection({ userId }: { userId: string }) {
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const orders = useQuery({ queryKey: ["account-orders", userId, offset], queryFn: async () => (await api.http.get<{ orders: Order[]; count: number }>("/account/commerce/orders", { params: { offset } })).data, retry: false, staleTime: 0 });
  const detail = useQuery({ queryKey: ["account-order", userId, selected], queryFn: async () => (await api.http.get<{ order: Order }>(`/account/commerce/orders/${encodeURIComponent(selected!)}`)).data.order, enabled: !!selected, retry: false, staleTime: 0 });
  return <div className="rounded-xl border border-wax-line bg-card p-5 sm:p-7">
    {orders.isPending ? <p role="status">Loading orders…</p> : orders.isError ? <ErrorState retry={() => void orders.refetch()} /> : orders.data.orders.length === 0 ? <p>You have no orders associated with this account yet.</p> : <><ul className="divide-y divide-wax-line">{orders.data.orders.map(order => <li key={order.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0"><div><p className="font-semibold">Order #{order.display_id}</p><p className="mt-1 text-sm text-wax-muted">{new Date(order.created_at).toLocaleDateString()} · {order.status.replaceAll('_', ' ')}</p></div><Button variant="outline" onClick={() => setSelected(selected === order.id ? null : order.id)} aria-expanded={selected === order.id}>{selected === order.id ? "Close details" : "View details"}</Button>{selected === order.id && <div className="w-full rounded-lg bg-muted p-4">{detail.isPending ? <p role="status">Loading order…</p> : detail.isError ? <ErrorState retry={() => void detail.refetch()} /> : <><p className="font-semibold">Items</p>{detail.data.items?.length ? <ul className="mt-2 space-y-1">{detail.data.items.map(item => <li key={item.id}>{item.title} × {item.quantity}</li>)}</ul> : <p className="mt-2">No item details available.</p>}</>}</div>}</li>)}</ul><div className="mt-5 flex gap-3"><Button variant="outline" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - 20))}>Previous</Button><Button variant="outline" disabled={offset + 20 >= orders.data.count} onClick={() => setOffset(offset + 20)}>Next</Button></div></>}
  </div>;
}

export function AddressesSection({ userId }: { userId: string }) {
  const client = useQueryClient();
  const key = ["account-addresses", userId];
  const addresses = useQuery({ queryKey: key, queryFn: async () => (await api.http.get<{ addresses: Address[] }>("/account/commerce/addresses")).data.addresses, retry: false, staleTime: 0 });
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const [notice, setNotice] = useState("");
  const mutation = useMutation({ mutationFn: async ({ id, data }: { id?: string; data?: AddressInput }) => {
    if (!data && id) return api.http.delete(`/account/commerce/addresses/${encodeURIComponent(id)}`);
    return id ? api.http.put(`/account/commerce/addresses/${encodeURIComponent(id)}`, data) : api.http.post("/account/commerce/addresses", data);
  }, onSuccess: async (_, variables) => { setEditing(null); setNotice(variables.data ? "Address saved." : "Address deleted."); await client.invalidateQueries({ queryKey: key }); } });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(addressFields.map(([name]) => [name, String(form.get(name) ?? "").trim()])) as AddressInput;
    data.country_code = data.country_code.toLowerCase();
    mutation.mutate({ id: editing && editing !== "new" ? editing.id : undefined, data });
  }
  return <div className="rounded-xl border border-wax-line bg-card p-5 sm:p-7">
    {addresses.isPending ? <p role="status">Loading addresses…</p> : addresses.isError ? <ErrorState retry={() => void addresses.refetch()} /> : <>
      {addresses.data.length === 0 ? <p>No saved addresses yet.</p> : <ul className="divide-y divide-wax-line">{addresses.data.map(address => <li key={address.id} className="flex flex-wrap justify-between gap-4 py-4 first:pt-0"><div><p className="font-semibold">{address.first_name} {address.last_name}</p><p className="text-sm text-wax-muted">{[address.address_1, address.address_2, address.city, address.province, address.postal_code, address.country_code.toUpperCase()].filter(Boolean).join(", ")}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditing(address); setNotice(""); mutation.reset(); }}>Edit</Button><Button variant="outline" disabled={mutation.isPending} onClick={() => { if (window.confirm("Delete this saved address?")) mutation.mutate({ id: address.id }); }}>Delete</Button></div></li>)}</ul>}
      {!editing && <Button className="mt-5" onClick={() => { setEditing("new"); setNotice(""); mutation.reset(); }}>Add address</Button>}
      {editing && <form onSubmit={submit} className="mt-6 grid gap-4 border-t border-wax-line pt-6 sm:grid-cols-2"><h3 className="font-display text-lg font-semibold sm:col-span-2">{editing === "new" ? "Add address" : "Edit address"}</h3>{addressFields.map(([name, label, required]) => <AuthField key={name} id={`address-${name}`} label={label}><AuthInput id={`address-${name}`} name={name} required={required} maxLength={name === 'country_code' ? 2 : name === 'phone' || name === 'postal_code' ? 32 : 255} minLength={name === 'country_code' ? 2 : undefined} defaultValue={editing === "new" ? name === "country_code" ? "EG" : "" : editing[name] ?? ""} /></AuthField>)}<div className="flex flex-wrap gap-3 sm:col-span-2"><Button type="submit" loading={mutation.isPending}>Save address</Button><Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => { setEditing(null); mutation.reset(); }}>Cancel</Button></div></form>}
    </>}
    {notice && <p role="status" className="mt-4 text-sm">{notice}</p>}{mutation.isError && <p role="alert" className="mt-4 text-sm text-red-700">Couldn’t update the address. Check the details and try again.</p>}
  </div>;
}
