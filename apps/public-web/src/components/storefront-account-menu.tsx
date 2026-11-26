"use client";

import { DropdownMenu } from "@tcg/ui-web/components/radix/dropdown-menu";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useStorefrontLogout } from "../lib/auth/use-storefront-logout";

export function StorefrontAccountMenu({
  username = "Your account",
}: {
  username?: string;
}) {
  const logout = useStorefrontLogout();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={`Account menu for ${username}`}
        className="group focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-wax-navy px-2.5 text-sm font-semibold text-wax-paper sm:px-3"
      >
        <UserRound aria-hidden="true" className="size-5 shrink-0" />
        <span className="hidden max-w-28 truncate sm:block">{username}</span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 group-data-[state=open]:rotate-180 motion-safe:transition-transform"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label className="max-w-64 px-2.5 py-2 text-sm font-semibold [overflow-wrap:anywhere]">
          {username}
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild>
          <Link href="/account">
            <UserRound aria-hidden="true" className="size-4" />
            Your account
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          disabled={logout.isPending}
          onSelect={(event) => {
            event.preventDefault();
            logout.mutate();
          }}
        >
          <LogOut aria-hidden="true" className="size-4" />
          {logout.isPending ? "Signing out…" : "Sign out"}
        </DropdownMenu.Item>
        {logout.isError && (
          <p role="alert" className="max-w-64 px-2.5 py-2 text-sm text-danger-600">
            We couldn’t sign you out. Please try again.
          </p>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
