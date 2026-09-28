"use client";

import type { ComponentProps, ComponentType, ReactNode } from "react";
import { ArrowLeft, Check, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";

export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children: ReactNode;
  "aria-current"?: "page";
  "aria-label"?: string;
  onClick?: () => void;
}>;

const publicLinks = [
  { href: "/checklists", label: "Catalogue" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/swapping", label: "Swaps" },
] as const;

export const NativeLink = ({
  href,
  children,
  ...props
}: ComponentProps<"a">) => (
  <a href={href} {...props}>
    {children}
  </a>
);

type HeaderProps = {
  Link?: LinkComponent;
  currentPath?: string;
  authenticated?: boolean;
};

export function PublicHeader({
  Link = NativeLink,
  currentPath = "",
  authenticated = false,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(`${path}/`);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="wax-header" data-header-variant="public">
      <Link
        href="/"
        className="wax-brand focus-ring"
        aria-label="TCG Nexus home"
      >
        <span className="wax-brand-mark">TN</span>
        <span>
          <strong>TCG NEXUS</strong>
          <small>COLLECT · TRADE · BELONG</small>
        </span>
      </Link>
      <nav
        id="public-navigation"
        className={`wax-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Primary navigation"
      >
        {publicLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="focus-ring"
            aria-current={isActive(href) ? "page" : undefined}
            onClick={closeMenu}
          >
            {label}
          </Link>
        ))}
        {!authenticated ? (
          <>
            <Link
              href="/login"
              className="wax-nav-mobile-action focus-ring"
              onClick={closeMenu}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="wax-button wax-button-small wax-nav-mobile-action focus-ring"
              onClick={closeMenu}
            >
              Join the club
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="wax-button wax-button-small wax-nav-mobile-action focus-ring"
            onClick={closeMenu}
          >
            Collector desk
          </Link>
        )}
      </nav>
      <div className="wax-header-actions">
        {!authenticated ? (
          <>
            <Link href="/login" className="wax-signin focus-ring">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="wax-button wax-button-small focus-ring"
            >
              Join the club
            </Link>
          </>
        ) : (
          <Link
            href="/dashboard"
            className="wax-button wax-button-small focus-ring"
          >
            Collector desk
          </Link>
        )}
        <button
          type="button"
          className="wax-menu-button focus-ring"
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}

export function PublicShell({
  children,
  currentPath,
  Link = NativeLink,
}: {
  children: ReactNode;
  currentPath?: string;
  Link?: LinkComponent;
}) {
  return (
    <div className="wax-page">
      <PublicHeader Link={Link} currentPath={currentPath} />
      <main>{children}</main>
      <footer className="wax-footer">
        <span className="wax-brand-footer">TCG NEXUS</span>
        <span>Cards bring people closer.</span>
        <span>© 2026 · Egypt first, collectors everywhere.</span>
      </footer>
    </div>
  );
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  asideTitle,
  asideDescription,
  asideItems,
  Link = NativeLink,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  asideTitle: string;
  asideDescription: string;
  asideItems: string[];
  Link?: LinkComponent;
}) {
  return (
    <main className="wax-auth-shell">
      <div className="wax-auth-layout">
        <aside className="wax-auth-rail">
          <div className="wax-auth-rail-pattern" aria-hidden="true" />
          <div className="wax-auth-rail-content">
            <Link href="/" className="wax-brand wax-auth-brand focus-ring">
              <span className="wax-brand-mark">T</span>
              <span>
                <strong>TCG Nexus</strong>
                <small>THE COLLECTOR'S CLUB</small>
              </span>
            </Link>
            <div className="wax-auth-rail-copy">
              <h2>
                Your binder,
                <br />
                <em>in motion.</em>
              </h2>
              <p>{asideDescription}</p>
            </div>
          </div>
          <div className="wax-auth-rail-foot">
            <div className="wax-auth-callout">
              <strong>{asideTitle}</strong>
              <span>Egypt-first collecting, trading, and discovery.</span>
            </div>
            <ul>
              {asideItems.map((item) => (
                <li key={item}>
                  <span className="wax-auth-check">
                    <Check aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="wax-auth-location">
              <MapPin aria-hidden="true" /> Cairo / Alexandria / everywhere
            </div>
          </div>
        </aside>
        <section className="wax-auth-main">
          <div className="wax-auth-topbar">
            <button
              type="button"
              onClick={() => window.history.back()}
              aria-label="Go back"
              className="wax-auth-back focus-ring"
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <Link
              href="/"
              className="wax-brand wax-auth-mobile-brand focus-ring"
            >
              <span className="wax-brand-mark">T</span>
              <strong>TCG Nexus</strong>
            </Link>
            <span className="wax-auth-edition">TCG / 2026</span>
          </div>
          <div className="wax-auth-form-wrap">
            <header className="wax-auth-heading">
              <p className="wax-kicker">{eyebrow}</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </header>
            {children}
            <div className="wax-auth-footer">{footer}</div>
          </div>
          <p className="wax-auth-legal">
            Private collection space · Secure session
          </p>
        </section>
      </div>
    </main>
  );
}
