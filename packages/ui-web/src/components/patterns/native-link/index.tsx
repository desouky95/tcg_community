import type { ComponentProps } from "react";

export const NativeLink = ({ href, children, ...props }: ComponentProps<"a">) => <a href={href} {...props}>{children}</a>;
