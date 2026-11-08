import type { ComponentPropsWithoutRef } from "react";
import { cn } from "../../../lib/cn";
import { PublicHeader, type PublicHeaderProps } from "../public-header";
import { PublicFooter } from "../../patterns";

export type PublicShellProps = ComponentPropsWithoutRef<"div"> &
  Pick<
    PublicHeaderProps,
    | "currentPath"
    | "Link"
    | "links"
    | "authenticated"
    | "applink"
    | "isNext"
    | "config"
    | "storeNavigation"
  > & { mainClassName?: string };

export function PublicShell({
  children,
  currentPath,
  Link,
  links,
  authenticated,
  className,
  mainClassName,
  isNext = true,
  config = {},
  storeNavigation = false,
  ...props
}: PublicShellProps) {
  return (
    <div
      {...props}
      className={cn(
        "wax-page min-h-dvh bg-background font-brand text-foreground",
        className,
      )}
    >
      <PublicHeader
        Link={Link}
        currentPath={currentPath}
        links={links}
        authenticated={authenticated}
        applink={props.applink}
        isNext
        config={config}
        storeNavigation={storeNavigation}
      />
      <main className={mainClassName}>{children}</main>
      <PublicFooter />
    </div>
  );
}
