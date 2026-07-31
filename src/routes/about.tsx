import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, SectionHeading } from "@/components/lux";
import { TIMELINE, BRANCHES } from "@/data/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Studio | MOTURBO" },
      {
        name: "description",
        content: "MOTURBO is a precision automotive atelier: craftsmanship, controlled lighting and obsessive finish standards.",
      },
      { property: "og:title", content: "About the Studio | MOTURBO" },
      { property: "og:description", content: "Our story, our standards and the people behind the finish." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Studio"
        title={<>Obsession, <span className="text-gold">measured</span> in microns</>}
        sub="MOTURBO began as a single correction bay. It is now a connected atelier for protection, customization and accessories."
      />

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["12", "Years of finish work"],
            ["9,400", "Vehicles through the bays"],
            ["31", "Craftspeople on the floor"],
          ].map(([n, l], i) => (
            <Reveal key={l} delay={i * 0.08}>
              <div className="glass lux-border rounded-3xl p-8 text-center">
                <div className="font-display text-4xl font-black text-chrome">{n}</div>
                <div className="mt-3 text-[0.6rem] tracking-[0.22em] text-muted-foreground uppercase">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative border-y border-white/8 py-24">
        <div className="absolute inset-0 spotlight" />
        <div className="relative mx-auto max-w-3xl px-6">
          <SectionHeading eyebrow="Timeline" title="How the atelier grew" align="center" />
          <div className="mt-14 space-y-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.06}>
                <div className="flex gap-8">
                  <div className="w-20 shrink-0 font-display text-lg font-bold text-gold">{t.year}</div>
                  <div className="relative flex-1 border-l border-white/10 pb-2 pl-8">
                    <span className="absolute -left-[3px] top-2 size-1.5 rounded-full bg-gold" />
                    <h4 className="font-display text-base font-semibold">{t.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeading eyebrow="Locations" title="Where we work" align="center" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BRANCHES.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.07}>
              <div className="glass lux-border h-full rounded-3xl p-7">
                <h4 className="font-display text-lg font-semibold">{b.name}</h4>
                <p className="mt-3 text-sm text-muted-foreground">{b.address}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}