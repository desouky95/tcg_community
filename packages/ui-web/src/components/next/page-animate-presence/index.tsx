"use client";

import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useIsomorphicLayoutEffect,
  usePresence,
  type Variants,
} from "motion/react";
import { FrozenRoute } from "../frozen-route";
import { Cards } from "../../../components/patterns/cards-transition";
import { useCallback, useEffect, useRef, type PropsWithChildren } from "react";
import { TCG } from "../../patterns/tcg-transition";

type PageTransitionData = {
  type: PageTransitionVariant;
  tcgImages?: string[];
};

type RouteTransitionFrameProps = {
  children: React.ReactNode;
  onCover: () => Promise<void>;
  onMounted: () => void;
};

type ArtworkControls = ReturnType<typeof useAnimationControls>;

const artworkHostVariants: Variants = {
  above: {
    transition: {
      when: "afterChildren",
    },
  },
  covered: {
    transition: {
      when: "afterChildren",
    },
  },
  below: {
    transition: {
      when: "afterChildren",
    },
  },
};

function DestinationArtwork({
  type,
  tcgImages,
  controls,
}: {
  type: PageTransitionVariant;
  tcgImages?: string[];
  controls: ArtworkControls;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-999"
      variants={artworkHostVariants}
      initial="above"
      animate={controls}
    >
      {type === "sticker-packs" && <Cards />}

      {type === "tcg-games" && tcgImages && tcgImages.length > 0 && (
        <TCG images={tcgImages} />
      )}
    </motion.div>
  );
}

const RouteTransitionFrame = ({
  children,
  onCover,
  onMounted,
}: RouteTransitionFrameProps) => {
  const [isPresent, safeToRemove] = usePresence();
  const coverStarted = useRef(false);

  useEffect(() => {
    onMounted();
  }, [onMounted]);

  useEffect(() => {
    if (isPresent || coverStarted.current || !safeToRemove) {
      return;
    }

    coverStarted.current = true;

    void onCover().then(() => {
      safeToRemove();
    });
  }, [isPresent, onCover, safeToRemove]);

  return <FrozenRoute>{children}</FrozenRoute>;
};

export type PageTransitionVariant = "sticker-packs" | "tcg-games";

type PageAnimatePresenceProps = PropsWithChildren<PageTransitionData>;

const PageAnimatePresence = ({
  children,
  type = "sticker-packs",
  tcgImages,
}: PropsWithChildren<PageAnimatePresenceProps>) => {
  const pathname = usePathname();

  const controls = useAnimationControls();

  const sequence = useRef(0);
  const pendingSequence = useRef<number | null>(null);

  const coverDestination = useCallback(async () => {
    const currentSequence = ++sequence.current;

    pendingSequence.current = currentSequence;

    controls.set("above");

    await controls.start("covered");
  }, [controls]);

  const revealDestination = useCallback(() => {
    const currentSequence = pendingSequence.current;
    if (currentSequence === null) {
      return;
    }
    pendingSequence.current = null;
    void controls.start("below").then(() => {
      if (sequence.current === currentSequence) {
        controls.set("above");
      }
    });
  }, [controls]);

  return (
    <>
      <DestinationArtwork
        type={type}
        tcgImages={tcgImages}
        controls={controls}
      />
      <AnimatePresence mode="wait" initial={false}>
        <RouteTransitionFrame
          key={pathname}
          onCover={coverDestination}
          onMounted={revealDestination}
        >
          {children}
        </RouteTransitionFrame>
      </AnimatePresence>
    </>
  );
};

export { PageAnimatePresence };
