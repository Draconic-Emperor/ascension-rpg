import { useEffect, useRef } from "react";

interface EmberFieldProps {
  /** Particle density multiplier (1 = default) */
  intensity?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  alpha: number;
  phase: number;
  twinkle: number;
}

function spawn(w: number, h: number, fromBottom = true): Particle {
  return {
    x: Math.random() * w,
    y: fromBottom ? h + Math.random() * h * 0.5 : Math.random() * h,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -(0.12 + Math.random() * 0.3),
    size: 0.8 + Math.random() * 1.8,
    hue: 262 + Math.random() * 24,
    alpha: 0.25 + Math.random() * 0.45,
    phase: Math.random() * Math.PI * 2,
    twinkle: 0.5 + Math.random() * 1.5,
  };
}

/**
 * A fixed, pointer-transparent canvas of drifting amethyst embers.
 * Renders nothing when the user prefers reduced motion.
 */
export default function EmberField({ intensity = 1, className }: EmberFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((width * height) / 26_000) * intensity);
      particles = Array.from({ length: Math.min(90, Math.max(12, count)) }, () =>
        spawn(width, height, false),
      );
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.phase += 0.02 * p.twinkle;
        p.x += p.vx + Math.sin(p.phase) * 0.12;
        p.y += p.vy;
        if (p.y < -8 || p.x < -8 || p.x > width + 8) {
          Object.assign(p, spawn(width, height), { y: height + 6 });
        }
        const alpha = Math.max(0, p.alpha * (0.65 + 0.35 * Math.sin(p.phase)));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 72%, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };

    resize();
    step();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[1] ${className ?? ""}`}
    />
  );
}
