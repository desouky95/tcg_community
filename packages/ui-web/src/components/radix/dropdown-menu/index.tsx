"use client";

import * as Primitive from "@radix-ui/react-dropdown-menu";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import { floatingPanelClass, menuItemClass } from "../shared";

const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(({ className, sideOffset = 8, ...props }, ref) => (
  <Primitive.Portal><Primitive.Content ref={ref} className={cn("min-w-48 p-1.5", floatingPanelClass, className)} sideOffset={sideOffset} {...props} /></Primitive.Portal>
));
Content.displayName = "DropdownMenuContent";

const Item = forwardRef<ElementRef<typeof Primitive.Item>, ComponentPropsWithoutRef<typeof Primitive.Item>>(({ className, ...props }, ref) => (
  <Primitive.Item ref={ref} className={cn(menuItemClass, className)} {...props} />
));
Item.displayName = "DropdownMenuItem";

const Separator = forwardRef<ElementRef<typeof Primitive.Separator>, ComponentPropsWithoutRef<typeof Primitive.Separator>>(({ className, ...props }, ref) => (
  <Primitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-wax-line", className)} {...props} />
));
Separator.displayName = "DropdownMenuSeparator";

export const DropdownMenu = { Root: Primitive.Root, Trigger: Primitive.Trigger, Content, Item, Separator, Label: Primitive.Label, Group: Primitive.Group };
