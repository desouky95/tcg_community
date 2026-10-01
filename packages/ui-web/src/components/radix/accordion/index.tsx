"use client";

import * as Primitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

const Trigger = forwardRef<ElementRef<typeof Primitive.Trigger>, ComponentPropsWithoutRef<typeof Primitive.Trigger>>(({ className, children, ...props }, ref) => (
  <Primitive.Header className="flex"><Primitive.Trigger ref={ref} className={cn("focus-ring flex min-h-control flex-1 items-center justify-between gap-3 rounded-md px-3 text-start font-bold text-wax-ink data-[state=open]:text-primary-600", className)} {...props}>{children}<ChevronRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-90" /></Primitive.Trigger></Primitive.Header>
));
Trigger.displayName = "AccordionTrigger";
const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content>>(({ className, ...props }, ref) => (
  <Primitive.Content ref={ref} className={cn("overflow-hidden px-3 pb-3 text-sm text-wax-muted data-[state=closed]:animate-out data-[state=open]:animate-in", className)} {...props} />
));
Content.displayName = "AccordionContent";
export const Accordion = { Root: Primitive.Root, Item: Primitive.Item, Trigger, Content };
