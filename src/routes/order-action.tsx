import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { LuxLink } from "@/components/lux";
import { reviewOrder } from "@/lib/commerce";

export const Route = createFileRoute("/order-action")({
  validateSearch: (search: Record<string, unknown>) => ({
    action: typeof search["action"] === "string" ? (search["action"] as string) : undefined,
    code: typeof search["code"] === "string" ? (search["code"] as string) : undefined,
  }),
  loaderDeps: ({ search }) => ({
    action: search.action,
    code: search.code,
  }),
  loader: async ({ deps }) => {
    if (!deps.code || (deps.action !== "accept" && deps.action !== "decline")) {
      return { state: "invalid" as const, message: "Invalid order action link." };
    }

    try {
      const result = await reviewOrder({
        data: {
          orderCode: deps.code,
          action: deps.action,
        },
      });

      if (result.status === "accepted") {
        return {
          state: "accepted" as const,
          message: `Order ${result.orderCode} accepted. Customer has been notified.`,
        };
      }

      return {
        state: "declined" as const,
        message: `Order ${result.orderCode} declined.`,
      };
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Could not process order action.";
      return { state: "error" as const, message };
    }
  },
  head: () => ({
    meta: [{ title: "Order Action | MOTURBO" }],
  }),
  component: OrderActionPage,
});

function OrderActionPage() {
  const data = Route.useLoaderData();

  return (
    <>
      <PageHeader eyebrow="Executive" title={<>Order <span className="text-gold">Action</span></>} />
      <section className="mx-auto max-w-3xl px-6 pb-28">
        <div className="glass lux-border rounded-3xl p-8 text-center">
          {data.state === "accepted" && <p className="text-gold">{data.message}</p>}
          {data.state === "declined" && <p className="text-muted-foreground">{data.message}</p>}
          {(data.state === "invalid" || data.state === "error") && <p className="text-destructive">{data.message}</p>}
          <div className="mt-7 flex justify-center gap-3">
            <LuxLink to="/track" variant="ghost">
              Open Track Page
            </LuxLink>
            <LuxLink to="/" variant="gold">
              Go to Home
            </LuxLink>
          </div>
        </div>
      </section>
    </>
  );
}
