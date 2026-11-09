"use client";

import { ArrowLeft, Check, MapPin } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { IconButton } from "../../primitives/icon-button";
import { NativeLink } from "../native-link";
import type { LinkComponent } from "../types";

export type AuthShellProps = Omit<ComponentPropsWithoutRef<"main">, "title"> & {
  eyebrow: string;
  title: ReactNode;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  asideTitle: string;
  asideDescription: string;
  asideItems: string[];
  Link?: LinkComponent;
  onBack?: () => void;
  backIcon?: ReactNode;
  quiet?: boolean;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  asideTitle,
  asideDescription,
  asideItems,
  Link = NativeLink,
  onBack,
  backIcon,
  quiet = false,
  className,
  ...props
}: AuthShellProps) {
  return (
    <main
      {...props}
      className={cn("min-h-dvh bg-background text-foreground", className)}
    >
      <div className="mx-auto grid min-h-dvh lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]">
            <aside className="relative hidden min-h-full flex-col justify-between gap-10 bg-wax-navy p-8 text-wax-paper lg:flex xl:p-16">
                      <div
                        className="pointer-events-none absolute inset-4 border border-wax-paper/10"
                        aria-hidden="true"
                      />
                      <div className="relative">
                        <Link href="/" className="focus-ring inline-flex">
                          <img src="/brand/next-pull-logo-white.svg" alt="Next Pull" className="h-auto w-40" />
                        </Link>
                        <div className="mt-10 max-w-sm xl:mt-10">
                          <h2 className="my-6 font-display text-display font-bold leading-[1.05] xl:text-7xl">
                            Find your
                            <br />
                            <em className="text-wax-gold not-italic">next pull.</em>
                          </h2>
                          <p className="max-w-72 leading-relaxed text-wax-paper/85">
                            {asideDescription}
                          </p>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="grid gap-1.5 bg-wax-gold/10 px-4 py-3.5">
                          <strong className="font-display text-lg uppercase">
                            {asideTitle}
                          </strong>
                          <span className="text-sm text-wax-paper/85">
                            Egypt-first collecting, trading, and discovery.
                          </span>
                        </div>
                        <ul className="my-7 grid list-none gap-3">
                          {asideItems.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-3 text-sm text-wax-paper/85"
                            >
                              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-wax-gold/20 text-wax-ink">
                                <Check className="size-3" aria-hidden="true" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center gap-2 border-t border-wax-paper/25 pt-4 font-mono text-utility uppercase text-wax-paper/80">
                          <MapPin
                            className="size-4 shrink-0 text-wax-gold"
                            aria-hidden="true"
                          />{" "}
                          Cairo / Alexandria / everywhere
                        </div>
                      </div>
                </aside>
            <section className={cn("flex min-h-dvh min-w-0 flex-col", quiet ? "px-[clamp(1.25rem,4vw,4rem)] py-4" : "p-4 sm:p-8 xl:px-20")}>
              <div className="flex items-center justify-between gap-3">
                <IconButton
                  variant="outline"
                  type="button"
                  onClick={() => { if (onBack) onBack(); else window.history.back(); }}
                  aria-label="Go back"
                >
                  {backIcon ?? (
                    <ArrowLeft
                      className="size-4 rtl:rotate-180"
                      aria-hidden="true"
                    />
                  )}
                </IconButton>
                <Link href="/" className="focus-ring inline-flex lg:hidden">
                  <img src="/brand/next-pull-logo-navy.svg" alt="Next Pull" className="h-auto w-28" />
                </Link>
                <span className="text-xs font-semibold text-wax-muted">
                  NEXT PULL / 2026
                </span>
              </div>
              <div className={cn("m-auto w-full", quiet ? "max-w-[38rem] py-[1.1rem]" : "max-w-xl py-12 sm:py-16")}>
                <header className={quiet ? "mb-[0.88rem] text-center" : "mb-8 sm:mb-10"}>
                  <p className={cn("mb-3 text-xs font-semibold uppercase tracking-[0.08em]", quiet ? "text-wax-muted" : "text-accent-500")}>
                    {eyebrow}
                  </p>
                  <h1 className={cn("font-display font-bold [&_em]:not-italic", quiet ? "my-3 text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.1]" : "my-4 text-5xl leading-[1.05] sm:text-display [&_em]:text-accent-500")}>
                    {title}
                  </h1>
                  <p className={cn("max-w-md leading-relaxed text-wax-muted", quiet && "mx-auto")}>
                    {description}
                  </p>
                </header>
                {children}
                <div className={cn("border-t border-wax-line pt-6 text-center text-sm text-wax-muted", quiet ? "mt-4" : "mt-10")}>
                  {footer}
                </div>
              </div>
              <p className="mt-auto text-center text-xs font-semibold uppercase tracking-[0.08em] text-wax-muted">
                Private collection space · Secure session
              </p>
            </section>

      </div>
    </main>
  );
}
