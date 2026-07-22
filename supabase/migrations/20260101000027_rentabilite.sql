-- Module Rentabilité (Profit Intelligence) : puisque le SP-API Amazon n'est
-- pas connecté, les charges qu'Amazon fournirait normalement automatiquement
-- (frais Amazon, FBA, stockage, retours, TVA) deviennent des réglages saisis
-- manuellement, à deux niveaux — workspace (TVA globale) et produit (charges
-- récurrentes par unité vendue). `products.prix_vente` reste TTC comme
-- aujourd'hui : la TVA n'est traitée que comme une charge déductible dans le
-- calcul de marge nette ci-dessous, rien ne change dans le CA affiché ailleurs.

create table public.workspace_cost_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade unique,
  taux_tva_pct numeric(5, 2) not null default 20.00,
  prix_ttc boolean not null default true,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_workspace_cost_settings_modifie_le
  before update on public.workspace_cost_settings
  for each row execute function public.set_modifie_le();

create table public.product_cost_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade unique,
  cout_transport_flat numeric(10, 2) not null default 0,
  cout_douane_flat numeric(10, 2) not null default 0,
  frais_amazon_pct numeric(5, 2) not null default 15.00,
  frais_fba_flat numeric(10, 2) not null default 0,
  frais_stockage_unitaire_flat numeric(10, 2) not null default 0,
  taux_retour_pct numeric(5, 2) not null default 0,
  cout_divers_flat numeric(10, 2) not null default 0,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_product_cost_settings_modifie_le
  before update on public.product_cost_settings
  for each row execute function public.set_modifie_le();

create index product_cost_settings_workspace_idx on public.product_cost_settings (workspace_id);

-- Auto-création d'une ligne de charges par défaut à la création d'un produit,
-- pour qu'aucun produit ne soit jamais "non configuré" dans le module.
create or replace function public.creer_product_cost_settings_par_defaut()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.product_cost_settings (organization_id, workspace_id, product_id)
  values (new.organization_id, new.workspace_id, new.id);
  return new;
end;
$$;

create trigger creer_product_cost_settings_apres_produit
  after insert on public.products
  for each row execute function public.creer_product_cost_settings_par_defaut();

-- Vue de marge nette par ligne de commande : jointure des commandes avec les
-- réglages de charges (coalesce sur les valeurs par défaut si un produit
-- n'a, par exception, aucune ligne de réglages).
create view public.v_product_margins
with (security_invoker = true) as
select
  oi.id as order_item_id,
  o.id as order_id,
  o.organization_id,
  o.workspace_id,
  o.cree_le,
  o.statut,
  p.id as product_id,
  p.nom as produit_nom,
  p.categorie,
  p.prix_achat,
  oi.quantite,
  oi.prix_unitaire,
  (oi.quantite * oi.prix_unitaire) as chiffre_affaires,
  coalesce(pcs.cout_transport_flat, 0) as cout_transport_flat,
  coalesce(pcs.cout_douane_flat, 0) as cout_douane_flat,
  coalesce(pcs.frais_amazon_pct, 15.00) as frais_amazon_pct,
  coalesce(pcs.frais_fba_flat, 0) as frais_fba_flat,
  coalesce(pcs.frais_stockage_unitaire_flat, 0) as frais_stockage_unitaire_flat,
  coalesce(pcs.taux_retour_pct, 0) as taux_retour_pct,
  coalesce(pcs.cout_divers_flat, 0) as cout_divers_flat,
  coalesce(wcs.taux_tva_pct, 20.00) as taux_tva_pct,
  coalesce(wcs.prix_ttc, true) as prix_ttc
from public.order_items oi
join public.orders o on o.id = oi.order_id
join public.products p on p.id = oi.product_id
left join public.product_cost_settings pcs on pcs.product_id = p.id
left join public.workspace_cost_settings wcs on wcs.workspace_id = o.workspace_id;

grant select on public.v_product_margins to authenticated;

-- RLS
alter table public.workspace_cost_settings enable row level security;
alter table public.product_cost_settings enable row level security;

create policy "workspace_cost_settings_lecture" on public.workspace_cost_settings for select
using (public.is_organization_member(organization_id));
create policy "workspace_cost_settings_ecriture" on public.workspace_cost_settings for insert
with check (public.has_permission(organization_id, 'rentabilite.manage'));
create policy "workspace_cost_settings_maj" on public.workspace_cost_settings for update
using (public.has_permission(organization_id, 'rentabilite.manage'));

create policy "product_cost_settings_lecture" on public.product_cost_settings for select
using (public.is_organization_member(organization_id));
create policy "product_cost_settings_ecriture" on public.product_cost_settings for insert
with check (public.has_permission(organization_id, 'rentabilite.manage'));
create policy "product_cost_settings_maj" on public.product_cost_settings for update
using (public.has_permission(organization_id, 'rentabilite.manage'));

-- Permission dédiée, même pattern que `fournisseurs.manage`
-- (20260101000026_fournisseurs.sql) : ajoutée et accordée dans sa propre
-- migration plutôt que dans reference_data.sql.
insert into public.permissions (cle, module, description) values
  ('rentabilite.manage', 'rentabilite', 'Configurer la TVA et les charges produit, calculer la rentabilité réelle');

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug in ('owner', 'admin') and r.organization_id is null and p.cle = 'rentabilite.manage';

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.cle = 'rentabilite.manage'
where r.slug = 'manager' and r.organization_id is null;
