import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

const items = ["Product Strategy", "Web Design", "Motion Graphics", "WebGL & 3D", "Go-to-Market", "Design Systems", "Technical Advisory", "Brand"];

function Row({ reverse = false, outline = false }: { reverse?: boolean; outline?: boolean }) {
  const list = [...items, ...items];
  return (
    <div className="flex w-max">
      <div className={"flex shrink-0 items-center " + (reverse ? "animate-marquee-rev" : "animate-marquee")} style={{ width: "max-content" }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {list.map((t, i) => (
              <span key={i} className="flex items-center">
                <span
                  className={
                    "px-6 font-display text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold uppercase leading-none tracking-tight " +
                    (outline ? "text-outline text-bone/60" : "text-bone")
                  }
                >
                  {t}
                </span>
                <svg viewBox="0 0 32 32" className={"h-8 w-8 shrink-0 md:h-12 md:w-12 " + (i % 2 ? "text-volt" : "text-acid")}>
                  <path d="M16 1 L19 13 L31 16 L19 19 L16 31 L13 19 L1 16 L13 13 Z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  const { scrollY } = useScroll();
  const v = useVelocity(scrollY);
  const sv = useSpring(v, { stiffness: 80, damping: 30 });
  const skew = useTransform(sv, [-3000, 0, 3000], [8, 0, -8]);

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-ink py-10 md:py-14">
      <motion.div style={{ skewX: skew }} className="flex flex-col gap-4">
        <Row />
        <Row reverse outline />
      </motion.div>
    </section>
  );
}
