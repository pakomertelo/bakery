-- Development-only deterministic DEMO data. Never use as production content.
insert into public.site_settings (id,business_name,business_description,public_phone,public_email,address,opening_hours,accepting_orders,closed_orders_message,minimum_notice_days,pickup_enabled,delivery_enabled,payment_bizum_enabled,payment_cash_enabled,payment_card_in_store_enabled,payment_information_text,order_confirmation_text,allergen_general_notice,hero_title,hero_subtitle,custom_orders_title,custom_orders_description,business_timezone,privacy_notice_version)
values (true,'Repostería DEMO','Negocio completamente ficticio para desarrollo local.','+34 600 000 000','demo@example.invalid','Dirección DEMO — completar antes de producción','Horario DEMO',true,'Agenda DEMO cerrada temporalmente.',3,true,false,true,true,false,'Los pagos no se realizan a través de esta web.','Solicitud DEMO recibida; todavía debe ser confirmada.','AVISO DEMO: revisar trazas con el negocio antes de publicar.','Repostería artesanal DEMO','Catálogo ficticio para probar el entorno local.','Pedidos personalizados DEMO','Describe una creación ficticia para desarrollo.','Europe/Madrid','demo-v1') on conflict (id) do update set business_name=excluded.business_name;

insert into public.categories(id,name,slug,description,active,sort_order) values
('10000000-0000-4000-8000-000000000001','Tartas DEMO','tartas-demo','Categoría ficticia',true,10),
('10000000-0000-4000-8000-000000000002','Cupcakes DEMO','cupcakes-demo','Categoría ficticia',true,20),
('10000000-0000-4000-8000-000000000003','Galletas DEMO','galletas-demo','Categoría ficticia',true,30)
on conflict(id) do nothing;
insert into public.products(id,category_id,slug,name,short_description,description,price_mode,base_price_cents,active,published,available,featured,sort_order) values
('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','tarta-chocolate-demo','Tarta chocolate DEMO','Producto ficticio de precio fijo.','Descripción exclusivamente DEMO.','fixed',2500,true,true,true,true,10),
('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','cupcakes-vainilla-demo','Cupcakes vainilla DEMO','Producto ficticio desde un precio.','Descripción exclusivamente DEMO.','from',1800,true,true,false,false,20),
('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003','galletas-personalizadas-demo','Galletas personalizadas DEMO','Producto ficticio bajo consulta.','Descripción exclusivamente DEMO.','quote',null,true,true,true,false,30),
('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000001','borrador-demo','Borrador oculto DEMO','No debe ser público.','Producto no publicado para probar RLS.','quote',null,true,false,true,false,40)
on conflict(id) do nothing;
insert into public.product_images(id,product_id,path,alt_text,sort_order,is_primary) values
('21000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','products/20000000-0000-4000-8000-000000000001/demo.webp','Imagen DEMO no incluida',0,true) on conflict(id) do nothing;
insert into public.product_variants(id,product_id,name,description,price_cents,servings_min,servings_max,sort_order) values
('22000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Pequeña DEMO','6–8 raciones ficticias',2500,6,8,10),
('22000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001','Grande DEMO','10–12 raciones ficticias',3900,10,12,20) on conflict(id) do nothing;
insert into public.flavours(id,name,slug,sort_order) values
('30000000-0000-4000-8000-000000000001','Chocolate DEMO','chocolate-demo',10),
('30000000-0000-4000-8000-000000000002','Vainilla DEMO','vainilla-demo',20),
('30000000-0000-4000-8000-000000000003','Limón DEMO','limon-demo',30) on conflict(id) do nothing;
insert into public.allergens(id,code,name,sort_order) values
('40000000-0000-4000-8000-000000000001','gluten','Cereales con gluten',1),
('40000000-0000-4000-8000-000000000002','crustaceans','Crustáceos',2),
('40000000-0000-4000-8000-000000000003','eggs','Huevos',3),
('40000000-0000-4000-8000-000000000004','fish','Pescado',4),
('40000000-0000-4000-8000-000000000005','peanuts','Cacahuetes',5),
('40000000-0000-4000-8000-000000000006','soybeans','Soja',6),
('40000000-0000-4000-8000-000000000007','milk','Leche',7),
('40000000-0000-4000-8000-000000000008','nuts','Frutos de cáscara',8),
('40000000-0000-4000-8000-000000000009','celery','Apio',9),
('40000000-0000-4000-8000-000000000010','mustard','Mostaza',10),
('40000000-0000-4000-8000-000000000011','sesame','Granos de sésamo',11),
('40000000-0000-4000-8000-000000000012','sulphites','Dióxido de azufre y sulfitos',12),
('40000000-0000-4000-8000-000000000013','lupin','Altramuces',13),
('40000000-0000-4000-8000-000000000014','molluscs','Moluscos',14) on conflict(id) do nothing;
insert into public.product_flavours(product_id,flavour_id) values
('20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001'),('20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000002'),('20000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002') on conflict do nothing;
insert into public.product_allergens(product_id,allergen_id) values
('20000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000001'),('20000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000003'),('20000000-0000-4000-8000-000000000001','40000000-0000-4000-8000-000000000007'),('20000000-0000-4000-8000-000000000002','40000000-0000-4000-8000-000000000003') on conflict do nothing;
insert into public.availability_blocks(id,start_date,end_date,reason_internal,public_message) values
('50000000-0000-4000-8000-000000000001',current_date + 14,current_date + 15,'Motivo interno DEMO','Fechas DEMO no disponibles') on conflict(id) do update set start_date=excluded.start_date,end_date=excluded.end_date;
insert into public.orders(id,human_reference,type,customer_name,phone,phone_normalized,requested_date,customer_notes,admin_notes,fulfilment_type,estimated_price_cents,privacy_notice_version,privacy_acknowledged_at) values
('60000000-0000-4000-8000-000000000001','PED-2099-0001','catalog','Cliente DEMO','+34 600 000 001','+34600000001',current_date + 21,'Notas ficticias','Nota interna DEMO','pickup',2500,'demo-v1',now()) on conflict(id) do nothing;
insert into public.order_items(id,order_id,product_id,product_name_snapshot,quantity,variant_name_snapshot,flavour_name_snapshot,unit_price_snapshot_cents) values
('61000000-0000-4000-8000-000000000001','60000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Tarta chocolate DEMO',1,'Pequeña DEMO','Chocolate DEMO',2500) on conflict(id) do nothing;
