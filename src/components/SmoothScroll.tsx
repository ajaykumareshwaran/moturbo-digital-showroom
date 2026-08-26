import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let destroy: (() => void) | undefined;
    let cancelled = false;

    // Defer Lenis initialization until after first paint
    const timeoutId = setTimeout(() => {
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
          duration: 1.0,
          smoothWheel: true,
          lerp: 0.04,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          wheelMultiplier: 0.75,
        });
        (window as unknown as { lenis?: Lenis }).lenis = lenis;

        lenis.on("scroll", scrollTriggerApi.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsapApi.ticker.add(raf);
        gsapApi.ticker.lagSmoothing(0);

        destroy = () => {
          gsapApi.ticker.remove(raf);
          lenis.destroy();
          scrollTriggerApi.getAll().forEach((trigger) => trigger.kill());
        };
      })();
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      destroy?.();
    };
  }, []);

  return null;
}