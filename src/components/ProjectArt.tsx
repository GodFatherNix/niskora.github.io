import { motion } from "framer-motion";

export type ArtKind = "rings" | "bars" | "blobs" | "waves" | "dots";

/** Pure SVG/CSS generative artwork — each project gets its own animated visual. */
export default function ProjectArt({ kind }: { kind: ArtKind }) {
  switch (kind) {
    case "rings":
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,#1a1240,#07070a_70%)]">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: `${22 + i * 12}%`,
                aspectRatio: "1",
                borderColor: i % 2 ? "rgba(200,255,46,.7)" : "rgba(130,90,255,.8)",
                borderWidth: i % 3 === 0 ? 2 : 1,
                borderStyle: i % 2 ? "dashed" : "solid",
              }}
              animate={{ rotate: i % 2 ? 360 : -360, scale: [1, 1.04, 1] }}
              transition={{ rotate: { duration: 14 + i * 5, repeat: Infinity, ease: "linear" }, scale: { duration: 4 + i, repeat: Infinity } }}
            />
          ))}
          <div className="h-[14%] w-[14%] rounded-full bg-acid shadow-[0_0_80px_20px_rgba(200,255,46,.5)]" />
        </div>
      );
    case "bars":
      return (
        <div className="absolute inset-0 flex items-end gap-[3%] bg-gradient-to-b from-[#0d1a14] to-[#07070a] px-[8%] pb-[10%]">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:100%_12.5%]" />
          {[35, 52, 44, 68, 60, 82, 74, 96].map((h, i) => (
            <motion.div
              key={i}
              className="relative flex-1 rounded-t-md"
              style={{ background: i === 7 ? "#c8ff2e" : `linear-gradient(to top, rgba(200,255,46,.05), rgba(200,255,46,${0.25 + i * 0.07}))`, height: `${h}%` }}
              animate={{ scaleY: [0.6, 1, 0.85, 1] }}
              transition={{ duration: 4 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
            />
          ))}
        </div>
      );
    case "blobs":
      return (
        <div className="absolute inset-0 overflow-hidden bg-[#0a0612]">
          {[
            { c: "#6a3dff", s: 70, x: "10%", y: "10%", d: 9 },
            { c: "#ff4d8d", s: 60, x: "50%", y: "40%", d: 11 },
            { c: "#c8ff2e", s: 40, x: "25%", y: "55%", d: 13 },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-[60px]"
              style={{ background: b.c, width: `${b.s}%`, aspectRatio: "1", left: b.x, top: b.y, opacity: 0.85 }}
              animate={{ x: ["0%", "30%", "-10%", "0%"], y: ["0%", "-25%", "20%", "0%"], scale: [1, 1.2, 0.9, 1] }}
              transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <div className="absolute inset-0 backdrop-blur-[2px] [background-image:radial-gradient(rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:18px_18px]" />
        </div>
      );
    case "waves":
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#12091f] to-[#07070a]">
          <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {[...Array(14)].map((_, i) => (
              <motion.path
                key={i}
                fill="none"
                stroke={i % 4 === 0 ? "#c8ff2e" : "#8a63ff"}
                strokeOpacity={0.25 + (i / 14) * 0.7}
                strokeWidth={1.2}
                animate={{
                  d: [
                    `M0 ${60 + i * 14} C 100 ${20 + i * 14}, 200 ${120 + i * 14}, 400 ${60 + i * 14}`,
                    `M0 ${60 + i * 14} C 120 ${110 + i * 14}, 220 ${10 + i * 14}, 400 ${60 + i * 14}`,
                    `M0 ${60 + i * 14} C 100 ${20 + i * 14}, 200 ${120 + i * 14}, 400 ${60 + i * 14}`,
                  ],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              />
            ))}
          </svg>
        </div>
      );
    case "dots":
    default:
      return (
        <div className="absolute inset-0 grid place-items-center bg-[#07090f]">
          <div className="grid h-[80%] w-[80%] grid-cols-12 gap-[2.5%]">
            {[...Array(144)].map((_, i) => {
              const x = i % 12;
              const y = Math.floor(i / 12);
              const dist = Math.hypot(x - 5.5, y - 5.5);
              return (
                <motion.span
                  key={i}
                  className="aspect-square rounded-full"
                  style={{ background: dist < 3 ? "#c8ff2e" : "#6a3dff" }}
                  animate={{ scale: [0.25, 1, 0.25], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: dist * 0.18, ease: "easeInOut" }}
                />
              );
            })}
          </div>
        </div>
      );
  }
}
