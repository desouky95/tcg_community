import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "../../lib/cn";

type Tone = "default" | "muted" | "accent" | "success" | "warning" | "danger";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  tone?: "primary" | "accent" | "danger";
  loading?: boolean;
};

export function Button({
  className,
  variant = "solid",
  size = "md",
  tone = "primary",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      data-variant={variant}
      data-size={size}
      data-tone={tone}
      data-state={loading ? "loading" : disabled ? "disabled" : "ready"}
      className={cn("ui-button", className)}
    >
      {loading && <span aria-hidden="true" className="ui-button-spinner" />}
      {children}
    </button>
  );
}

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  tone?: Exclude<Tone, "success" | "warning" | "danger">;
  interactive?: boolean;
};

export function Surface({ className, tone = "default", interactive = false, ...props }: SurfaceProps) {
  return <div {...props} data-tone={tone} data-interactive={interactive} className={cn("ui-surface", className)} />;
}

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: Exclude<Tone, "default" | "muted" | "accent">;
  size?: "sm" | "md";
};

export function StatusBadge({ className, tone = "success", size = "sm", ...props }: StatusBadgeProps) {
  return <span {...props} data-tone={tone} data-size={size} className={cn("ui-status", className)} />;
}

export type FieldProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  invalid?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, hint, error, invalid = Boolean(error), children, className, ...props }: FieldProps) {
  const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;
  return (
    <div {...props} className={cn("ui-field", className)} data-state={invalid ? "invalid" : "ready"}>
      <label htmlFor={htmlFor} className="ui-field-label">{label}</label>
      <div className="ui-field-control">{children}</div>
      {(hint || error) && (
        <p id={descriptionId} className={cn("ui-field-message", error && "ui-field-message-error")} role={error ? "alert" : undefined}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("ui-control ui-input", className)} />;
}

export type PageHeadingProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeading({ eyebrow, title, description, actions, className, ...props }: PageHeadingProps) {
  return (
    <header {...props} className={cn("ui-page-heading", className)}>
      <div>
        {eyebrow && <p className="wax-kicker">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="ui-page-heading-actions">{actions}</div>}
    </header>
  );
}

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} aria-hidden="true" className={cn("ui-skeleton", className)} />;
}

export function EmptyState({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("ui-empty-state", className)} />;
}
