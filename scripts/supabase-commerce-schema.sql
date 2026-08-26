-- MOTURBO commerce schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  city text not null,
  address text not null,
  payment_method text not null check (payment_method in ('pay_at_studio', 'pay_on_delivery')),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  currency text not null default 'INR',
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  product_name text not null,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity int not null check (quantity > 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_code text not null unique,
  service_name text not null,
  package_name text not null,
  date text not null,
  time text not null,
  branch text not null,
  vehicle text not null,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create index if not exists idx_bookings_created_at on public.bookings(created_at desc);
