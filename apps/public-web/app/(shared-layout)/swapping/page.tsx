import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button, Kicker } from "@tcg/ui-web";

export const metadata: Metadata = {
  title: "Swapping coming soon | Next Pull",
  description:
    "Next Pull swapping is being prepared.",
};

export default function SwappingPage() {
  return (
    <section className="mx-auto grid min-h-[65dvh] max-w-360 place-items-center px-gutter py-section text-center"><div className="max-w-2xl"><Kicker>COMING SOON</Kicker><h1 className="mt-4">Swapping is on the way.</h1><p className="mt-5 text-lg leading-relaxed text-wax-muted">We are building a calmer, safer way to compare checklists and make thoughtful swaps. Your collection tools are ready now.</p><Button asChild className="mt-8"><a href={process.env.NEXT_PUBLIC_APP_URL ?? '/signup'}>Open your checklists <ArrowRight aria-hidden="true" /></a></Button></div></section>
  );
}
