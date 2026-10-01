import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../../lib/cn";

export type OtpFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  help?: ReactNode;
  icon?: ReactNode;
  inputClassName?: string;
};

export function OtpField({ id, label, help, icon, className, inputClassName, ...props }: OtpFieldProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={id} className="text-xs font-extrabold text-wax-ink">{label}</label>
      <div className="focus-within:ring-ring/20 flex min-h-control items-center rounded-md border border-wax-line bg-wax-input px-3.5 transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-4 [&>svg]:size-4 [&>svg]:text-wax-muted">
        {icon}
        <input
          {...props}
          id={id}
          aria-describedby={[props["aria-describedby"], help ? `${id}-help` : undefined].filter(Boolean).join(" ") || undefined}
          className={cn("min-h-control min-w-0 flex-1 border-0 bg-transparent px-3 text-center font-mono text-xl tracking-[0.35em] text-wax-ink outline-none placeholder:text-wax-muted", inputClassName)}
          inputMode={props.inputMode ?? "numeric"}
          pattern={props.pattern ?? "[0-9]*"}
          maxLength={props.maxLength ?? 6}
          autoComplete={props.autoComplete ?? "one-time-code"}
        />
      </div>
      {help && <p id={`${id}-help`} className="m-0 flex flex-wrap items-center gap-1 text-xs text-wax-muted [&_svg]:size-4">{help}</p>}
    </div>
  );
}
