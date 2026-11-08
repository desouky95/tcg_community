"use client";

import { Menu, UserRound, X } from "lucide-react";
import React, {
  Fragment,
  useEffect,
  useState,
  useTransition,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "../../../lib/cn";
import { Button } from "../../primitives/button";
import { IconButton } from "../../primitives/icon-button";
import { Dialog } from "../../radix/dialog";
import type { LinkComponent } from "../../patterns";
import NextLink from "next/link";
import { AnimatedBrandLogo } from "../../primitives";
export type PublicNavItem = { href: string; label: string; flag?: string };
export const publicLinks: readonly PublicNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/checklists", label: "Catalogue" },
  { href: "/collector-disk", label: "Collector Disk", flag: "collectorDisk" },
];
export type PublicHeaderProps = ComponentPropsWithoutRef<"header"> & {
  Link?: LinkComponent;
  currentPath?: string;
  authenticated?: boolean;
  links?: readonly PublicNavItem[];
  applink?: string;
  isNext?: boolean;
  config?: Record<string, boolean>;
  storeNavigation?: boolean;
};

export function PublicHeader({
  currentPath = "",
  authenticated = false,
  links = publicLinks,
  className,
  applink,
  isNext = false,
  config = {},
  storeNavigation = false,
  ...props
}: PublicHeaderProps) {
  const Link = NextLink;
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) =>
    currentPath === path ||
    (path !== "/" && currentPath.startsWith(`${path}/`));
  const actionHref = storeNavigation ? "/shop" : authenticated ? applink || "" : "/signup";
  const actionLabel = storeNavigation ? "Shop now" : authenticated ? "Collector desk" : "Get started";
  return (
    <header
      {...props}
      className={cn(
        "sticky top-0 z-40 mx-auto flex min-h-20   items-center justify-between gap-4 border-b border-wax-line bg-background px-4 text-foreground sm:px-8",
        className,
      )}
    >
      <Link
        href="/"
        className="focus-ring flex shrink-0 items-center"
        aria-label="Next Pull home"
      >
        <div className="w-20">
          <AnimatedBrandLogo />
        </div>
        {/* <img
          src="/brand/next-pull-logo-navy.svg"
          alt="Next Pull"
          className="h-auto w-[5rem]"
        /> */}
      </Link>
      <nav
        className="ms-auto hidden items-center gap-6 lg:flex"
        aria-label="Primary navigation"
      >
        {links.map(({ href, label, flag }) => (
          <Fragment key={href}>
            {(flag === undefined || (!!flag && config[flag])) && (
              <Link
                key={href}
                href={href}
                className="focus-ring py-3 font-display font-semibold hover:text-accent-500 aria-[current=page]:text-accent-500 aria-[current=page]:underline"
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            )}
          </Fragment>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        {!authenticated && !storeNavigation && (
          <Link
            href="/login"
            className="focus-ring hidden px-2 py-3 font-semibold hover:text-accent-500 lg:block"
          >
            Sign in
          </Link>
        )}
        {(!authenticated || storeNavigation) && (
          <Link href="/login" aria-label="Your account" className="focus-ring hidden size-11 items-center justify-center rounded-md bg-wax-navy text-wax-paper sm:inline-flex"><UserRound aria-hidden="true" className="size-5" /></Link>
        )}

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
                  className="focus-ring border-b border-wax-line py-4 font-display text-xl font-semibold aria-[current=page]:text-accent-500"
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {!authenticated && !storeNavigation && (
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
