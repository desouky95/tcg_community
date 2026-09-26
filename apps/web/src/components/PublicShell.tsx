import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../store/useStore";

type PublicShellProps = {
  children: ReactNode;
  mainClassName?: string;
};

const publicLinks = [
  { to: "/checklists", label: "Catalogue" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/swapping", label: "Swaps" },
];

export default function PublicShell({ children, mainClassName }: PublicShellProps) {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="wax-page">
      <header className="wax-header">
        <Link to="/" className="wax-brand focus-ring" aria-label="TCG Nexus home">
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
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="focus-ring"
              aria-current={isActive(link.to) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <>
              <Link to="/login" className="wax-nav-mobile-action focus-ring" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" className="wax-button wax-button-small wax-nav-mobile-action focus-ring" onClick={() => setMenuOpen(false)}>Join the club</Link>
            </>
          )}
          {user && (
            <Link to="/dashboard" className="wax-button wax-button-small wax-nav-mobile-action focus-ring" onClick={() => setMenuOpen(false)}>Collector desk</Link>
          )}
        </nav>

        <div className="wax-header-actions">
          {user ? (
            <Link to="/dashboard" className="wax-button wax-button-small focus-ring">Collector desk</Link>
          ) : (
            <>
              <Link to="/login" className="wax-signin focus-ring">Sign in</Link>
              <Link to="/signup" className="wax-button wax-button-small focus-ring">Join the club</Link>
            </>
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

      <main className={mainClassName}>{children}</main>

      <footer className="wax-footer">
        <span className="wax-brand-footer">TCG NEXUS</span>
        <span>Cards bring people closer.</span>
        <span>© 2026 · Egypt first, collectors everywhere.</span>
      </footer>
    </div>
  );
}
