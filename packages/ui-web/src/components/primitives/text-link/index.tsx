"use client";

import { Slot } from "@radix-ui/react-slot";
import type { AnchorHTMLAttributes } from "react";
import { textLinkStyles } from "../../../lib/component-styles";

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean };

export function TextLink({ asChild = false, className, ...props }: TextLinkProps) {
  const Comp = asChild ? Slot : "a";
  return <Comp {...props} className={textLinkStyles(`ui-text-link ${className ?? ""}`)} />;
}
