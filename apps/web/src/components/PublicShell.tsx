import type { ReactNode } from "react";
import Header from "./Header";

type PublicShellProps = {
  children: ReactNode;
  mainClassName?: string;
};

export default function PublicShell({ children, mainClassName }: PublicShellProps) {
  return (
    <div className="wax-page">
      <Header variant="public" />

      <main className={mainClassName}>{children}</main>

      <footer className="wax-footer">
        <span className="wax-brand-footer">TCG NEXUS</span>
        <span>Cards bring people closer.</span>
        <span>© 2026 · Egypt first, collectors everywhere.</span>
      </footer>
    </div>
  );
}
