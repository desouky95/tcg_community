import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  MessageCircle,
  Repeat,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useStore } from "../store/useStore";
import GlobalSearch from "./GlobalSearch";
import UserDrawer from "./UserDrawer";

type HeaderProps = {
  variant: "public" | "workspace";
  hideNav?: boolean;
  unreadCount?: number;
};

const publicLinks = [
  { to: "/checklists", label: "Catalogue" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/swapping", label: "Swaps" },
];

const workspaceLinks = [
  { to: "/dashboard", label: "Desk", icon: LayoutDashboard },
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/swapping", label: "Swaps", icon: Repeat },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Header({
  variant,
  hideNav = false,
  unreadCount = 0,
}: HeaderProps) {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const closeMenu = () => setMenuOpen(false);

  if (variant === "workspace") {
    return (
      <>
        <header className="wax-workspace-header" data-header-variant="workspace">
          <Link
            to={user ? "/dashboard" : "/"}
            className="wax-brand wax-workspace-brand focus-ring"
            aria-label="TCG Nexus collector desk"
          >
            <span className="wax-brand-mark">TN</span>
            <span>
              <strong>TCG NEXUS</strong>
              <small>COLLECTOR DESK</small>
            </span>
          </Link>

          {user && !hideNav && (
            <nav className="wax-workspace-nav" aria-label="Collector workspace">
              {workspaceLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="focus-ring"
                  aria-current={isActive(to) ? "page" : undefined}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                  {to === "/chat" && unreadCount > 0 && (
                    <b>{unreadCount > 9 ? "9+" : unreadCount}</b>
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div className="wax-workspace-tools">
            {user && !hideNav && (
              <div className="wax-workspace-search">
                <GlobalSearch />
              </div>
            )}
            {user?.role === "super_admin" && !hideNav && (
              <Link to="/admin" className="wax-workspace-admin focus-ring">
                <ShieldCheck aria-hidden="true" /> Admin
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="wax-workspace-account focus-ring"
              aria-label="Open account menu"
            >
              <span>{user ? `${user.points} pts` : "Guest"}</span>
              <UserRound aria-hidden="true" />
            </button>
          </div>
        </header>
        <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </>
    );
  }

  return (
    <>
      <header className="wax-header" data-header-variant="public">
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
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <>
              <Link to="/login" className="wax-nav-mobile-action focus-ring" onClick={closeMenu}>
                Sign in
              </Link>
              <Link to="/signup" className="wax-button wax-button-small wax-nav-mobile-action focus-ring" onClick={closeMenu}>
                Join the club
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="wax-button wax-button-small wax-nav-mobile-action focus-ring" onClick={closeMenu}>
              Collector desk
            </Link>
          )}
        </nav>

        <div className="wax-header-actions">
          {user ? (
            <Link to="/dashboard" className="wax-button wax-button-small focus-ring">
              Collector desk
            </Link>
          ) : (
            <>
              <Link to="/login" className="wax-signin focus-ring">
                Sign in
              </Link>
              <Link to="/signup" className="wax-button wax-button-small focus-ring">
                Join the club
              </Link>
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
    </>
  );
}
