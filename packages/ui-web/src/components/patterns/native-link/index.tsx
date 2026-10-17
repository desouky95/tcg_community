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

export const NextLink = ({
  href,
  children,
  ...props
}: ComponentProps<any>) => (
  <></>
  // <Link href={href} {...props}>
  //   {children}
  // </Link>
);
