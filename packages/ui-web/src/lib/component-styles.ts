import { cn } from "./cn";

export type ControlSize = "sm" | "md" | "lg";
export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonTone = "primary" | "accent" | "danger";

const buttonBase =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-md border font-extrabold transition-[background-color,border-color,color,transform,filter] duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55";

const buttonSizes: Record<ControlSize, string> = {
  sm: "min-h-control-sm px-3 text-control",
  md: "min-h-control px-4",
  lg: "min-h-control-lg px-5",
};

const solidTones: Record<ButtonTone, string> = {
  primary: "border-primary-500 bg-primary-500 text-primary-50 hover:brightness-110",
  accent: "border-accent-500 bg-accent-500 text-white hover:brightness-110",
  danger: "border-danger-500 bg-danger-500 text-white hover:brightness-110",
};

export function buttonStyles({
  variant = "solid",
  size = "md",
  tone = "accent",
  className,
}: {
  variant?: ButtonVariant;
  size?: ControlSize;
  tone?: ButtonTone;
  className?: string;
} = {}) {
  return cn(
    buttonBase,
    buttonSizes[size],
    variant === "solid" && solidTones[tone],
    variant === "outline" &&
      "border-wax-line bg-transparent text-wax-ink hover:border-ring hover:bg-ring/5 font-white",
    variant === "ghost" &&
      "border-transparent bg-transparent text-wax-ink hover:bg-primary-500/10",
    className,
  );
}

export function textLinkStyles(className?: string) {
  return cn(
    "focus-ring inline-flex items-center gap-1.5 font-bold text-wax-ink underline decoration-wax-red decoration-1 underline-offset-4 transition-colors hover:text-wax-red",
    className,
  );
}

export const controlStyles =
  "focus-ring min-h-control rounded-md border border-wax-line bg-wax-input text-wax-ink transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-wax-muted hover:border-ring/50 aria-invalid:border-danger-500 disabled:cursor-not-allowed disabled:opacity-50";
