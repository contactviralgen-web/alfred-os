-- Catalogue global des permissions, nommées par module ("core", "dashboard", et les
-- clés déjà réservées pour les futurs modules "crm", "amazon", "stock", "automation",
-- "agents") afin de figer la convention de nommage inter-modules dès maintenant.
create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  cle text not null unique,
  module text not null,
  description text
);

-- Un rôle est soit "système" (organization_id null, partagé par toutes les
-- organisations, non modifiable), soit un rôle personnalisé propre à une organisation.
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  nom text not null,
  slug text not null,
  est_systeme boolean not null default false,
  description text,
  cree_le timestamptz not null default now()
);

-- NULL n'étant jamais égal à NULL, une contrainte unique classique sur
-- (organization_id, slug) n'empêcherait pas les doublons de rôles système.
-- On utilise donc deux index uniques partiels.
create unique index roles_systeme_slug_unique on public.roles (slug) where organization_id is null;
create unique index roles_organisation_slug_unique on public.roles (organization_id, slug) where organization_id is not null;

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);
