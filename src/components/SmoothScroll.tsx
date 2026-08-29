import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPowerDevice =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 6) ||
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory <= 4 ||
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

    if (isCoarsePointer || prefersReducedMotion || lowPowerDevice) {
      return;
    }

    let destroy: (() => void) | undefined;
    let cancelled = false;

    const initSmoothScroll = () => {
      if (cancelled || document.visibilityState === "hidden") {
        return;
      }

      void (async () => {
        const gsapModule = await import("gsap");
        const scrollTriggerModule = await import("gsap/ScrollTrigger");
        const gsap =
          (gsapModule as { default?: unknown; gsap?: unknown }).default ??
          (gsapModule as { default?: unknown; gsap?: unknown }).gsap;
        const ScrollTrigger =
          (scrollTriggerModule as { default?: unknown; ScrollTrigger?: unknown }).ScrollTrigger ??
          (scrollTriggerModule as { default?: unknown; ScrollTrigger?: unknown }).default;

        if (!gsap || !ScrollTrigger || cancelled) {
          return;
        }

        const gsapApi = gsap as {
          registerPlugin: (plugin: unknown) => void;
          ticker: {
            add: (fn: (time: number) => void) => void;
            remove: (fn: (time: number) => void) => void;
            lagSmoothing: (threshold: number) => void;
          };
        };
        const scrollTriggerApi = ScrollTrigger as {
          update: () => void;
          getAll: () => Array<{ kill: () => void }>;
        };

        gsapApi.registerPlugin(scrollTriggerApi);

        const lenis = new Lenis({
          duration: 0.9,
          smoothWheel: true,
          lerp: 0.06,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -9 * t)),
          wheelMultiplier: 0.7,
        });
        (window as unknown as { lenis?: Lenis }).lenis = lenis;

        lenis.on("scroll", scrollTriggerApi.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsapApi.ticker.add(raf);
        gsapApi.ticker.lagSmoothing(100);

        destroy = () => {
          gsapApi.ticker.remove(raf);
          lenis.destroy();
          scrollTriggerApi.getAll().forEach((trigger) => trigger.kill());
        };
      })();
    };

    const startAfterIdle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(initSmoothScroll)
        : window.setTimeout(initSmoothScroll, 150);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        initSmoothScroll();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility, { passive: true });

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibility);
      if ("cancelIdleCallback" in window && typeof startAfterIdle === "number") {
        window.cancelIdleCallback(startAfterIdle);
      }
      if (typeof startAfterIdle === "number") {
        window.clearTimeout(startAfterIdle);
      }
      destroy?.();
    };
  }, []);

  return null;
}