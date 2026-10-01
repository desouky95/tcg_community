"use client";

import * as Primitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";

const Item = forwardRef<ElementRef<typeof Primitive.Item>, ComponentPropsWithoutRef<typeof Primitive.Item>>(({ className, ...props }, ref) => (
  <Primitive.Item ref={ref} className={cn("focus-ring inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-wax-line bg-wax-input text-primary-500 data-[state=checked]:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}><Primitive.Indicator><Circle aria-hidden="true" className="size-2.5 fill-current" /></Primitive.Indicator></Primitive.Item>
));
Item.displayName = "RadioGroupItem";
export const RadioGroup = { Root: Primitive.Root, Item };
