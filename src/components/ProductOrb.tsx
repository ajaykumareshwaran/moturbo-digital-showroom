import { cn } from "@/lib/utils";

/**
 * Lightweight "product on a luxury display stand" visual.
 * Pure CSS so hundreds can render without a WebGL context each.
 */
export function ProductOrb({
  hue,
  compact = false,
  className,
}: {
  hue: number;
  compact?: boolean;
  className?: string;
}) {
  const c1 = `oklch(0.62 0.18 ${hue})`;
  const c2 = `oklch(0.28 0.09 ${hue})`;
  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        background: `radial-gradient(80% 60% at 50% 15%, ${c1}22, transparent 70%), var(--gradient-noir)`,
      }}
    >
      {/* spotlight cone */}
      <div
        className="absolute inset-x-0 top-0 h-2/3"
        style={{ background: `conic-gradient(from 180deg at 50% -10%, transparent 40%, ${c1}26 50%, transparent 60%)` }}
      />
      {/* bottle / canister body */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className={cn(
            "relative rounded-[28%_28%_18%_18%/12%] transition-transform duration-700 group-hover:-translate-y-1.5",
            compact ? "h-9 w-6" : "h-[46%] w-[22%]",
          )}
          style={{
            backgroundImage: `linear-gradient(100deg, ${c2}, ${c1} 38%, oklch(0.95 0.02 ${hue}) 46%, ${c1} 55%, ${c2})`,
            boxShadow: `0 22px 44px -18px ${c1}, inset 0 1px 0 oklch(1 0 0 / 45%)`,
          }}
        >
          {!compact && (
            <>
              <div
                className="absolute -top-[26%] left-1/2 h-[26%] w-[42%] -translate-x-1/2 rounded-t-md"
                style={{ backgroundImage: "var(--gradient-gold)", boxShadow: "var(--shadow-gold)" }}
              />
              <div className="absolute inset-x-[18%] top-[38%] h-[24%] rounded-sm bg-noir/45 backdrop-blur-[1px]" />
            </>
          )}
        </div>
      </div>
      {/* reflective plinth */}
      <div
        className="absolute inset-x-0 bottom-0 h-[26%]"
        style={{
          background: `linear-gradient(180deg, oklch(1 0 0 / 6%), transparent), radial-gradient(60% 100% at 50% 0%, ${c1}33, transparent 70%)`,
          borderTop: "1px solid oklch(1 0 0 / 10%)",
        }}
      />
    </div>
  );
}