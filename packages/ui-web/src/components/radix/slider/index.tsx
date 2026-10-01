"use client";

import * as Primitive from "@radix-ui/react-slider";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

export const Slider = forwardRef<ElementRef<typeof Primitive.Root>, ComponentPropsWithoutRef<typeof Primitive.Root>>(({ className, ...props }, ref) => (
  <Primitive.Root ref={ref} className={cn("relative flex h-6 w-full touch-none select-none items-center", className)} {...props}><Primitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-wax-line"><Primitive.Range className="absolute h-full bg-primary-500" /></Primitive.Track><Primitive.Thumb className="focus-ring block size-5 rounded-full border border-primary-500 bg-wax-card shadow-soft" /></Primitive.Root>
));
Slider.displayName = "Slider";
