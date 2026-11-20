"use client";
import type { ComponentProps } from "react";
// import Link from "next/link";
export const NativeLink = ({
  href,
  children,
  ...props
}: ComponentProps<"a">) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export const NextLink = (_props: ComponentProps<"a">) => (
  <></>
  // <Link href={href} {...props}>
  //   {children}
  // </Link>
);
