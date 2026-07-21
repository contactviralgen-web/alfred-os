-- Pivot : les utilisateurs de Pilot sont des vendeurs Amazon dont les clients
-- sont des particuliers issus des commandes, pas des entreprises B2B avec un
-- pipeline commercial. On retire ce qui ne correspond pas à cet usage plutôt
-- que de garder un schéma B2B inutilisé, et on relie chaque commande à une
-- fiche client CRM.
drop trigger if exists on_workspace_created_seed_pipeline on public.workspaces;
drop function if exists public.seed_crm_pipeline_defaut();

alter table public.crm_activities drop column if exists deal_id;

drop table if exists public.crm_deals;
drop table if exists public.crm_pipeline_stages;

alter table public.crm_contacts drop column if exists company_id;
drop table if exists public.crm_companies;

-- Relie chaque commande à sa fiche client CRM (particulier).
alter table public.orders add column contact_id uuid references public.crm_contacts (id) on delete set null;
create index orders_contact_id_idx on public.orders (contact_id);

-- Crée automatiquement (ou réutilise) une fiche client à partir des
-- informations d'une commande, pour que chaque commande Amazon/site web/
-- manuelle alimente le CRM sans saisie manuelle.
create or replace function public.relier_ou_creer_contact_depuis_commande(
  p_organization_id uuid,
  p_workspace_id uuid,
  p_client_nom text,
  p_email text default null
) returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_contact_id uuid;
begin
  if p_email is not null then
    select id into v_contact_id from public.crm_contacts
    where workspace_id = p_workspace_id and email = p_email
    limit 1;
  end if;

  if v_contact_id is null and p_client_nom is not null then
    select id into v_contact_id from public.crm_contacts
    where workspace_id = p_workspace_id
      and email is null
      and (coalesce(prenom, '') || ' ' || coalesce(nom, '')) = p_client_nom
    limit 1;
  end if;

  if v_contact_id is null then
    insert into public.crm_contacts (organization_id, workspace_id, prenom, email, statut, source)
    values (p_organization_id, p_workspace_id, p_client_nom, p_email, 'client', 'commande')
    returning id into v_contact_id;
  end if;

  return v_contact_id;
end;
$$;

grant execute on function public.relier_ou_creer_contact_depuis_commande(uuid, uuid, text, text) to authenticated;
