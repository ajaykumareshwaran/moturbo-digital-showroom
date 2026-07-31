import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { LuxLink, Reveal } from "@/components/lux";
import { useStore } from "@/context/StoreContext";
import { currency } from "@/data/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Booking | MOTURBO" },
      { name: "description", content: "Live progress for your MOTURBO reservation, bay by bay." },
      { property: "og:title", content: "Track Your Booking | MOTURBO" },
      { property: "og:description", content: "Intake, correction, protection, handover." },
    ],
  }),
  component: TrackPage,
});

const STAGES = ["Confirmed", "Intake", "In studio", "Quality gate", "Ready"];

function TrackPage() {
  const { bookings } = useStore();

  return (
    <>
      <PageHeader eyebrow="Concierge" title={<>Track your <span className="text-gold">visit</span></>} />
      <section className="mx-auto max-w-4xl space-y-6 px-6 pb-28">
        {bookings.length === 0 && (
          <div className="glass rounded-3xl p-16 text-center">
            <p className="text-sm text-muted-foreground">No reservations yet.</p>
            <div className="mt-6">
              <LuxLink to="/book">Book a bay</LuxLink>
            </div>
          </div>
        )}
        {bookings.map((b, idx) => {
          const stage = 1 + (idx % 3);
          return (
            <Reveal key={b.id} delay={idx * 0.06}>
              <div className="glass lux-border rounded-3xl p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[0.55rem] tracking-[0.24em] text-muted-foreground uppercase">Reference</div>
                    <div className="mt-1 font-display text-xl font-bold text-gold">{b.id}</div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div className="font-display text-sm text-foreground">{b.service}</div>
                    {b.vehicle} · {b.branch}
                    <div className="mt-1">
                      {b.date} at {b.time} · {currency(b.total)}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center">
                  {STAGES.map((s, i) => (
                    <div key={s} className="flex flex-1 items-center last:flex-none">
                      <div
                        className={cn(
                          "grid size-8 shrink-0 place-items-center rounded-full text-[0.6rem]",
                          i < stage ? "text-noir" : i === stage ? "glass text-gold" : "glass text-muted-foreground",
                        )}
                        style={i < stage ? { backgroundImage: "var(--gradient-gold)" } : undefined}
                      >
                        {i < stage ? <Check className="size-3.5" /> : i === stage ? <Loader2 className="size-3.5 animate-spin" /> : i + 1}
                      </div>
                      {i < STAGES.length - 1 && (
                        <div className={cn("mx-2 h-px flex-1", i < stage ? "bg-gold/50" : "bg-white/10")} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-[0.55rem] tracking-[0.22em] text-muted-foreground uppercase">
                  Current stage · {STAGES[stage]}
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}