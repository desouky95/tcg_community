"use client";

import * as Primitive from "@radix-ui/react-alert-dialog";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import { overlayClass } from "../shared";

const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content> & { size?: "sm" | "md" | "lg" }>(
  ({ className, children, size = "sm", ...props }, ref) => (
    <Primitive.Portal>
      <Primitive.Overlay className={overlayClass} />
      <Primitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-[51] max-h-[calc(100vh-2rem)] w-[min(calc(100vw-2rem),30rem)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg border border-wax-line bg-wax-card p-5 text-wax-ink shadow-pop data-[size=lg]:w-[min(calc(100vw-2rem),42rem)] data-[size=md]:w-[min(calc(100vw-2rem),34rem)]",
          className,
        )}
        data-size={size}
        {...props}
      >
        {children}
      </Primitive.Content>
    </Primitive.Portal>
  ),
);
Content.displayName = "AlertDialogContent";

const Title = forwardRef<ElementRef<typeof Primitive.Title>, ComponentPropsWithoutRef<typeof Primitive.Title>>(({ className, ...props }, ref) => (
  <Primitive.Title ref={ref} className={cn("m-0 font-display text-2xl leading-none", className)} {...props} />
));
Title.displayName = "AlertDialogTitle";

const Description = forwardRef<ElementRef<typeof Primitive.Description>, ComponentPropsWithoutRef<typeof Primitive.Description>>(({ className, ...props }, ref) => (
  <Primitive.Description ref={ref} className={cn("mt-2 text-sm text-wax-muted", className)} {...props} />
));
Description.displayName = "AlertDialogDescription";

export const AlertDialog = { Root: Primitive.Root, Trigger: Primitive.Trigger, Content, Title, Description, Action: Primitive.Action, Cancel: Primitive.Cancel };
