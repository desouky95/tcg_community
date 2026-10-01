"use client";

import * as Primitive from "@radix-ui/react-switch";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

export const Switch = forwardRef<ElementRef<typeof Primitive.Root>, ComponentPropsWithoutRef<typeof Primitive.Root>>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn("focus-ring inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-wax-line transition-colors data-[state=checked]:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}><Primitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-wax-card shadow-soft transition-transform data-[state=checked]:translate-x-5 rtl:data-[state=checked]:-translate-x-5" /></Primitive.Root>
));
Switch.displayName = "Switch";
