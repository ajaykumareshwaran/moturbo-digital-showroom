import { Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Scroll reveal wrapper */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  // filter:blur() forces a GPU composite layer on every element it touches.
  // On touch/mobile GPUs this tanks scroll fps — skip it on coarse-pointer devices.
  const [skipBlur] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: skipBlur ? "blur(0px)" : "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Magnetic hover wrapper */
export function Magnetic({ children, strength = 18 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  
  const updatePos = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect();
    setPos({
      x: ((e.clientX - r.left) / r.width - 0.5) * strength,
      y: ((e.clientY - r.top) / r.height - 0.5) * strength,
    });
  };
  
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updatePos(e));
  };
  
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      onMouseMove={onMouseMove}
      onMouseLeave={() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setPos({ x: 0, y: 0 });
      }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

type BtnProps = {
  variant?: "gold" | "ghost" | "royal";
  className?: string;
  children: ReactNode;
};

const btnBase =
  "sheen inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-display text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-all duration-500 will-change-transform";

const btnVariant = {
  gold: "text-noir shadow-[var(--shadow-gold)] hover:shadow-[0_0_60px_-4px_oklch(0.82_0.13_88/60%)]",
  royal: "text-foreground lux-border hover:-translate-y-0.5",
  ghost: "text-muted-foreground border border-white/10 hover:text-gold-soft hover:border-gold/40",
};

export function LuxButton({
  variant = "gold",
  className,
  children,
  ...rest
}: BtnProps & ComponentProps<"button">) {
  return (
    <button
      {...rest}
      className={cn(btnBase, btnVariant[variant], className)}
      style={
        variant === "gold"
          ? { backgroundImage: "var(--gradient-gold)" }
          : variant === "royal"
            ? { backgroundImage: "var(--gradient-royal)" }
            : undefined
      }
    >
      {children}
    </button>
  );
}

export function LuxLink({
  variant = "gold",
  className,
  children,
  ...rest
}: BtnProps & ComponentProps<typeof Link>) {
  return (
    <Link
      {...rest}
      className={cn(btnBase, btnVariant[variant], className)}
      style={
        variant === "gold"
          ? { backgroundImage: "var(--gradient-gold)" }
          : variant === "royal"
            ? { backgroundImage: "var(--gradient-royal)" }
            : undefined
      }
    >
      {children}
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-4 text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl">{title}</h2>
      {sub && <p className="mt-5 text-[0.98rem] leading-relaxed text-muted-foreground">{sub}</p>}
      <div className={cn("hairline mt-7 w-40", align === "center" && "mx-auto")} />
    </Reveal>
  );
}

/** Card that tilts with pointer, lifts on hover, with a moving reflection */
export function TiltCard({
  children,
  className,
  intensity = 10,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        setT({ rx: (0.5 - py) * intensity, ry: (px - 0.5) * intensity, mx: px * 100, my: py * 100, active: true });
      }}
      onMouseLeave={() => setT((s) => ({ ...s, rx: 0, ry: 0, active: false }))}
      className={cn(
        "group relative rounded-3xl transition-transform duration-500 [transform-style:preserve-3d] will-change-transform",
        className,
      )}
      style={{
        transform: `perspective(1100px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateY(${t.active ? -10 : 0}px)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(45% 45% at ${t.mx}% ${t.my}%, oklch(0.82 0.13 88 / 16%), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
}