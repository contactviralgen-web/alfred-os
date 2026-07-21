-- Fonctions RPC métier exposées au client authentifié. Elles orchestrent des
-- opérations atomiques multi-tables qu'aucune policy RLS unitaire ne peut exprimer
-- correctement (ex: création d'une organisation + workspace + membership en une
-- seule transaction cohérente).

create or replace function public.create_organization(p_nom text, p_slug text)
returns public.organizations
language plpgsql
security definer set search_path = public
as $$
declare
  v_org public.organizations;
  v_workspace_id uuid;
  v_owner_role_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentification requise';
  end if;

  insert into public.organizations (nom, slug, cree_par)
  values (p_nom, p_slug, auth.uid())
  returning * into v_org;

  insert into public.workspaces (organization_id, nom, slug, cree_par)
  values (v_org.id, 'Général', 'general', auth.uid())
  returning id into v_workspace_id;

  select id into v_owner_role_id from public.roles where slug = 'owner' and organization_id is null;

  insert into public.organization_members (organization_id, user_id, role_id, statut)
  values (v_org.id, auth.uid(), v_owner_role_id, 'actif');

  insert into public.workspace_members (workspace_id, user_id, role_id)
  values (v_workspace_id, auth.uid(), v_owner_role_id);

  update public.profiles set derniere_organisation_id = v_org.id where id = auth.uid();

  perform public.log_activity(v_org.id, v_workspace_id, 'organisation.creee', 'organization', v_org.id, jsonb_build_object('nom', p_nom));

  return v_org;
end;
$$;

grant execute on function public.create_organization(text, text) to authenticated;

-- Aperçu public (limité) d'une invitation par token, pour affichage avant connexion
-- sur la page /invitation/[token]. Ne révèle jamais d'informations sensibles.
create or replace function public.get_invitation_preview(p_token uuid)
returns table (
  organization_nom text,
  role_nom text,
  email text,
  statut public.statut_invitation,
  expire_le timestamptz
)
language sql stable security definer set search_path = public
as $$
  select o.nom, r.nom, i.email, i.statut, i.expire_le
  from public.invitations i
  join public.organizations o on o.id = i.organization_id
  join public.roles r on r.id = i.role_id
  where i.token = p_token;
$$;

grant execute on function public.get_invitation_preview(uuid) to authenticated, anon;

create or replace function public.accept_invitation(p_token uuid)
returns public.organization_members
language plpgsql
security definer set search_path = public
as $$
declare
  v_invitation public.invitations;
  v_member public.organization_members;
  v_user_email text;
  v_default_workspace_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentification requise';
  end if;

  select email into v_user_email from auth.users where id = auth.uid();

  select * into v_invitation from public.invitations
  where token = p_token and statut = 'en_attente' and expire_le > now();

  if v_invitation.id is null then
    raise exception 'Invitation invalide ou expirée';
  end if;

  if lower(v_invitation.email) <> lower(v_user_email) then
    raise exception 'Cette invitation ne correspond pas à votre adresse email';
  end if;

  insert into public.organization_members (organization_id, user_id, role_id, statut, invite_par)
  values (v_invitation.organization_id, auth.uid(), v_invitation.role_id, 'actif', v_invitation.invite_par)
  on conflict (organization_id, user_id) do update set statut = 'actif', role_id = excluded.role_id
  returning * into v_member;

  select id into v_default_workspace_id
  from public.workspaces
  where organization_id = v_invitation.organization_id
  order by cree_le asc
  limit 1;

  if v_default_workspace_id is not null then
    insert into public.workspace_members (workspace_id, user_id, role_id)
    values (v_default_workspace_id, auth.uid(), v_invitation.role_id)
    on conflict (workspace_id, user_id) do nothing;
  end if;

  update public.invitations set statut = 'acceptee' where id = v_invitation.id;
  update public.profiles set derniere_organisation_id = v_invitation.organization_id where id = auth.uid();

  perform public.log_activity(v_invitation.organization_id, v_default_workspace_id, 'invitation.acceptee', 'organization_member', v_member.id, '{}'::jsonb);

  return v_member;
end;
$$;

grant execute on function public.accept_invitation(uuid) to authenticated;
