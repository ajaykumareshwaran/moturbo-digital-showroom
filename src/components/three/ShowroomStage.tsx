import { lazy, Suspense, useEffect, useRef } from "react";
import { ClientOnly } from "@/components/ClientOnly";

const ShowroomScene = lazy(() => import("./ShowroomScene"));

const showroomFallbackStyle = {
  backgroundImage:
    "linear-gradient(to bottom, rgba(74,69,79,0.82), rgba(74,69,79,0.98)), url('/showroom-bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
} as const;

/**
 * Fixed full-screen showroom canvas. Scroll progress across the whole
 * cinematic section drives the Three.js camera, not the DOM.
 */
export function ShowroomStage({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const sceneLayerRef = useRef<HTMLDivElement>(null);
  const purpleLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allowPointerParallax = !window.matchMedia("(pointer: coarse)").matches;
    let scrollRaf = 0;
    let moveRaf = 0;
    let settleRaf = 0;
    let settleRaf2 = 0;
    let nextPointer = { x: 0, y: 0 };

    const setLayerOpacity = (sceneOpacity: number, purpleOpacity: number) => {
      if (sceneLayerRef.current) {
        sceneLayerRef.current.style.opacity = String(sceneOpacity);
      }
      if (purpleLayerRef.current) {
        purpleLayerRef.current.style.opacity = String(purpleOpacity);
      }
    };

    const updateProgress = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      progress.current = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;

      // Chapter 08 transition: fade out showroom and reveal page-style purple backdrop.
      const fadeStart = 0.82;
      const fadeEnd = 0.92;
      const t = Math.min(1, Math.max(0, (progress.current - fadeStart) / (fadeEnd - fadeStart)));
      setLayerOpacity(1 - t, t);
    };

    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(() => {
        scrollRaf = 0;
        updateProgress();
      });
    };

    const onMove = (e: PointerEvent) => {
      nextPointer = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
      if (moveRaf) return;
      moveRaf = window.requestAnimationFrame(() => {
        moveRaf = 0;
        pointer.current = nextPointer;
      });
    };
    // Always start with showroom visible, then compute fade once layout settles.
    setLayerOpacity(1, 0);
    updateProgress();
    settleRaf = window.requestAnimationFrame(() => {
      updateProgress();
      settleRaf2 = window.requestAnimationFrame(updateProgress);
    });

    const onLoad = () => updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    if (allowPointerParallax) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }
    window.addEventListener("load", onLoad);
    window.addEventListener("pageshow", onLoad);
    return () => {
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
      if (moveRaf) window.cancelAnimationFrame(moveRaf);
      if (settleRaf) window.cancelAnimationFrame(settleRaf);
      if (settleRaf2) window.cancelAnimationFrame(settleRaf2);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (allowPointerParallax) {
        window.removeEventListener("pointermove", onMove);
      }
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pageshow", onLoad);
    };
  }, [sectionRef]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div
        ref={purpleLayerRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 50% -10%, oklch(0.3 0.14 300 / 35%), transparent 60%), var(--gradient-noir)",
        }}
      />

      <div ref={sceneLayerRef} className="absolute inset-0 transition-opacity duration-500">
        <ClientOnly
          fallback={<div className="absolute inset-0 spotlight bg-noir" style={showroomFallbackStyle} />}
        >
          <Suspense fallback={<div className="absolute inset-0 spotlight bg-noir" style={showroomFallbackStyle} />}>
            <ShowroomScene progress={progress} pointer={pointer} />
          </Suspense>
        </ClientOnly>
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_35%,oklch(0.09_0.012_300/85%))]" />
      </div>
    </div>
  );
}
