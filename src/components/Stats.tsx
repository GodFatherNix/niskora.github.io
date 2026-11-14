import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  );
}

const stats = [
  { n: 140, s: "+", l: "Projects shipped" },
  { n: 62, s: "", l: "Tech companies advised" },
  { n: 18, s: "", l: "Industry awards" },
  { n: 96, s: "%", l: "Clients who return" },
];

export default function Stats() {
  return (
    <section className="relative border-y border-white/10 bg-ink px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-y-14 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="border-l border-white/15 pl-5 md:pl-8"
          >
            <div className="font-display text-[clamp(3.2rem,8vw,8rem)] font-extrabold leading-none tracking-tight">
              <Count to={s.n} suffix={s.s} />
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-acid">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
