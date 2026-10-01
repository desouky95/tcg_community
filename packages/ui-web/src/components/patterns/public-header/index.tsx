"use client";

import { Menu, X } from "lucide-react";
import { useState, useTransition, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import { Button } from "../../primitives/button";
import { IconButton } from "../../primitives/icon-button";
import { Dialog } from "../../radix/dialog";
import { NativeLink } from "../native-link";
import type { LinkComponent } from "../types";

export type PublicNavItem = { href: string; label: string };
export const publicLinks: readonly PublicNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/checklists", label: "Catalogue" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/swapping", label: "Swaps" },
];
export type PublicHeaderProps = ComponentPropsWithoutRef<"header"> & {
  Link?: LinkComponent;
  currentPath?: string;
  authenticated?: boolean;
  links?: readonly PublicNavItem[];
};

export function PublicHeader({
  Link = NativeLink,
  currentPath = "",
  authenticated = false,
  links = publicLinks,
  className,
  ...props
}: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) =>
    currentPath === path ||
    (path !== "/" && currentPath.startsWith(`${path}/`));
  const actionHref = authenticated ? "/dashboard" : "/signup";
  const actionLabel = authenticated ? "Collector desk" : "Join the club";
  return (
    <header
      {...props}
      className={cn(
        "sticky top-0 z-40 mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 border-b-2 border-wax-ink bg-background px-4 text-foreground sm:px-8",
        className,
      )}
    >
      <Link
        href="/"
        className="focus-ring flex shrink-0 items-center gap-2.5"
        aria-label="TCG Nexus home"
      >
        <span className="grid size-10 -rotate-3 place-items-center bg-accent-500 font-display font-extrabold text-white">
          TN
        </span>
        <span>
          <strong className="block font-display text-xl font-extrabold">
            TCG NEXUS
          </strong>
          <small className="hidden font-mono text-utility sm:block">
            COLLECT · TRADE · BELONG
          </small>
        </span>
      </Link>
      <nav
        className="ms-auto hidden items-center gap-6 lg:flex"
        aria-label="Primary navigation"
      >
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="focus-ring py-3 font-display font-bold hover:text-wax-red aria-[current=page]:text-wax-red aria-[current=page]:underline"
            aria-current={isActive(href) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {!authenticated && (
          <Link
            href="/login"
            className="focus-ring hidden px-2 py-3 font-bold hover:text-wax-red lg:block"
          >
            Sign in
          </Link>
        )}
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger asChild>
            <IconButton
              variant="outline"
              aria-label="Open menu"
              className="lg:hidden"
            >
              <Menu aria-hidden="true" className="size-5" />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Content
            placement="end"
            className="p-5"
            aria-describedby={undefined}
          >
            <Dialog.Title className="font-display text-2xl">
              Navigation
            </Dialog.Title>
            <Dialog.Close asChild>
              <IconButton
                variant="ghost"
                aria-label="Close menu"
                className="absolute end-3 top-3"
              >
                <X aria-hidden="true" className="size-5" />
              </IconButton>
            </Dialog.Close>
            <nav className="mt-8 grid gap-2" aria-label="Mobile navigation">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="focus-ring border-b border-wax-line py-4 font-display text-xl aria-[current=page]:text-wax-red"
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {!authenticated && (
                <Link
                  href="/login"
                  className="focus-ring py-4 font-bold"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
              <Button asChild>
                <Link href={actionHref} onClick={() => setMenuOpen(false)}>
                  {actionLabel}
                </Link>
              </Button>
            </nav>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </header>
  );
}
