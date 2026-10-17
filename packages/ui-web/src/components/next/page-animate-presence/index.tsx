"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { FrozenRoute } from "../frozen-route";
import { Cards } from "../../../components/patterns/cards-transition";
import {
  useEffect,
  useState,
  type ComponentProps,
  type PropsWithChildren,
} from "react";

type TransitionPhase = "revealing" | "ready";

const routeVariants: Variants = {
  idle: {},
  routeExit: {},
};
const routeNewVariants: Variants = {
  above: {
    transition: { when: "afterChildren" },
  },
  below: {
    transition: { when: "afterChildren" },
  },
  covered: {
    transition: { when: "afterChildren" },
  },
};

type RouteTransitionFrameProps = {
  children: React.ReactNode;
  skipInitialReveal: boolean;
};
const RouteTransitionFrame = ({
  children,
  skipInitialReveal,
}: RouteTransitionFrameProps) => {
  // Freeze this value for the lifetime of this pathname.
  const [startsReady] = useState(skipInitialReveal);
  const [phase, setPhase] = useState<TransitionPhase>(
    startsReady ? "ready" : "revealing",
  );

  const activeVariant = phase === "ready" ? "above" : "below";

  return (
    <motion.div
      variants={routeVariants}
      initial={startsReady ? false : "covered"}
      animate={activeVariant}
      exit="covered"
      onAnimationComplete={(definition) => {
        // The destination has now been revealed below the exiting rows.
        // Reset the rows above instantly so the next navigation enters
        // from the top.
        if (definition === "below") {
          setPhase("ready");
        }
      }}
    >
      <FrozenRoute>{children}</FrozenRoute>
      <Cards />
    </motion.div>
  );
};

type PageAnimatePresenceProps = Pick<ComponentProps<typeof Cards>, "type"> & {};
const PageAnimatePresence = ({
  children,
  type = "sticker-packs",
}: PropsWithChildren<PageAnimatePresenceProps>) => {
  const pathname = usePathname();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  return (
    <AnimatePresence mode="wait" initial={false}>
      {/**
       * We use `motion.div` as the first child of `<AnimatePresence />` Component so we can specify page animations at the page level.
       * The `motion.div` Component gets re-evaluated when the `key` prop updates, triggering the animation's lifecycles.
       * During this re-evaluation, the `<FrozenRoute />` Component also gets updated with the new route components.
       */}
      <RouteTransitionFrame key={pathname} skipInitialReveal={!hasMounted}>
        {children}
      </RouteTransitionFrame>
    </AnimatePresence>
  );
};

export { PageAnimatePresence };
