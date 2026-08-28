import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SERVICES } from "@/data/catalog";
import { LuxButton, Reveal } from "@/components/lux";
import { SOCIAL_LINKS } from "@/components/SocialFloating";

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="relative overflow-hidden border-t border-white/8">
      <div className="absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-gold)] opacity-60" />
      <div className="absolute inset-0 spotlight" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-purple-royal/18 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-10">
        <Reveal className="text-center">
          <div className="eyebrow">Reception</div>
          <h2
            className="mt-5 font-display text-[13vw] leading-none font-black text-chrome sm:text-[9rem]"
            style={{ textShadow: "0 0 90px oklch(0.68 0.2 300 / 45%)" }}
          >
            MOTURBO
          </h2>
          <p className="mt-3 font-display text-[0.68rem] tracking-[0.5em] text-muted-foreground uppercase">
            Luxury Automotive Studio
          </p>
        </Reveal>

        <div className="hairline my-14" />

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="eyebrow">Newsletter</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Private previews of new finishes, workroom drops and members-only detailing slots.
            </p>
            <form
              className="glass mt-6 flex items-center gap-2 rounded-full p-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email.includes("@")) {
                  toast.error("Enter a valid email");
                  return;
                }
                setEmail("");
                toast.success("Welcome to the MOTURBO circle.");
              }}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <LuxButton className="px-5 py-2.5 text-[0.6rem]">Join</LuxButton>
            </form>

            <div className="mt-8 flex gap-2">
              {[
                { Icon: Instagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
                { Icon: Youtube, href: "#", label: "YouTube" },
                { Icon: Facebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={`MOTURBO on ${label}`}
                  className="glass grid size-10 place-items-center rounded-full text-muted-foreground transition-all hover:-translate-y-1 hover:text-gold-soft"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="eyebrow">Quick Links</div>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              {[
                ["/", "Showroom"],
                ["/services", "Services"],
                ["/shop", "Shop"],
                ["/book", "Book Appointment"],
                ["/gallery", "Gallery"],
                ["/about", "Studio"],
                ["/blog", "Journal"],
                ["/track", "Order Tracking"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to!} className="transition-colors hover:text-gold-soft">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow">Services</div>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              {SERVICES.slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link to="/services" className="transition-colors hover:text-gold-soft">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow">Studio</div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold/70" />
                Site No.02 Gottigere Village, 80 Feet Road, Uttarahalli Hobli, Bangalore South Taluk, Bangalore - 560083
              </li>
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold/70" /> +91 8147702688
              </li>
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold/70" /> moturbo@gmail.com
              </li>
              <li className="flex gap-2.5">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gold/70" />
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gold-soft"
                >
                  WhatsApp executive
                </a>
              </li>
            </ul>
            <div className="mt-6 text-sm text-muted-foreground">
              <div className="eyebrow">Hours</div>
              <p className="mt-3">Mon – Sat · 08:00 – 21:00</p>
              <p>Sunday · By appointment</p>
            </div>
          </div>
        </div>

        <div className="hairline my-10" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MOTURBO Automotive Studio. All rights reserved.</p>
          <p className="tracking-[0.25em] uppercase">Precision · Performance · Prestige</p>
        </div>
      </div>
    </footer>
  );
}
