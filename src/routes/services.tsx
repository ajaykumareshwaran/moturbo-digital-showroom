import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ServiceCard } from "@/components/ServiceCard";
import { LuxLink, Magnetic, Reveal, SectionHeading, TiltCard } from "@/components/lux";
import { PACKAGES, SERVICES, currency } from "@/data/catalog";
import { Check } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Ceramic, PPF & Wrapping | MOTURBO" },
      {
        name: "description",
        content:
          "Thirteen detailing disciplines: ceramic coating, paint protection film, wrapping, tinting, paint correction and bespoke accessories.",
      },
      { property: "og:title", content: "Services — Ceramic, PPF & Wrapping | MOTURBO" },
      { property: "og:description", content: "Every MOTURBO bay runs its own protocol, lighting and quality gate." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Detailing Bays"
        title={<>The <span className="text-gold">studio</span> disciplines</>}
        sub="Thirteen programs, each with its own bay, lighting rig and inspection protocol."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.06}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative border-y border-white/8 py-24">
        <div className="absolute inset-0 spotlight" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Packages"
            title="Three levels of finish"
            sub="Bundle disciplines into a single studio visit. All packages include executive collection within the city."
            align="center"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <TiltCard
                  className={`glass lux-border h-full rounded-3xl p-8 ${i === 2 ? "shadow-[var(--shadow-lift)]" : ""}`}
                >
                  {i === 2 && (
                    <span className="rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 font-display text-[0.55rem] font-bold tracking-[0.2em] text-noir uppercase">
                      Most requested
                    </span>
                  )}
                  <h3 className="mt-5 font-display text-2xl font-semibold">{p.name}</h3>
                  <div className="mt-3 font-display text-4xl font-bold text-gold">{currency(p.price)}</div>
                  <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
                    {p.perks.map((perk) => (
                      <li key={perk} className="flex gap-3">
                        <Check className="mt-0.5 size-4 shrink-0 text-gold" /> {perk}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Magnetic>
                      <LuxLink to="/book" variant={i === 2 ? "gold" : "ghost"} className="w-full">
                        Select {p.name}
                      </LuxLink>
                    </Magnetic>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-24">
        <SectionHeading eyebrow="Protocol" title="How a MOTURBO visit runs" align="center" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "Intake", "Paint depth mapping, photo documentation and a written plan."],
            ["02", "Decontamination", "Chemical and mechanical removal down to bare clear coat."],
            ["03", "Correction", "Multi-stage machine polishing under inspection lighting."],
            ["04", "Protection", "Ceramic, graphene or film, cured in a dust-controlled bay."],
          ].map(([n, t, b], i) => (
            <Reveal key={n} delay={i * 0.07}>
              <div className="glass h-full rounded-3xl p-7">
                <div className="font-display text-3xl font-black text-gold/35">{n}</div>
                <h4 className="mt-4 font-display text-base font-semibold">{t}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}