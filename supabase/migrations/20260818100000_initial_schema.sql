create type public.price_mode as enum ('fixed', 'from', 'quote');
create type public.order_type as enum ('catalog', 'custom');
create type public.order_status as enum ('new', 'pending_confirmation', 'confirmed', 'in_preparation', 'ready', 'completed', 'cancelled', 'no_response');
create type public.fulfilment_type as enum ('pickup', 'delivery');
create type public.admin_role as enum ('admin');

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.admin_role not null default 'admin', active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.site_settings (
  id boolean primary key default true check (id), business_name text not null, business_description text not null,
  public_phone text, public_email text, address text, opening_hours text,
  instagram_url text, facebook_url text, tiktok_url text, accepting_orders boolean not null default true,
  closed_orders_message text not null, minimum_notice_days integer not null default 3 check (minimum_notice_days >= 0),
  pickup_enabled boolean not null default true, delivery_enabled boolean not null default false,
  payment_bizum_enabled boolean not null default false, payment_cash_enabled boolean not null default true,
  payment_card_in_store_enabled boolean not null default false, payment_information_text text,
  order_confirmation_text text not null, allergen_general_notice text, hero_title text not null,
  hero_subtitle text, hero_image text, custom_orders_title text not null, custom_orders_description text,
  about_title text, about_description text, about_image text,
  business_timezone text not null default 'Europe/Madrid', privacy_notice_version text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.categories (
  id uuid primary key default gen_random_uuid(), name text not null check (btrim(name) <> ''), slug text not null unique check (btrim(slug) <> ''),
  description text, image_path text, active boolean not null default true, sort_order integer not null default 0 check (sort_order >= 0),
  archived_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete set null,
  slug text not null unique check (btrim(slug) <> ''), name text not null check (btrim(name) <> ''),
  short_description text not null, description text not null, price_mode public.price_mode not null,
  base_price_cents integer check (base_price_cents >= 0), currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  active boolean not null default true, published boolean not null default false, available boolean not null default true,
  featured boolean not null default false, sort_order integer not null default 0 check (sort_order >= 0), archived_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint products_price_mode_price_check check ((price_mode in ('fixed','from') and base_price_cents is not null) or (price_mode = 'quote' and base_price_cents is null))
);
create table public.product_images (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  path text not null unique check (btrim(path) <> ''), alt_text text not null default '', sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false, created_at timestamptz not null default now()
);
create unique index product_images_one_primary_idx on public.product_images(product_id) where is_primary;
create table public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  name text not null check (btrim(name) <> ''), description text, price_cents integer check (price_cents >= 0),
  servings_min integer check (servings_min > 0), servings_max integer check (servings_max > 0), active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (servings_min is null or servings_max is null or servings_max >= servings_min)
);
create table public.flavours (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, active boolean not null default true,
  sort_order integer not null default 0 check (sort_order >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_flavours (
  product_id uuid not null references public.products(id) on delete cascade, flavour_id uuid not null references public.flavours(id) on delete cascade,
  primary key(product_id, flavour_id)
);
create table public.allergens (
  id uuid primary key default gen_random_uuid(), code text not null unique, name text not null,
  sort_order integer not null default 0 check (sort_order >= 0), active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.product_allergens (
  product_id uuid not null references public.products(id) on delete cascade, allergen_id uuid not null references public.allergens(id) on delete cascade,
  primary key(product_id, allergen_id)
);
create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(), start_date date not null, end_date date not null,
  reason_internal text not null check (btrim(reason_internal) <> ''), public_message text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check (end_date >= start_date)
);
create table public.orders (
  id uuid primary key default gen_random_uuid(), human_reference text not null unique check (btrim(human_reference) <> ''),
  type public.order_type not null, customer_name text not null check (btrim(customer_name) <> ''), phone text not null check (btrim(phone) <> ''),
  phone_normalized text, requested_date date not null, status public.order_status not null default 'new', customer_notes text, admin_notes text,
  fulfilment_type public.fulfilment_type, estimated_price_cents integer check (estimated_price_cents >= 0), final_price_cents integer check (final_price_cents >= 0),
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'), privacy_notice_version text not null check (btrim(privacy_notice_version) <> ''),
  privacy_acknowledged_at timestamptz not null, idempotency_key uuid unique, admin_seen_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null, product_name_snapshot text not null check (btrim(product_name_snapshot) <> ''),
  quantity integer not null check (quantity > 0), variant_name_snapshot text, flavour_name_snapshot text,
  unit_price_snapshot_cents integer check (unit_price_snapshot_cents >= 0), notes text, created_at timestamptz not null default now()
);
create table public.custom_order_details (
  order_id uuid primary key references public.orders(id) on delete restrict, servings integer check (servings > 0),
  description text not null check (btrim(description) <> ''), flavour_preferences text, custom_notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.order_reference_images (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  storage_path text not null unique, mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 8388608), created_at timestamptz not null default now()
);
create table public.order_status_history (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  previous_status public.order_status, new_status public.order_status not null, changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create table public.email_events (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete restrict,
  type text not null check (btrim(type) <> ''), status text not null check (status in ('sent','failed')),
  provider_message_id text, error_message text, created_at timestamptz not null default now()
);

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end; $$;
create function public.record_order_status_change() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then insert into public.order_status_history(order_id,new_status,changed_by) values(new.id,new.status,auth.uid());
  elsif new.status is distinct from old.status then insert into public.order_status_history(order_id,previous_status,new_status,changed_by) values(new.id,old.status,new.status,auth.uid()); end if;
  return new;
end; $$;
revoke all on function public.record_order_status_change() from public;
create trigger site_settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger product_variants_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
create trigger flavours_updated_at before update on public.flavours for each row execute function public.set_updated_at();
create trigger allergens_updated_at before update on public.allergens for each row execute function public.set_updated_at();
create trigger availability_blocks_updated_at before update on public.availability_blocks for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger custom_order_details_updated_at before update on public.custom_order_details for each row execute function public.set_updated_at();
create trigger orders_status_history after insert or update of status on public.orders for each row execute function public.record_order_status_change();

create index products_category_id_idx on public.products(category_id);
create index products_published_idx on public.products(published) where published;
create index products_featured_idx on public.products(featured) where featured;
create index products_sort_order_idx on public.products(sort_order);
create index product_images_product_id_idx on public.product_images(product_id);
create index product_variants_product_id_idx on public.product_variants(product_id);
create index orders_status_idx on public.orders(status);
create index orders_requested_date_idx on public.orders(requested_date);
create index orders_created_at_idx on public.orders(created_at desc);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_status_history_order_id_idx on public.order_status_history(order_id, created_at);
create index availability_blocks_dates_idx on public.availability_blocks(start_date, end_date);
