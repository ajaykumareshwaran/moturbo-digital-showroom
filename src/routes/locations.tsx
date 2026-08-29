import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CarFront, Clock3, MapPin, Navigation } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { LuxButton, Reveal } from "@/components/lux";

const DIRECTIONS_URL =
  "https://www.google.com/maps/search/Gottigere+Village,+80+Feet+Road,+Uttarahalli+Hobli,+Bangalore+South+Taluk,+Bangalore+-+560083/@12.8935735,77.5291596,16z?entry=ttu&g_ep=EgoyMDI2MDgyNS4wIKXMDSoASAFQAw%3D%3D";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Location | MOTURBO" },
      {
        name: "description",
        content: "Find the MOTURBO showroom in Gottigere, Bangalore and get directions in one tap.",
      },
      { property: "og:title", content: "Location | MOTURBO" },
      {
        property: "og:description",
        content: "Luxury detailing studio in Bangalore. Get directions to the MOTURBO showroom.",
      },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Location"
        title={
          <>
            Visit the <span className="text-gold">MOTURBO studio</span>
          </>
        }
        sub="Luxury detailing, paint protection and bespoke finishing in Gottigere, Bangalore."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="glass lux-border rounded-[2rem] p-8 sm:p-10">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold/25 bg-gold/5 px-3 py-1.5 text-[0.62rem] font-display tracking-[0.2em] text-gold uppercase">
                <CarFront className="size-4" />
                Showroom address
              </div>

              <h2 className="font-display text-3xl font-semibold text-balance">MOTURBO Bengaluru Showroom</h2>

              <div className="mt-8 space-y-5 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 size-4 shrink-0 text-gold/80" />
                  <p>
                    Site No.02 Gottigere Village, 80 Feet Road, Uttarahalli Hobli, Bangalore South Taluk,
                    Bangalore - 560083
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 className="size-4 shrink-0 text-gold/80" />
                  <p>Mon – Sat · 08:00 – 21:00</p>
                </div>

                <div className="flex items-center gap-3">
                  <Navigation className="size-4 shrink-0 text-gold/80" />
                  <p>Easy access from South Bangalore and surrounding routes.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-gold)] px-5 py-3 font-display text-[0.65rem] font-bold tracking-[0.2em] text-noir uppercase transition-transform hover:scale-[1.01]"
                >
                  Get Directions
                  <ArrowUpRight className="size-4" />
                </a>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 font-display text-[0.65rem] font-bold tracking-[0.2em] text-foreground uppercase transition-colors hover:border-gold/40 hover:text-gold-soft"
                >
                  Contact Studio
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/30 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
              <div className="border-b border-white/10 bg-[#101215] px-4 py-3 text-[0.62rem] font-display tracking-[0.24em] text-gold uppercase">
                Google Maps
              </div>
              <div className="h-[520px] w-full">
                <iframe
                  title="MOTURBO Google Map"
                  src="https://www.google.com/maps?q=12.8935735,77.5291596&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
