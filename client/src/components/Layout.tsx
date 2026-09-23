import {
  ShieldCheck,
  User as UserIcon,
  Repeat,
  MessageCircle,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { Link, useLocation } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useConversations } from "../hooks/useConversations";
import MobileNav from "./MobileNav";
import UserDrawer from "./UserDrawer";

export default function Layout({
  children,
  transparent,
  hideNav,
}: {
  children: React.ReactNode;
  transparent?: boolean;
  hideNav?: boolean;
}) {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: conversations } = useConversations();
  const unreadCount =
    conversations?.reduce((acc, conv) => acc + conv.unreadCount, 0) || 0;

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary-500/30">
      <nav
        className={`w-full z-50 transition-all duration-300 ${transparent ? "bg-transparent border-transparent absolute top-0" : "bg-card/80 border-b backdrop-blur-md sticky top-0"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            <div className="flex items-center space-x-8 flex-1">
              <Link
                to={user ? "/dashboard" : "/"}
                className="flex items-center gap-2 font-display font-bold text-xl text-foreground shrink-0 focus-ring"
              >
                <img src="/logo_tcg-nexus_primary_20260923.svg" alt="" aria-hidden="true" className="h-8 w-8" />
                <span className="tracking-tight uppercase">TCG Nexus</span>
              </Link>

              {user && !hideNav && (
                <div className="hidden lg:block flex-1 max-w-md">
                  <GlobalSearch />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {!user && (
                <>
                  <div className="hidden lg:flex items-center gap-4">
                    <Link
                      to={"/checklists"}
                      className="text-sm font-bold hover:text-primary-500 transition-colors"
                    >
                      {t("nav.checklists")}
                    </Link>
                    <Link
                      to="/login"
                      className="text-sm font-bold hover:text-primary-500 transition-colors"
                    >
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/signup"
                      className="text-sm font-bold bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                    >
                      {t("nav.signup")}
                    </Link>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex lg:hidden w-10 h-10 rounded-xl bg-muted/50 items-center justify-center text-muted-foreground hover:bg-primary-500 hover:text-white transition-all"
                  >
                    <UserIcon className="w-5 h-5" />
                  </button>
                </>
              )}

              {user && !hideNav && (
                <div className="hidden lg:flex gap-4 items-center">
                  <Link
                    to="/marketplace"
                    className={`text-sm font-bold transition-colors ${location.pathname.startsWith("/marketplace") ? "text-primary-500" : "hover:text-primary-500"}`}
                  >
                    Market
                  </Link>
                  <Link
                    to="/swapping"
                    className={`text-sm font-bold flex items-center gap-2 rtl:space-x-reverse transition-colors ${
                      location.pathname === "/swapping"
                        ? "text-primary-500"
                        : "hover:text-primary-500"
                    }`}
                  >
                    <Repeat className="w-4 h-4 opacity-70" />
                    <span>{t("nav.swap_search")}</span>
                  </Link>

                  <Link
                    to="/chat"
                    className={`relative text-sm font-bold flex items-center gap-2 rtl:space-x-reverse transition-colors ${
                      location.pathname.startsWith("/chat")
                        ? "text-primary-500"
                        : "hover:text-primary-500"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 opacity-70" />
                    <span>{t("nav.chats")}</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-3.5 rtl:-left-3.5 rtl:right-auto bg-primary-500 text-white text-[9px] font-black px-1.5 h-4 min-w-4 rounded-full flex items-center justify-center border-2 border-card shadow-sm shadow-primary-500/30">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to={`/profile`}
                    className={`text-sm font-bold flex items-center gap-2 rtl:space-x-reverse transition-colors ${
                      location.pathname === "/profile"
                        ? "text-primary-500"
                        : "hover:text-primary-500"
                    }`}
                  >
                    <UserIcon className="w-4 h-4 opacity-70" />
                    <span>{t("nav.profile")}</span>
                  </Link>

                  {user?.role === "super_admin" && (
                    <Link
                      to="/admin"
                      className="text-sm font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full hover:bg-emerald-500/20 flex items-center space-x-2 rtl:space-x-reverse transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t("nav.admin")}</span>
                    </Link>
                  )}
                </div>
              )}

              {user && !hideNav && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-3 pl-4 border-l rtl:border-r rtl:border-l-0 border-border group"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {user.points} pts
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <UserIcon className="w-5 h-5" />
                  </div>
                </button>
              )}

              {user && hideNav && (
                <div className="flex items-center gap-4">
                  <Link
                    to={user ? "/dashboard" : "/checklists"}
                    className="text-sm font-bold hover:text-primary-500 transition-colors"
                  >
                    {t("nav.checklists")}
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-sm font-bold bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-500 shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                  >
                    {t("landing.hero.cta_enter")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8 relative z-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        {children}
      </main>

      {user && !hideNav && <MobileNav />}
      <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
