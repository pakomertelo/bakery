begin;
select plan(39);
-- Direct storage.objects writes below unit-test RLS only; Storage API uploads are Phase 4 coverage.
select ok(has_table_privilege('service_role','public.admin_profiles','SELECT') and has_table_privilege('service_role','public.admin_profiles','INSERT') and has_table_privilege('service_role','public.admin_profiles','UPDATE'),'service_role provisions admin profiles');
select ok(has_table_privilege('service_role','public.orders','SELECT') and has_table_privilege('service_role','public.orders','INSERT') and has_table_privilege('service_role','public.orders','UPDATE'),'service_role manages orders without deleting history');
select ok(has_table_privilege('service_role','public.order_items','SELECT') and has_table_privilege('service_role','public.order_items','INSERT') and has_table_privilege('service_role','public.order_items','UPDATE') and has_table_privilege('service_role','public.order_items','DELETE'),'service_role manages order items');
select ok(has_table_privilege('service_role','public.custom_order_details','SELECT') and has_table_privilege('service_role','public.custom_order_details','INSERT') and has_table_privilege('service_role','public.custom_order_details','UPDATE') and has_table_privilege('service_role','public.custom_order_details','DELETE'),'service_role manages custom order details');
select ok(has_table_privilege('service_role','public.order_reference_images','SELECT') and has_table_privilege('service_role','public.order_reference_images','INSERT') and has_table_privilege('service_role','public.order_reference_images','UPDATE') and has_table_privilege('service_role','public.order_reference_images','DELETE'),'service_role manages order reference metadata');
select ok(has_table_privilege('service_role','public.email_events','SELECT') and has_table_privilege('service_role','public.email_events','INSERT') and has_table_privilege('service_role','public.email_events','UPDATE'),'service_role writes email events');
insert into auth.users(instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at) values
('00000000-0000-0000-0000-000000000000','aaaaaaaa-0000-4000-8000-000000000001','authenticated','authenticated','normal@example.invalid','',now(),'{}','{}',now(),now()),
('00000000-0000-0000-0000-000000000000','aaaaaaaa-0000-4000-8000-000000000002','authenticated','authenticated','admin@example.invalid','',now(),'{}','{}',now(),now()),
('00000000-0000-0000-0000-000000000000','aaaaaaaa-0000-4000-8000-000000000003','authenticated','authenticated','inactive@example.invalid','',now(),'{}','{}',now(),now());
insert into public.admin_profiles(user_id,active) values ('aaaaaaaa-0000-4000-8000-000000000002',true),('aaaaaaaa-0000-4000-8000-000000000003',false);
select is((select public from storage.buckets where id='order-references-private'),false,'order references bucket is private');

set local role anon;
select is((select count(*)::integer from public.categories),3,'anon sees active categories');
select is((select count(*)::integer from public.products),3,'anon sees only published products including unavailable');
select is((select count(*)::integer from public.site_settings),1,'anon sees public settings');
select is((select count(*)::integer from public.get_public_availability()),1,'anon sees safe availability');
select ok(not has_column_privilege('anon','public.availability_blocks','reason_internal','select'),'anon cannot select internal availability reason');
select ok(not has_table_privilege('anon','public.orders','select'),'anon cannot select orders');
select ok(not has_table_privilege('anon','public.orders','insert'),'anon cannot insert orders');
select ok(not has_table_privilege('anon','public.products','insert'),'anon cannot insert products');
select ok(not has_table_privilege('anon','public.products','update'),'anon cannot update products');
select ok(not has_table_privilege('anon','public.products','delete'),'anon cannot delete products');
select ok(not has_table_privilege('anon','public.order_items','select'),'anon cannot select order items');
select ok(not has_table_privilege('anon','public.custom_order_details','select'),'anon cannot select custom details');
select ok(not has_table_privilege('anon','public.order_reference_images','select'),'anon cannot select reference metadata');
select ok(not has_table_privilege('anon','public.admin_profiles','select'),'anon cannot select admin profiles');
select ok(not has_table_privilege('anon','public.email_events','select'),'anon cannot select email events');
select is((select count(*)::integer from storage.objects where bucket_id='order-references-private'),0,'anon cannot list private objects');
select throws_ok($$insert into storage.objects(bucket_id,name) values ('catalog-public','anon.webp')$$,'42501',null,'anon cannot upload catalog objects');
select throws_ok($$insert into storage.objects(bucket_id,name) values ('order-references-private','anon.webp')$$,'42501',null,'anon cannot upload private objects');
reset role;

set local role authenticated; select set_config('request.jwt.claim.sub','aaaaaaaa-0000-4000-8000-000000000001',true);
select is(public.is_admin(),false,'authenticated normal user is not admin');
select is((select count(*)::integer from public.orders),0,'normal user sees no orders');
select is((select count(*)::integer from public.admin_profiles),0,'normal user sees no admin profile');
select is((select count(*)::integer from storage.objects where bucket_id='order-references-private'),0,'normal user sees no private objects');
select throws_ok($$insert into storage.objects(bucket_id,name) values ('order-references-private','normal.webp')$$,'42501',null,'normal user cannot upload private objects');
reset role;

set local role authenticated; select set_config('request.jwt.claim.sub','aaaaaaaa-0000-4000-8000-000000000002',true);
select is(public.is_admin(),true,'active profile grants admin');
select is((select count(*)::integer from public.products),4,'admin sees unpublished products');
select is((select count(*)::integer from public.orders),1,'admin sees orders and private notes');
select is((select count(*)::integer from public.availability_blocks),1,'admin sees private availability');
select lives_ok($$update public.site_settings set minimum_notice_days=4 where id=true$$,'admin updates settings');
select lives_ok($$insert into public.categories(name,slug) values ('Admin test','admin-test')$$,'admin creates categories');
select lives_ok($$insert into storage.objects(bucket_id,name,owner_id) values ('order-references-private','orders/test/admin.webp','aaaaaaaa-0000-4000-8000-000000000002')$$,'admin manages private storage');
reset role;
set local role authenticated; select set_config('request.jwt.claim.sub','aaaaaaaa-0000-4000-8000-000000000003',true);
select is(public.is_admin(),false,'inactive admin loses privileges');
select is((select count(*)::integer from public.orders),0,'inactive admin sees no orders');
select * from finish(); rollback;
