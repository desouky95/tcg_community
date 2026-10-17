import { useSearchParams } from "react-router-dom";

export function getDefaultApiQuery() {
  if (typeof window === "undefined") return undefined;
  return new URLSearchParams(window.location.search);
}

export function useDefaultApiQuery() {
  const [searchParams] = useSearchParams();
  return searchParams;
}
