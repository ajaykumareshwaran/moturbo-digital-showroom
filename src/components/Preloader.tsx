import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [done, setDone] = useState(false);
  // Refs let the interval write to the DOM directly - zero React re-renders.
  const barRef      = useRef<HTMLDivElement>(null);
  const labelRef    = useRef<HTMLDivElement>(null);
  const shutter0Ref = useRef<HTMLDivElement>(null);
  const shutter1Ref = useRef<HTMLDivElement>(null);
  // Skip expensive blur/shadow filters on touch/mobile devices.
  const [skipBlur] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let pageLoaded = document.readyState === "complete";
    let finished = false;
    const startedAt = Date.now();

    const onPageLoad = () => { pageLoaded = true; };
    if (!pageLoaded) window.addEventListener("load", onPageLoad, { once: true });

    let v = 0;
    const id = window.setInterval(() => {
      const step = pageLoaded ? 1.4 : 0.7;
      v = Math.min(100, v + step);
      const p = Math.round(v);

      if (barRef.current)      barRef.current.style.width          = `${p}%`;
      if (labelRef.current)    labelRef.current.textContent        = String(p).padStart(3, "0");
      if (shutter0Ref.current) shutter0Ref.current.style.transform = `translateY(${-p * 1.1}%)`;
      if (shutter1Ref.current) shutter1Ref.current.style.transform = `translateY(${p * 1.1}%)`;

      if (v >= 100 && !finished) {
        finished = true;
        clearInterval(id);
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, 2000 - elapsed);
        window.setTimeout(() => setDone(true), remaining);
      }
    }, 22);

    return () => {
      clearInterval(id);
      window.removeEventListener("load", onPageLoad);
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-noir">
            <div className="absolute inset-0 spotlight" />
            {!skipBlur && (
              <div className="absolute left-1/2 top-1/2 h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-royal/25 blur-[120px]" />
            )}
            <div className="relative flex h-full flex-col items-center justify-center gap-8">
              <motion.div
                initial={{ opacity: 0, scale: skipBlur ? 0.9 : 0.6, filter: skipBlur ? "none" : "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "none" }}
                transition={{ duration: skipBlur ? 0.5 : 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="h-28 w-28 sm:h-36 sm:w-36"
              >
                <img src="/moturbo_lg.png" alt="MOTURBO" className="size-full object-contain" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, filter: skipBlur ? "none" : "blur(14px)" }}
                animate={{ opacity: 1, filter: "none" }}
                transition={{ duration: skipBlur ? 0.4 : 1.6, ease: [0.16, 1, 0.3, 1], delay: skipBlur ? 0.3 : 0.5 }}
                className="font-display text-3xl font-extrabold text-chrome sm:text-5xl tracking-[0.35em]"
              >
                MOTURBO
              </motion.div>

              <div className="eyebrow">Luxury Automotive Studio</div>

              <div className="relative h-[2px] w-56 overflow-hidden rounded-full bg-white/10 sm:w-72">
                <div
                  ref={barRef}
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-200"
                  style={{ width: "0%", backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
                />
              </div>

              <div ref={labelRef} className="font-display text-xs tracking-[0.5em] text-muted-foreground">
                000
              </div>

              <div className="font-display text-[0.62rem] tracking-[0.38em] text-muted-foreground uppercase">
                Loading the showroom
              </div>
            </div>
          </div>

          <div
            ref={shutter0Ref}
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              backgroundImage: "var(--gradient-metal)",
              backgroundSize: "100% 14px",
              boxShadow: "0 0 60px oklch(0 0 0 / 80%)",
              transition: "transform 0.28s linear",
            }}
          >
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(180deg, oklch(1 0 0 / 8%) 0 1px, transparent 1px 12px)" }} />
            <div className="absolute inset-x-0 bottom-0 h-[3px]" style={{ backgroundImage: "var(--gradient-gold)" }} />
          </div>
          <div
            ref={shutter1Ref}
            className="absolute inset-x-0 h-1/2"
            style={{
              top: "50%",
              backgroundImage: "var(--gradient-metal)",
              backgroundSize: "100% 14px",
              boxShadow: "0 0 60px oklch(0 0 0 / 80%)",
              transition: "transform 0.28s linear",
            }}
          >
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(180deg, oklch(1 0 0 / 8%) 0 1px, transparent 1px 12px)" }} />
            <div className="absolute inset-x-0 top-0 h-[3px]" style={{ backgroundImage: "var(--gradient-gold)" }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
