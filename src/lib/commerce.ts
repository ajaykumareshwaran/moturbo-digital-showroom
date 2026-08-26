import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OrderLineSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  qty: z.number().int().positive(),
});

const PlaceOrderSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(7),
  city: z.string().trim().min(2),
  address: z.string().trim().min(5),
  paymentMethod: z.enum(["pay_at_studio", "pay_on_delivery"]),
  lines: z.array(OrderLineSchema).min(1),
});

const CreateBookingSchema = z.object({
  service: z.string().trim().min(1),
  packageName: z.string().trim().min(1),
  date: z.string().trim().min(1),
  time: z.string().trim().min(1),
  branch: z.string().trim().min(1),
  vehicle: z.string().trim().min(2),
  total: z.number().nonnegative(),
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(7),
});

const ReviewOrderSchema = z.object({
  orderCode: z.string().trim().min(3),
  action: z.enum(["accept", "decline"]),
});

type OrderInsert = {
  order_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  city: string;
  address: string;
  payment_method: "pay_at_studio" | "pay_on_delivery";
  total_amount: number;
  currency: "INR";
  status: "received" | "accepted" | "declined" | "confirmed";
};

type BookingInsert = {
  booking_code: string;
  service_name: string;
  package_name: string;
  date: string;
  time: string;
  branch: string;
  vehicle: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: "confirmed";
};

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

async function supabaseInsert<T>(table: string, payload: T): Promise<any[]> {
  const supabaseUrl = readEnv("VITE_SUPABASE_URL");
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const anonKey = readEnv("VITE_SUPABASE_ANON_KEY");

  async function insertWithKey(key: string) {
    return await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });
  }

  let response: Response;

  try {
    response = await insertWithKey(serviceRoleKey || anonKey);
  } catch (error) {
    const cause = error instanceof Error && "cause" in error ? (error as Error & { cause?: unknown }).cause : undefined;
    const causeText = cause instanceof Error ? cause.message : "Unknown network error";
    throw new Error(`Supabase network request failed: ${causeText}`);
  }

  if (response.status === 401 && serviceRoleKey) {
    response = await insertWithKey(anonKey);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase insert failed for ${table}: ${errorText}`);
  }

  return (await response.json()) as any[];
}

async function supabaseUpdate(table: string, filter: string, payload: Record<string, unknown>): Promise<any[]> {
  const supabaseUrl = readEnv("VITE_SUPABASE_URL");
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const anonKey = readEnv("VITE_SUPABASE_ANON_KEY");

  async function updateWithKey(key: string) {
    return await fetch(`${supabaseUrl}/rest/v1/${table}?${filter}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });
  }

  let response: Response;

  try {
    response = await updateWithKey(serviceRoleKey || anonKey);
  } catch (error) {
    const cause = error instanceof Error && "cause" in error ? (error as Error & { cause?: unknown }).cause : undefined;
    const causeText = cause instanceof Error ? cause.message : "Unknown network error";
    throw new Error(`Supabase network request failed: ${causeText}`);
  }

  if (response.status === 401 && serviceRoleKey) {
    response = await updateWithKey(anonKey);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase update failed for ${table}: ${errorText}`);
  }

  return (await response.json()) as any[];
}

async function supabaseSelect<T>(table: string, query: string): Promise<T[]> {
  const supabaseUrl = readEnv("VITE_SUPABASE_URL");
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const anonKey = readEnv("VITE_SUPABASE_ANON_KEY");

  async function selectWithKey(key: string) {
    return await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
  }

  let response: Response;

  try {
    response = await selectWithKey(serviceRoleKey || anonKey);
  } catch (error) {
    const cause = error instanceof Error && "cause" in error ? (error as Error & { cause?: unknown }).cause : undefined;
    const causeText = cause instanceof Error ? cause.message : "Unknown network error";
    throw new Error(`Supabase network request failed: ${causeText}`);
  }

  if (response.status === 401 && serviceRoleKey) {
    response = await selectWithKey(anonKey);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase select failed for ${table}: ${errorText}`);
  }

  return (await response.json()) as T[];
}

