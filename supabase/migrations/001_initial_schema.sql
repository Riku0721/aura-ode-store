-- =====================================================
-- Aura & Ode E-Commerce Database Schema
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- PROFILES (extends Supabase auth.users)
-- =====================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin', 'staff')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- ADDRESSES
-- =====================================================
create table public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  city text not null,
  district text not null,
  address text not null,
  postal_code text,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- =====================================================
-- PRODUCT CATEGORIES
-- =====================================================
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references public.categories(id) on delete set null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into public.categories (name, slug, sort_order) values
  ('所有商品', 'all', 0),
  ('最暢銷商品', 'bestsellers', 1),
  ('耳飾', 'earrings', 2),
  ('手鍊', 'bracelets', 3),
  ('戒指', 'rings', 4),
  ('項鍊', 'necklaces', 5),
  ('香氛', 'scents', 6),
  ('療癒小物', 'healing', 7);

-- =====================================================
-- PRODUCTS
-- =====================================================
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2), -- original price for showing discount
  sku text unique,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] default '{}',
  is_active boolean default true,
  is_featured boolean default false,
  weight_grams int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =====================================================
-- PRODUCT IMAGES
-- =====================================================
create table public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- =====================================================
-- PRODUCT VARIANTS (for size/color options)
-- =====================================================
create table public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  name text not null, -- e.g. "金色", "銀色", "S", "M"
  sku text unique,
  price_adjustment numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- =====================================================
-- INVENTORY
-- =====================================================
create table public.inventory (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity int not null default 0,
  low_stock_threshold int default 5,
  updated_at timestamptz default now(),
  unique(product_id, variant_id)
);

-- =====================================================
-- COUPONS
-- =====================================================
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  minimum_order numeric(10,2) default 0,
  usage_limit int, -- null = unlimited
  used_count int default 0,
  valid_from timestamptz default now(),
  valid_until timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- =====================================================
-- ORDERS
-- =====================================================
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text not null unique,
  user_id uuid references public.profiles(id) on delete set null,
  -- Guest checkout fields
  guest_email text,
  guest_name text,
  guest_phone text,
  -- Shipping
  shipping_name text not null,
  shipping_phone text not null,
  shipping_city text not null,
  shipping_district text not null,
  shipping_address text not null,
  shipping_postal_code text,
  -- Financials
  subtotal numeric(10,2) not null,
  shipping_fee numeric(10,2) default 0,
  discount_amount numeric(10,2) default 0,
  total numeric(10,2) not null,
  coupon_code text,
  -- Status
  status text not null default 'pending'
    check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','paid','refunded')),
  payment_method text default 'pending', -- stripe, ecpay, bank_transfer, etc.
  payment_reference text,
  -- Logistics
  carrier text,
  tracking_number text,
  notes text,
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-generate order number
create sequence order_number_seq start 10001;
create or replace function generate_order_number()
returns trigger as $$
begin
  new.order_number := 'AO-' || nextval('order_number_seq')::text;
  return new;
end;
$$ language plpgsql;

create trigger set_order_number
  before insert on public.orders
  for each row execute function generate_order_number();

-- =====================================================
-- ORDER ITEMS
-- =====================================================
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null, -- snapshot at time of order
  variant_name text,
  price numeric(10,2) not null,
  quantity int not null,
  subtotal numeric(10,2) not null
);

-- =====================================================
-- SITE SETTINGS (CMS for admin-editable content)
-- =====================================================
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

-- Insert default site settings
insert into public.site_settings (key, value) values
  ('hero_banners', '[
    {
      "id": "1",
      "image_url": "/images/hero-1.jpg",
      "title": "Live in light. Sing your life.",
      "subtitle": "Wear your little universe.",
      "cta_text": "開始購買",
      "cta_link": "/products",
      "is_active": true
    }
  ]'::jsonb),
  ('homepage_sections', '{
    "show_featured_products": true,
    "featured_title": "精選商品",
    "show_categories": true,
    "show_announcement": false,
    "announcement_text": ""
  }'::jsonb),
  ('store_info', '{
    "store_name": "Aura & Ode",
    "tagline": "ACCESSORIES & SCENT",
    "email": "",
    "phone": "",
    "instagram": "",
    "facebook": "",
    "line_id": "",
    "free_shipping_threshold": 1500,
    "shipping_fee": 60
  }'::jsonb),
  ('seo', '{
    "meta_title": "Aura & Ode | 飾品 × 香氛 × 療癒小物",
    "meta_description": "點綴生活儀式感，讓美好與你日常相伴",
    "og_image": "/images/og-image.jpg"
  }'::jsonb);

