"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2, Search } from "lucide-react";
import {
  motion,
  frame,
  cancelFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import styles from "./collector-disk.module.css";

type SceneVariant = "collection" | "swap" | "listing";
type Box = Pick<DOMRect, "left" | "top" | "width" | "height"> & {
  rotation?: number;
};
export type JourneyRange = { start: number; end: number };

/** Blend between sections; at either edge the result exactly matches its anchor. */
export function journeySegment(
  scroll: number,
  ranges: JourneyRange[],
  viewportHeight: number,
) {
  if (!ranges.length) return { from: 0, to: 0, progress: 0 };
  const firstStart = ranges[0].start;
  if (scroll <= firstStart - viewportHeight) return { from: 0, to: 0, progress: 0 };
  if (scroll < firstStart)
    return {
      from: 0,
      to: 1,
      progress: Math.max(
        0,
        Math.min(
          1,
          (scroll - (firstStart - viewportHeight)) /
            Math.max(1, viewportHeight),
        ),
      ),
    };
  for (let i = 0; i < ranges.length; i++) {
    if (scroll <= ranges[i].end) return { from: i + 1, to: i + 1, progress: 0 };
    const next = ranges[i + 1];
    if (next && scroll < next.start)
      return {
        from: i + 1,
        to: i + 2,
        progress: Math.max(
          0,
          Math.min(
            1,
            (scroll - ranges[i].end) / Math.max(1, next.start - ranges[i].end),
          ),
        ),
      };
  }
  return { from: ranges.length, to: ranges.length, progress: 0 };
}

export function journeyPosition(
  from: Box,
  to: Box,
  root: Box,
  progress: number,
) {
  const mix = (a: number, b: number) => a + (b - a) * progress;
  return {
    x: mix(from.left, to.left) - root.left,
    y: mix(from.top, to.top) - root.top,
    width: mix(from.width, to.width),
    height: mix(from.height, to.height),
    rotation: mix(from.rotation ?? 0, to.rotation ?? 0),
  };
}

function measureCard(anchor: HTMLElement): Box {
  const rect = anchor.getBoundingClientRect();
  const width = anchor.offsetWidth;
  const height = anchor.offsetHeight;
  const transform = getComputedStyle(anchor.parentElement!).transform;
  const matrix = transform === "none" ? null : new DOMMatrixReadOnly(transform);
  const rotation = matrix
    ? (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI
    : 0;
  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
    rotation,
  };
}

export function FeaturedCard({ anchor }: { anchor?: number }) {
  return (
    <span
      className={styles.featuredCard}
      data-featured-anchor={anchor}
    >
      <span className={styles.featuredSpark} />
    </span>
  );
}

function SupportingCard({ shape }: { shape: "circle" | "diamond" }) {
  return (
    <span className={`${styles.supportCard} ${styles[shape]}`}>
      <span />
    </span>
  );
}

export function CollectorFeature({
  variant,
  id,
  title,
  description,
  dark,
}: {
  variant: SceneVariant;
  id: string;
  title: string;
  description: string;
  dark: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useEffect(() => {
    if (reduced !== false) {
      setReady(false);
      return;
    }
    const update = () =>
      setReady(
        !!stageRef.current &&
          stageRef.current.scrollHeight <= window.innerHeight,
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduced]);
  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${styles.chapter} ${dark ? styles.dark : ""}`}
      aria-labelledby={`${id}-heading`}
      data-story-motion={ready ? "true" : undefined}
    >
      <div ref={stageRef} className={styles.chapterInner}>
        <div className={styles.chapterCopy}>
          <p className={styles.chapterStatus}>Coming soon</p>
          <h2 id={`${id}-heading`}>{title}</h2>
          <p>{description}</p>
        </div>
        <CollectorScene
          variant={variant}
          progress={scrollYProgress}
          animate={ready}
        />
      </div>
    </section>
  );
}

export function CollectorScene({
  variant,
  progress,
  animate,
}: {
  variant: SceneVariant;
  progress: MotionValue<number>;
  animate: boolean;
}) {
  const cardY = useTransform(progress, [0, 0.36], ["-45%", "0%"]);
  const cardX = useTransform(progress, [0, 0.36], ["-25%", "0%"]);
  const cardRotate = useTransform(progress, [0, 0.36], [-12, 0]);
  const updated = useTransform(progress, [0.36, 0.52], [0, 1]);
  const query = useTransform(
    progress,
    [0.04, 0.28],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const results = useTransform(progress, [0.22, 0.42], [0, 1]);
  const resultY = useTransform(progress, [0.22, 0.42], [20, 0]);
  const swapFeatured = useTransform(progress, [0.5, 0.85], ["0%", "100%"]);
  const swapOther = useTransform(progress, [0.5, 0.85], ["0%", "-100%"]);
  const listingY = useTransform(progress, [0, 0.25], [-40, 0]);
  const listingRotate = useTransform(progress, [0, 0.25], [-8, 0]);
  const pointerX = useTransform(progress, [0.23, 0.46], [40, 0]);
  const pointerY = useTransform(progress, [0.23, 0.46], [35, 0]);
  const pointerOpacity = useTransform(progress, [0.23, 0.4], [0, 1]);
  const purchaseScale = useTransform(
    progress,
    [0.46, 0.55, 0.64],
    [1, 0.94, 1],
  );
  const paymentX = useTransform(progress, [0.63, 0.88], [-50, 0]);
  const paymentOpacity = useTransform(progress, [0.63, 0.88], [0, 1]);
  return (
    <div className={`${styles.scene} ${styles[variant]}`} data-scene={variant}>
      <p className={styles.previewLabel}>Illustrative preview</p>
      <div className={styles.storyStage} aria-hidden="true">
        {variant === "collection" && (
          <div className={styles.collectionStory}>
            <div className={styles.storyHeading}>
              <span>My collection</span>
              <motion.span
                style={animate ? { opacity: updated } : undefined}
                className={styles.updated}
              >
                Collection updated
              </motion.span>
            </div>
            <div className={styles.collectionGrid}>
              <SupportingCard shape="circle" />
              <SupportingCard shape="diamond" />
              <SupportingCard shape="circle" />
              <SupportingCard shape="diamond" />
              <div className={styles.missingSlot}>
                <motion.div
                  style={
                    animate
                      ? { y: cardY, x: cardX, rotate: cardRotate }
                      : undefined
                  }
                  className={styles.storyFeatured}
                >
                  <FeaturedCard anchor={1} />
                </motion.div>
              </div>
              <SupportingCard shape="diamond" />
            </div>
          </div>
        )}
        {variant === "swap" && (
          <div className={styles.swapStory}>
            <div className={styles.searchVisual}>
              <Search size={20} />
              <motion.span style={animate ? { clipPath: query } : undefined}>
                Find a missing card
              </motion.span>
            </div>
            <div className={styles.swapCards}>
              <motion.div
                style={animate ? { opacity: results, y: resultY } : undefined}
              >
                <SupportingCard shape="circle" />
              </motion.div>
              <motion.div
                style={animate ? { x: swapFeatured } : undefined}
                className={styles.storyFeatured}
              >
                <FeaturedCard anchor={2} />
              </motion.div>
              <motion.div
                style={animate ? { x: swapOther, opacity: results } : undefined}
              >
                <SupportingCard shape="diamond" />
              </motion.div>
              <motion.div
                style={animate ? { opacity: results, y: resultY } : undefined}
              >
                <SupportingCard shape="circle" />
              </motion.div>
            </div>
            <p className={styles.storyHint}>Find a match · Exchange cards</p>
          </div>
        )}
        {variant === "listing" && (
          <div className={styles.marketStory}>
            <motion.div
              style={
                animate ? { y: listingY, rotate: listingRotate } : undefined
              }
              className={styles.marketCard}
            >
              <FeaturedCard anchor={3} />
            </motion.div>
            <div className={styles.marketDetails}>
              <strong>Listing preview</strong>
              <span />
              <span />
              <motion.div
                className={styles.purchaseVisual}
                style={animate ? { scale: purchaseScale } : undefined}
              >
                Buy{" "}
                <motion.span
                  className={styles.pointer}
                  style={
                    animate
                      ? { x: pointerX, y: pointerY, opacity: pointerOpacity }
                      : undefined
                  }
                >
                  <MousePointer2 size={24} />
                </motion.span>
              </motion.div>
            </div>
            <div className={styles.walletVisual}>
              <span className={styles.walletIcon} />
              <motion.span
                style={
                  animate ? { x: paymentX, opacity: paymentOpacity } : undefined
                }
                className={styles.payment}
              >
                Payment received
              </motion.span>
            </div>
          </div>
        )}
      </div>
      <p className={styles.storyAccessible}>
        {variant === "collection"
          ? "A missing card joins a collection, and the collection is updated."
          : variant === "swap"
            ? "A collector searches for a missing card, sees matches, and exchanges cards."
            : "A buyer purchases a listed card and a payment reaches the seller’s wallet."}{" "}
        This is a concept preview.
      </p>
    </div>
  );
}

type Handoff = { from: Box; to: Box; start: number; end: number; visible: boolean };
const emptyHandoff: Handoff = { from: { left: 0, top: 0, width: 0, height: 0 }, to: { left: 0, top: 0, width: 0, height: 0 }, start: 0, end: 1, visible: false };

/** Scene cards remain in control while pinned; this card only bridges sections. */
export function CardJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const handoff = useMotionValue<Handoff>(emptyHandoff);
  const position = useTransform(() => {
    const route = handoff.get();
    const progress = Math.max(0, Math.min(1, (scrollY.get() - route.start) / Math.max(1, route.end - route.start)));
    return journeyPosition(route.from, route.to, { left: 0, top: 0, width: 0, height: 0 }, progress);
  });
  const x = useTransform(() => position.get().x);
  const y = useTransform(() => position.get().y);
  const width = useTransform(() => position.get().width);
  const height = useTransform(() => position.get().height);
  const rotate = useTransform(() => position.get().rotation);
  const opacity = useTransform(() => handoff.get().visible ? 1 : 0);
  const onScrollRef = useRef<(scroll: number) => void>(() => {});
  useMotionValueEvent(scrollY, "change", value => onScrollRef.current(value));
  useEffect(() => {
    const root = ref.current?.closest<HTMLElement>("[data-journey-root]");
    if (!root || reduced !== false) return;
    const anchors = Array.from(root.querySelectorAll<HTMLElement>("[data-featured-anchor]"));
    const sections = anchors.slice(1).map(anchor => anchor.closest<HTMLElement>("section"));
    if (anchors.length !== 4 || sections.some(section => !section)) return;
    let ranges: JourneyRange[] = [];
    let viewport = window.innerHeight;
    let pair = "";
    let disposed = false;
    let needsMeasure = true;
    const clear = () => {
      pair = "";
      root.removeAttribute("data-journey-pair");
      handoff.set(emptyHandoff);
    };
    const update = () => {
      if (disposed) return;
      const scroll = window.scrollY;
      if (needsMeasure) {
        viewport = window.innerHeight;
        ranges = sections.map(section => {
          const element = section!;
          const rect = element.getBoundingClientRect();
          const top = rect.top + scroll;
          if (element.dataset.storyMotion === "true") return { start: top, end: Math.max(top, top + rect.height - viewport) };
          const center = top + rect.height / 2 - viewport / 2;
          return { start: center, end: center };
        });
      }
      const segment = journeySegment(scroll, ranges, viewport);
      if (segment.from === segment.to) { needsMeasure = false; clear(); return; }
      const nextPair = `${segment.from} ${segment.to}`;
      if (nextPair === pair && !needsMeasure) return;
      const rootRect = root.getBoundingClientRect();
      const from = measureCard(anchors[segment.from]);
      const to = measureCard(anchors[segment.to]);
      if (!from.width || !from.height || !to.width || !to.height) { clear(); return; }
      const local = (box: Box): Box => ({ ...box, left: box.left - rootRect.left, top: box.top - rootRect.top });
      const start = segment.from === 0 ? ranges[0].start - viewport : ranges[segment.from - 1].end;
      const end = ranges[segment.to - 1].start;
      handoff.set({ from: local(from), to: local(to), start, end, visible: true });
      pair = nextPair;
      needsMeasure = false;
      root.setAttribute("data-journey-pair", pair);
    };
    const schedule = () => frame.postRender(update);
    const invalidate = () => { needsMeasure = true; schedule(); };
    onScrollRef.current = scroll => {
      const segment = journeySegment(scroll, ranges, viewport);
      const nextPair = segment.from === segment.to ? "" : `${segment.from} ${segment.to}`;
      if (nextPair !== pair || needsMeasure) schedule();
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(invalidate);
    observer?.observe(root);
    sections.forEach(section => observer?.observe(section!));
    const mutations = new MutationObserver(invalidate);
    sections.forEach(section => mutations.observe(section!, { attributes: true, attributeFilter: ["data-story-motion"] }));
    window.addEventListener("resize", invalidate);
    window.visualViewport?.addEventListener("resize", invalidate);
    document.fonts?.ready.then(() => { if (!disposed) invalidate(); });
    invalidate();
    return () => {
      disposed = true;
      cancelFrame(update);
      observer?.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", invalidate);
      window.visualViewport?.removeEventListener("resize", invalidate);
      onScrollRef.current = () => {};
      clear();
    };
  }, [reduced, handoff]);
  return <motion.div ref={ref} aria-hidden="true" className={styles.journeyCard} style={{ x, y, width, height, rotate, opacity }}><FeaturedCard /></motion.div>;
}
