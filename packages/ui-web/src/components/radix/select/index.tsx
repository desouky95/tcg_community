"use client";

import * as Primitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import { floatingPanelClass, menuItemClass } from "../shared";

const Trigger = forwardRef<ElementRef<typeof Primitive.Trigger>, ComponentPropsWithoutRef<typeof Primitive.Trigger>>(({ className, children, ...props }, ref) => (
  <Primitive.Trigger ref={ref} className={cn("focus-ring inline-flex min-h-control min-w-48 items-center justify-between gap-3 rounded-md border border-wax-line bg-wax-input px-3.5 text-wax-ink", className)} {...props}>
    {children}<Primitive.Icon asChild><ChevronDown aria-hidden="true" className="size-4 shrink-0" /></Primitive.Icon>
  </Primitive.Trigger>
));
Trigger.displayName = "SelectTrigger";

const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(({ className, sideOffset = 8, children, ...props }, ref) => (
  <Primitive.Portal><Primitive.Content ref={ref} className={cn("min-w-48 p-1.5", floatingPanelClass, className)} sideOffset={sideOffset} position="popper" {...props}><Primitive.Viewport>{children}</Primitive.Viewport></Primitive.Content></Primitive.Portal>
));
Content.displayName = "SelectContent";

const Item = forwardRef<ElementRef<typeof Primitive.Item>, ComponentPropsWithoutRef<typeof Primitive.Item>>(({ className, children, ...props }, ref) => (
  <Primitive.Item ref={ref} className={cn(menuItemClass, className)} {...props}><Primitive.ItemText>{children}</Primitive.ItemText><Primitive.ItemIndicator className="ms-auto inline-flex"><Check aria-hidden="true" className="size-4" /></Primitive.ItemIndicator></Primitive.Item>
));
Item.displayName = "SelectItem";

export const Select = { Root: Primitive.Root, Trigger, Value: Primitive.Value, Content, Item, Group: Primitive.Group, Label: Primitive.Label };
