import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { LuxButton, Magnetic } from "@/components/lux";
import { BRANCHES, SERVICES, VEHICLE_BRANDS, currency } from "@/data/catalog";
import { useStore } from "@/context/StoreContext";
import { createBooking } from "@/lib/commerce";
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
      { property: "og:description", content: "Executive collection, private lounge, live progress updates." },
    ],
  }),
  component: BookPage,
});

const STEPS = ["Service", "Details"];
const TIMES = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

function getInputDate(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function BookPage() {
  const { service: preset } = Route.useSearch();
  const { addBooking } = useStore();
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preset ? [preset] : [SERVICES[0]!.slug],
  );
  const [brand, setBrand] = useState(VEHICLE_BRANDS[0]!);
  const [model, setModel] = useState("");
  const branch = BRANCHES[0]!.name;
  const [date, setDate] = useState(getInputDate(new Date()));
  const [time, setTime] = useState(TIMES[2]!);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const chosen = SERVICES.find((s) => s.slug === selectedServices[0]) ?? SERVICES[0]!;
  const serviceSummary = selectedServices.length
    ? selectedServices.map((slug) => SERVICES.find((s) => s.slug === slug)?.name ?? slug).join(" + ")
    : "Select a service";
  const totalFrom = selectedServices.reduce((sum, slug) => {
    const item = SERVICES.find((s) => s.slug === slug);
    return sum + (item?.from ?? 0);
  }, 0);
  const today = getInputDate(new Date());
  const maxDate = getInputDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2));
  const canNext = step === 0 ? selectedServices.length > 0 : model.trim().length > 1 && !!date && date >= today;

  const validateBooking = () => {
    const nextErrors: Record<string, string> = {};

    if (name.trim().length < 2) nextErrors.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Please enter a valid email.";
    if (phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Please enter a valid phone number.";
    if (!model.trim()) nextErrors.model = "Please add your vehicle model.";
    if (!date || date < today) nextErrors.date = "Please select today or a future date.";

    setFieldErrors(nextErrors);
    return nextErrors;
  };

  const toggleService = (slug: string) => {
    setSelectedServices((current) => {
      const exists = current.includes(slug);
      return exists ? current.filter((item) => item !== slug) : [...current, slug];
    });
  };

  async function confirm() {
    const nextErrors = validateBooking();
    if (Object.keys(nextErrors).length > 0) {
      const firstMessage = Object.values(nextErrors)[0] ?? "Please complete the required fields.";
      toast.error(firstMessage);
      return;
    }

    if (!date || date < today) {
      toast.error("Please select today or a future date");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking({
        data: {
          service: serviceSummary,
          packageName: serviceSummary,
          vehicle: `${brand} ${model}`,
          branch,
          date,
          time,
          total: totalFrom,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
        },
      });

      const created = addBooking({
        id: result.bookingCode,
        status: "Confirmed",
        service: serviceSummary,
        package: serviceSummary,
        vehicle: `${brand} ${model}`,
        branch,
        date,
        time,
        total: totalFrom,
      });

      setDone(created.id);
      toast.success("Bay reserved");
    } catch (error) {
      console.error(error);
      toast.error("Could not reserve the bay. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Reservation"
        title={<>Book your <span className="text-gold">bay</span></>}
        sub="Four steps. Executive collection available across the city."
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
                      {SERVICES.map((s) => {
                        const selected = selectedServices.includes(s.slug);

                        return (
                          <button
                            key={s.slug}
                            type="button"
                            onClick={() => toggleService(s.slug)}
                            className={cn(
                              "rounded-2xl border p-5 text-left transition-all",
                              selected
                                ? "border-gold/50 bg-gold/5"
                                : "border-white/10 hover:border-white/25",
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="font-display text-sm font-semibold">{s.name}</div>
                              {selected && <Sparkles className="size-4 text-gold" />}
                            </div>
                            <div className="mt-1.5 text-[0.65rem] text-muted-foreground">
                              {s.duration} · from {currency(s.from)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-4 text-sm sm:p-5">
                        <div className="text-[0.55rem] tracking-[0.22em] text-muted-foreground uppercase">Selected services</div>
                        <div className="mt-2 font-display text-base font-semibold text-gold">{serviceSummary}</div>
                      </div>

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
                          onChange={(e) => {
                            setModel(e.target.value);
                            setFieldErrors((current) => ({ ...current, model: "" }));
                          }}
                          placeholder="911 Turbo S, 2023"
                          className={cn("input-lux", fieldErrors.model && "border-red-500/80")}
                        />
                        {fieldErrors.model && <p className="mt-2 text-xs text-red-300">{fieldErrors.model}</p>}
                      </Field>
                      <Field label="Preferred date">
                        <input
                          type="date"
                          value={date}
                          min={today}
                          max={maxDate}
                          onChange={(e) => {
                            setDate(e.target.value);
                            setFieldErrors((current) => ({ ...current, date: "" }));
                          }}
                          className={cn("input-lux", fieldErrors.date && "border-red-500/80")}
                        />
                        {fieldErrors.date && <p className="mt-2 text-xs text-red-300">{fieldErrors.date}</p>}
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
                      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 text-sm">
                        <div className="font-display text-base font-semibold text-gold">{serviceSummary}</div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {brand} {model || "—"} · {branch} · {date || "select a date"} at {time}
                        </div>
                        <div className="mt-3 font-display text-sm">From {currency(totalFrom)}</div>
                      </div>
                      <Field label="Full name">
                        <input
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            setFieldErrors((current) => ({ ...current, name: "" }));
                          }}
                          className={cn("input-lux", fieldErrors.name && "border-red-500/80")}
                        />
                        {fieldErrors.name && <p className="mt-2 text-xs text-red-300">{fieldErrors.name}</p>}
                      </Field>
                      <Field label="Email">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setFieldErrors((current) => ({ ...current, email: "" }));
                          }}
                          className={cn("input-lux", fieldErrors.email && "border-red-500/80")}
                        />
                        {fieldErrors.email && <p className="mt-2 text-xs text-red-300">{fieldErrors.email}</p>}
                      </Field>
                      <Field label="Phone">
                        <input
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            setFieldErrors((current) => ({ ...current, phone: "" }));
                          }}
                          className={cn("input-lux", fieldErrors.phone && "border-red-500/80")}
                        />
                        {fieldErrors.phone && <p className="mt-2 text-xs text-red-300">{fieldErrors.phone}</p>}
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
                  {step === 1 ? (
                    <LuxButton
                      onClick={confirm}
                      disabled={!selectedServices.length || !name || !email || !phone || !model.trim() || !date || date < today || isSubmitting}
                    >
                      {isSubmitting ? "Confirming..." : "Confirm reservation"}
                    </LuxButton>
                  ) : (
                    <LuxButton onClick={() => { if (canNext) { setFieldErrors({}); setStep((s) => s + 1); }}} disabled={!canNext}>
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