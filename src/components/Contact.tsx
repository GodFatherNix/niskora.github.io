import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Logo } from "./Nav";
import Magnetic from "./Magnetic";
import { Eyebrow, MaskLine } from "./Reveal";
import { scrollToId } from "../lib/scroll";

const interests = ["Strategy", "Web design", "Motion / VFX", "Design system", "Not sure yet"];

export default function Contact() {
  const [picked, setPicked] = useState<string[]>(["Web design"]);
  const [sent, setSent] = useState(false);
  const foot = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: foot, offset: ["start end", "end end"] });
  const clip = useTransform(scrollYProgress, [0.15, 0.95], ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);

  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-acid px-5 py-28 text-ink md:px-10 md:py-40">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-volt/30 blur-[120px]" />
        <div className="relative mx-auto grid max-w-[1500px] gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em]">
              <span className="h-px w-8 bg-ink" /> Contact
            </div>
            <h2 className="mt-6 font-display text-[clamp(3rem,9vw,10rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.04em]">
              <MaskLine>Let's build</MaskLine>
              <MaskLine>
                what's <span className="font-serif font-normal normal-case italic">next.</span>
              </MaskLine>
            </h2>
            <a
              href="mailto:hello@niskora.com"
              className="mt-10 inline-block border-b-2 border-ink pb-1 font-display text-2xl font-bold tracking-tight transition-opacity hover:opacity-60 md:text-4xl"
            >
              hello@niskora.com
            </a>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-3xl bg-ink p-6 text-bone md:p-9">
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[380px] flex-col items-center justify-center text-center"
                  >
                    <motion.svg viewBox="0 0 52 52" className="h-20 w-20 text-acid" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <motion.circle cx="26" cy="26" r="23" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
                      <motion.path d="M15 27l8 8 14-16" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6 }} />
                    </motion.svg>
                    <h3 className="mt-6 font-display text-3xl font-bold uppercase">Signal received.</h3>
                    <p className="mt-2 text-bone/60">We'll reply within one business day.</p>
                    <button onClick={() => setSent(false)} className="mt-6 font-mono text-[11px] uppercase tracking-widest text-acid underline">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSent(true);
                    }}
                    className="space-y-6"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-bone/50">Tell us about your project</div>
                    {[
                      { n: "name", p: "Your name", t: "text" },
                      { n: "email", p: "Work email", t: "email" },
                    ].map((f) => (
                      <input
                        key={f.n}
                        required
                        name={f.n}
                        type={f.t}
                        placeholder={f.p}
                        className="w-full border-b border-white/20 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-bone/35 focus:border-acid"
                      />
                    ))}
                    <textarea
                      name="msg"
                      rows={3}
                      placeholder="What are you building?"
                      className="w-full resize-none border-b border-white/20 bg-transparent py-3 text-lg outline-none transition-colors placeholder:text-bone/35 focus:border-acid"
                    />
                    <div className="flex flex-wrap gap-2">
                      {interests.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => toggle(t)}
                          className={
                            "rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-all " +
                            (picked.includes(t) ? "border-acid bg-acid text-ink" : "border-white/20 text-bone/70 hover:border-acid")
                          }
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      className="group flex w-full items-center justify-between rounded-full bg-acid px-7 py-4 font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-transform hover:scale-[1.02]"
                    >
                      Send message
                      <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <footer ref={foot} className="relative overflow-hidden bg-ink px-5 pb-8 pt-20 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <Logo />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/55">
                Consulting for tech companies. Web design with motion at its core.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:col-span-5 md:col-start-6">
              <ul className="space-y-3 font-mono text-[12px] uppercase tracking-[0.2em] text-bone/70">
                {["services", "work", "lab", "process"].map((id) => (
                  <li key={id}>
                    <button onClick={() => scrollToId(id)} className="transition-colors hover:text-acid">
                      {id === "lab" ? "Motion Lab" : id}
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="space-y-3 font-mono text-[12px] uppercase tracking-[0.2em] text-bone/70">
                {["LinkedIn", "Dribbble", "Instagram", "GitHub"].map((s) => (
                  <li key={s}>
                    <a href="#" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-acid">
                      {s} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex md:col-span-2 md:justify-end">
              <Magnetic>
                <button
                  onClick={() => scrollToId("top")}
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-acid hover:bg-acid hover:text-ink"
                  aria-label="Back to top"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 20V4m0 0l-6 6m6-6l6 6" />
                  </svg>
                </button>
              </Magnetic>
            </div>
          </div>

          <div className="relative mt-16 select-none">
            <div className="text-outline text-center font-display text-[clamp(3rem,20.5vw,24rem)] font-extrabold leading-[0.8] tracking-[-0.04em] text-bone/25">
              NISKORA
            </div>
            <motion.div
              style={{ clipPath: clip }}
              className="absolute inset-0 bg-gradient-to-t from-acid via-acid to-volt bg-clip-text text-center font-display text-[clamp(3rem,20.5vw,24rem)] font-extrabold leading-[0.8] tracking-[-0.04em] text-transparent"
              aria-hidden
            >
              NISKORA
            </motion.div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-bone/40 md:flex-row">
            <span>© {new Date().getFullYear()} Niskora Studio. All rights reserved.</span>
            <span className="flex items-center gap-2">
              <Eyebrow className="!tracking-[0.2em] !text-bone/40 [&>span]:hidden">Crafted with motion & obsession</Eyebrow>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
