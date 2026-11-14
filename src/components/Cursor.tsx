import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const c = t?.closest("[data-cursor]") as HTMLElement | null;
      const i = t?.closest("a,button,input,textarea,[role=button]");
      setLabel(c?.dataset.cursor ?? "");
      setHover(!!(c || i));
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  const big = label !== "";
  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full bg-acid font-mono text-[10px] font-medium uppercase tracking-widest text-ink"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: big ? 92 : hover ? 54 : down ? 10 : 14,
          height: big ? 92 : hover ? 54 : down ? 10 : 14,
          opacity: hover && !big ? 0.9 : 1,
          mixBlendMode: big ? "normal" : "difference",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {big && <span>{label}</span>}
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[99] h-9 w-9 rounded-full border border-acid/50"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hover ? 0 : down ? 0.7 : 1, opacity: hover ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      />
    </>
  );
}
