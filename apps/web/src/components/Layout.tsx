import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageCircle, Repeat, ShieldCheck, Store, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStore } from "../store/useStore";
import { useConversations } from "../hooks/useConversations";
import GlobalSearch from "./GlobalSearch";
import MobileNav from "./MobileNav";
import UserDrawer from "./UserDrawer";

const workspaceLinks = [
  { to: "/dashboard", label: "Desk", icon: LayoutDashboard },
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/swapping", label: "Swaps", icon: Repeat },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Layout({ children, hideNav = false }: { children: React.ReactNode; transparent?: boolean; hideNav?: boolean }) {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const { i18n } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: conversations } = useConversations();
  const unreadCount = conversations?.reduce((total, conversation) => total + conversation.unreadCount, 0) ?? 0;

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <div className="wax-workspace">
      <header className="wax-workspace-header">
        <Link to={user ? "/dashboard" : "/"} className="wax-brand wax-workspace-brand focus-ring" aria-label="TCG Nexus collector desk">
          <span className="wax-brand-mark">TN</span>
          <span><strong>TCG NEXUS</strong><small>COLLECTOR DESK</small></span>
        </Link>

        {user && !hideNav && (
          <nav className="wax-workspace-nav" aria-label="Collector workspace">
            {workspaceLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="focus-ring" aria-current={isActive(to) ? "page" : undefined}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
                {to === "/chat" && unreadCount > 0 && <b>{unreadCount > 9 ? "9+" : unreadCount}</b>}
              </Link>
            ))}
          </nav>
        )}

        <div className="wax-workspace-tools">
          {user && !hideNav && <div className="wax-workspace-search"><GlobalSearch /></div>}
          {user?.role === "super_admin" && !hideNav && (
            <Link to="/admin" className="wax-workspace-admin focus-ring"><ShieldCheck aria-hidden="true" /> Admin</Link>
          )}
          <button type="button" onClick={() => setIsDrawerOpen(true)} className="wax-workspace-account focus-ring" aria-label="Open account menu">
            <span>{user ? `${user.points} pts` : "Guest"}</span>
            <UserRound aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="wax-workspace-main">{children}</main>
      {user && !hideNav && <MobileNav />}
      <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
