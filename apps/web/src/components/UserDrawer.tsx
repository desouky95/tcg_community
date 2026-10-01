import { Globe, LogIn, LogOut, Moon, Settings, ShieldCheck, Sun, UserPlus, UserRound, X } from "lucide-react";
import type { RefObject } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Dialog, IconButton, ToggleGroup } from "@tcg/ui-web";
import { useStore } from "../store/useStore";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@tcg/react-query";

export default function UserDrawer({ isOpen, onClose, triggerRef }: {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  const { i18n } = useTranslation();
  const user = useStore(state => state.user);
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const handleLogout = () => { void logout.mutateAsync(); onClose(); };

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <Dialog.Content placement="end" className="gap-5 p-6" onCloseAutoFocus={event => {
        if (triggerRef?.current) { event.preventDefault(); triggerRef.current.focus(); }
      }}>
        <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-wax-line pb-5">
          <div className="grid size-control-sm place-items-center bg-wax-navy text-wax-paper"><UserRound aria-hidden="true" className="size-5" /></div>
          <div className="min-w-0">
            <Dialog.Title className="text-xl">{user?.fullName ?? "Collector access"}</Dialog.Title>
            <Dialog.Description className="mt-1 break-words text-sm">{user ? `@${user.username}` : "Guest account"}</Dialog.Description>
          </div>
          <Dialog.Close asChild><IconButton variant="outline" aria-label="Close account menu"><X aria-hidden="true" className="size-5" /></IconButton></Dialog.Close>
        </header>
        {user && <div className="flex items-center justify-between gap-4 bg-wax-navy p-4 text-wax-paper"><span className="text-sm font-bold uppercase">Collector points</span><strong className="font-display text-2xl text-wax-gold">{user.points}</strong></div>}
        <nav aria-label={user ? "Account links" : "Guest actions"} className="grid border-t border-wax-line [&_a]:flex [&_a]:min-h-control [&_a]:items-center [&_a]:gap-3 [&_a]:border-b [&_a]:border-wax-line [&_a:hover]:text-wax-red [&_svg]:size-4">
          {user ? <>
            <Link to="/profile" onClick={onClose}><UserRound aria-hidden="true" /> Profile</Link>
            <Link to="/profile/edit" onClick={onClose}><Settings aria-hidden="true" /> Account settings</Link>
            {user.role !== "super_admin" && <Link to="/admin" onClick={onClose}><ShieldCheck aria-hidden="true" /> Admin</Link>}
          </> : <>
            <Link to="/login" onClick={onClose}><LogIn aria-hidden="true" /> Sign in</Link>
            <Link to="/signup" onClick={onClose}><UserPlus aria-hidden="true" /> Create account</Link>
          </>}
        </nav>
        <section className="mt-auto grid gap-3 border-t border-wax-line pt-5" aria-label="Preferences">
          <Button variant="outline" className="justify-between" onClick={() => void i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}><Globe aria-hidden="true" className="size-4" /><span>Language</span><strong>{i18n.language === "en" ? "AR" : "EN"}</strong></Button>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm">Appearance</span>
            <ToggleGroup.Root type="single" value={theme} onValueChange={value => { if (value === "light" || value === "dark" || value === "system") setTheme(value); }} aria-label="Theme">
              <ToggleGroup.Item value="light" aria-label="Light theme"><Sun aria-hidden="true" className="size-4" /></ToggleGroup.Item>
              <ToggleGroup.Item value="dark" aria-label="Dark theme"><Moon aria-hidden="true" className="size-4" /></ToggleGroup.Item>
              <ToggleGroup.Item value="system">Auto</ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </section>
        {user && <Button variant="outline" onClick={handleLogout}><LogOut aria-hidden="true" className="size-4" /> Sign out</Button>}
      </Dialog.Content>
    </Dialog.Root>
  );
}
