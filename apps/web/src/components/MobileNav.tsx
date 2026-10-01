import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageCircle, Repeat, Store, UserRound } from "lucide-react";
import { useConversations } from "../hooks/useConversations";

const links = [
  { to: "/", label: "Desk", icon: LayoutDashboard },
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
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-wax-line bg-card pb-[env(safe-area-inset-bottom)] xl:hidden [&_a]:relative [&_a]:flex [&_a]:min-h-16 [&_a]:flex-col [&_a]:items-center [&_a]:justify-center [&_a]:gap-1 [&_a]:text-utility [&_a]:text-wax-muted [&_a[aria-current=page]]:text-wax-red [&_svg]:size-5 [&_b]:absolute [&_b]:end-[20%] [&_b]:top-2 [&_b]:min-w-5 [&_b]:rounded-full [&_b]:bg-accent-500 [&_b]:text-center [&_b]:text-white" aria-label="Mobile collector workspace">
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
