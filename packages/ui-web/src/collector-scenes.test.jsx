import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardJourney, CollectorFeature, FeaturedCard, journeyPosition, journeySegment } from "../../../apps/public-web/app/(shared-layout)/collector-disk/collector-scenes";
const state = vi.hoisted(() => ({ transforms: [] }));
vi.mock("motion/react", async () => {
  const React = await import("react");
  const element = tag => React.forwardRef(({ children, ...props }, ref) => React.createElement(tag, { ref, ...props }, children));
  return { motion: { div: element("div"), span: element("span") }, useReducedMotion: () => true,
    useScroll: () => ({ scrollY: { get: () => 0 }, scrollYProgress: 0 }), useMotionValue: value => ({ get: () => value, set: vi.fn() }), useMotionValueEvent: () => {},
    useTransform: (value, input, output) => { if (typeof value === "function") return { get: value }; state.transforms.push({ input, output }); return output.at(-1); } };
});
beforeEach(() => { state.transforms = []; });
describe("collector card stories", () => {
  it("joins every pinned range continuously in either direction", () => {
    const ranges = [{ start: 1000, end: 2000 }, { start: 2600, end: 4000 }, { start: 4600, end: 6000 }];
    expect(journeySegment(999.99, ranges, 800).progress).toBeCloseTo(1);
    expect(journeySegment(1000, ranges, 800)).toEqual({ from: 1, to: 1, progress: 0 });
    expect(journeySegment(2000.01, ranges, 800).progress).toBeCloseTo(0);
    expect(journeySegment(2599.99, ranges, 800).progress).toBeCloseTo(1);
    expect(journeySegment(2600, ranges, 800)).toEqual({ from: 2, to: 2, progress: 0 });
    expect(journeySegment(4000.01, ranges, 800).progress).toBeCloseTo(0);
    expect(journeySegment(4599.99, ranges, 800).progress).toBeCloseTo(1);
    expect(journeySegment(4600, ranges, 800)).toEqual({ from: 3, to: 3, progress: 0 });
  });
  it("recalculates positions using current geometry and viewport sizes", () => {
    const from = { left: 100, top: 200, width: 100, height: 140 };
    const to = { left: 300, top: 500, width: 200, height: 280 };
    const root = { left: 10, top: 20, width: 1000, height: 4000 };
    expect(journeyPosition({ ...from, rotation: -12 }, { ...to, rotation: 4 }, root, 0.5)).toEqual({ x: 190, y: 330, width: 150, height: 210, rotation: -4 });
    expect(journeySegment(800, [{ start: 1000, end: 2000 }], 400).progress).toBe(0.5);
    expect(journeySegment(800, [{ start: 1000, end: 2000 }], 800).progress).toBe(0.75);
  });
  it("uses real scene cards within pinned ranges and only bridges between them", () => {
    const ranges = [{ start: 1000, end: 2000 }, { start: 2600, end: 4000 }, { start: 4600, end: 6000 }];
    expect(journeySegment(0, ranges, 800)).toEqual({ from: 0, to: 0, progress: 0 });
    expect(journeySegment(1500, ranges, 800)).toEqual({ from: 1, to: 1, progress: 0 });
    expect(journeySegment(2300, ranges, 800)).toEqual({ from: 1, to: 2, progress: 0.5 });
    expect(journeySegment(3300, ranges, 800)).toEqual({ from: 2, to: 2, progress: 0 });
    expect(journeySegment(4300, ranges, 800)).toEqual({ from: 2, to: 3, progress: 0.5 });
    expect(journeySegment(5100, ranges, 800)).toEqual({ from: 3, to: 3, progress: 0 });
  });
  it("shows complete scenes and descriptions without motion or simulated controls", () => {
    const chapters = [["collection", "Collection Tracking"], ["swap", "Swapping"], ["listing", "Marketplace Listing"]];
    const { container } = render(<main data-journey-root><FeaturedCard anchor={0} />{chapters.map(([variant, title]) => <CollectorFeature key={variant} id={variant} title={title} description="Coming soon" variant={variant} dark={false} />)}<CardJourney /></main>);
    expect(container.querySelectorAll("[data-featured-anchor]")).toHaveLength(4);
    expect(container.querySelectorAll("[data-scene]")).toHaveLength(3);
    expect(screen.getAllByText("Illustrative preview")).toHaveLength(3);
    expect(screen.getByText(/payment reaches the seller’s wallet/i)).toBeInTheDocument();
    expect(container.querySelectorAll("button, input, [data-story-motion]")).toHaveLength(0);
    expect(state.transforms.some(({ output }) => output.includes("inset(0 100% 0 0)"))).toBe(true);
    expect(state.transforms.some(({ output }) => output.includes("-100%"))).toBe(true);
    expect(state.transforms.some(({ output }) => output.includes(-50))).toBe(true);
  });
});
