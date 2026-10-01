"use client";

import * as Primitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

export const Checkbox = forwardRef<ElementRef<typeof Primitive.Root>, ComponentPropsWithoutRef<typeof Primitive.Root>>(({ className, children, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn("focus-ring inline-flex size-5 shrink-0 items-center justify-center rounded-sm border border-wax-line bg-wax-input text-primary-50 data-[state=checked]:border-primary-500 data-[state=checked]:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}><Primitive.Indicator><Check aria-hidden="true" className="size-4" /></Primitive.Indicator>{children}</Primitive.Root>
));
Checkbox.displayName = "Checkbox";
