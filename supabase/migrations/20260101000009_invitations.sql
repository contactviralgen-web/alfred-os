create type public.statut_invitation as enum ('en_attente', 'acceptee', 'expiree', 'revoquee');

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role_id uuid not null references public.roles (id),
  token uuid not null default gen_random_uuid() unique,
  statut public.statut_invitation not null default 'en_attente',
  invite_par uuid references public.profiles (id),
  expire_le timestamptz not null default (now() + interval '7 days'),
  cree_le timestamptz not null default now()
);
