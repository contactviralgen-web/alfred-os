-- Fonctions utilitaires réutilisées par toutes les policies RLS du projet, pour
-- éviter de dupliquer des sous-requêtes complexes dans chaque policy.
create or replace function public.is_organization_member(p_organization_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.organization_members m
    where m.organization_id = p_organization_id
      and m.user_id = auth.uid()
      and m.statut = 'actif'
  );
$$;

create or replace function public.is_workspace_member(p_workspace_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.workspaces w
    join public.organization_members m on m.organization_id = w.organization_id
    where w.id = p_workspace_id
      and m.user_id = auth.uid()
      and m.statut = 'actif'
  );
$$;

create or replace function public.has_permission(p_organization_id uuid, p_permission_key text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members m
    join public.role_permissions rp on rp.role_id = m.role_id
    join public.permissions p on p.id = rp.permission_id
    where m.organization_id = p_organization_id
      and m.user_id = auth.uid()
      and m.statut = 'actif'
      and p.cle = p_permission_key
  );
$$;

grant execute on function public.is_organization_member(uuid) to authenticated;
grant execute on function public.is_workspace_member(uuid) to authenticated;
grant execute on function public.has_permission(uuid, text) to authenticated;
