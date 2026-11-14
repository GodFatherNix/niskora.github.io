import { motion, useScroll, useSpring } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useState } from "react";
import Contact from "./components/Contact";
import Cursor from "./components/Cursor";
import Hero from "./components/Hero";
import Lab from "./components/Lab";
import Loader from "./components/Loader";
import Marquee from "./components/Marquee";
import Nav from "./components/Nav";
import Process from "./components/Process";
import Services from "./components/Services";
import Stats from "./components/Stats";
import Work from "./components/Work";
import { getLenis, setLenis } from "./lib/scroll";

export default function App() {
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // smooth scrolling (locked while the intro plays)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.stop();
    window.scrollTo(0, 0);
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  const onLoaded = () => {
    setReady(true);
    getLenis()?.start();
  };

  return (
    <div className="grain relative bg-ink text-bone">
      <Cursor />
      <Loader onDone={onLoaded} />
      <motion.div
        className="fixed left-0 top-0 z-[95] h-[3px] w-full origin-left bg-acid"
        style={{ scaleX: progress }}
      />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Services />
        <Work />
        <Lab />
        <Stats />
        <Process />
        <Contact />
      </main>
    </div>
  );
}
