import { cn } from "./cn";

export type ControlSize = "xs" | "sm" | "md" | "lg";
export type FontSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";
export type HeadingSize = Extract<
  FontSize,
  "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl"
>;
export type ButtonVariant = "solid" | "outline" | "ghost";
export type ButtonTone = "primary" | "accent" | "danger" | "success";

const buttonBase =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-md border font-extrabold transition-[background-color,border-color,color,transform,filter] duration-150 ease-standard disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55";

const buttonSizes: Record<ControlSize, string> = {
  sm: "min-h-control-sm px-3 text-control",
  md: "min-h-control px-4",
  lg: "min-h-control-lg px-5",
  xs: "min-h-control-xs px-1 text-control",
};

const solidTones: Record<ButtonTone, string> = {
  primary:
    "border-primary-500 bg-primary-500 text-primary-50 hover:brightness-110",
  accent: "border-accent-500 bg-accent-500 text-white hover:brightness-110",
  danger: "border-danger-500 bg-danger-500 text-white hover:brightness-110",
  success: "border-success-500 bg-success-500 text-white hover:brightness-110",
};

const outlineTones: Record<ButtonTone, string> = {
  primary:
    "border-primary-500 bg-transparent text-wax-ink hover:border-ring hover:bg-ring/5",
  accent:
    "border-accent-500 bg-transparent text-accent-500 hover:border-ring hover:bg-ring/5",
  danger:
    "border-danger-500 bg-transparent text-danger-500 hover:border-ring hover:bg-ring/5",
  success:
    "border-success-500 bg-transparent text-success-500 hover:bg-success-500/10",
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
      "border-wax-line bg-transparent text-wax-ink  font-white",
    variant === "ghost" &&
      "border-transparent bg-transparent text-wax-ink hover:bg-primary-500/10",
    variant === "outline" && outlineTones[tone],
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
  "focus-ring rounded-md border border-wax-line bg-wax-input text-wax-ink transition-[border-color,box-shadow,background-color] duration-150 placeholder:text-wax-muted hover:border-ring/50 aria-invalid:border-danger-500 disabled:cursor-not-allowed disabled:opacity-50";
export const controlSizeVariants: Record<ControlSize, string> = {
  md: "min-h-control",
  lg: "min-h-control-lg",
  sm: "min-h-control-sm",
  xs: "min-h-control-xs",
};
export const headingStyles: Record<
  HeadingSize,
  { heading: string; description?: string }
> = {
  "4xl": {
    heading: "text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl",
    description: "text-base",
  },
  "3xl": {
    heading: "text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl",
    description: "text-base",
  },
  "2xl": {
    heading: "text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
    description: "text-sm",
  },
  xl: {
    heading: "text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl",
    description: "text-sm",
  },
  "5xl": {
    heading: "text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl",
    description: "text-base",
  },
  "6xl": {
    heading: "text-6xl font-black tracking-tight sm:text-7xl lg:text-8xl",
    description: "text-base",
  },
};
