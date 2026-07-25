-- Supprime l'étape manuelle de création d'organisation : chaque nouvel
-- utilisateur reçoit automatiquement sa propre organisation (owner) à
-- l'inscription. Fait dans le trigger existant (security definer, donc pas
-- de souci RLS puisqu'aucun aller-retour client n'est nécessaire).

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid := gen_random_uuid();
  org_name text := coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1));
  org_slug text := regexp_replace(lower(org_name), '[^a-z0-9]+', '-', 'g') || '-' || substr(new.id::text, 1, 6);
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.organizations (id, name, slug)
  values (org_id, org_name, org_slug);

  insert into public.organization_members (organization_id, user_id, role)
  values (org_id, new.id, 'owner');

  return new;
end;
$$;
