-- Agrégats journaliers pré-calculés : le dashboard lit cette table plutôt que
-- d'agréger `orders` à la volée (pattern pensé pour la performance à grande
-- échelle, une fois qu'un vrai volume de commandes existera).
create table public.revenue_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  date date not null,
  chiffre_affaires numeric(12, 2) not null default 0,
  benefice numeric(12, 2) not null default 0,
  nombre_commandes integer not null default 0,
  panier_moyen numeric(12, 2) not null default 0,
  unique (workspace_id, date)
);

create index revenue_metrics_workspace_date_idx on public.revenue_metrics (workspace_id, date desc);
