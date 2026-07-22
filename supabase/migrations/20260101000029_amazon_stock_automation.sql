-- Trois modules encore au statut "bientôt disponible" : Stock, Amazon,
-- Automatisations. Toujours en démo (pas de SP-API réel, pas de crédits
-- Claude supplémentaires) : chaque donnée est soit ce qu'Amazon fournirait
-- automatiquement une fois connecté, soit saisie manuellement en attendant.
-- Les permissions amazon.*/stock.*/automation.* existent déjà dans le
-- catalogue (20260101000007_reference_data.sql) — rien à ajouter côté rôles.

-- === Stock ===============================================================

create type public.type_mouvement_stock as enum ('entree', 'sortie', 'ajustement');

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  type public.type_mouvement_stock not null,
  quantite integer not null check (quantite > 0),
  motif text,
  cree_le timestamptz not null default now()
);

create index stock_movements_workspace_idx on public.stock_movements (workspace_id, cree_le desc);
create index stock_movements_product_idx on public.stock_movements (product_id, cree_le desc);

alter table public.stock_movements enable row level security;

create policy "stock_movements_lecture" on public.stock_movements for select
using (public.is_organization_member(organization_id));
create policy "stock_movements_ecriture" on public.stock_movements for insert
with check (public.has_permission(organization_id, 'stock.products.manage'));

-- === Amazon ===============================================================

create type public.statut_connexion_amazon as enum ('connecte', 'deconnecte');

create table public.amazon_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade unique,
  statut public.statut_connexion_amazon not null default 'deconnecte',
  seller_id text,
  marketplaces text[] not null default '{}',
  connecte_le timestamptz,
  modifie_le timestamptz not null default now()
);

create trigger set_amazon_connections_modifie_le
  before update on public.amazon_connections
  for each row execute function public.set_modifie_le();

create type public.motif_retour_amazon as enum (
  'defectueux', 'ne_correspond_pas', 'taille_couleur', 'change_avis', 'autre'
);

create table public.product_returns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  quantite integer not null default 1 check (quantite > 0),
  motif public.motif_retour_amazon not null default 'autre',
  cree_le timestamptz not null default now()
);

create index product_returns_workspace_idx on public.product_returns (workspace_id, cree_le desc);

alter table public.amazon_connections enable row level security;
alter table public.product_returns enable row level security;

create policy "amazon_connections_lecture" on public.amazon_connections for select
using (public.is_organization_member(organization_id));
create policy "amazon_connections_ecriture" on public.amazon_connections for insert
with check (public.has_permission(organization_id, 'amazon.connection.manage'));
create policy "amazon_connections_maj" on public.amazon_connections for update
using (public.has_permission(organization_id, 'amazon.connection.manage'));

create policy "product_returns_lecture" on public.product_returns for select
using (public.is_organization_member(organization_id));
create policy "product_returns_ecriture" on public.product_returns for insert
with check (public.has_permission(organization_id, 'amazon.listings.manage'));

-- === Automatisations ======================================================

create type public.declencheur_automatisation as enum (
  'stock_bas', 'commande_bloquee', 'fournisseur_en_retard'
);
create type public.action_automatisation as enum ('creer_tache', 'envoyer_notification');

create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  nom text not null,
  declencheur public.declencheur_automatisation not null,
  action public.action_automatisation not null,
  actif boolean not null default true,
  description text,
  cree_le timestamptz not null default now()
);

create index automation_rules_workspace_idx on public.automation_rules (workspace_id, actif);

create table public.automation_executions (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references public.automation_rules (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  resume text not null,
  cree_le timestamptz not null default now()
);

create index automation_executions_workspace_idx on public.automation_executions (workspace_id, cree_le desc);

alter table public.automation_rules enable row level security;
alter table public.automation_executions enable row level security;

create policy "automation_rules_lecture" on public.automation_rules for select
using (public.is_organization_member(organization_id));
create policy "automation_rules_ecriture" on public.automation_rules for insert
with check (public.has_permission(organization_id, 'automation.workflows.manage'));
create policy "automation_rules_maj" on public.automation_rules for update
using (public.has_permission(organization_id, 'automation.workflows.manage'));

create policy "automation_executions_lecture" on public.automation_executions for select
using (public.is_workspace_member(workspace_id));
create policy "automation_executions_ecriture" on public.automation_executions for insert
with check (exists (
  select 1 from public.automation_rules r
  where r.id = automation_executions.rule_id
    and public.has_permission(r.organization_id, 'automation.workflows.execute')
));
