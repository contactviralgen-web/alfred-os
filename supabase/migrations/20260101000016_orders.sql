-- Commandes multi-canal (le canal "amazon" prépare le futur module Amazon
-- SP-API sans nécessiter de migration disruptive).
create type public.canal_commande as enum ('site_web', 'amazon', 'manuel');
create type public.statut_commande as enum (
  'en_attente', 'confirmee', 'expediee', 'livree', 'bloquee', 'annulee'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  numero_commande text not null,
  canal public.canal_commande not null default 'manuel',
  statut public.statut_commande not null default 'en_attente',
  montant_total numeric(12, 2) not null default 0,
  montant_marge numeric(12, 2) not null default 0,
  client_nom text,
  cree_le timestamptz not null default now(),
  unique (workspace_id, numero_commande)
);

create index orders_workspace_cree_le_idx on public.orders (workspace_id, cree_le desc);
create index orders_workspace_statut_idx on public.orders (workspace_id, statut);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  quantite integer not null default 1,
  prix_unitaire numeric(12, 2) not null default 0,
  marge_unitaire numeric(12, 2) not null default 0
);

create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_id_idx on public.order_items (product_id);
