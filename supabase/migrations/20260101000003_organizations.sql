-- Les organisations représentent les entreprises clientes d'Pilot (tenants).
create type public.plan_organisation as enum ('essai', 'starter', 'pro', 'entreprise');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text not null unique,
  logo_url text,
  plan public.plan_organisation not null default 'essai',
  parametres jsonb not null default '{}'::jsonb,
  cree_par uuid references public.profiles (id),
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  supprime_le timestamptz
);

create trigger set_organizations_modifie_le
  before update on public.organizations
  for each row execute function public.set_modifie_le();

alter table public.profiles
  add constraint profiles_derniere_organisation_fk
  foreign key (derniere_organisation_id) references public.organizations (id) on delete set null;
