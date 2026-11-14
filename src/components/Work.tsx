import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ProjectArt, { type ArtKind } from "./ProjectArt";
import { Eyebrow, MaskLine } from "./Reveal";
import { scrollToId } from "../lib/scroll";

const projects: { name: string; type: string; tags: string[]; year: string; art: ArtKind; blurb: string }[] = [
  { name: "Helix Labs", type: "Brand + Website", tags: ["Web design", "WebGL"], year: "2025", art: "rings", blurb: "A living, orbital identity for an AI infrastructure platform." },
  { name: "Orbital Pay", type: "Go-to-market", tags: ["Consulting", "Strategy"], year: "2025", art: "bars", blurb: "Repositioned a fintech API and tripled qualified pipeline in two quarters." },
  { name: "Vanta Cloud", type: "Product Website", tags: ["Web design", "Motion"], year: "2024", art: "blobs", blurb: "A fluid, shader-driven launch site for a next-gen cloud." },
  { name: "Kinetic OS", type: "Design System", tags: ["Systems", "Motion specs"], year: "2024", art: "waves", blurb: "A motion-first system powering 40+ product surfaces." },
  { name: "Northwind AI", type: "Series B Narrative", tags: ["Consulting", "Web"], year: "2024", art: "dots", blurb: "Investor story, brand and site — shipped in six weeks." },
];

export default function Work() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const counter = useTransform(scrollYProgress, (v) => String(Math.min(projects.length, Math.floor(v * projects.length) + 1)).padStart(2, "0"));

  return (
    <section id="work" ref={outer} style={{ height: dist + vh }} className="relative bg-ink-2">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[40rem] w-[40rem] rounded-full bg-volt/20 blur-[140px]" />

        <motion.div ref={track} style={{ x }} className="relative flex items-center gap-6 pl-5 pr-[10vw] will-change-transform md:gap-10 md:pl-10">
          {/* intro panel */}
          <div className="w-[82vw] shrink-0 md:w-[34vw]">
            <Eyebrow>Selected work</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.6rem,6.5vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
              <MaskLine>Proof,</MaskLine>
              <MaskLine>
                in <span className="font-serif font-normal normal-case italic text-acid">motion.</span>
              </MaskLine>
            </h2>
            <p className="mt-6 max-w-sm text-bone/65">
              A few recent engagements across strategy and design. Keep scrolling — the work moves sideways.
            </p>
            <div className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/60">
              Scroll <span className="h-px w-16 bg-acid" />
            </div>
          </div>

          {projects.map((p, i) => (
            <article
              key={p.name}
              data-cursor="View"
              className="group relative w-[82vw] shrink-0 md:w-[44vw]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
                <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                  <ProjectArt kind={p.art} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute left-5 top-5 flex gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/20 bg-ink/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="absolute inset-x-5 bottom-5 max-w-sm translate-y-4 text-sm text-bone opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.blurb}
                </p>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-acid">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight md:text-4xl">{p.name}</h3>
                </div>
                <span className="text-right font-mono text-[11px] uppercase tracking-widest text-bone/55">
                  {p.type} · {p.year}
                </span>
              </div>
            </article>
          ))}

          {/* end panel */}
          <div className="flex w-[70vw] shrink-0 flex-col items-start gap-6 md:w-[26vw]">
            <p className="font-serif text-5xl italic leading-none md:text-6xl">
              Yours <span className="text-acid">next?</span>
            </p>
            <button
              onClick={() => scrollToId("contact")}
              className="rounded-full border border-acid px-6 py-3 font-mono text-[12px] uppercase tracking-widest text-acid transition-colors hover:bg-acid hover:text-ink"
            >
              Let's talk →
            </button>
          </div>
        </motion.div>

        {/* progress */}
        <div className="absolute inset-x-5 bottom-8 flex items-center gap-5 md:inset-x-10">
          <motion.span className="font-mono text-xs tabular-nums text-acid">{counter}</motion.span>
          <div className="h-px flex-1 bg-white/15">
            <motion.div className="h-full bg-acid" style={{ width: bar }} />
          </div>
          <span className="font-mono text-xs tabular-nums text-bone/50">{String(projects.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
