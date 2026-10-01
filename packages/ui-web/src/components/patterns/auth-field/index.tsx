import type { ReactNode } from "react";
import { Field } from "../../primitives/field";

export type AuthFieldProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AuthField({ id, label, icon, error, children, className }: AuthFieldProps) {
  return (
    <Field htmlFor={id} label={label} error={error} className={className}>
      <div className="focus-within:ring-ring/20 relative flex min-h-control items-center rounded-md border border-wax-line bg-wax-input transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-4 [&>svg]:ms-3.5 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-wax-muted">
        {icon}
        {children}
      </div>
    </Field>
  );
}
