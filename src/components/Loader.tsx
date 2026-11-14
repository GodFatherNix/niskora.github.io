import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const word = "NISKORA".split("");

export default function Loader({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 2.4);
      setN(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setShow(false), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink p-6 md:p-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-bone/50">
            <span>Niskora ® Studio</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-acid" /> Initialising
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex overflow-hidden font-display text-[clamp(2.6rem,12vw,10rem)] font-extrabold leading-none tracking-tight">
              {word.map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className={i % 2 ? "text-acid" : ""}
                >
                  {c}
                </motion.span>
              ))}
            </div>
            <div className="mt-8 h-px w-[min(420px,70vw)] overflow-hidden bg-bone/10">
              <div className="h-full bg-acid" style={{ width: n + "%" }} />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone/50">
              Consulting × Web × Motion
            </span>
            <span className="font-display text-6xl font-bold tabular-nums leading-none md:text-8xl">
              {String(n).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
