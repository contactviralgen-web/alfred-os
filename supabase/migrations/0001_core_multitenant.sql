-- Socle multi-tenant : profils utilisateurs, organisations, membres, invitations.
-- Une organisation = une entreprise cliente (le "Company" du modèle de domaine Profytt).

create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin', 'member')),
  invited_by uuid not null references auth.users (id),
  token uuid not null default gen_random_uuid(),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days'),
  unique (organization_id, email)
);

-- Crée automatiquement un profil à l'inscription d'un utilisateur Supabase Auth.
create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Vérifie l'appartenance d'un utilisateur à une organisation sans provoquer de
-- récursion RLS (fonction security definer utilisée dans les policies ci-dessous).
create function is_organization_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from organization_members
    where organization_id = org_id and user_id = auth.uid()
  );
$$;

create function organization_role(org_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from organization_members
  where organization_id = org_id and user_id = auth.uid();
$$;

alter table profiles enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table invitations enable row level security;

create policy "Un utilisateur voit et modifie son propre profil"
  on profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Les membres voient leur organisation"
  on organizations for select
  using (is_organization_member(id));

create policy "Un utilisateur peut créer une organisation"
  on organizations for insert
  with check (true);

create policy "Owner/admin modifient leur organisation"
  on organizations for update
  using (organization_role(id) in ('owner', 'admin'));

create policy "Les membres voient les autres membres de leur organisation"
  on organization_members for select
  using (is_organization_member(organization_id));

create policy "Un utilisateur rejoint une organisation comme owner à sa création"
  on organization_members for insert
  with check (user_id = auth.uid());

create policy "Owner/admin gèrent les membres"
  on organization_members for update
  using (organization_role(organization_id) in ('owner', 'admin'));

create policy "Owner/admin retirent des membres"
  on organization_members for delete
  using (organization_role(organization_id) in ('owner', 'admin'));

create policy "Owner/admin voient les invitations de leur organisation"
  on invitations for select
  using (organization_role(organization_id) in ('owner', 'admin'));

create policy "Owner/admin créent des invitations"
  on invitations for insert
  with check (organization_role(organization_id) in ('owner', 'admin'));

create policy "Owner/admin annulent des invitations"
  on invitations for delete
  using (organization_role(organization_id) in ('owner', 'admin'));
