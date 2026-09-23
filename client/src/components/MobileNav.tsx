import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Repeat,
  MessageCircle,
  User,
  Store,
} from "lucide-react";
import { useConversations } from "../hooks/useConversations";
import { useTranslation } from "react-i18next";

export default function MobileNav() {
  const location = useLocation();
  const { t } = useTranslation();
  const { data: conversations } = useConversations();

  const unreadCount =
    conversations?.reduce((acc, conv) => acc + conv.unreadCount, 0) || 0;

  const navLinks = [
    {
      to: "/dashboard",
      label: t("nav.dashboard") || "Home",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard",
    },
    {
      to: "/swapping",
      label: t("nav.swap_search") || "Swap",
      icon: Repeat,
      active: location.pathname === "/swapping",
    },
    {
      to: "/marketplace",
      label: "Market",
      icon: Store,
      active: location.pathname.startsWith("/marketplace"),
    },
    {
      to: "/chat",
      label: t("nav.chats") || "Chats",
      icon: MessageCircle,
      active: location.pathname.startsWith("/chat"),
      badge: unreadCount,
    },
    {
      to: "/profile",
      label: t("nav.profile") || "Profile",
      icon: User,
      active: location.pathname === "/profile",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-t border-border px-4 py-2 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`relative flex flex-col items-center justify-center gap-1 w-full h-full transition-all ${
                link.active
                  ? "text-primary-500 scale-110"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${link.active ? "bg-primary-500/10" : ""}`}>
                <Icon className="w-6 h-6" strokeWidth={link.active ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${link.active ? "opacity-100" : "opacity-60"}`}>
                {link.label}
              </span>

              {link.badge !== undefined && link.badge > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-4 bg-primary-500 text-white text-[9px] font-black px-1.5 h-4 min-w-4 rounded-full flex items-center justify-center border-2 border-card shadow-sm shadow-primary-500/30">
                  {link.badge > 9 ? "9+" : link.badge}
                </span>
              )}
              
              {link.active && (
                <div className="absolute -bottom-2 w-1 h-1 bg-primary-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
