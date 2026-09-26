import { Globe, LogIn, LogOut, Moon, Settings, Sun, UserPlus, UserRound, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "../store/useStore";
import { useTheme } from "./ThemeProvider";

export default function UserDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { i18n } = useTranslation();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    queryClient.clear();
    onClose();
    navigate("/");
  };

  return (
    <div className="wax-drawer-layer">
      <button type="button" className="wax-drawer-backdrop" onClick={onClose} aria-label="Close account menu" />
      <aside className="wax-account-drawer" role="dialog" aria-modal="true" aria-labelledby="account-menu-title">
        <header>
          <div className="wax-account-avatar"><UserRound aria-hidden="true" /></div>
          <div><h2 id="account-menu-title">{user?.fullName ?? "Collector access"}</h2><p>{user ? `@${user.username}` : "Guest account"}</p></div>
          <button type="button" onClick={onClose} className="focus-ring" aria-label="Close account menu"><X aria-hidden="true" /></button>
        </header>

        {user ? (
          <>
            <div className="wax-account-points"><span>Collector points</span><strong>{user.points}</strong></div>
            <nav aria-label="Account links">
              <Link to="/profile" onClick={onClose}><UserRound aria-hidden="true" /> Profile</Link>
              <Link to="/profile/edit" onClick={onClose}><Settings aria-hidden="true" /> Account settings</Link>
            </nav>
          </>
        ) : (
          <nav aria-label="Guest actions">
            <Link to="/login" onClick={onClose}><LogIn aria-hidden="true" /> Sign in</Link>
            <Link to="/signup" onClick={onClose}><UserPlus aria-hidden="true" /> Create account</Link>
          </nav>
        )}

        <section className="wax-account-preferences" aria-label="Preferences">
          <button type="button" onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}>
            <Globe aria-hidden="true" /><span>Language</span><strong>{i18n.language === "en" ? "AR" : "EN"}</strong>
          </button>
          <div className="wax-theme-choice" aria-label="Theme">
            <span>Appearance</span>
            <button type="button" onClick={() => setTheme("light")} aria-pressed={theme === "light"} aria-label="Light theme"><Sun aria-hidden="true" /></button>
            <button type="button" onClick={() => setTheme("dark")} aria-pressed={theme === "dark"} aria-label="Dark theme"><Moon aria-hidden="true" /></button>
            <button type="button" onClick={() => setTheme("system")} aria-pressed={theme === "system"}>Auto</button>
          </div>
        </section>

        {user && <button type="button" onClick={handleLogout} className="wax-account-logout"><LogOut aria-hidden="true" /> Sign out</button>}
      </aside>
    </div>
  );
}
