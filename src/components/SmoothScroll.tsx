import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Defer Lenis initialization until after first paint
    const timeoutId = setTimeout(() => {
      gsap.registerPlugin(ScrollTrigger);
      
      const lenis = new Lenis({ 
        duration: 1.0, 
        smoothWheel: true, 
        lerp: 0.04,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 0.75
      });
      (window as unknown as { lenis?: Lenis }).lenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill());
      };
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}