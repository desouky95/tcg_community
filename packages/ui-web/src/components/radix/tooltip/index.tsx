"use client";

import * as Primitive from "@radix-ui/react-tooltip";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(({ className, sideOffset = 6, ...props }, ref) => (
  <Primitive.Portal><Primitive.Content ref={ref} className={cn("max-w-72 rounded-md border border-wax-line bg-wax-ink px-2.5 py-2 text-xs font-bold text-wax-paper shadow-pop", className)} sideOffset={sideOffset} {...props} /></Primitive.Portal>
));
Content.displayName = "TooltipContent";
export const Tooltip = { Provider: Primitive.Provider, Root: Primitive.Root, Trigger: Primitive.Trigger, Content };
