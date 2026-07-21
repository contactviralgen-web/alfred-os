-- Prévisions de chiffre d'affaires. "modele" vaut 'mock_v0' tant qu'aucun
-- véritable modèle IA n'est branché (hors périmètre de cette tranche) : le
-- dashboard affiche un badge "Prévision IA (bêta)" pour ne jamais faire
-- passer ces valeurs pour des prévisions réelles auprès de l'utilisateur.
create table public.revenue_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  date date not null,
  chiffre_affaires_prevu numeric(12, 2) not null default 0,
  intervalle_confiance_bas numeric(12, 2) not null default 0,
  intervalle_confiance_haut numeric(12, 2) not null default 0,
  modele text not null default 'mock_v0',
  genere_le timestamptz not null default now(),
  unique (workspace_id, date)
);

create index revenue_forecasts_workspace_date_idx on public.revenue_forecasts (workspace_id, date);
