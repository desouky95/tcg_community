"use client";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchRail } from "@tcg/ui-web";
import { useState } from "react";

export function Searchbar() {
  const params = useSearchParams();
  const router = useRouter();

  const { scrollY } = useScroll();
  const [trigger, setTrigger] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    setTrigger(v > 200);
  });
  return (
    <>
      <SearchRail
        key={params.get("q") ?? ""}
        defaultValue={params.get("q") ?? ""}
        inputId="catalogue-search"
        onSearch={(value) => {
          const next = new URLSearchParams(params.toString());
          if (value.trim()) next.set("q", value.trim());
          else next.delete("q");
          router.push(`/checklists${next.size ? `?${next}` : ""}`, {
            scroll: false,
          });
        }}
      />
    </>
  );
}
