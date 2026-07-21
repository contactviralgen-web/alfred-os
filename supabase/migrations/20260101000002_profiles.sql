-- Profil public associé à chaque utilisateur Supabase Auth (auth.users est privé/interne).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nom_complet text,
  avatar_url text,
  derniere_organisation_id uuid,
  derniere_connexion_le timestamptz,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

comment on table public.profiles is 'Profil applicatif miroir de auth.users, créé automatiquement à l''inscription.';

-- Fonction générique réutilisée par toutes les tables ayant une colonne modifie_le.
create or replace function public.set_modifie_le()
returns trigger
language plpgsql
as $$
begin
  new.modifie_le = now();
  return new;
end;
$$;

create trigger set_profiles_modifie_le
  before update on public.profiles
  for each row execute function public.set_modifie_le();

-- Création automatique du profil à l'inscription d'un utilisateur.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, nom_complet, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'nom_complet',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
