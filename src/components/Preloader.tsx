import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let pageLoaded = document.readyState === "complete";
    let finished = false;

    const onPageLoad = () => {
      pageLoaded = true;
    };

    if (!pageLoaded) {
      window.addEventListener("load", onPageLoad, { once: true });
    }

    let v = 0;
    const id = window.setInterval(() => {
      // Keep shutter travel smooth, while finishing promptly when ready.
      const step = pageLoaded ? 10 : Math.random() * 6 + 3;
      v = Math.min(100, v + step);
      setProgress(Math.round(v));

      if (v >= 100 && !finished) {
        finished = true;
        clearInterval(id);
        // Small pause so the user sees the fully-open shutter before fade-out
        window.setTimeout(() => {
          setDone(true);
        }, 320);
      }
    }, 65);

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
          transition={{ duration: 0.6, delay: 0 }}
        >
          <div className="absolute inset-0 bg-noir">
            <div className="absolute inset-0 spotlight" />
            <div className="absolute left-1/2 top-1/2 h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-royal/25 blur-[120px]" />
            <div className="relative flex h-full flex-col items-center justify-center gap-8">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0.9em", filter: "blur(14px)" }}
                animate={{ opacity: 1, letterSpacing: "0.35em", filter: "blur(0px)" }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="font-display text-3xl font-extrabold text-chrome sm:text-5xl"
                style={{ textShadow: "0 0 60px oklch(0.68 0.2 300 / 60%)" }}
              >
                MOTURBO
              </motion.div>

              <div className="eyebrow">Luxury Automotive Studio</div>

              <div className="relative h-[2px] w-56 overflow-hidden rounded-full bg-white/10 sm:w-72">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-200"
                  style={{
                    width: `${progress}%`,
                    backgroundImage: "var(--gradient-gold)",
                    boxShadow: "var(--shadow-gold)",
                  }}
                />
              </div>

              <div className="font-display text-xs tracking-[0.5em] text-muted-foreground">
                {String(progress).padStart(3, "0")}
              </div>

              <div className="font-display text-[0.62rem] tracking-[0.38em] text-muted-foreground uppercase">
                Loading the showroom
              </div>
            </div>
          </div>

          {[0, 1].map((i) => (
            <div
              key={i}
              className="absolute inset-x-0 h-1/2"
              style={{
                top: i === 0 ? 0 : "50%",
                backgroundImage: "var(--gradient-metal)",
                backgroundSize: "100% 14px",
                boxShadow: "0 0 60px oklch(0 0 0 / 80%)",
                transform: `translateY(${(i === 0 ? -1 : 1) * progress * 1.1}%)`,
                transition: "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(180deg, oklch(1 0 0 / 8%) 0 1px, transparent 1px 12px)",
                }}
              />

              <div
                className="absolute inset-x-0 h-[3px]"
                style={
                  {
                    [i === 0 ? "bottom" : "top"]: 0,
                    backgroundImage: "var(--gradient-gold)",
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
