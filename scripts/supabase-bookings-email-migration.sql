-- Add customer email to existing bookings table for booking notifications.
alter table public.bookings
  add column if not exists customer_email text;

-- Backfill any existing nulls to avoid not-null failure.
update public.bookings
set customer_email = 'unknown@moturbo.in'
where customer_email is null;

alter table public.bookings
  alter column customer_email set not null;
