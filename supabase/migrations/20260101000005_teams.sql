-- Équipes internes à une organisation, regroupant des membres pour des besoins
-- d'organisation (ex: "Équipe commerciale", "Équipe support").
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  nom text not null,
  description text,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_teams_modifie_le
  before update on public.teams
  for each row execute function public.set_modifie_le();

create table public.team_members (
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  cree_le timestamptz not null default now(),
  primary key (team_id, user_id)
);
