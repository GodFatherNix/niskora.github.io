import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/** A single line of display type that rises out of a mask. */
export function MaskLine({
  children,
  delay = 0,
  className = "",
  animateOn,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** If provided, drives the animation instead of scroll-into-view. */
  animateOn?: boolean;
}) {
  const motionProps =
    animateOn === undefined
      ? { initial: { y: "115%", rotate: 4 }, whileInView: { y: 0, rotate: 0 }, viewport: { once: true, margin: "-10% 0px" } }
      : { initial: { y: "115%", rotate: 4 }, animate: animateOn ? { y: 0, rotate: 0 } : { y: "115%", rotate: 4 } };
  return (
    <span className={"block overflow-hidden pb-[0.12em] -mb-[0.12em] " + className}>
      <motion.span
        className="block origin-bottom-left will-change-transform"
        {...motionProps}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Word-by-word fade/rise for paragraphs. */
export function WordReveal({
  text,
  className = "",
  delay = 0,
  animateOn,
}: {
  text: string;
  className?: string;
  delay?: number;
  animateOn?: boolean;
}) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((w, i) => {
        const props =
          animateOn === undefined
            ? { initial: { y: "100%", opacity: 0 }, whileInView: { y: 0, opacity: 1 }, viewport: { once: true, margin: "-8% 0px" } }
            : { initial: { y: "100%", opacity: 0 }, animate: animateOn ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 } };
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              {...props}
              transition={{ duration: 0.9, ease, delay: delay + i * 0.018 }}
            >
              {w}&nbsp;
            </motion.span>
          </span>
        );
      })}
    </p>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={"flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-acid " + className}>
      <span className="h-px w-8 bg-acid" />
      {children}
    </div>
  );
}
