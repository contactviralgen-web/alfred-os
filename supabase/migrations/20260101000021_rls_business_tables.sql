-- RLS des tables métier alimentant le tableau de bord. Mêmes principes que le
-- noyau : isolation stricte par organisation/workspace via les fonctions
-- helper déjà définies (is_organization_member, is_workspace_member,
-- has_permission).

alter table public.products enable row level security;
alter table public.stock_levels enable row level security;
alter table public.stock_alerts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.revenue_metrics enable row level security;
alter table public.revenue_forecasts enable row level security;
alter table public.tasks enable row level security;
alter table public.calendar_events enable row level security;
alter table public.notifications enable row level security;

-- products
create policy "products_lecture" on public.products for select
using (public.is_organization_member(organization_id));

create policy "products_ecriture" on public.products for insert
with check (public.has_permission(organization_id, 'stock.products.manage'));

create policy "products_maj" on public.products for update
using (public.has_permission(organization_id, 'stock.products.manage'));

create policy "products_suppression" on public.products for delete
using (public.has_permission(organization_id, 'stock.products.manage'));

-- stock_levels (rattaché à un produit, pas directement à une organisation)
create policy "stock_levels_lecture" on public.stock_levels for select
using (public.is_workspace_member(workspace_id));

create policy "stock_levels_ecriture" on public.stock_levels for insert
with check (exists (
  select 1 from public.products p
  where p.id = stock_levels.product_id and public.has_permission(p.organization_id, 'stock.products.manage')
));

create policy "stock_levels_maj" on public.stock_levels for update
using (exists (
  select 1 from public.products p
  where p.id = stock_levels.product_id and public.has_permission(p.organization_id, 'stock.products.manage')
));

-- stock_alerts
create policy "stock_alerts_lecture" on public.stock_alerts for select
using (public.is_workspace_member(workspace_id));

create policy "stock_alerts_maj" on public.stock_alerts for update
using (exists (
  select 1 from public.products p
  where p.id = stock_alerts.product_id and public.has_permission(p.organization_id, 'stock.alerts.manage')
));

-- orders / order_items : lecture seule pour les membres dans cette tranche
-- (pas d'UI de création/édition de commandes ; les données proviennent du
-- seed ou, plus tard, du module Amazon).
create policy "orders_lecture" on public.orders for select
using (public.is_organization_member(organization_id));

create policy "order_items_lecture" on public.order_items for select
using (exists (
  select 1 from public.orders o
  where o.id = order_items.order_id and public.is_organization_member(o.organization_id)
));

-- revenue_metrics / revenue_forecasts : lecture seule (agrégats calculés côté serveur)
create policy "revenue_metrics_lecture" on public.revenue_metrics for select
using (public.is_organization_member(organization_id));

create policy "revenue_forecasts_lecture" on public.revenue_forecasts for select
using (public.is_organization_member(organization_id));

-- tasks : outil de collaboration interne, CRUD ouvert aux membres de l'organisation
create policy "tasks_lecture" on public.tasks for select
using (public.is_organization_member(organization_id));

create policy "tasks_ecriture" on public.tasks for insert
with check (public.is_organization_member(organization_id));

create policy "tasks_maj" on public.tasks for update
using (public.is_organization_member(organization_id));

create policy "tasks_suppression" on public.tasks for delete
using (public.is_organization_member(organization_id));

-- calendar_events
create policy "calendar_events_lecture" on public.calendar_events for select
using (public.is_organization_member(organization_id));

create policy "calendar_events_ecriture" on public.calendar_events for insert
with check (public.is_organization_member(organization_id));

create policy "calendar_events_maj" on public.calendar_events for update
using (public.is_organization_member(organization_id));

create policy "calendar_events_suppression" on public.calendar_events for delete
using (public.is_organization_member(organization_id));

-- notifications : strictement personnelles, jamais visibles par d'autres membres.
-- Pas d'insert/delete client : générées côté serveur (service_role) uniquement.
create policy "notifications_lecture" on public.notifications for select
using (destinataire_id = auth.uid());

create policy "notifications_maj_lue" on public.notifications for update
using (destinataire_id = auth.uid());