async function sendResendEmail(args: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const resendApiKey = readEnv("RESEND_API_KEY");
  const from = readEnv("RESEND_FROM_EMAIL");
  const fromName = process.env["MAIL_FROM_NAME"] || "MOTURBO Executive Desk";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${from}>`,
      to: Array.isArray(args.to) ? args.to : [args.to],
      subject: args.subject,
      html: args.html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend send failed: ${errorText}`);
  }
}

async function sendOrderEmail(args: {
  orderCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: "pay_at_studio" | "pay_on_delivery";
  totalAmount: number;
  lineCount: number;
  city: string;
  address: string;
}) {
  const executiveEmail = readEnv("ORDER_NOTIFY_TO_EMAIL");

  await sendResendEmail({
    to: executiveEmail,
    subject: `New order received: ${args.orderCode}`,
    html: `
      <h2>New MOTURBO order received</h2>
      <p><strong>Order:</strong> ${args.orderCode}</p>
      <p><strong>Customer:</strong> ${args.customerName}</p>
      <p><strong>Email:</strong> ${args.customerEmail}</p>
      <p><strong>Phone:</strong> ${args.customerPhone}</p>
      <p><strong>City:</strong> ${args.city}</p>
      <p><strong>Address:</strong> ${args.address}</p>
      <p><strong>Payment:</strong> ${args.paymentMethod === "pay_at_studio" ? "Pay at studio" : "Pay on delivery"}</p>
      <p><strong>Items:</strong> ${args.lineCount}</p>
      <p><strong>Total:</strong> INR ${args.totalAmount.toLocaleString("en-IN")}</p>
      <p style="margin-top:16px;">Please review and manage this order from the admin workflow.</p>
    `,
  });

  await sendResendEmail({
    to: args.customerEmail,
    subject: `Order received: ${args.orderCode}`,
    html: `
      <h2>Your MOTURBO order is received</h2>
      <p>Hello ${args.customerName},</p>
      <p>We have received your order and our executive team is reviewing it.</p>
      <p><strong>Order:</strong> ${args.orderCode}</p>
      <p><strong>Payment:</strong> ${args.paymentMethod === "pay_at_studio" ? "Pay at studio" : "Pay on delivery"}</p>
      <p><strong>Total:</strong> INR ${args.totalAmount.toLocaleString("en-IN")}</p>
      <p>We will confirm this order shortly.</p>
    `,
  });
}

