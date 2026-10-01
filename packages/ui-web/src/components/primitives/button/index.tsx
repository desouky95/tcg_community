"use client";

import { Slot } from "@radix-ui/react-slot";
import { cloneElement, isValidElement, type ComponentPropsWithRef, type ReactElement } from "react";
import { buttonStyles, type ButtonTone, type ButtonVariant, type ControlSize } from "../../../lib/component-styles";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ControlSize;
  tone?: ButtonTone;
  loading?: boolean;
};

export function Button({
  asChild = false,
  className,
  variant = "solid",
  size = "md",
  tone = "accent",
  loading = false,
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const isDisabled = disabled || loading;
  const sharedProps = {
    "aria-busy": loading || undefined,
    "aria-disabled": asChild && isDisabled ? true : props["aria-disabled"],
    "data-size": size,
    "data-state": loading ? "loading" : disabled ? "disabled" : "ready",
    "data-tone": tone,
    "data-variant": variant,
    className: buttonStyles({ variant, size, tone, className: `ui-button ${className ?? ""}` }),
  };

  if (asChild) {
    // Slot composes child handlers first; guard the child as well as the wrapper.
    const child = isDisabled && isValidElement(children)
      ? cloneElement(children as ReactElement<ComponentPropsWithRef<"button">>, {
          onClick: (event) => { event.preventDefault(); event.stopPropagation(); },
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); }
          },
          tabIndex: -1,
        })
      : children;
    return <Comp {...props} {...sharedProps}
      onClick={isDisabled ? (event) => { event.preventDefault(); event.stopPropagation(); } : props.onClick}
      onKeyDown={isDisabled ? (event) => { if (event.key === "Enter" || event.key === " ") event.preventDefault(); } : props.onKeyDown}
      tabIndex={isDisabled ? -1 : props.tabIndex}
    >{child}</Comp>;
  }

  return (
    <Comp
      {...props}
      disabled={isDisabled}
      type={type ?? "button"}
      {...sharedProps}
    >
      {loading && (
        <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-current border-e-transparent" />
      )}
      {children}
    </Comp>
  );
}
