import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Configurable social links ─────────────────────────────────────────────
// Replace these with MOTURBO's actual URLs before launch.
export const SOCIAL_LINKS = {
  whatsapp:
    "https://wa.me/918147702688?text=Hi%20MOTURBO%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services.",
  instagram: "https://www.instagram.com/moturbo/", // ← replace with actual handle
  facebook: "https://www.facebook.com/moturbo/", //   ← replace with actual page
} as const;

// ─── Brand SVG icons ───────────────────────────────────────────────────────
export function WhatsAppSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function InstagramSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function FacebookSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ─── WhatsApp Floating Action Button ──────────────────────────────────────
const floatingSocials = [
  { id: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram, Icon: InstagramSVG },
  { id: "facebook", label: "Facebook", href: SOCIAL_LINKS.facebook, Icon: FacebookSVG },
] as const;

export function WhatsAppFAB() {
  const [open, setOpen] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const clusterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(pointer: coarse)");
    const updatePointerMode = () => setIsCoarsePointer(media.matches);

    updatePointerMode();
    media.addEventListener?.("change", updatePointerMode);

    return () => {
      media.removeEventListener?.("change", updatePointerMode);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (clusterRef.current && !clusterRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [open]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div
      ref={clusterRef}
      className="fixed right-3 z-[50] flex flex-col items-end"
      style={{ bottom: "max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))" }}
      onMouseEnter={!isCoarsePointer ? () => setOpen(true) : undefined}
      onMouseLeave={!isCoarsePointer ? () => setOpen(false) : undefined}
    >
      <motion.div
        className="pointer-events-none mb-3 flex flex-col items-end gap-2"
        animate={{ opacity: open ? 1 : 0, y: open ? 0 : 10 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {floatingSocials.map((item, index) => {
          const Icon = item.Icon;

          return (
            <motion.a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`MOTURBO on ${item.label}`}
              className="pointer-events-auto relative flex items-center overflow-hidden rounded-full border"
              style={{
                height: 42,
                width: open ? 144 : 42,
                background:
                  "linear-gradient(140deg, oklch(0.09 0.015 300 / 92%) 0%, oklch(0.13 0.022 300 / 88%) 100%)",
                backdropFilter: "blur(26px) saturate(140%)",
                WebkitBackdropFilter: "blur(26px) saturate(140%)",
                borderColor: "oklch(0.82 0.13 88 / 30%)",
                boxShadow:
                  "0 10px 28px -12px oklch(0 0 0 / 75%), 0 0 24px -8px oklch(0.68 0.2 300 / 40%)",
              }}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.24, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="flex size-[42px] shrink-0 items-center justify-center">
                <Icon className="size-[16px]" style={{ color: "oklch(0.85 0.09 88)" }} />
              </span>
              <span
                className="whitespace-nowrap pr-4 font-display text-[0.52rem] font-semibold tracking-[0.2em] uppercase"
                style={{ color: "oklch(0.9 0.09 88)" }}
              >
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </motion.div>

      <motion.button
        type="button"
        aria-label="Toggle MOTURBO social menu"
        className="pointer-events-auto relative flex items-center overflow-hidden rounded-full border"
        style={{
          height: 58,
          background:
            "linear-gradient(145deg, oklch(0.1 0.02 300 / 94%) 0%, oklch(0.15 0.028 300 / 88%) 100%)",
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          borderColor: "oklch(0.82 0.13 88 / 36%)",
          boxShadow: open
            ? "0 0 48px -6px oklch(0.82 0.13 88 / 65%), 0 0 86px -24px oklch(0.55 0.21 298 / 45%), inset 0 1px 0 oklch(1 0 0 / 12%)"
            : "0 0 26px -6px oklch(0.82 0.13 88 / 40%), 0 8px 30px -8px oklch(0 0 0 / 65%), inset 0 1px 0 oklch(1 0 0 / 8%)",
          transition: "box-shadow 0.35s ease, width 0.3s ease",
          width: open ? 220 : 58,
        }}
        onMouseEnter={!isCoarsePointer ? () => setOpen(true) : undefined}
        onClick={handleToggle}
        animate={open ? { scale: 1 } : { scale: [1, 1.06, 1] }}
        transition={
          open
            ? { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
        whileTap={{ scale: 0.96 }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 8%, oklch(0.82 0.13 88 / 75%) 50%, transparent 92%)",
          }}
        />

        <span className="flex size-[58px] shrink-0 items-center justify-center">
          <WhatsAppSVG className="size-5" style={{ color: "oklch(0.82 0.13 88)" }} />
        </span>

        <AnimatePresence initial={false}>
          {open && (
            <motion.span
              key="wa-label"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <span
                className="whitespace-nowrap pr-5 font-display text-[0.58rem] font-bold tracking-[0.22em] uppercase"
                style={{ color: "oklch(0.9 0.09 88)" }}
              >
                Chat with MOTURBO
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
