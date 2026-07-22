-- Module Fournisseurs : fiches fournisseurs, commandes d'achat (de l'entreprise
-- vers le fournisseur — à ne pas confondre avec `orders`, les commandes clients),
-- et factures fournisseurs. Module 100% interne, pas de dépendance API externe.

create type public.statut_fournisseur as enum ('actif', 'inactif');

create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  nom text not null,
  email text,
  telephone text,
  adresse text,
  notes text,
  statut public.statut_fournisseur not null default 'actif',
  delai_livraison_jours integer,
  note_performance numeric(2, 1) check (note_performance >= 0 and note_performance <= 5),
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_suppliers_modifie_le
  before update on public.suppliers
  for each row execute function public.set_modifie_le();

create index suppliers_workspace_idx on public.suppliers (workspace_id, statut);

create type public.statut_commande_fournisseur as enum (
  'brouillon', 'envoyee', 'confirmee', 'en_transit', 'livree', 'annulee'
);

create table public.supplier_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  numero_commande text not null,
  statut public.statut_commande_fournisseur not null default 'brouillon',
  montant_total numeric(12, 2) not null default 0,
  date_commande date not null default current_date,
  date_livraison_prevue date,
  date_livraison_reelle date,
  notes text,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  unique (workspace_id, numero_commande)
);

create trigger set_supplier_orders_modifie_le
  before update on public.supplier_orders
  for each row execute function public.set_modifie_le();

create index supplier_orders_workspace_idx on public.supplier_orders (workspace_id, statut);
create index supplier_orders_supplier_idx on public.supplier_orders (supplier_id, date_commande desc);

create table public.supplier_order_items (
  id uuid primary key default gen_random_uuid(),
  supplier_order_id uuid not null references public.supplier_orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantite integer not null check (quantite > 0),
  prix_unitaire numeric(12, 2) not null default 0,
  cree_le timestamptz not null default now()
);

create index supplier_order_items_order_idx on public.supplier_order_items (supplier_order_id);

create type public.statut_facture_fournisseur as enum ('en_attente', 'payee', 'en_retard');

create table public.supplier_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  supplier_order_id uuid references public.supplier_orders (id) on delete set null,
  numero_facture text not null,
  montant numeric(12, 2) not null default 0,
  statut public.statut_facture_fournisseur not null default 'en_attente',
  date_emission date not null default current_date,
  date_echeance date,
  date_paiement date,
  cree_le timestamptz not null default now(),
  unique (workspace_id, numero_facture)
);

create index supplier_invoices_workspace_idx on public.supplier_invoices (workspace_id, statut);
create index supplier_invoices_supplier_idx on public.supplier_invoices (supplier_id, date_emission desc);

-- Vue : taux de livraison à temps et statistiques agrégées par fournisseur,
-- base du score de recommandation calculé côté service (pas d'IA — un simple
-- calcul déterministe à partir de note_performance, taux de ponctualité et
-- délai annoncé).
create view public.v_supplier_performance as
select
  s.id as supplier_id,
  s.workspace_id,
  count(so.id) filter (where so.statut = 'livree') as commandes_livrees,
  count(so.id) filter (
    where so.statut = 'livree' and so.date_livraison_reelle is not null and so.date_livraison_prevue is not null
  ) as commandes_livrees_avec_dates,
  count(so.id) filter (
    where so.statut = 'livree'
      and so.date_livraison_reelle is not null
      and so.date_livraison_prevue is not null
      and so.date_livraison_reelle <= so.date_livraison_prevue
  ) as commandes_livrees_a_temps
from public.suppliers s
left join public.supplier_orders so on so.supplier_id = s.id
group by s.id, s.workspace_id;

-- RLS : mêmes principes que le reste du projet (is_organization_member /
-- has_permission), cohérent avec la tranche RLS des tables métier.
alter table public.suppliers enable row level security;
alter table public.supplier_orders enable row level security;
alter table public.supplier_order_items enable row level security;
alter table public.supplier_invoices enable row level security;

create policy "suppliers_lecture" on public.suppliers for select
using (public.is_organization_member(organization_id));
create policy "suppliers_ecriture" on public.suppliers for insert
with check (public.has_permission(organization_id, 'fournisseurs.manage'));
create policy "suppliers_maj" on public.suppliers for update
using (public.has_permission(organization_id, 'fournisseurs.manage'));
create policy "suppliers_suppression" on public.suppliers for delete
using (public.has_permission(organization_id, 'fournisseurs.manage'));

create policy "supplier_orders_lecture" on public.supplier_orders for select
using (public.is_organization_member(organization_id));
create policy "supplier_orders_ecriture" on public.supplier_orders for insert
with check (public.has_permission(organization_id, 'fournisseurs.manage'));
create policy "supplier_orders_maj" on public.supplier_orders for update
using (public.has_permission(organization_id, 'fournisseurs.manage'));
create policy "supplier_orders_suppression" on public.supplier_orders for delete
using (public.has_permission(organization_id, 'fournisseurs.manage'));

create policy "supplier_order_items_lecture" on public.supplier_order_items for select
using (exists (
  select 1 from public.supplier_orders so
  where so.id = supplier_order_items.supplier_order_id and public.is_organization_member(so.organization_id)
));
create policy "supplier_order_items_ecriture" on public.supplier_order_items for insert
with check (exists (
  select 1 from public.supplier_orders so
  where so.id = supplier_order_items.supplier_order_id and public.has_permission(so.organization_id, 'fournisseurs.manage')
));
create policy "supplier_order_items_maj" on public.supplier_order_items for update
using (exists (
  select 1 from public.supplier_orders so
  where so.id = supplier_order_items.supplier_order_id and public.has_permission(so.organization_id, 'fournisseurs.manage')
));
create policy "supplier_order_items_suppression" on public.supplier_order_items for delete
using (exists (
  select 1 from public.supplier_orders so
  where so.id = supplier_order_items.supplier_order_id and public.has_permission(so.organization_id, 'fournisseurs.manage')
));

create policy "supplier_invoices_lecture" on public.supplier_invoices for select
using (public.is_organization_member(organization_id));
create policy "supplier_invoices_ecriture" on public.supplier_invoices for insert
with check (public.has_permission(organization_id, 'fournisseurs.manage'));
create policy "supplier_invoices_maj" on public.supplier_invoices for update
using (public.has_permission(organization_id, 'fournisseurs.manage'));
create policy "supplier_invoices_suppression" on public.supplier_invoices for delete
using (public.has_permission(organization_id, 'fournisseurs.manage'));

-- Permission dédiée au module, ajoutée au catalogue et accordée aux rôles
-- système comme les autres modules métier (voir 20260101000007_reference_data.sql).
insert into public.permissions (cle, module, description) values
  ('fournisseurs.manage', 'fournisseurs', 'Gérer les fournisseurs, commandes d''achat et factures fournisseurs');

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug in ('owner', 'admin') and r.organization_id is null and p.cle = 'fournisseurs.manage';

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.cle = 'fournisseurs.manage'
where r.slug = 'manager' and r.organization_id is null;
