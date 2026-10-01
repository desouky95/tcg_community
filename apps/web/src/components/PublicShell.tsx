import type { ReactNode } from "react";
import Header from "./Header";
import { PublicFooter } from "@tcg/ui-web";
import { useStore } from "../store/useStore";

type PublicShellProps = {
  children: ReactNode;
  mainClassName?: string;
};

export default function PublicShell({ children, mainClassName }: PublicShellProps) {
  const user = useStore(state => state.user);
  return (
    <div className="wax-page">
      <Header variant={user ? "workspace" : "public"} />

      <main className={mainClassName}>{children}</main>

      <PublicFooter />
    </div>
  );
}
