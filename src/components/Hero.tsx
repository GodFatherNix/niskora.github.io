import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ShaderBackground from "./ShaderBackground";
import Magnetic from "./Magnetic";
import { MaskLine, WordReveal } from "./Reveal";
import { scrollToId } from "../lib/scroll";

function Badge() {
  const text = "SCROLL TO EXPLORE • SCROLL TO EXPLORE • ";
  return (
    <button
      onClick={() => scrollToId("services")}
      aria-label="Scroll down"
      className="group relative hidden h-32 w-32 items-center justify-center md:flex"
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow">
        <defs>
          <path id="circ" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
        </defs>
        <text className="fill-bone/70 font-mono text-[9.5px] uppercase tracking-[0.28em]">
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-acid text-ink transition-transform duration-500 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 4v16m0 0l-6-6m6 6l6-6" />
        </svg>
      </span>
    </button>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <ShaderBackground />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col justify-end px-5 pb-10 pt-32 md:px-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bone/70"
        >
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-ink/40 px-3 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-acid" /> Booking Q3 projects
          </span>
          <span>Tech Consulting</span>
          <span className="text-acid">×</span>
          <span>Web Design Studio</span>
        </motion.div>

        <h1 className="font-display text-[clamp(2.7rem,10.4vw,11rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]">
          <MaskLine animateOn={ready} delay={0.1}>We make tech</MaskLine>
          <MaskLine animateOn={ready} delay={0.2}>
            <span className="font-serif font-normal normal-case italic tracking-[-0.02em] text-acid glow-acid">
              impossible
            </span>{" "}
            <span className="text-outline">to</span>
          </MaskLine>
          <MaskLine animateOn={ready} delay={0.3}>ignore.</MaskLine>
        </h1>

        <div className="mt-10 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-xl">
            <WordReveal
              animateOn={ready}
              delay={0.7}
              className="text-lg leading-relaxed text-bone/75 md:text-xl"
              text="NISKORA is a consultancy for technology companies — and a design studio obsessed with motion. We sharpen your strategy, then ship the interface that proves it."
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <button
                  onClick={() => scrollToId("contact")}
                  className="group flex items-center gap-3 rounded-full bg-acid py-4 pl-7 pr-5 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-ink"
                >
                  Start a project
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-acid transition-transform duration-500 group-hover:rotate-45">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </span>
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollToId("work")}
                  className="rounded-full border border-white/25 bg-ink/30 px-7 py-4 font-mono text-[12px] uppercase tracking-[0.16em] backdrop-blur transition-colors hover:border-acid hover:text-acid"
                >
                  See our work
                </button>
              </Magnetic>
            </motion.div>
          </div>
          <Badge />
        </div>
      </motion.div>
    </section>
  );
}
