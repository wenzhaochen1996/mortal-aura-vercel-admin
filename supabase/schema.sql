create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text default '',
  phone text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text default 'Default',
  recipient_name text default '',
  phone text default '',
  country text default '',
  state_region text default '',
  city text default '',
  postal_code text default '',
  address_line1 text default '',
  address_line2 text default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  fulfillment_status text not null default 'unfulfilled',
  currency text not null default 'JPY',
  subtotal_jpy integer not null default 0,
  total_jpy integer not null default 0,
  shipping_name text default '',
  shipping_phone text default '',
  shipping_country text default '',
  shipping_state_region text default '',
  shipping_city text default '',
  shipping_postal_code text default '',
  shipping_address_line1 text default '',
  shipping_address_line2 text default '',
  order_note text default '',
  tracking_number text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  sku text not null,
  title text not null,
  quantity integer not null default 1,
  unit_price_jpy integer not null default 0,
  line_total_jpy integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  sku text primary key,
  title text not null,
  price_jpy integer not null,
  image_url text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table profiles enable row level security;
alter table customer_addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on profiles for insert with check (auth.uid() = id);

create policy "addresses_select_own" on customer_addresses for select using (auth.uid() = user_id);
create policy "orders_select_own" on orders for select using (auth.uid() = user_id);
create policy "order_items_select_own" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
);
