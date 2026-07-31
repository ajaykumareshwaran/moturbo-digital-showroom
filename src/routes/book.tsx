import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { LuxButton, Magnetic } from "@/components/lux";
import { BRANCHES, SERVICES, VEHICLE_BRANDS, currency } from "@/data/catalog";
import { useStore } from "@/context/StoreContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search["service"] === "string" ? (search["service"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book a Studio Slot | MOTURBO" },
      {
        name: "description",
        content: "Reserve a MOTURBO bay in four steps: choose your service, your car, your slot and confirm.",
      },
      { property: "og:title", content: "Book a Studio Slot | MOTURBO" },
      { property: "og:description", content: "Concierge collection, private lounge, live progress updates." },
    ],
  }),
  component: BookPage,
});

const STEPS = ["Service", "Vehicle", "Slot", "Confirm"];
const TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function BookPage() {
  const { service: preset } = Route.useSearch();
  const { addBooking } = useStore();
  const [step, setStep] = useState(0);
  const [service, setService] = useState(preset ?? SERVICES[0]!.slug);
  const [brand, setBrand] = useState(VEHICLE_BRANDS[0]!);
  const [model, setModel] = useState("");
  const [branch, setBranch] = useState(BRANCHES[0]!.name);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIMES[2]!);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<string | null>(null);

  const chosen = SERVICES.find((s) => s.slug === service) ?? SERVICES[0]!;
  const canNext = step === 1 ? model.trim().length > 1 : step === 2 ? date !== "" : true;

  function confirm() {
    const created = addBooking({
      service: chosen.name,
      package: chosen.name,
      vehicle: `${brand} ${model}`,
      branch,
      date,
      time,
      total: chosen.from,
    });
    setDone(created.id);
    toast.success("Bay reserved");
  }

  return (
    <>
      <PageHeader
        eyebrow="Reservation"
        title={<>Book your <span className="text-gold">bay</span></>}
        sub="Four steps. Concierge collection available across the city."
      />

      <section className="mx-auto max-w-4xl px-6 pb-28">
        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass lux-border rounded-[2rem] p-12 text-center"
          >
            <div
              className="mx-auto grid size-16 place-items-center rounded-full"
              style={{ backgroundImage: "var(--gradient-gold)" }}
            >
              <Check className="size-7 text-noir" />
            </div>
            <h2 className="mt-7 font-display text-3xl font-semibold">Reservation confirmed</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {chosen.name} · {brand} {model} · {date} at {time}
            </p>
            <div className="mt-7 inline-block rounded-2xl border border-gold/30 px-8 py-4">
              <div className="text-[0.55rem] tracking-[0.24em] text-muted-foreground uppercase">Reference</div>
              <div className="mt-1 font-display text-2xl font-bold text-gold">{done}</div>
            </div>
            <p className="mt-7 text-xs text-muted-foreground">Track live progress from the Track Order page.</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-10 flex items-center justify-between">
              {STEPS.map((s, i) => (
                <div key={s} className="flex flex-1 items-center">
                  <div
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full font-display text-xs transition-all",
                      i <= step ? "text-noir" : "glass text-muted-foreground",
                    )}
                    style={i <= step ? { backgroundImage: "var(--gradient-gold)" } : undefined}
                  >
                    {i < step ? <Check className="size-4" /> : i + 1}
                  </div>
                  <span className="ml-3 hidden font-display text-[0.6rem] tracking-[0.2em] uppercase sm:block">
                    {s}
                  </span>
                  {i < STEPS.length - 1 && <div className="mx-4 h-px flex-1 bg-white/10" />}
                </div>
              ))}
            </div>

            <div className="glass lux-border rounded-[2rem] p-8 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {step === 0 && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {SERVICES.map((s) => (
                        <button
                          key={s.slug}
                          onClick={() => setService(s.slug)}
                          className={cn(
                            "rounded-2xl border p-5 text-left transition-all",
                            service === s.slug
                              ? "border-gold/50 bg-gold/5"
                              : "border-white/10 hover:border-white/25",
                          )}
                        >
                          <div className="font-display text-sm font-semibold">{s.name}</div>
                          <div className="mt-1.5 text-[0.65rem] text-muted-foreground">
                            {s.duration} · from {currency(s.from)}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <Field label="Vehicle brand">
                        <select
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="input-lux"
                        >
                          {VEHICLE_BRANDS.map((b) => (
                            <option key={b} value={b} className="bg-noir">
                              {b}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Model & year">
                        <input
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="911 Turbo S, 2023"
                          className="input-lux"
                        />
                      </Field>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <Field label="Studio">
                        <select value={branch} onChange={(e) => setBranch(e.target.value)} className="input-lux">
                          {BRANCHES.map((b) => (
                            <option key={b.name} value={b.name} className="bg-noir">
                              {b.name} — {b.address}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Date">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="input-lux"
                        />
                      </Field>
                      <Field label="Time slot">
                        <div className="flex flex-wrap gap-2">
                          {TIMES.map((t) => (
                            <button
                              key={t}
                              onClick={() => setTime(t)}
                              className={cn(
                                "rounded-full border px-5 py-2.5 font-display text-xs transition-all",
                                time === t ? "border-gold/50 text-gold" : "border-white/10 text-muted-foreground",
                              )}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </Field>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 text-sm">
                        <div className="font-display text-base font-semibold text-gold">{chosen.name}</div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {brand} {model || "—"} · {branch} · {date || "select a date"} at {time}
                        </div>
                        <div className="mt-3 font-display text-sm">From {currency(chosen.from)}</div>
                      </div>
                      <Field label="Full name">
                        <input value={name} onChange={(e) => setName(e.target.value)} className="input-lux" />
                      </Field>
                      <Field label="Phone">
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-lux" />
                      </Field>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 font-display text-[0.62rem] tracking-[0.22em] text-muted-foreground uppercase disabled:opacity-30"
                >
                  <ChevronLeft className="size-3.5" /> Back
                </button>
                <Magnetic>
                  {step === 3 ? (
                    <LuxButton onClick={confirm} disabled={!name || !phone}>
                      Confirm reservation
                    </LuxButton>
                  ) : (
                    <LuxButton onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext}>
                      Continue <ChevronRight className="size-3.5" />
                    </LuxButton>
                  )}
                </Magnetic>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}