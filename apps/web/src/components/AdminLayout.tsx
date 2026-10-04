import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Languages,
  LayoutDashboard,
  LibraryBig,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Tags,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import { useTheme } from "./ThemeProvider";

type AdminNavigationItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

const navigation: readonly AdminNavigationItem[] = [
  {
    to: "/admin",
    label: "admin.navigation.overview",
    icon: LayoutDashboard,
    end: true,
  },
  { to: "/admin/users", label: "admin.navigation.users", icon: Users },
  {
    to: "/admin/collections",
    label: "admin.navigation.collections",
    icon: LibraryBig,
  },
  { to: "/admin/categories", label: "admin.navigation.categories", icon: Tags },
];

export default function AdminLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const closeMenuButtonRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const user = useStore((state) => state.user);
  const location = useLocation();

  const currentItem =
    [...navigation]
      .reverse()
      .find(({ to, end }) =>
        end ? location.pathname === to : location.pathname.startsWith(to),
      ) ?? navigation[0];

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const previousFocus = document.activeElement as HTMLElement | null;

    const restoreFocus = () => {
      window.requestAnimationFrame(() => {
        (menuTriggerRef.current ?? previousFocus)?.focus();
      });
    };

    const closeForDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMenuOpen(false);
        restoreFocus();
        return;
      }

      if (event.key !== "Tab" || !mobileNavigationRef.current) return;

      const focusable = Array.from(
        mobileNavigationRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", closeForDesktop);
    closeMenuButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", closeForDesktop);
    };
  }, [isMenuOpen]);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    window.requestAnimationFrame(() => menuTriggerRef.current?.focus());
  };

  const isDarkTheme =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const navigationContent = (
    <>
      <div className="border-b border-white/15 px-5 py-5">
        <Link
          to="/admin"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-wax-gold focus-visible:ring-offset-2 focus-visible:ring-offset-wax-navy"
        >
          <span className="grid size-11 shrink-0 -rotate-3 place-items-center bg-accent-500 text-white">
            <ShieldCheck className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <strong className="block font-display text-xl font-extrabold leading-none text-white">
              TCG NEXUS
            </strong>
            <small className="mt-1 block font-mono text-utility font-semibold tracking-[0.16em] text-primary-100">
              {t("admin.shell.control_center")}
            </small>
          </span>
        </Link>
      </div>

      <nav
        className="flex-1 px-3 py-5"
        aria-label={t("admin.shell.navigation_label")}
      >
        <p className="px-3 pb-3 font-mono text-utility font-semibold uppercase tracking-[0.16em] text-primary-100">
          {t("admin.shell.operations")}
        </p>
        <div className="space-y-1">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `group flex min-h-12 items-center gap-3 rounded-sm px-3 text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-wax-gold focus-visible:ring-inset ${
                  isActive
                    ? "bg-wax-paper text-wax-navy"
                    : "text-primary-100 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span>{t(label)}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/15 p-3">
        <Link
          to="/"
          className="flex min-h-11 items-center gap-3 rounded-sm px-3 text-sm font-bold text-primary-100 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-wax-gold focus-visible:ring-inset"
        >
          <ArrowLeft
            className="size-4 shrink-0 rtl:rotate-180"
            aria-hidden="true"
          />
          <span>{t("admin.shell.back_to_workspace")}</span>
        </Link>
        {user && (
          <div className="mt-2 flex items-center gap-3 border-t border-white/10 px-3 pt-4">
            <span className="grid size-9 shrink-0 place-items-center bg-wax-gold font-display text-lg font-extrabold text-wax-navy" aria-hidden="true">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm text-white">
                {user.fullName}
              </strong>
              <small className="block truncate font-mono text-utility uppercase tracking-wider text-primary-100">
                {t("admin.shell.administrator")}
              </small>
            </span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="wax-workspace min-h-dvh lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col overflow-y-auto bg-wax-navy lg:flex">
        {navigationContent}
      </aside>

      <div
        className="min-w-0"
        inert={isMenuOpen ? true : undefined}
        aria-hidden={isMenuOpen || undefined}
      >
        <header className="sticky top-0 z-30 flex min-h-18 items-center justify-between gap-4 border-t-4 border-t-accent-500 border-b border-wax-line bg-card px-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              ref={menuTriggerRef}
              className="grid size-11 shrink-0 place-items-center border border-wax-line bg-background text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
              aria-label={t("admin.shell.open_menu")}
              aria-expanded={isMenuOpen}
              aria-controls="admin-mobile-navigation"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-extrabold text-foreground md:text-2xl">
                {t(currentItem.label)}
              </p>
              <p className="hidden font-mono text-utility font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:block">
                {t("admin.shell.control_center")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                void i18n.changeLanguage(i18n.language === "ar" ? "en" : "ar")
              }
              className="flex min-h-10 items-center gap-2 border border-wax-line bg-background px-3 text-xs font-bold uppercase text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={t("admin.shell.change_language")}
            >
              <Languages className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{i18n.language === "ar" ? "EN" : "AR"}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme(isDarkTheme ? "light" : "dark")}
              className="grid size-10 place-items-center border border-wax-line bg-background text-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={t("admin.shell.toggle_theme")}
            >
              {isDarkTheme ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-360 px-4 py-7 md:px-8 md:py-10">
          <Outlet />
        </main>
      </div>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${isMenuOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"}`}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          onClick={closeMobileMenu}
          className={`absolute inset-0 bg-wax-navy/70 transition-opacity ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          aria-label={t("admin.shell.close_menu")}
          tabIndex={isMenuOpen ? 0 : -1}
        />
        <aside
          ref={mobileNavigationRef}
          id="admin-mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label={t("admin.shell.navigation_label")}
          className={`absolute inset-y-0 left-0 flex w-[min(19rem,88vw)] flex-col overflow-y-auto bg-wax-navy shadow-pop transition-transform rtl:right-0 rtl:left-auto ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={closeMobileMenu}
            ref={closeMenuButtonRef}
            className="absolute top-5 right-4 z-10 grid size-10 place-items-center text-primary-100 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-wax-gold rtl:right-auto rtl:left-4"
            aria-label={t("admin.shell.close_menu")}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          {navigationContent}
        </aside>
      </div>
    </div>
  );
}
