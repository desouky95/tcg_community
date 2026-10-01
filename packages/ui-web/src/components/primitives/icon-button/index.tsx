"use client";

import { cn } from "../../../lib/cn";
import { Button, type ButtonProps } from "../button";

export type IconButtonProps = ButtonProps & { "aria-label": string };

export function IconButton({
  className,
  size = "sm",
  ...props
}: IconButtonProps) {
  return (
    <Button
      {...props}
      size={size}
      className={cn("aspect-square min-w-control-sm px-0 font-white", className)}
    />
  );
}
