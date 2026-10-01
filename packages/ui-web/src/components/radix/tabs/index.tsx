"use client";

import * as Primitive from "@radix-ui/react-tabs";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

const List = forwardRef<ElementRef<typeof Primitive.List>, ComponentPropsWithoutRef<typeof Primitive.List>>(({ className, ...props }, ref) => (
  <Primitive.List ref={ref} className={cn("inline-flex items-center gap-1 rounded-md border border-wax-line bg-wax-input/70 p-1", className)} {...props} />
));
List.displayName = "TabsList";
const Trigger = forwardRef<ElementRef<typeof Primitive.Trigger>, ComponentPropsWithoutRef<typeof Primitive.Trigger>>(({ className, ...props }, ref) => (
  <Primitive.Trigger ref={ref} className={cn("focus-ring min-h-9 rounded-sm px-3 font-bold text-wax-ink data-[state=active]:bg-wax-card data-[state=active]:shadow-soft", className)} {...props} />
));
Trigger.displayName = "TabsTrigger";
const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(({ className, ...props }, ref) => (
  <Primitive.Content ref={ref} className={cn("mt-4", className)} {...props} />
));
Content.displayName = "TabsContent";
export const Tabs = { Root: Primitive.Root, List, Trigger, Content };
