"use client";

import * as Primitive from "@radix-ui/react-popover";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import { floatingPanelClass } from "../shared";

const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(({ className, sideOffset = 8, ...props }, ref) => (
  <Primitive.Portal><Primitive.Content ref={ref} className={cn("w-[min(calc(100vw-2rem),22rem)] p-4", floatingPanelClass, className)} sideOffset={sideOffset} {...props} /></Primitive.Portal>
));
Content.displayName = "PopoverContent";

export const Popover = { Root: Primitive.Root, Trigger: Primitive.Trigger, Content, Close: Primitive.Close };
