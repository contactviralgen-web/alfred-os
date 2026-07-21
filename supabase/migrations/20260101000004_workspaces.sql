-- Un workspace (espace de travail) appartient à une seule organisation.
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  nom text not null,
  slug text not null,
  description text,
  icone text,
  parametres jsonb not null default '{}'::jsonb,
  cree_par uuid references public.profiles (id),
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  supprime_le timestamptz,
  unique (organization_id, slug)
);

create trigger set_workspaces_modifie_le
  before update on public.workspaces
  for each row execute function public.set_modifie_le();
