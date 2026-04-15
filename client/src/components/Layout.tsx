import {
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Moon,
  Sun,
  Settings,
  Globe,
  ChevronDown,
  Repeat,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import GlobalSearch from "./GlobalSearch";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "@reactuses/core";
import { EGYPT_GOVERNORATES } from "../lib/constants";
import { useUpdateProfile } from "../hooks/useUsers";
import { useConversations } from "../hooks/useConversations";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showRegionList, setShowRegionList] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const updateProfile = useUpdateProfile();

  // Polling total unread messages count
  const { data: conversations } = useConversations();
  const unreadCount =
    conversations?.reduce((acc, conv) => acc + conv.unreadCount, 0) || 0;
  const queryClient = useQueryClient();
  useClickAway(menuRef, () => {
    setIsSettingsOpen(false);
  });
  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate("/");
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const handleRegionChange = async (governorate: string) => {
    try {
      await updateProfile.mutateAsync({ governorate });
      toast.success(t("collection_edit.success"));
      setIsSettingsOpen(false);
    } catch {
      toast.error("Failed to update region");
    }
  };

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
                className="flex items-center space-x-2 font-black text-2xl text-primary-600 dark:text-primary-400 shrink-0"
              >
                <span className="tracking-tighter uppercase">TCG NEXUS</span>
              </Link>

              {user && !hideNav && (
                <div className="hidden lg:block flex-1 max-w-md">
                  <GlobalSearch />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {!user && (
                <div className="flex items-center gap-4">
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
              )}

              {user && !hideNav && (
                <div className="hidden md:flex gap-4 items-center">
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
                    <span>Chats</span>
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

              <div className="relative">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-black text-xs uppercase ${
                    isSettingsOpen
                      ? "bg-primary-500/10 text-primary-500 shadow-inner"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>{t("nav.settings")}</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${
                      isSettingsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isSettingsOpen && (
                    <>
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute top-full mt-2 right-0 rtl:left-0 rtl:right-auto w-48 bg-card border border-border rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                      >
                        <div className="space-y-1">
                          <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-3 pt-2">
                            Language
                          </label>
                          <button
                            onClick={() => {
                              toggleLanguage();
                              setIsSettingsOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted rounded-xl transition-colors text-left rtl:text-right"
                          >
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 opacity-70" />
                              <span className="text-sm font-bold">
                                {i18n.language === "en" ? "Arabic" : "English"}
                              </span>
                            </div>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-black">
                              {i18n.language === "en" ? "AR" : "EN"}
                            </span>
                          </button>

                          <div className="h-px bg-border my-2 mx-2" />

                          <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-3 pt-1">
                            Appearance
                          </label>
                          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
                            {(["light", "dark", "system"] as const).map(
                              (tMode) => (
                                <button
                                  key={tMode}
                                  onClick={() => setTheme(tMode)}
                                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg transition-all ${
                                    theme === tMode
                                      ? "bg-card text-primary-500 shadow-sm ring-1 ring-border"
                                      : "text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  {tMode === "light" && (
                                    <Sun className="w-4 h-4" />
                                  )}
                                  {tMode === "dark" && (
                                    <Moon className="w-4 h-4" />
                                  )}
                                  {tMode === "system" && (
                                    <Settings className="w-4 h-4" />
                                  )}
                                  <span className="text-[8px] font-black uppercase tracking-tighter">
                                    {tMode}
                                  </span>
                                </button>
                              ),
                            )}
                          </div>

                          {user && (
                            <>
                              <div className="h-px bg-border my-2 mx-2" />
                              <label className="block text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2 px-3 pt-1">
                                {t("common.region")}
                              </label>
                              <div className="px-2">
                                <button
                                  onClick={() =>
                                    setShowRegionList(!showRegionList)
                                  }
                                  className={`w-full flex items-center justify-between px-3 py-2.5 bg-muted/50 hover:bg-muted rounded-xl transition-all border ${showRegionList ? "border-primary-500/30" : "border-transparent"}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary-500" />
                                    <span className="text-sm font-bold truncate max-w-[100px]">
                                      {user.governorate
                                        ? t(
                                            `common.governorates.${user.governorate}`,
                                          )
                                        : "Select Region"}
                                    </span>
                                  </div>
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-300 ${showRegionList ? "rotate-180" : ""}`}
                                  />
                                </button>

                                <AnimatePresence>
                                  {showRegionList && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="mt-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar p-1 bg-muted/20 rounded-xl border border-border/50">
                                        {EGYPT_GOVERNORATES.map((gov) => (
                                          <button
                                            key={gov}
                                            onClick={() =>
                                              handleRegionChange(gov)
                                            }
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left rtl:text-right transition-colors ${
                                              user.governorate === gov
                                                ? "bg-primary-500/10 text-primary-500 font-black"
                                                : "hover:bg-muted text-xs font-bold text-muted-foreground"
                                            }`}
                                          >
                                            <div
                                              className={`w-1.5 h-1.5 rounded-full ${user.governorate === gov ? "bg-primary-500" : "bg-transparent"}`}
                                            />
                                            <span className="truncate">
                                              {t(`common.governorates.${gov}`)}
                                            </span>
                                          </button>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                      <div
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setIsSettingsOpen(false)}
                      />
                    </>
                  )}
                </AnimatePresence>
              </div>

              {user && !hideNav && (
                <div className="flex items-center border-l rtl:border-r rtl:border-l-0 pl-4 border-border">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      {user.points} pts
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-danger-500 hover:bg-danger-500/10 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
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

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-0 animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        {children}
      </main>
    </div>
  );
}
