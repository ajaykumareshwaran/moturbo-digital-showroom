import { lazy, Suspense, useEffect, useRef } from "react";
import { ClientOnly } from "@/components/ClientOnly";

const ShowroomScene = lazy(() => import("./ShowroomScene"));

/**
 * Fixed full-screen showroom canvas. Scroll progress across the whole
 * cinematic section drives the Three.js camera, not the DOM.
 */
export function ShowroomStage({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      progress.current = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, [sectionRef]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <ClientOnly
        fallback={<div className="absolute inset-0 spotlight bg-noir" />}
      >
        <Suspense fallback={<div className="absolute inset-0 spotlight bg-noir" />}>
          <ShowroomScene progress={progress} pointer={pointer} />
        </Suspense>
      </ClientOnly>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_35%,oklch(0.09_0.012_300/85%))]" />
    </div>
  );
}