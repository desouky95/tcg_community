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
};

export function AuthShell({ eyebrow, title, description, children, footer, asideTitle, asideDescription, asideItems, Link = NativeLink, onBack, backIcon, className, ...props }: AuthShellProps) {
  return (
    <main {...props} className={cn("min-h-dvh bg-background text-foreground", className)}>
      <div className="mx-auto grid min-h-dvh max-w-[1480px] lg:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.2fr)]">
        <aside className="relative hidden flex-col justify-between gap-16 overflow-hidden bg-wax-navy p-8 text-wax-paper lg:flex xl:p-16">
          <div className="pointer-events-none absolute inset-4 border border-wax-paper/10" aria-hidden="true" />
          <div className="relative">
            <Link href="/" className="focus-ring flex items-center gap-3">
              <span className="grid size-10 -rotate-3 place-items-center bg-accent-500 font-display font-extrabold text-white">T</span>
              <span><strong className="block font-display text-xl">TCG Nexus</strong><small className="font-mono text-utility">THE COLLECTOR'S CLUB</small></span>
            </Link>
            <div className="mt-20 max-w-sm xl:mt-32">
              <h2 className="my-6 font-display text-display font-extrabold uppercase xl:text-7xl">Your binder,<br /><em className="text-wax-gold not-italic">in motion.</em></h2>
              <p className="max-w-72 leading-relaxed text-wax-paper/85">{asideDescription}</p>
            </div>
          </div>
          <div className="relative">
            <div className="grid gap-1.5 bg-wax-gold/10 px-4 py-3.5">
              <strong className="font-display text-lg uppercase">{asideTitle}</strong>
              <span className="text-sm text-wax-paper/85">Egypt-first collecting, trading, and discovery.</span>
            </div>
            <ul className="my-7 grid list-none gap-3">
              {asideItems.map(item => <li key={item} className="flex items-center gap-3 text-sm text-wax-paper/85"><span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-wax-gold/20 text-wax-gold"><Check className="size-3" aria-hidden="true" /></span>{item}</li>)}
            </ul>
            <div className="flex items-center gap-2 border-t border-wax-paper/25 pt-4 font-mono text-utility uppercase text-wax-paper/80"><MapPin className="size-4 shrink-0 text-wax-gold" aria-hidden="true" /> Cairo / Alexandria / everywhere</div>
          </div>
        </aside>
        <section className="flex min-h-dvh min-w-0 flex-col p-4 sm:p-8 xl:px-20">
          <div className="flex items-center justify-between gap-3">
            <IconButton variant="outline" onClick={onBack ?? (() => window.history.back())} aria-label="Go back">{backIcon ?? <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />}</IconButton>
            <Link href="/" className="focus-ring flex items-center gap-2 font-display font-bold lg:hidden"><span className="grid size-9 -rotate-3 place-items-center bg-accent-500 text-white">T</span>TCG Nexus</Link>
            <span className="font-mono text-utility text-wax-muted">TCG / 2026</span>
          </div>
          <div className="m-auto w-full max-w-xl py-12 sm:py-16">
            <header className="mb-8 sm:mb-10">
              <p className="mb-3 text-xs font-extrabold uppercase text-wax-red">{eyebrow}</p>
              <h1 className="my-4 font-display text-5xl font-extrabold uppercase leading-none sm:text-display [&_em]:text-wax-red [&_em]:not-italic">{title}</h1>
              <p className="max-w-md leading-relaxed text-wax-muted">{description}</p>
            </header>
            {children}
            <div className="mt-10 border-t border-wax-line pt-6 text-center text-sm text-wax-muted">{footer}</div>
          </div>
          <p className="mt-auto text-center font-mono text-utility uppercase text-wax-muted">Private collection space · Secure session</p>
        </section>
      </div>
    </main>
  );
}
