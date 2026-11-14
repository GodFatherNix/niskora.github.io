import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import Magnetic from "./Magnetic";
import { scrollToId } from "../lib/scroll";

const links = [
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "lab", label: "Motion Lab" },
  { id: "process", label: "Process" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={"flex items-center gap-2.5 " + className}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 animate-spin-slow" fill="none">
        <path d="M16 1 L19 13 L31 16 L19 19 L16 31 L13 19 L1 16 L13 13 Z" fill="#c8ff2e" />
        <circle cx="16" cy="16" r="3" fill="#07070a" />
      </svg>
      <span className="font-display text-xl font-extrabold tracking-[0.12em]">NISKORA</span>
    </span>
  );
}

export default function Nav({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 200 && !open);
    setScrolled(y > 40);
  });

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), open ? 450 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={ready ? { y: hidden ? -100 : 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[80] px-4 pt-4 md:px-8"
      >
        <nav
          className={
            "mx-auto flex max-w-[1500px] items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 md:px-7 " +
            (scrolled || open
              ? "border-white/10 bg-ink/60 backdrop-blur-xl"
              : "border-transparent bg-transparent")
          }
        >
          <button onClick={() => go("top")} aria-label="NISKORA home" data-cursor="">
            <Logo />
          </button>

          <ul className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="group relative overflow-hidden font-mono text-[12px] uppercase tracking-[0.2em] text-bone/70 transition-colors hover:text-acid"
                >
                  <span className="block transition-transform duration-500 group-hover:-translate-y-full">{l.label}</span>
                  <span className="absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                    {l.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <Magnetic strength={0.25}>
                <button
                  onClick={() => go("contact")}
                  className="rounded-full bg-acid px-5 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.15em] text-ink transition-transform hover:scale-105"
                >
                  Start a project
                </button>
              </Magnetic>
            </div>
            <button
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              <span className={"h-px w-6 bg-bone transition-transform " + (open ? "translate-y-[3.5px] rotate-45" : "")} />
              <span className={"h-px w-6 bg-bone transition-transform " + (open ? "-translate-y-[3.5px] -rotate-45" : "")} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col justify-center bg-ink px-8"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            {[...links, { id: "contact", label: "Contact" }].map((l, i) => (
              <motion.button
                key={l.id}
                onClick={() => go(l.id)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className="py-3 text-left font-display text-5xl font-extrabold uppercase tracking-tight"
              >
                <span className="mr-4 font-mono text-xs text-acid">0{i + 1}</span>
                {l.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
