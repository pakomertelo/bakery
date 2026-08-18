create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists (select 1 from public.admin_profiles ap where ap.user_id = auth.uid() and ap.active and ap.role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create function public.get_public_availability()
returns table (id uuid, start_date date, end_date date, public_message text)
language sql stable security definer set search_path = '' as $$
  select ab.id, ab.start_date, ab.end_date, ab.public_message from public.availability_blocks ab;
$$;
revoke all on function public.get_public_availability() from public;
grant execute on function public.get_public_availability() to anon, authenticated;

alter table public.admin_profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.flavours enable row level security;
alter table public.product_flavours enable row level security;
alter table public.allergens enable row level security;
alter table public.product_allergens enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.custom_order_details enable row level security;
alter table public.order_reference_images enable row level security;
alter table public.order_status_history enable row level security;
alter table public.email_events enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.site_settings, public.categories, public.products, public.product_images, public.product_variants, public.flavours, public.product_flavours, public.allergens, public.product_allergens to anon, authenticated;
grant select on public.admin_profiles to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert, update on public.site_settings, public.categories, public.products to authenticated;
grant select, insert, update, delete on public.product_images, public.product_variants, public.flavours, public.product_flavours, public.allergens, public.product_allergens, public.availability_blocks, public.order_items, public.custom_order_details, public.order_reference_images to authenticated;
grant select on public.order_status_history, public.email_events to authenticated;

-- Backend-only access. RLS bypass does not replace PostgreSQL table privileges.
grant select on public.admin_profiles, public.site_settings, public.categories, public.products, public.product_images, public.product_variants, public.flavours, public.product_flavours, public.allergens, public.product_allergens, public.availability_blocks, public.orders, public.order_items, public.custom_order_details, public.order_reference_images, public.order_status_history, public.email_events to service_role;
grant insert, update on public.admin_profiles, public.orders, public.email_events to service_role;
grant insert, update, delete on public.site_settings, public.categories, public.products, public.product_images, public.product_variants, public.flavours, public.product_flavours, public.allergens, public.product_allergens, public.availability_blocks, public.order_items, public.custom_order_details, public.order_reference_images to service_role;

create policy "public reads singleton settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins initialize settings" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "admins update settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads active categories" on public.categories for select to anon, authenticated using (active and archived_at is null);
create policy "admins read all categories" on public.categories for select to authenticated using (public.is_admin());
create policy "admins insert categories" on public.categories for insert to authenticated with check (public.is_admin());
create policy "admins update categories" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads published products" on public.products for select to anon, authenticated using (published and active and archived_at is null);
create policy "admins read all products" on public.products for select to authenticated using (public.is_admin());
create policy "admins insert products" on public.products for insert to authenticated with check (public.is_admin());
create policy "admins update products" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public reads images of public products" on public.product_images for select to anon, authenticated using (exists(select 1 from public.products p where p.id=product_id and p.published and p.active and p.archived_at is null));
create policy "admins manage product images" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads variants of public products" on public.product_variants for select to anon, authenticated using (active and exists(select 1 from public.products p where p.id=product_id and p.published and p.active and p.archived_at is null));
create policy "admins manage product variants" on public.product_variants for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads active flavours" on public.flavours for select to anon, authenticated using (active);
create policy "admins manage flavours" on public.flavours for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads flavours of public products" on public.product_flavours for select to anon, authenticated using (exists(select 1 from public.products p where p.id=product_id and p.published and p.active and p.archived_at is null));
create policy "admins manage product flavours" on public.product_flavours for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads active allergens" on public.allergens for select to anon, authenticated using (active);
create policy "admins manage allergens" on public.allergens for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public reads allergens of public products" on public.product_allergens for select to anon, authenticated using (exists(select 1 from public.products p where p.id=product_id and p.published and p.active and p.archived_at is null));
create policy "admins manage product allergens" on public.product_allergens for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- The base table is admin-only; the public calls the column-limited function above.
create policy "admins read private availability" on public.availability_blocks for select to authenticated using (public.is_admin());
create policy "admins insert availability" on public.availability_blocks for insert to authenticated with check (public.is_admin());
create policy "admins update availability" on public.availability_blocks for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete availability" on public.availability_blocks for delete to authenticated using (public.is_admin());
create policy "authenticated reads own admin profile" on public.admin_profiles for select to authenticated using (user_id=auth.uid());

create policy "admins read orders" on public.orders for select to authenticated using (public.is_admin());
create policy "admins insert orders" on public.orders for insert to authenticated with check (public.is_admin());
create policy "admins update orders" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage order items" on public.order_items for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage custom order details" on public.custom_order_details for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage order reference images" on public.order_reference_images for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read status history" on public.order_status_history for select to authenticated using (public.is_admin());
create policy "admins read email events" on public.email_events for select to authenticated using (public.is_admin());
