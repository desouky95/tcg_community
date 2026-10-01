"use client";

import * as Primitive from "@radix-ui/react-toggle-group";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

const Item = forwardRef<ElementRef<typeof Primitive.Item>, ComponentPropsWithoutRef<typeof Primitive.Item>>(({ className, ...props }, ref) => (
  <Primitive.Item ref={ref} className={cn("focus-ring inline-flex min-h-9 items-center justify-center rounded-sm px-3 text-sm font-bold text-wax-muted data-[state=on]:bg-wax-card data-[state=on]:text-wax-ink data-[state=on]:shadow-soft disabled:pointer-events-none disabled:opacity-50", className)} {...props} />
));
Item.displayName = "ToggleGroupItem";
export const ToggleGroup = { Root: Primitive.Root, Item };
