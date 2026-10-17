"use client";

import { useSearchParams } from "next/navigation";

export function getDefaultApiQuery() {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search);
}

export function useDefaultApiQuery() {
  return useSearchParams();
}
