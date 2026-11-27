"use client";
import { LegalLinks } from "../../../src/components/legal-links";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useUpdateProfile } from "@tcg/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../src/lib/clients/adonis";
import {
  Button,
  AuthField,
  AuthInput,
  Field,
  Select,
  Surface,
} from "@tcg/ui-web";
import { Tabs } from "@tcg/ui-web/components/radix/tabs";
import {
  ArrowRight,
  LockKeyhole,
  MapPin,
  Package,
  UserRound,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { User } from "@tcg/api-contracts";
import { authQuery } from "../../../src/lib/auth/auth-destination";
import { useStorefrontLogout } from "../../../src/lib/auth/use-storefront-logout";
import { OrdersSection, AddressesSection } from "./commerce-sections";
import { PreferencesSection, PrivacySection } from "./account-settings";

const governorates = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Monufia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "Sharqia",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "Sohag",
  "North Sinai",
];
const inputClass = "w-full";

function Section({
  number,
  title,
  description,
  icon,
  children,
}: {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`account-${number}`} className="min-w-0">
      <div className="mb-6 border-b border-wax-line pb-5 sm:mb-8 sm:pb-6">
        <div className="mb-3 text-wax-muted">{icon}</div>
        <h2
          id={`account-${number}`}
          className="font-display text-2xl font-semibold sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-wax-muted">
          {description}
        </p>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function ProfileForm({
  user,
  onSaved,
}: {
  user: User;
  onSaved: (user: User) => void;
}) {
  const update = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const mobile = String(form.get("mobile") ?? "").replace(/\s/g, "");
    const selectedGovernorate = String(form.get("governorate") ?? "");
    const governorate =
      selectedGovernorate === "__none" ? "" : selectedGovernorate;
    try {
      const result = await update.mutateAsync({
        fullName,
        ...(email ? { email } : {}),
        mobile,
        ...(governorate ? { governorate } : {}),
      });
      setEditing(false);
      setNotice("Your profile has been updated.");
      onSaved(result.data.user);
    } catch {
      setError(
        "We couldn't save your details. Check the fields and try again; your email and mobile must be unique.",
      );
    }
  }
  return (
    <Surface className="rounded-xl p-5 sm:p-7">
      {editing ? (
        <form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
          <AuthField id="account-name" label="Full name">
            <AuthInput
              className={inputClass}
              id="account-name"
              name="fullName"
              defaultValue={user.fullName}
              minLength={3}
              required
              autoComplete="name"
            />
          </AuthField>
          <AuthField id="account-email" label="Email">
            <AuthInput
              className={inputClass}
              id="account-email"
              name="email"
              type="email"
              defaultValue={user.email ?? ""}
              autoComplete="email"
            />
          </AuthField>
          <AuthField id="account-mobile" label="Mobile number">
            <AuthInput
              className={inputClass}
              id="account-mobile"
              name="mobile"
              type="tel"
              defaultValue={user.mobile}
              required
              autoComplete="tel"
            />
          </AuthField>
          <Field htmlFor="account-region" label="Governorate">
            <Select.Root
              name="governorate"
              defaultValue={user.governorate || "__none"}
            >
              <Select.Trigger id="account-region">
                <Select.Value placeholder="Select governorate" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="__none">Select governorate</Select.Item>
                {governorates.map((g) => (
                  <Select.Item key={g} value={g}>
                    {g}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field>
          <p className="text-sm text-wax-muted sm:col-span-2">
            Changing your mobile number requires verification with a new code.
          </p>
          {error && (
            <p role="alert" className="text-sm text-red-700 sm:col-span-2">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="submit" loading={update.isPending}>
              Save changes
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={update.isPending}
              onClick={() => {
                setEditing(false);
                setError("");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {[
              ["Full name", user.fullName],
              ["Username", `@${user.username}`],
              ["Email", user.email || "Not provided"],
              ["Mobile", user.mobile || "Not provided"],
              ["Governorate", user.governorate || "Not provided"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-wax-muted">{label}</dt>
                <dd className="mt-1 wrap-break-word font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <Button
            type="button"
            variant="outline"
            className="mt-7"
            onClick={() => {
              setNotice("");
              setEditing(true);
            }}
          >
            Edit profile
          </Button>
        </>
      )}
      {notice && (
        <p role="status" className="mt-4 text-sm">
          {notice}
        </p>
      )}
    </Surface>
  );
}

const accountTabs = [
  { value: "profile", label: "Profile" },
  { value: "orders", label: "Orders" },
  { value: "addresses", label: "Addresses" },
  { value: "preferences", label: "Preferences" },
  { value: "privacy", label: "Privacy and account" },
  { value: "security", label: "Security" },
] as const;
type AccountTab = (typeof accountTabs)[number]["value"];
function readAccountTab(): AccountTab {
  const value = new URL(window.location.href).searchParams.get("tab");
  return accountTabs.find((tab) => tab.value === value)?.value ?? "profile";
}

export function AccountHub() {
  const [activeTab, setActiveTab] = useState<AccountTab>("profile");
  const [verticalTabs, setVerticalTabs] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setVerticalTabs(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const sync = () => setActiveTab(readAccountTab());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function selectTab(value: string) {
    const tab = accountTabs.find((item) => item.value === value);
    if (!tab || tab.value === activeTab) return;
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab.value);
    window.history.pushState(null, "", url);
    setActiveTab(tab.value);
  }
  const queryClient = useQueryClient();
  const logout = useStorefrontLogout();

  const profile = useQuery({
    queryKey: ["storefront-account-profile"],
    queryFn: async () => (await api.getProfile({ withParams: false })).data,
    staleTime: 0,
    refetchOnMount: "always",
    retry: false,
  });
  const status = (profile.error as { response?: { status?: number } } | null)
    ?.response?.status;
  const user = profile.data?.data;
  return (
    <main className="mx-auto w-full max-w-6xl px-gutter py-12 sm:py-16">
      <div className="mb-10">
        <p className="mb-3 font-display text-xs font-semibold uppercase tracking-widest text-accent-500">
          Next Pull / Account
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your account<span className="text-accent-500">.</span>
        </h1>
        <p className="mt-4 max-w-xl text-wax-muted">
          Your details, shopping and security, all in one place.
        </p>
      </div>
      {profile.isFetching ? (
        <p role="status" className="border-t border-wax-line py-10">
          Loading your account…
        </p>
      ) : status === 401 || status === 403 ? (
        <div className="border-t border-wax-line py-10">
          <h2 className="font-display text-2xl">Sign in to your account</h2>
          <p className="mt-3 text-wax-muted">
            Your account details are available after you sign in.
          </p>
          <Button asChild className="mt-6">
            <a href={`/login?${authQuery("public", "/account")}`}>
              Sign in <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
        </div>
      ) : profile.isError || !user ? (
        <div role="alert" className="border-t border-wax-line py-10">
          <p>We couldn’t load your account. Please try again.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => void profile.refetch()}
          >
            Try again
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-8 flex min-w-0 items-center gap-4 rounded-xl bg-wax-navy p-5 text-wax-paper sm:mb-10 sm:p-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-white/30 font-display text-xl">
              {user.fullName?.trim().charAt(0).toUpperCase() || (
                <UserRound aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white/70">Signed in as</p>
              <p className="wrap-break-word font-display text-xl font-semibold">
                {user.fullName}
              </p>
              <p className="break-all text-sm text-white/70">
                @{user.username}
              </p>
            </div>
          </div>
          <Tabs.Root
            value={activeTab}
            onValueChange={selectTab}
            activationMode="manual"
            orientation={verticalTabs ? "vertical" : "horizontal"}
            className="grid min-w-0 gap-7 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10"
          >
            <div className="min-w-0 overflow-x-auto pb-1 lg:row-start-1 lg:overflow-visible lg:pb-0">
              <Tabs.List
                aria-label="Account sections"
                className="min-w-max lg:flex lg:w-full lg:min-w-0 lg:flex-col lg:items-stretch lg:gap-1"
              >
                {accountTabs.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className="min-h-11 whitespace-nowrap text-start lg:w-full lg:justify-start lg:whitespace-normal"
                  >
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>
            <Tabs.Content
              className="mt-0 min-w-0 lg:col-start-2 lg:row-start-1"
              value="profile"
            >
              <Section
                number="01"
                title="Profile"
                description="The details connected to your Next Pull account."
                icon={<UserRound className="size-4" aria-hidden="true" />}
              >
                <ProfileForm
                  user={user}
                  onSaved={(updated) =>
                    queryClient.setQueryData(
                      ["storefront-account-profile"],
                      (previous: typeof profile.data) =>
                        previous
                          ? {
                              ...previous,
                              data: { ...previous.data, ...updated },
                            }
                          : previous,
                    )
                  }
                />
              </Section>
            </Tabs.Content>
            <Tabs.Content
              className="mt-0 min-w-0 lg:col-start-2 lg:row-start-1"
              value="orders"
            >
              <Section
                number="02"
                title="Orders"
                description="Keep track of your purchases and their progress."
                icon={<Package className="size-4" aria-hidden="true" />}
              >
                <OrdersSection userId={String(user.id)} />
              </Section>
            </Tabs.Content>
            <Tabs.Content
              className="mt-0 min-w-0 lg:col-start-2 lg:row-start-1"
              value="addresses"
            >
              <Section
                number="03"
                title="Addresses"
                description="Your delivery details for future orders."
                icon={<MapPin className="size-4" aria-hidden="true" />}
              >
                <AddressesSection userId={String(user.id)} />
              </Section>
            </Tabs.Content>
            <Tabs.Content
              className="mt-0 min-w-0 lg:col-start-2 lg:row-start-1"
              value="preferences"
            >
              <Section
                number="04"
                title="Preferences"
                description="Choose your privacy and communication settings."
                icon={<Settings className="size-4" aria-hidden="true" />}
              >
                <PreferencesSection userId={String(user.id)} />
              </Section>
            </Tabs.Content>
            <Tabs.Content
              className="mt-0 min-w-0 lg:col-start-2 lg:row-start-1"
              value="privacy"
            >
              <Section
                number="05"
                title="Privacy and account"
                description="Download your data or manage your account status."
                icon={<ShieldCheck className="size-4" aria-hidden="true" />}
              >
                <PrivacySection userId={String(user.id)} />
                <LegalLinks slugs={["privacy-policy", "account-deletion-policy"]} className="mt-6 flex flex-wrap gap-4 text-sm" />
              </Section>
            </Tabs.Content>
            <Tabs.Content
              className="mt-0 min-w-0 lg:col-start-2 lg:row-start-1"
              value="security"
            >
              <Section
                number="06"
                title="Security"
                description="Manage access to your account."
                icon={<LockKeyhole className="size-4" aria-hidden="true" />}
              >
                <Surface className="rounded-xl p-6">
                  <p className="font-semibold">Password and sign-in</p>
                  <p className="mt-2 text-sm leading-6 text-wax-muted">
                    Need a new password? Use account recovery to reset it.
                  </p>
                  {process.env.NEXT_PUBLIC_APP_URL && (
                    <a
                      className="focus-ring mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-accent-500 underline underline-offset-4"
                      href={new URL(
                        "/forgot-password",
                        process.env.NEXT_PUBLIC_APP_URL,
                      ).toString()}
                    >
                      Recover password{" "}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </a>
                  )}
                  <div className="mt-6 border-t border-wax-line pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      loading={logout.isPending}
                      disabled={logout.isPending}
                      onClick={() => logout.mutate()}
                    >
                      Sign out
                    </Button>
                    {logout.isError && (
                      <p role="alert" className="mt-3 text-sm text-danger-600">
                        We couldn’t sign you out. Please try again.
                      </p>
                    )}
                  </div>
                </Surface>
              </Section>
            </Tabs.Content>
          </Tabs.Root>
        </>
      )}
    </main>
  );
}