async function sendBookingEmail(args: {
  bookingCode: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  vehicle: string;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  const executiveEmail = process.env["BOOKING_NOTIFY_TO_EMAIL"] || readEnv("ORDER_NOTIFY_TO_EMAIL");

  await sendResendEmail({
    to: executiveEmail,
    subject: `New booking received: ${args.bookingCode}`,
    html: `
      <h2>New MOTURBO booking received</h2>
      <p><strong>Reference:</strong> ${args.bookingCode}</p>
      <p><strong>Service:</strong> ${args.service}</p>
      <p><strong>Vehicle:</strong> ${args.vehicle}</p>
      <p><strong>Studio:</strong> ${args.branch}</p>
      <p><strong>Slot:</strong> ${args.date} at ${args.time}</p>
      <p><strong>Customer:</strong> ${args.customerName}</p>
      <p><strong>Email:</strong> ${args.customerEmail}</p>
      <p><strong>Phone:</strong> ${args.customerPhone}</p>
      <p><strong>Estimated total:</strong> INR ${args.total.toLocaleString("en-IN")}</p>
    `,
  });

  await sendResendEmail({
    to: args.customerEmail,
    subject: `Booking received: ${args.bookingCode}`,
    html: `
      <h2>Your MOTURBO booking is received</h2>
      <p>Hello ${args.customerName},</p>
      <p>Your booking request has been received.</p>
      <p><strong>Reference:</strong> ${args.bookingCode}</p>
      <p><strong>Service:</strong> ${args.service}</p>
      <p><strong>Vehicle:</strong> ${args.vehicle}</p>
      <p><strong>Studio:</strong> ${args.branch}</p>
      <p><strong>Slot:</strong> ${args.date} at ${args.time}</p>
      <p><strong>Estimated total:</strong> INR ${args.total.toLocaleString("en-IN")}</p>
      <p>Our executive will contact you shortly.</p>
    `,
  });
}

function makeCode(prefix: string): string {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${token}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .validator((input: unknown) => PlaceOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const totalAmount = data.lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const orderCode = makeCode("MTB");

    const orderPayload: OrderInsert = {
      order_code: orderCode,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      city: data.city,
      address: data.address,
      payment_method: data.paymentMethod,
      total_amount: totalAmount,
      currency: "INR",
      status: "received",
    };

    const orderRows = await supabaseInsert("orders", orderPayload);
    const orderId = orderRows[0]?.id as string | undefined;

    if (!orderId) {
      throw new Error("Order insert did not return an id");
    }

    const itemPayload = data.lines.map((line) => ({
      order_id: orderId,
      product_slug: line.slug,
      product_name: line.name,
      unit_price: line.price,
      quantity: line.qty,
      line_total: line.price * line.qty,
    }));

    await supabaseInsert("order_items", itemPayload);

    try {
      await sendOrderEmail({
        orderCode,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        paymentMethod: data.paymentMethod,
        totalAmount,
        lineCount: data.lines.length,
        city: data.city,
        address: data.address,
      });
    } catch (error) {
      console.error("Order saved but email failed", error);
    }

    return { orderCode };
  });

export const createBooking = createServerFn({ method: "POST" })
  .validator((input: unknown) => CreateBookingSchema.parse(input))
  .handler(async ({ data }) => {
    const bookingCode = makeCode("MT");

    const bookingPayload: BookingInsert = {
      booking_code: bookingCode,
      service_name: data.service,
      package_name: data.packageName,
      date: data.date,
      time: data.time,
      branch: data.branch,
      vehicle: data.vehicle,
      total_amount: data.total,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      status: "confirmed",
    };

    await supabaseInsert("bookings", bookingPayload);

    try {
      await sendBookingEmail({
        bookingCode,
        service: data.service,
        branch: data.branch,
        date: data.date,
        time: data.time,
        vehicle: data.vehicle,
        total: data.total,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
      });
    } catch (error) {
      console.error("Booking saved but email failed", error);
    }

    return { bookingCode };
  });

export const reviewOrder = createServerFn({ method: "GET" })
  .validator((input: unknown) => ReviewOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const nextStatus = data.action === "accept" ? "accepted" : "declined";
    const existingRows = await supabaseSelect<{
      order_code: string;
      customer_name: string;
      customer_email: string;
      total_amount: number;
      status: string;
    }>(
      "orders",
      `select=order_code,customer_name,customer_email,total_amount,status&order_code=eq.${encodeURIComponent(data.orderCode)}&limit=1`,
    );

    const existing = existingRows[0];
    if (!existing) {
      throw new Error("Order not found");
    }

    if (existing.status === nextStatus) {
      return { status: nextStatus, orderCode: existing.order_code, alreadyProcessed: true };
    }

    const rows = await supabaseUpdate("orders", `order_code=eq.${encodeURIComponent(data.orderCode)}`, {
      status: nextStatus,
    });

    const updated = rows[0] as
      | {
          order_code: string;
          customer_name: string;
          customer_email: string;
          total_amount: number;
        }
      | undefined;

    if (!updated) {
      throw new Error("Order not found");
    }

    if (data.action === "accept") {
      try {
        await sendResendEmail({
          to: updated.customer_email,
          subject: `Order confirmed: ${updated.order_code}`,
          html: `
            <h2>Your MOTURBO order is confirmed</h2>
            <p>Hello ${updated.customer_name},</p>
            <p>Your order <strong>${updated.order_code}</strong> has been confirmed by our executive.</p>
            <p><strong>Total:</strong> INR ${Number(updated.total_amount).toLocaleString("en-IN")}</p>
            <p>Our team will contact you for next steps.</p>
          `,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown mail error";
        throw new Error(`Order accepted, but customer confirmation email failed: ${message}`);
      }
    }

    return { status: nextStatus, orderCode: updated.order_code };
  });
