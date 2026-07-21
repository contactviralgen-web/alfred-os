-- Catalogue produits et niveaux de stock. Ces tables appartiennent
-- conceptuellement au futur module "stock" (src/modules/stock), mais sont
-- créées dès cette tranche car le tableau de bord doit afficher des données
-- réelles (produits les plus rentables, ruptures, alertes...).
create table public.products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  sku text not null,
  nom text not null,
  prix_achat numeric(12, 2) not null default 0,
  prix_vente numeric(12, 2) not null default 0,
  categorie text,
  image_url text,
  actif boolean not null default true,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  unique (workspace_id, sku)
);

create trigger set_products_modifie_le
  before update on public.products
  for each row execute function public.set_modifie_le();

create table public.stock_levels (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  quantite_disponible integer not null default 0,
  quantite_reservee integer not null default 0,
  seuil_alerte integer not null default 5,
  mis_a_jour_le timestamptz not null default now(),
  unique (product_id)
);

create type public.type_alerte_stock as enum ('rupture', 'stock_bas', 'surstock');
create type public.statut_alerte_stock as enum ('ouverte', 'resolue');

create table public.stock_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  type public.type_alerte_stock not null,
  statut public.statut_alerte_stock not null default 'ouverte',
  cree_le timestamptz not null default now()
);

create index stock_alerts_workspace_ouvertes_idx on public.stock_alerts (workspace_id) where statut = 'ouverte';
