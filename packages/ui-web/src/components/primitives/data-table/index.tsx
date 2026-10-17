import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "../../../lib/cn";
import React from "react";

export type DataTableAlign = "start" | "center" | "end";
export type DataTableRowTone = "default" | "muted" | "danger";

export type DataTableRootProps = ComponentPropsWithoutRef<"div">;
export type DataTableTableProps = ComponentPropsWithoutRef<"table"> & {
  sticky?: boolean;
  maxHeight?: string;
};
export type DataTableHeaderProps = ComponentPropsWithoutRef<"thead">;
export type DataTableBodyProps = ComponentPropsWithoutRef<"tbody">;
export type DataTableRowProps = ComponentPropsWithoutRef<"tr"> & {
  /** Adds pointer hover treatment only. Keep a real link or button inside the row for keyboard access. */
  interactive?: boolean;
  tone?: DataTableRowTone;
};

export type DataTableHeadRowProps = ComponentPropsWithoutRef<"tr"> & {
  /** Adds pointer hover treatment only. Keep a real link or button inside the row for keyboard access. */
  interactive?: boolean;
  tone?: DataTableRowTone;
  sticky?: boolean;
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

function Root({ className, children, ...props }: DataTableRootProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden rounded-xl border border-wax-line bg-wax-card text-card-foreground",
        className,
      )}
    >
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Table({
  className,
  sticky = false,
  maxHeight = "max-h-[calc(100vh-18rem)]",
  ...props
}: DataTableTableProps) {
  if (!sticky) {
    return (
      <table
        {...props}
        className={cn("w-full border-collapse text-start", className)}
      />
    );
  }

  return (
    <div className={cn(maxHeight, "overflow-y-auto")}>
      <table
        {...props}
        className={cn("w-full border-collapse text-start", className)}
      />
    </div>
  );
}

function Header({ className, ...props }: DataTableHeaderProps) {
  return (
    <thead
      {...props}
      className={cn(
        "bg-wax-input/70 [&_tr]:border-b [&_tr]:border-wax-line",
        className,
      )}
    />
  );
}

function Body({ className, ...props }: DataTableBodyProps) {
  return (
    <tbody {...props} className={cn("divide-y divide-wax-line", className)} />
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
        "group transition-colors",
        interactive && "cursor-pointer hover:bg-primary-500/5",
        tone === "muted" && "bg-wax-input/30",
        tone === "danger" && "bg-danger-500/5",
        className,
      )}
    />
  );
}

function HeadRow({
  className,
  interactive = false,
  tone = "default",
  sticky = false,
  ...props
}: DataTableHeadRowProps) {
  return (
    <tr
      {...props}
      data-interactive={interactive || undefined}
      data-tone={tone}
      className={cn(
        "group transition-colors",
        interactive && "cursor-pointer hover:bg-primary-500/5",
        tone === "muted" && "bg-wax-input/30",
        tone === "danger" && "bg-danger-500/5",
        className,
        sticky && "[&_th]:sticky [&_th]:top-0",
      )}
    />
  );
}

function Head({ className, align = "start", ...props }: DataTableHeadProps) {
  return (
    <th
      {...props}
      data-align={align}
      className={cn(
        "px-5 py-4 text-xs font-extrabold uppercase tracking-[0.08em] text-wax-muted",
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
      className={cn("px-5 py-4", alignmentClasses[align], className)}
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
    <tr {...props} className={className}>
      <Cell colSpan={colSpan} className={cn("p-5", cellClassName)}>
        {children}
      </Cell>
    </tr>
  );
}

function LoadingRows({ columns, label, rows = 5 }: DataTableLoadingRowsProps) {
  return Array.from({ length: rows }, (_, index) => (
    <tr
      key={index}
      aria-hidden={index === 0 ? undefined : true}
      className="animate-pulse"
    >
      <Cell colSpan={columns} className="px-5 py-5">
        {index === 0 && (
          <span className="sr-only" role="status">
            {label}
          </span>
        )}
        <div aria-hidden="true" className="h-10 rounded-md bg-wax-input" />
      </Cell>
    </tr>
  ));
}

/**
 * Framework-neutral table building blocks for dense application data.
 * Interactive rows must include a semantic app-owned link or button.
 */
export const DataTable = {
  Root,
  Table,
  Header,
  Body,
  Row,
  Head,
  Cell,
  StateRow,
  LoadingRows,
  HeadRow,
};
