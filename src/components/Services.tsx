import { motion } from "framer-motion";
import { Eyebrow, MaskLine, WordReveal } from "./Reveal";

const services = [
  {
    n: "01",
    title: "Product & GTM Strategy",
    kind: "Consulting",
    desc: "Positioning, pricing and launch playbooks that turn a clever product into a category leader.",
    tags: ["Positioning", "Pricing", "Launch"],
  },
  {
    n: "02",
    title: "Technical Advisory",
    kind: "Consulting",
    desc: "Architecture reviews, diligence and roadmap triage from operators who've shipped at scale.",
    tags: ["Architecture", "Due diligence", "Roadmap"],
  },
  {
    n: "03",
    title: "Growth & Narrative",
    kind: "Consulting",
    desc: "The story, the funnel and the metrics — aligned so investors, users and teams all hear one voice.",
    tags: ["Storytelling", "Funnels", "Fundraising"],
  },
  {
    n: "04",
    title: "Web Design & Build",
    kind: "Studio",
    desc: "Award-calibre marketing sites and product surfaces — designed in motion, built to be fast.",
    tags: ["React", "WebGL", "CMS"],
  },
  {
    n: "05",
    title: "Motion & Visual FX",
    kind: "Studio",
    desc: "Shaders, 3D, kinetic type and product films that make complex tech feel effortless.",
    tags: ["Shaders", "3D", "Product film"],
  },
  {
    n: "06",
    title: "Design Systems",
    kind: "Studio",
    desc: "Tokens, components and motion principles that let your team ship beautifully, at speed.",
    tags: ["Tokens", "Components", "Motion specs"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative bg-ink px-5 py-28 md:px-10 md:py-44">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Eyebrow>What we do</Eyebrow>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,6vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em]">
              <MaskLine>Two crafts,</MaskLine>
              <MaskLine>
                <span className="font-serif font-normal normal-case italic text-acid">one</span> obsession.
              </MaskLine>
            </h2>
          </div>
          <div className="flex items-end md:col-span-6 md:col-start-7">
            <WordReveal
              className="text-lg leading-relaxed text-bone/70 md:text-xl"
              text="We sit at the intersection of technology and taste. Our consultants sharpen how your company wins; our designers make it impossible to miss. Hire one side — or the full stack."
            />
          </div>
        </div>

        <div className="mt-20 border-t border-white/15">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="Explore"
              className="group relative overflow-hidden border-b border-white/15"
            >
              <div className="absolute inset-0 origin-bottom scale-y-0 bg-acid transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100" />
              <div className="relative grid items-center gap-4 px-1 py-8 transition-colors duration-500 group-hover:text-ink md:grid-cols-12 md:gap-8 md:px-6 md:py-10">
                <span className="font-mono text-xs tracking-widest text-acid transition-colors group-hover:text-ink md:col-span-1">
                  {s.n}
                </span>
                <h3 className="font-display text-3xl font-bold uppercase leading-none tracking-tight transition-transform duration-500 group-hover:translate-x-3 md:col-span-5 md:text-5xl">
                  {s.title}
                </h3>
                <div className="md:col-span-4">
                  <p className="text-[15px] leading-relaxed text-bone/65 transition-colors group-hover:text-ink/80">{s.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-current/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest opacity-70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between md:col-span-2 md:justify-end md:gap-6">
                  <span
                    className={
                      "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest " +
                      (s.kind === "Studio" ? "bg-volt text-white" : "border border-current/40")
                    }
                  >
                    {s.kind}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-9 w-9 -rotate-45 transition-transform duration-500 group-hover:rotate-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path d="M5 12h14m0 0l-6-6m6 6l-6 6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
