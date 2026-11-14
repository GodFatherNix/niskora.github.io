import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Eyebrow, MaskLine } from "./Reveal";

const steps = [
  { t: "Discover", d: "We embed with your team, audit product, market and tech, and find the one thing that matters most.", k: "Week 1–2" },
  { t: "Define", d: "A sharp strategy and a creative direction — positioning, narrative and a motion language to match.", k: "Week 3–4" },
  { t: "Design & Build", d: "Prototype, art-direct and engineer in the open. Weekly demos, no black boxes, no surprises.", k: "Week 5–10" },
  { t: "Launch & Scale", d: "Ship, measure, iterate. We stay on to tune the funnel, the story and the frame rate.", k: "Ongoing" },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <section id="process" className="relative bg-ink px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto grid max-w-[1500px] gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <Eyebrow>How we work</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,6vw,6.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
              <MaskLine>From</MaskLine>
              <MaskLine>
                <span className="font-serif font-normal normal-case italic text-acid">brief</span> to
              </MaskLine>
              <MaskLine>blast-off.</MaskLine>
            </h2>
          </div>
        </div>

        <div ref={ref} className="relative md:col-span-6 md:col-start-7">
          <div className="absolute bottom-0 left-[15px] top-2 w-px bg-white/10" />
          <motion.div
            className="absolute left-[15px] top-2 bottom-0 w-px origin-top bg-acid shadow-[0_0_14px_2px_rgba(200,255,46,0.7)]"
            style={{ scaleY }}
          />
          <div className="space-y-24 md:space-y-40">
            {steps.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-14"
              >
                <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border border-acid bg-ink font-mono text-[11px] text-acid">
                  {i + 1}
                </span>
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone/50">{s.k}</div>
                <h3 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight md:text-6xl">{s.t}</h3>
                <p className="mt-4 max-w-md text-lg leading-relaxed text-bone/65">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
