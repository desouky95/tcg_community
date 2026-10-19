import * as ScrollArea from "@radix-ui/react-scroll-area";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export type DataTableAlign = "start" | "center" | "end";
export type DataTableRowTone = "default" | "muted" | "danger";

export type DataTableRootProps = ComponentPropsWithoutRef<
  typeof ScrollArea.Root
> & {
  /** Accessible name for the keyboard-focusable scroll viewport. */
  scrollLabel?: string;
  viewportClassName?: string;
};
export type DataTableTableProps = ComponentPropsWithoutRef<"table">;
export type DataTableCaptionProps = ComponentPropsWithoutRef<"caption">;
export type DataTableHeaderProps = ComponentPropsWithoutRef<"thead"> & {
  sticky?: boolean;
};
export type DataTableBodyProps = ComponentPropsWithoutRef<"tbody">;
export type DataTableFooterProps = ComponentPropsWithoutRef<"tfoot">;
export type DataTableRowProps = ComponentPropsWithoutRef<"tr"> & {
  /** Adds pointer hover treatment only. Keep a real link or button inside the row for keyboard access. */
  interactive?: boolean;
  tone?: DataTableRowTone;
};
export type DataTableHeadProps = Omit<
  ComponentPropsWithoutRef<"th">,
  "align"
> & {
  align?: DataTableAlign;
};
export type DataTableCellProps = Omit<
  ComponentPropsWithoutRef<"td">,
  "align"
> & {
  align?: DataTableAlign;
};
export type DataTableStateRowProps = Omit<
  ComponentPropsWithoutRef<"tr">,
  "children"
> & {
  children: ReactNode;
  colSpan: number;
  cellClassName?: string;
};
export type DataTableLoadingRowsProps = {
  columns: number;
  label: string;
  rows?: number;
};

const alignmentClasses: Record<DataTableAlign, string> = {
  start: "text-start",
  center: "text-center",
  end: "text-end",
};

function Root({
  className,
  children,
  scrollLabel,
  viewportClassName,
  ...props
}: DataTableRootProps) {
  return (
    <ScrollArea.Root
      {...props}
      className={cn(
        "relative overflow-hidden rounded-lg border border-wax-line bg-wax-card text-card-foreground",
        className,
      )}
    >
      <ScrollArea.Viewport
        aria-label={scrollLabel}
        role={scrollLabel ? "region" : undefined}
        tabIndex={scrollLabel ? 0 : undefined}
        className={cn(
          "size-full overscroll-contain focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-ring",
          viewportClassName,
        )}
      >
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className="z-20 flex h-2.5 touch-none select-none bg-wax-input/90 p-0.5"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-wax-muted/70 before:absolute before:start-1/2 before:top-1/2 before:size-11 before:-translate-1/2" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className="z-20 flex w-2.5 touch-none select-none bg-wax-input/90 p-0.5"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-full bg-wax-muted/70 before:absolute before:start-1/2 before:top-1/2 before:size-11 before:-translate-1/2" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-wax-input" />
    </ScrollArea.Root>
  );
}

function Table({ className, ...props }: DataTableTableProps) {
  return (
    <table
      {...props}
      className={cn(
        "w-full border-separate border-spacing-0 text-start text-sm tabular-nums",
        className,
      )}
    />
  );
}

function Caption({ className, ...props }: DataTableCaptionProps) {
  return (
    <caption
      {...props}
      className={cn("px-5 py-3 text-start text-sm text-wax-muted", className)}
    />
  );
}

function Header({ className, sticky = false, ...props }: DataTableHeaderProps) {
  return (
    <thead
      {...props}
      data-sticky={sticky || undefined}
      className={cn(
        "[&_th]:border-b [&_th]:border-primary-600 [&_th]:bg-primary-500 [&_th]:text-wax-paper",
        sticky && "[&_th]:sticky [&_th]:top-0 [&_th]:z-10",
        className,
      )}
    />
  );
}

function Body({ className, ...props }: DataTableBodyProps) {
  return (
    <tbody
      {...props}
      className={cn("[&_tr:last-child_td]:border-b-0", className)}
    />
  );
}

function Footer({ className, ...props }: DataTableFooterProps) {
  return (
    <tfoot
      {...props}
      className={cn(
        "bg-wax-input/70 font-semibold [&_td]:border-t [&_td]:border-wax-line",
        className,
      )}
    />
  );
}

function Row({
  className,
  interactive = false,
  tone = "default",
  ...props
}: DataTableRowProps) {
  return (
    <tr
      {...props}
      data-interactive={interactive || undefined}
      data-tone={tone}
      className={cn(
        "group transition-colors motion-reduce:transition-none",
        interactive && "cursor-pointer hover:bg-primary-500/6",
        tone === "muted" && "bg-wax-input/45",
        tone === "danger" && "bg-danger-500/8",
        className,
      )}
    />
  );
}

function Head({
  className,
  align = "start",
  scope = "col",
  ...props
}: DataTableHeadProps) {
  return (
    <th
      {...props}
      scope={scope}
      data-align={align}
      className={cn(
        "lg:h-12 px-4 py-0.5 lg:py-3 font-mono text-[0.6875rem] font-bold uppercase tracking-[0.08em]",
        alignmentClasses[align],
        className,
      )}
    />
  );
}

function Cell({ className, align = "start", ...props }: DataTableCellProps) {
  return (
    <td
      {...props}
      data-align={align}
      className={cn(
        "border-b border-wax-line px-4 py-3.5 align-middle text-wax-muted",
        alignmentClasses[align],
        className,
      )}
    />
  );
}

function StateRow({
  children,
  colSpan,
  cellClassName,
  className,
  ...props
}: DataTableStateRowProps) {
  return (
    <Row {...props} className={className}>
      <Cell colSpan={colSpan} className={cn("p-5", cellClassName)}>
        {children}
      </Cell>
    </Row>
  );
}

function LoadingRows({ columns, label, rows = 5 }: DataTableLoadingRowsProps) {
  return Array.from({ length: rows }, (_, index) => (
    <Row key={index} aria-hidden={index === 0 ? undefined : true}>
      <Cell colSpan={columns} className="px-4 py-4">
        {index === 0 && (
          <span className="sr-only" role="status">
            {label}
          </span>
        )}
        <div
          aria-hidden="true"
          className="h-9 animate-pulse rounded-sm bg-wax-input motion-reduce:animate-none"
        />
      </Cell>
    </Row>
  ));
}

/**
 * Framework-neutral data-table building blocks. Native table elements preserve
 * semantics while Radix Scroll Area supplies the composable overflow primitive.
 * Interactive rows must include a semantic app-owned link or button.
 */
export const DataTable = {
  Root,
  Table,
  Caption,
  Header,
  Body,
  Footer,
  Row,
  Head,
  Cell,
  StateRow,
  LoadingRows,
};
