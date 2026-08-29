import { lazy, Suspense, useEffect, useRef, useState } from "react";
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
  const [sceneReady, setSceneReady] = useState(false);
  const [framePaused, setFramePaused] = useState(false);
  // Tracks the pending setTimeout that schedules the pause so we can cancel it
  // if the user scrolls back before the fade-out timer fires.
  const pausePendingRef = useRef<number | null>(null);

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
        // Compositor hint: skip this layer entirely when fully transparent.
        sceneLayerRef.current.style.visibility = sceneOpacity < 0.01 ? "hidden" : "";
      }
      if (purpleLayerRef.current) {
        purpleLayerRef.current.style.opacity = String(purpleOpacity);
      }
      // When the canvas is fully faded, schedule a pause of the WebGL render loop
      // (saves GPU cycles). Cancel if the user scrolls back before it fires.
      if (sceneOpacity < 0.01) {
        if (pausePendingRef.current === null) {
          pausePendingRef.current = window.setTimeout(() => {
            setFramePaused(true);
            pausePendingRef.current = null;
          }, 600);
        }
      } else {
        if (pausePendingRef.current !== null) {
          clearTimeout(pausePendingRef.current);
          pausePendingRef.current = null;
        }
        setFramePaused(false);
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
      if (pausePendingRef.current !== null) clearTimeout(pausePendingRef.current);
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
            <ShowroomScene progress={progress} pointer={pointer} onReady={() => setSceneReady(true)} paused={framePaused} />
          </Suspense>
        </ClientOnly>
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_35%,oklch(0.09_0.012_300/85%))]" />
      </div>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${sceneReady ? "opacity-0" : "opacity-100"}`}
        style={{ transitionDelay: sceneReady ? "1200ms" : "0ms" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1/2 border-b border-[#e8c37a33]"
          style={{
            background: "linear-gradient(180deg, rgba(18,15,22,0.98), rgba(31,27,37,0.96))",
            transform: sceneReady ? "translateY(-110%)" : "translateY(0)",
            transition: "transform 1600ms cubic-bezier(0.19, 1, 0.22, 1)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 border-t border-[#e8c37a33]"
          style={{
            background: "linear-gradient(0deg, rgba(18,15,22,0.98), rgba(31,27,37,0.96))",
            transform: sceneReady ? "translateY(110%)" : "translateY(0)",
            transition: "transform 1600ms cubic-bezier(0.19, 1, 0.22, 1)",
          }}
        />
        <div
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#e8c37a66]"
          style={{
            opacity: sceneReady ? 0 : 1,
            boxShadow: "0 0 24px rgba(232,195,122,0.65)",
            transition: "opacity 350ms ease",
          }}
        />

        <div
          className="absolute left-1/2 top-1/2 flex w-[84vw] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{
            opacity: sceneReady ? 0 : 1,
            transform: sceneReady
              ? "translate(-50%, calc(-50% + 8px))"
              : "translate(-50%, -50%)",
            transition: "opacity 400ms ease, transform 550ms ease",
          }}
        >
          <img
            src="/moturbo_lg.png"
            alt="MOTURBO"
            className="h-20 w-20 object-contain sm:h-24 sm:w-24"
            style={{ filter: "drop-shadow(0 0 18px rgba(232,195,122,0.35))" }}
          />
          <div className="mt-3 font-display text-[0.64rem] tracking-[0.38em] text-[#e8c37a] uppercase">
            Preparing Showroom
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[#e8c37a] animate-pulse" style={{ animationDelay: "0ms" }} />
            <span className="size-1.5 rounded-full bg-[#e8c37a] animate-pulse" style={{ animationDelay: "180ms" }} />
            <span className="size-1.5 rounded-full bg-[#e8c37a] animate-pulse" style={{ animationDelay: "360ms" }} />
          </div>
          <div className="mt-4 h-[2px] w-44 overflow-hidden rounded-full bg-[#e8c37a2e]">
            <div
              className="h-full w-1/2 animate-pulse rounded-full bg-[#e8c37a]"
              style={{ boxShadow: "0 0 16px rgba(232,195,122,0.65)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
