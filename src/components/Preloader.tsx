import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("moturbo.entered")) {
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.random() * 9 + 3);
      setProgress(Math.round(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => {
          sessionStorage.setItem("moturbo.entered", "1");
          setDone(true);
        }, 700);
      }
    }, 120);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  const playChime = () => {
    setSound((s) => !s);
    if (sound) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const now = ctx.currentTime;
      [220, 330, 494].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0, now + i * 0.12);
        g.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.4);
        o.connect(g).connect(ctx.destination);
        o.start(now + i * 0.12);
        o.stop(now + i * 0.12 + 1.5);
      });
    } catch {
      /* audio unavailable */
    }
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          {/* purple light behind the shutter */}
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
                  style={{ width: `${progress}%`, backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
                />
              </div>
              <div className="font-display text-xs tracking-[0.5em] text-muted-foreground">
                {String(progress).padStart(3, "0")}
              </div>
              <button
                onClick={playChime}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[0.65rem] tracking-[0.28em] text-muted-foreground uppercase transition-colors hover:text-gold-soft"
              >
                {sound ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
                Startup sound
              </button>
            </div>
          </div>

          {/* metallic shutter panels */}
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-x-0 h-1/2"
              style={{
                top: i === 0 ? 0 : "50%",
                backgroundImage: "var(--gradient-metal)",
                backgroundSize: "100% 14px",
                boxShadow: "0 0 60px oklch(0 0 0 / 80%)",
              }}
              initial={{ y: 0 }}
              animate={{ y: progress >= 100 ? (i === 0 ? "-100%" : "100%") : 0 }}
              transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.25 }}
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
                style={{ [i === 0 ? "bottom" : "top"]: 0, backgroundImage: "var(--gradient-gold)" } as React.CSSProperties}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}