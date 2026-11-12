"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import "./shop-menu.css";
import { motion } from "motion/react";

export type ShopCategory = {
  id: string;
  name: string;
  href: string;
  image?: string;
  children: ShopCategory[];
  metadata?: Record<string, unknown> | null;
};

function CategoryLinks({
  categories,
  onNavigate,
  onPreview,
}: {
  categories: ShopCategory[];
  onNavigate: () => void;
  onPreview?: (category: ShopCategory) => void;
}) {
  const _Link = ({ disabled }: { disabled: boolean }) =>
    disabled ? "span" : Link;
  return (
    <>
      {categories.map((category) => (
        <div key={category.id} className="min-w-0">
          <Link
            href={category?.metadata?.disabled ? "" : category.href}
            onClick={category?.metadata?.disabled ? undefined : onNavigate}
            onMouseEnter={() =>
              category?.metadata?.disabled || onPreview?.(category)
            }
            onFocus={() => onPreview?.(category)}
            className="focus-ring font-display text-base font-semibold hover:text-accent-500"
          >
            {category.name}
          </Link>
          {category.children.length > 0 && (
            <div className="mt-3 grid gap-3 border-s border-wax-line ps-4">
              <CategoryLinks
                categories={category.children}
                onNavigate={onNavigate}
                onPreview={onPreview}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export function ShopMenu({ categories }: { categories: ShopCategory[] }) {
  const [open, setOpen] = useState(false);
  const [feature, setFeature] = useState<ShopCategory | null>(null);
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const closeNow = () => {
    cancelClose();
    setOpen(false);
    setFeature(null);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      if (!root.current?.contains(document.activeElement)) {
        setOpen(false);
        setFeature(null);
      }
    }, 200);
  };
  useEffect(() => () => cancelClose(), []);
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeNow();
        trigger.current?.focus();
      }
    }
    function onPointer(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) closeNow();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className="static flex items-center self-stretch"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          scheduleClose();
      }}
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        )
          closeNow();
      }}
      onFocus={cancelClose}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(event) => {
          if (event.detail === 0 && open) closeNow();
          else setOpen(true);
        }}
        className="focus-ring inline-flex h-full min-h-11 items-center gap-1 font-display font-semibold hover:text-accent-500"
      >
        Shop <ChevronDown aria-hidden="true" className="size-4" />
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full z-50 max-h-[min(70vh,40rem)] overflow-y-auto border-b border-wax-line bg-background px-4 py-7 text-foreground shadow-pop sm:px-8"
        >
          <div className="mx-auto grid max-w-360 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,25%)]">
            <div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="font-display text-xl font-semibold">
                  Shop by category
                </h2>
                <Link
                  href="/shop"
                  onClick={closeNow}
                  className="focus-ring inline-flex min-h-11 items-center gap-2 font-semibold text-accent-500 hover:underline"
                >
                  Shop all{" "}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
              {categories.length ? (
                <div className="grid grid-cols-3 gap-x-8 gap-y-7 xl:grid-cols-4">
                  <CategoryLinks
                    categories={categories}
                    onNavigate={closeNow}
                    onPreview={setFeature}
                  />
                </div>
              ) : (
                <p className="text-wax-muted">
                  Categories are not available right now. Explore all products
                  in the shop.
                </p>
              )}
            </div>
            <CategoryFeature
              key={`${feature?.id ?? "neutral"}:${feature?.image ?? ""}`}
              category={feature}
              onNavigate={closeNow}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryFeature({
  category,
  onNavigate,
}: {
  category: ShopCategory | null;
  onNavigate: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  const content = (
    <>
      {category?.image && !imageFailed && (
        <span className="absolute inset-2 h-3/4 z-[1]">
          <motion.img
            initial={{
              translateY: "100%",
            }}
            animate={{
              translateY: "0",
            }}
            src={category.image}
            alt=""
            onError={() => setImageFailed(true)}
            className="inset-0 h-full w-full object-contain"
          />
        </span>
      )}
      <span
        aria-hidden="true"
        data-testid="category-feature-shape"
        className="absolute inset-0 bg-accent-500 [clip-path:polygon(70%_0,100%_0,100%_100%,28%_100%)]"
      />
      <span
        aria-hidden="true"
        data-testid="category-feature-spark"
        className="absolute end-6 top-6 size-8 bg-signature-lime-500 [clip-path:polygon(50%_0,61%_37%,100%_50%,61%_63%,50%_100%,39%_63%,0_50%,39%_37%)]"
      />
      <span className="relative font-display text-xl z-10 font-semibold [overflow-wrap:anywhere]">
        {category?.name ?? "Explore categories"}
        {category && (
          <>
            {" "}
            <ArrowUpRight aria-hidden="true" className="inline size-5" />
          </>
        )}
      </span>
    </>
  );
  const styles =
    "relative flex min-h-52 items-end overflow-hidden rounded-xl bg-primary-500 p-5 text-white";
  return category ? (
    <Link
      href={category.href}
      onClick={onNavigate}
      aria-label={`Explore ${category.name}`}
      className={`focus-ring group ${styles}`}
    >
      {content}
    </Link>
  ) : (
    <div className={styles}>{content}</div>
  );
}

export function MobileShopCategories({
  categories,
  onNavigate,
}: {
  categories: ShopCategory[];
  onNavigate: () => void;
}) {
  return (
    <details className="border-b border-wax-line">
      <summary className="focus-ring flex min-h-14 cursor-pointer list-none items-center justify-between font-display text-xl font-semibold">
        Shop categories <ChevronDown aria-hidden="true" className="size-5" />
      </summary>
      <div className="grid gap-5 pb-5 ps-2">
        <Link
          href="/shop"
          onClick={onNavigate}
          className="focus-ring inline-flex min-h-11 items-center font-semibold text-accent-500"
        >
          Shop all
        </Link>
        <CategoryLinks categories={categories} onNavigate={onNavigate} />
        {!categories.length && (
          <p className="text-sm text-wax-muted">
            Categories are not available right now.
          </p>
        )}
      </div>
    </details>
  );
}
