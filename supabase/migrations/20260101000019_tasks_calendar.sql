create type public.statut_tache as enum ('a_faire', 'en_cours', 'terminee');
create type public.priorite_tache as enum ('basse', 'normale', 'haute');

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  assigne_a uuid references public.profiles (id) on delete set null,
  titre text not null,
  description text,
  statut public.statut_tache not null default 'a_faire',
  priorite public.priorite_tache not null default 'normale',
  echeance_le date,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_tasks_modifie_le
  before update on public.tasks
  for each row execute function public.set_modifie_le();

create index tasks_workspace_statut_idx on public.tasks (workspace_id, statut);

create type public.type_evenement_calendrier as enum ('reunion', 'echeance', 'rappel');

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  titre text not null,
  type public.type_evenement_calendrier not null default 'reunion',
  debut_le timestamptz not null,
  fin_le timestamptz,
  cree_par uuid references public.profiles (id) on delete set null,
  cree_le timestamptz not null default now()
);

create index calendar_events_workspace_debut_idx on public.calendar_events (workspace_id, debut_le);
