import { useTranslation } from "react-i18next";
import { useStore } from "../store/useStore";
import { useTheme } from "./ThemeProvider";
import { useUpdateProfile } from "../hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LogOut,
  Globe,
  Sun,
  Moon,
  Settings,
  MapPin,
  ChevronDown,
  User as UserIcon,
  Crown,
  LogIn,
  UserPlus,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { EGYPT_GOVERNORATES } from "../lib/constants";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDrawer({ isOpen, onClose }: UserDrawerProps) {
  const { t, i18n } = useTranslation();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const updateProfile = useUpdateProfile();
  const [showRegionList, setShowRegionList] = useState(false);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    onClose();
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
    } catch {
      toast.error("Failed to update region");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-card border-l border-border shadow-2xl z-50 flex flex-col rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-tight">
                    {user?.fullName || t("nav.welcome_guest")}
                  </h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    {user ? `@${user.username}` : t("nav.guest_account")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Points Section */}
            {user && (
              <div className="px-6 py-4">
                <div className="bg-primary-500/5 border border-primary-500/10 rounded-2xl p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                      <Crown className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-primary-600 dark:text-primary-400">
                      Your Points
                    </span>
                  </div>
                  <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                    {user?.points}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
              {/* Guest Actions */}
              {!user && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <LogIn className="w-3 h-3" />
                    Account
                  </label>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="w-full flex items-center gap-3 p-4 bg-primary-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:bg-primary-600 active:scale-[0.98] shadow-lg shadow-primary-500/20"
                    >
                      <LogIn className="w-4 h-4" />
                      {t("nav.login")}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={onClose}
                      className="w-full flex items-center gap-3 p-4 bg-muted/50 hover:bg-muted rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
                    >
                      <UserPlus className="w-4 h-4 text-primary-500" />
                      {t("nav.signup")}
                    </Link>
                    <Link
                      to="/checklists"
                      onClick={onClose}
                      className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 rounded-2xl font-black uppercase tracking-widest text-xs transition-all text-muted-foreground hover:text-foreground"
                    >
                      <ClipboardList className="w-4 h-4" />
                      {t("nav.checklists")}
                    </Link>
                  </div>
                </div>
              )}
              {/* Language Switch */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Language
                </label>
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-between p-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all group"
                >
                  <span className="text-sm font-bold">
                    {i18n.language === "en" ? "Arabic" : "English"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-card px-2 py-0.5 rounded-lg border border-border font-black text-primary-500">
                      {i18n.language === "en" ? "AR" : "EN"}
                    </span>
                  </div>
                </button>
              </div>

              {/* Theme Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Sun className="w-3 h-3" />
                  Appearance
                </label>
                <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl">
                  {(["light", "dark", "system"] as const).map((tMode) => (
                    <button
                      key={tMode}
                      onClick={() => setTheme(tMode)}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                        theme === tMode
                          ? "bg-card text-primary-500 shadow-md ring-1 ring-border"
                          : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                      }`}
                    >
                      {tMode === "light" && <Sun className="w-4 h-4" />}
                      {tMode === "dark" && <Moon className="w-4 h-4" />}
                      {tMode === "system" && <Settings className="w-4 h-4" />}
                      <span className="text-[9px] font-black uppercase tracking-tighter">
                        {tMode}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Selector */}
              {/* {user && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {t("common.region")}
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowRegionList(!showRegionList)}
                      className={`w-full flex items-center justify-between p-3.5 bg-muted/30 hover:bg-muted/50 rounded-2xl transition-all border ${
                        showRegionList ? "border-primary-500/30 ring-4 ring-primary-500/5" : "border-transparent"
                      }`}
                    >
                      <span className="text-sm font-bold">
                        {user?.governorate
                          ? t(`common.governorates.${user.governorate}`)
                          : "Select Region"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          showRegionList ? "rotate-180" : ""
                        }`}
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
                          <div className="p-2 space-y-1 max-h-48 overflow-y-auto custom-scrollbar bg-muted/20 rounded-2xl border border-border/50">
                            {EGYPT_GOVERNORATES.map((gov) => (
                              <button
                                key={gov}
                                onClick={() => handleRegionChange(gov)}
                                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left rtl:text-right transition-colors ${
                                  user?.governorate === gov
                                    ? "bg-primary-500 text-white font-black shadow-lg shadow-primary-500/20"
                                    : "hover:bg-muted text-xs font-bold text-muted-foreground"
                                }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    user?.governorate === gov ? "bg-white" : "bg-transparent"
                                  }`}
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
                </div>
              )} */}
            </div>

            {/* Footer */}
            {user && (
              <div className="p-6 border-t border-border mt-auto">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all active:scale-[0.98] group"
                >
                  <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Logout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
