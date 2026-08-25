import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  useEffect(() => {
    // Defer Lenis initialization until after first paint
    const timeoutId = setTimeout(() => {
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ 
        duration: 1.2, 
        smoothWheel: true, 
        lerp: 0.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.8
      });
      (window as unknown as { lenis?: Lenis }).lenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    }, 50);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}