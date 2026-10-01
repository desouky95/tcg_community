"use client";

import * as Primitive from "@radix-ui/react-dialog";
import type { ComponentProps, ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import { overlayClass } from "../shared";

const Content = forwardRef<ElementRef<typeof Primitive.Content>, ComponentPropsWithoutRef<typeof Primitive.Content> & { size?: "sm" | "md" | "lg"; placement?: "center" | "end" }>(
  ({ className, children, size = "md", placement = "center", ...props }, ref) => (
    <Primitive.Portal>
      <Primitive.Overlay className={overlayClass} />
      <Primitive.Content
        ref={ref}
        className={cn(
          "fixed z-[51] overflow-auto border border-wax-line bg-wax-card text-wax-ink shadow-pop",
          placement === "end"
            ? "inset-y-0 end-0 flex max-h-dvh w-[min(24rem,100vw)] flex-col"
            : "left-1/2 top-1/2 max-h-[calc(100dvh-2rem)] w-[min(calc(100vw-2rem),34rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg data-[size=lg]:w-[min(calc(100vw-2rem),48rem)] data-[size=sm]:w-[min(calc(100vw-2rem),26rem)]",
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
Content.displayName = "DialogContent";

const Header = ({ className, ...props }: ComponentProps<"div">) => <div className={cn("grid gap-2 p-5 pb-0", className)} {...props} />;
const Body = ({ className, ...props }: ComponentProps<"div">) => <div className={cn("p-5", className)} {...props} />;

const Title = forwardRef<ElementRef<typeof Primitive.Title>, ComponentPropsWithoutRef<typeof Primitive.Title>>(({ className, ...props }, ref) => (
  <Primitive.Title ref={ref} className={cn("m-0 font-display text-2xl leading-none", className)} {...props} />
));
Title.displayName = "DialogTitle";

const Description = forwardRef<ElementRef<typeof Primitive.Description>, ComponentPropsWithoutRef<typeof Primitive.Description>>(({ className, ...props }, ref) => (
  <Primitive.Description ref={ref} className={cn("m-0 text-wax-muted", className)} {...props} />
));
Description.displayName = "DialogDescription";

export const Dialog = { Root: Primitive.Root, Trigger: Primitive.Trigger, Close: Primitive.Close, Content, Header, Body, Title, Description };
