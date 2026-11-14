import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uEnergy;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec2 mu = (uMouse - 0.5 * uRes) / uRes.y;
    float t = uTime * 0.11;

    vec2 dv = uv - mu;
    float d = length(dv);
    // lens + ripple around the cursor
    uv -= dv * exp(-d * d * 9.0) * (0.22 + uEnergy * 0.25);
    uv += normalize(dv + 1e-5) * sin(d * 26.0 - uTime * 2.5) * exp(-d * 4.0) * 0.012 * (0.4 + uEnergy);

    vec2 q = vec2(fbm(uv * 1.4 + t), fbm(uv * 1.4 + vec2(5.2, 1.3) - t));
    vec2 r = vec2(
      fbm(uv * 1.6 + 3.0 * q + vec2(1.7, 9.2) + t * 1.5),
      fbm(uv * 1.6 + 3.0 * q + vec2(8.3, 2.8) - t * 1.2)
    );
    float f = fbm(uv * 1.5 + 3.5 * r);

    vec3 ink  = vec3(0.027, 0.027, 0.040);
    vec3 volt = vec3(0.42, 0.24, 1.0);
    vec3 acid = vec3(0.78, 1.0, 0.18);
    vec3 hot  = vec3(1.0, 0.30, 0.55);

    vec3 col = ink;
    col = mix(col, volt * 0.45, smoothstep(0.25, 0.85, f) * smoothstep(0.25, 0.95, length(q)));
    col += volt * pow(f, 3.0) * 0.55;
    col += hot * smoothstep(0.55, 0.95, r.x) * 0.10;

    // topographic contour lines
    float v = f * 15.0;
    float l = abs(fract(v) - 0.5);
    float aa = fwidth(v);
    float line = 1.0 - smoothstep(0.0, aa * 1.4 + 0.025, 0.5 - l);
    line *= 0.25 + 0.75 * smoothstep(0.33, 0.78, f);
    vec3 lc = mix(volt * 1.5, acid, smoothstep(0.42, 0.72, f + exp(-d * 2.6) * 0.35));
    col += lc * line * 0.75;

    // acid hot spot following the cursor
    col += acid * exp(-d * d * 16.0) * 0.20 * (0.5 + uEnergy);

    // vignette + grain
    vec2 sp = gl_FragCoord.xy / uRes - 0.5;
    col *= 1.0 - 0.9 * dot(sp, sp);
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.03;
    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ShaderBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    const pr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(pr);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uEnergy: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment });
    const geo = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geo, material));

    const target = new THREE.Vector2();
    const mouse = new THREE.Vector2();
    let energy = 0;
    let first = true;

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w * pr, h * pr);
      if (first) {
        target.set(w * pr * 0.7, h * pr * 0.45);
        mouse.copy(target);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      first = false;
      const nx = (e.clientX - r.left) * pr;
      const ny = (r.height - (e.clientY - r.top)) * pr;
      energy = Math.min(1, energy + Math.hypot(nx - target.x, ny - target.y) / (400 * pr));
      target.set(nx, ny);
    };
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(el);

    let raf = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reduce) uniforms.uTime.value += dt;
      mouse.lerp(target, 1 - Math.pow(0.0015, dt));
      energy *= Math.pow(0.12, dt);
      // gentle idle drift when the pointer hasn't moved yet
      if (first && !reduce) {
        const t = uniforms.uTime.value;
        target.set(
          uniforms.uRes.value.x * (0.65 + Math.sin(t * 0.4) * 0.15),
          uniforms.uRes.value.y * (0.45 + Math.cos(t * 0.3) * 0.15)
        );
      }
      uniforms.uMouse.value.copy(mouse);
      uniforms.uEnergy.value = energy;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="absolute inset-0" aria-hidden />;
}
