import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { LuxButton, Reveal } from "@/components/lux";
import { BRANCHES } from "@/data/catalog";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the Studio | MOTURBO" },
      {
        name: "description",
        content: "Speak to the MOTURBO reception: studio addresses, hours, phone and enquiry form.",
      },
      { property: "og:title", content: "Contact the Studio | MOTURBO" },
      { property: "og:description", content: "Reception is open seven days a week." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const whatsappNumber = "918147702668";

  function openWhatsAppEnquiry(form: HTMLFormElement) {
    const data = new FormData(form);
    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const vehicle = String(data.get("vehicle") ?? "").trim();
    const enquiry = String(data.get("enquiry") ?? "").trim();

    const message = [
      "Hello MOTURBO, I'd like to send an enquiry:",
      "",
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Vehicle: ${vehicle || "Not provided"}`,
      "",
      "Requirement:",
      enquiry,
    ].join("\n");

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <PageHeader
        eyebrow="Reception"
        title={
          <>
            Talk to the <span className="text-gold">studio</span>
          </>
        }
        sub="Tell us the car, the finish you want and when you'd like to come in."
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-28 lg:grid-cols-[1fr_0.85fr]">
        <Reveal>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              openWhatsAppEnquiry(e.currentTarget);
              toast.success("Opening WhatsApp with your enquiry");
            }}
            className="glass lux-border space-y-5 rounded-[2rem] p-8 sm:p-10"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <input required name="fullName" placeholder="Full name" className="input-lux" />
              <input required name="email" type="email" placeholder="Email" className="input-lux" />
              <input name="phone" placeholder="Phone" className="input-lux" />
              <input name="vehicle" placeholder="Vehicle" className="input-lux" />
            </div>
            <textarea
              required
              name="enquiry"
              rows={5}
              placeholder="What are you looking for?"
              className="input-lux resize-none"
            />
            <LuxButton type="submit">Send enquiry</LuxButton>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-4">
            {[
              [Phone, "Reception", "+91 8147702668"],
              [Mail, "Email", "moturboweb@gmail.com"],
              [Clock, "Hours", "Mon–Sun · 08:00 — 20:00"],
            ].map(([Icon, label, value]) => {
              const I = Icon as typeof Phone;
              return (
                <div
                  key={label as string}
                  className="glass lux-border flex items-center gap-5 rounded-3xl p-6"
                >
                  <div
                    className="grid size-11 shrink-0 place-items-center rounded-2xl"
                    style={{ backgroundImage: "var(--gradient-royal)" }}
                  >
                    <I className="size-4 text-gold-soft" />
                  </div>
                  <div>
                    <div className="text-[0.55rem] tracking-[0.24em] text-muted-foreground uppercase">
                      {label as string}
                    </div>
                    <div className="mt-1 font-display text-sm">{value as string}</div>
                  </div>
                </div>
              );
            })}

            {BRANCHES.map((b) => (
              <div key={b.name} className="glass lux-border flex items-start gap-5 rounded-3xl p-6">
                <MapPin className="mt-1 size-4 shrink-0 text-gold/70" />
                <div>
                  <div className="font-display text-sm font-semibold">{b.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{b.address}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
