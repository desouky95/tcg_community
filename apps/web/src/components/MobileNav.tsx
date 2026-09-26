import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageCircle, Repeat, Store, UserRound } from "lucide-react";
import { useConversations } from "../hooks/useConversations";

const links = [
  { to: "/dashboard", label: "Desk", icon: LayoutDashboard },
  { to: "/swapping", label: "Swaps", icon: Repeat },
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function MobileNav() {
  const location = useLocation();
  const { data: conversations } = useConversations();
  const unreadCount = conversations?.reduce((total, conversation) => total + conversation.unreadCount, 0) ?? 0;

  return (
    <nav className="wax-workspace-mobile-nav" aria-label="Mobile collector workspace">
      {links.map(({ to, label, icon: Icon }) => {
        const active = location.pathname === to || location.pathname.startsWith(`${to}/`);
        return (
          <Link key={to} to={to} aria-current={active ? "page" : undefined} className="focus-ring">
            <Icon aria-hidden="true" />
            <span>{label}</span>
            {to === "/chat" && unreadCount > 0 && <b>{unreadCount > 9 ? "9+" : unreadCount}</b>}
          </Link>
        );
      })}
    </nav>
  );
}