-- =====================================================
-- NOTIFICATIONS / LOW STOCK ALERTS
-- =====================================================
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  type text not null, -- 'low_stock', 'new_order', 'cancelled_order'
  title text not null,
  message text not null,
  reference_id uuid, -- product_id or order_id
  is_read boolean default false,
  created_at timestamptz default now()
);

-- =====================================================
-- RLS (Row Level Security) POLICIES
-- =====================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.site_settings enable row level security;
alter table public.notifications enable row level security;
alter table public.categories enable row level security;

-- Helper function
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$ language sql security definer;

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for all using (public.is_admin());

-- Addresses
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id);
create policy "Admins view all addresses" on public.addresses for select using (public.is_admin());

-- Products (public read)
create policy "Anyone can view active products" on public.products for select using (is_active = true or public.is_admin());
create policy "Admins manage products" on public.products for all using (public.is_admin());

-- Categories (public read)
create policy "Anyone can view categories" on public.categories for select using (true);
create policy "Admins manage categories" on public.categories for all using (public.is_admin());

-- Product images (public read)
create policy "Anyone can view product images" on public.product_images for select using (true);
create policy "Admins manage product images" on public.product_images for all using (public.is_admin());

-- Product variants (public read)
create policy "Anyone can view variants" on public.product_variants for select using (true);
create policy "Admins manage variants" on public.product_variants for all using (public.is_admin());

-- Inventory (admin only)
create policy "Anyone can view inventory" on public.inventory for select using (true);
create policy "Admins manage inventory" on public.inventory for all using (public.is_admin());

-- Orders
create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Users create orders" on public.orders for insert with check (true);
create policy "Admins manage orders" on public.orders for all using (public.is_admin());

-- Order items
create policy "Users view own order items" on public.order_items for select
  using (exists (select 1 from public.orders where id = order_id and (user_id = auth.uid() or public.is_admin())));
create policy "Insert order items" on public.order_items for insert with check (true);

-- Site settings (public read, admin write)
create policy "Anyone can read site settings" on public.site_settings for select using (true);
create policy "Admins update site settings" on public.site_settings for all using (public.is_admin());

-- Coupons
create policy "Anyone can check coupons" on public.coupons for select using (is_active = true or public.is_admin());
create policy "Admins manage coupons" on public.coupons for all using (public.is_admin());

-- Notifications (admin only)
create policy "Admins manage notifications" on public.notifications for all using (public.is_admin());

-- =====================================================
-- TRIGGERS: updated_at auto-update
-- =====================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on public.products
  for each row execute function update_updated_at();
create trigger orders_updated_at before update on public.orders
  for each row execute function update_updated_at();
create trigger profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at();

-- =====================================================
-- TRIGGER: Auto-create profile on user signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- TRIGGER: Low stock notification
-- =====================================================
create or replace function check_low_stock()
returns trigger as $$
begin
  if new.quantity <= new.low_stock_threshold then
    insert into public.notifications (type, title, message, reference_id)
    select 'low_stock', '庫存不足警告',
      '商品 "' || p.name || '" 庫存剩餘 ' || new.quantity || ' 件，請盡快補貨。',
      new.product_id
    from public.products p where p.id = new.product_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger inventory_low_stock
  after update on public.inventory
  for each row execute function check_low_stock();

-- =====================================================
-- INDEXES
-- =====================================================
create index products_category_id_idx on public.products(category_id);
create index products_is_active_idx on public.products(is_active);
create index products_is_featured_idx on public.products(is_featured);
create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index orders_created_at_idx on public.orders(created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index inventory_product_id_idx on public.inventory(product_id);
