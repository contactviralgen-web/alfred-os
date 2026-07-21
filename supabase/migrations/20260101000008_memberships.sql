-- Appartenance d'un utilisateur à une organisation (niveau principal du RBAC).
create type public.statut_membre as enum ('actif', 'invite', 'suspendu');

create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role_id uuid not null references public.roles (id),
  statut public.statut_membre not null default 'actif',
  invite_par uuid references public.profiles (id),
  cree_le timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- Appartenance à un workspace précis. role_id nullable = hérite du rôle organisation ;
-- non nul = override fin par workspace (utile plus tard pour cloisonner par exemple
-- l'accès à un workspace Amazon spécifique d'une filiale).
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role_id uuid references public.roles (id),
  cree_le timestamptz not null default now(),
  unique (workspace_id, user_id)
);
