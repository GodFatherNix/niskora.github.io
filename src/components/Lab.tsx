import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Eyebrow, MaskLine } from "./Reveal";

const vert = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uPx;
  attribute float aSeed;
  varying float vN;
  varying float vSeed;
  void main() {
    vec3 p = position;
    float n = sin(p.x * 2.1 + uTime) * sin(p.y * 2.4 + uTime * 1.2) * sin(p.z * 1.9 - uTime * 0.8);
    float n2 = sin(length(p.xy) * 5.0 - uTime * 2.0) * 0.5;
    vN = n;
    vSeed = aSeed;
    p *= 1.0 + n * 0.32 + uPulse * (0.35 + n2 * 0.6);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = (1.6 + aSeed * 2.6 + uPulse * 2.0) * uPx * (7.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  varying float vN;
  varying float vSeed;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    vec3 volt = vec3(0.45, 0.28, 1.0);
    vec3 acid = vec3(0.78, 1.0, 0.18);
    vec3 hot = vec3(1.0, 0.3, 0.55);
    vec3 col = mix(volt, acid, smoothstep(-0.2, 0.7, vN));
    col = mix(col, hot, step(0.93, vSeed) * 0.9);
    gl_FragColor = vec4(col, a * 0.9);
  }
`;

function Scene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pr);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 7;

    const N = 14000;
    const pos = new Float32Array(N * 3);
    const seed = new Float32Array(N);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const rad = 1.9 + (Math.random() - 0.5) * 0.08;
      pos[i * 3] = Math.cos(th) * r * rad;
      pos[i * 3 + 1] = y * rad;
      pos[i * 3 + 2] = Math.sin(th) * r * rad;
      seed[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const uniforms = { uTime: { value: 0 }, uPulse: { value: 0 }, uPx: { value: pr } };
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 10 : 7;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    let pulse = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      m.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      m.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onDown = () => (pulse = 1);
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reduce) uniforms.uTime.value += dt * 0.7;
      m.x += (m.tx - m.x) * (1 - Math.pow(0.02, dt));
      m.y += (m.ty - m.y) * (1 - Math.pow(0.02, dt));
      pulse *= Math.pow(0.04, dt);
      uniforms.uPulse.value = pulse;
      points.rotation.y += dt * 0.12 + (reduce ? 0 : m.x * dt * 0.8);
      points.rotation.x = m.y * 0.5;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="absolute inset-0" aria-hidden />;
}

const specs = [
  ["Real-time shaders", "GLSL, WebGL & WebGPU"],
  ["Scroll-driven stories", "Pinned, scrubbed, choreographed"],
  ["Kinetic typography", "Type that thinks and moves"],
  ["60fps, always", "Budgeted, profiled, accessible"],
];

export default function Lab() {
  return (
    <section id="lab" className="relative min-h-[110vh] overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(106,61,255,0.22),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="absolute inset-y-0 right-0 w-full md:w-[75%]" data-cursor="Pulse">
        <Scene />
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[110vh] max-w-[1500px] flex-col justify-between px-5 py-28 md:px-10">
        <div>
          <Eyebrow>Motion lab</Eyebrow>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em]">
            <MaskLine>Pixels that</MaskLine>
            <MaskLine>
              <span className="font-serif font-normal normal-case italic text-acid">feel</span> alive.
            </MaskLine>
          </h2>
          <p className="mt-6 max-w-md text-bone/65">
            14,000 particles, one shader, zero fluff. This is the kind of detail we bring to every interface.
          </p>
        </div>

        <div>
          <div className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-bone/60">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-acid" />
            Move your cursor · Click to pulse
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
            {specs.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-ink/80 p-6 backdrop-blur-md"
              >
                <div className="font-mono text-[10px] tracking-widest text-acid">0{i + 1}</div>
                <div className="mt-3 font-display text-lg font-bold uppercase tracking-tight">{t}</div>
                <div className="mt-1 text-sm text-bone/55">{d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
