import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Repeat, Store,
  UserRound
} from "lucide-react";
import { Button, PublicHeader, type LinkComponent } from "@tcg/ui-web";
import { useStore } from "../store/useStore";
import GlobalSearch from "./GlobalSearch";
import UserDrawer from "./UserDrawer";

type HeaderProps = {
  variant: "public" | "workspace";
  hideNav?: boolean;
  unreadCount?: number;
};

const RouterLink: LinkComponent = ({ href, ...props }) => <Link to={href} {...props} />;

const workspaceLinks = [
  { to: "/", label: "Desk", icon: LayoutDashboard },
  { to: "/marketplace", label: "Market", icon: Store },
  { to: "/swapping", label: "Swaps", icon: Repeat },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default function Header({
  variant,
  hideNav = false,
  unreadCount = 0,
}: HeaderProps) {
  const user = useStore((state) => state.user);
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const accountTrigger = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  if (variant === "workspace") {
    return (
      <>
        <header className="sticky top-0 z-40 grid min-h-20 grid-cols-[auto_1fr] items-center gap-6 border-t-4 border-b border-t-accent-500 border-b-wax-line bg-card px-4 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:px-10" data-header-variant="workspace">
          <Link
            to={"/"}
            className="flex shrink-0 items-center gap-2.5 [&_strong]:block [&_strong]:font-display [&_strong]:text-xl [&_strong]:font-extrabold [&_small]:block [&_small]:font-mono [&_small]:text-utility [&_small]:hidden [&_small]:text-wax-muted md:[&_small]:block focus-ring"
            aria-label="TCG Nexus collector desk"
          >
            <span className="grid size-10 shrink-0 -rotate-3 place-items-center bg-accent-500 font-display font-extrabold text-white">TN</span>
            <span>
              <strong>TCG NEXUS</strong>
              <small>COLLECTOR DESK</small>
            </span>
          </Link>

          {user && !hideNav && (
            <nav className="hidden h-20 items-stretch justify-self-center xl:flex [&>a]:relative [&>a]:flex [&>a]:items-center [&>a]:gap-2 [&>a]:border-b-2 [&>a]:border-transparent [&>a]:px-3 [&>a]:text-sm [&>a]:font-bold [&>a]:text-wax-muted [&>a:hover]:text-wax-ink [&>a[aria-current=page]]:border-accent-500 [&>a[aria-current=page]]:text-wax-ink [&_svg]:size-4 [&_b]:inline-flex [&_b]:min-w-5 [&_b]:items-center [&_b]:justify-center [&_b]:rounded-full [&_b]:bg-accent-500 [&_b]:text-utility [&_b]:text-white" aria-label="Collector workspace">
              {workspaceLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="focus-ring"
                  aria-current={isActive(to) ? "page" : undefined}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                  {to === "/chat" && unreadCount > 0 && (
                    <b>{unreadCount > 9 ? "9+" : unreadCount}</b>
                  )}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center justify-self-end gap-3">
            {user && !hideNav && (
              <div className="hidden w-64 md:block">
                <GlobalSearch />
              </div>
            )}
            {/* {user?.role !== "super_admin" && !hideNav && (
              <Link to="/admin" className="hidden items-center gap-2 text-xs font-bold uppercase text-wax-red md:inline-flex [&_svg]:size-4 focus-ring">
                <ShieldCheck aria-hidden="true" /> Admin
              </Link>
            )} */}
            <Button variant="outline" size="sm"
              ref={accountTrigger}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="[&_span]:hidden [&_span]:font-mono [&_span]:text-utility md:[&_span]:block [&_svg]:size-8 [&_svg]:bg-wax-navy [&_svg]:p-2 [&_svg]:text-wax-paper focus-ring"
              aria-label="Open account menu"
            >
              <span>{user ? `${user.points} pts` : "Guest"}</span>
              <UserRound aria-hidden="true" />
            </Button>
          </div>
        </header>
        <UserDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} triggerRef={accountTrigger} />
      </>
    );
  }

  return <PublicHeader Link={RouterLink} currentPath={location.pathname} authenticated={Boolean(user)} />;
}
