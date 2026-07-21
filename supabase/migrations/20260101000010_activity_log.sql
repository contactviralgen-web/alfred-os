-- Journal d'activité (sécurité/traçabilité). Aucune écriture directe côté client :
-- uniquement via la fonction log_activity(), en SECURITY DEFINER, pour garantir
-- l'intégrité du journal (acteur_id toujours dérivé de auth.uid() côté serveur).
create table public.activity_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid references public.workspaces (id) on delete cascade,
  acteur_id uuid references public.profiles (id) on delete set null,
  action text not null,
  cible_type text,
  cible_id uuid,
  metadonnees jsonb not null default '{}'::jsonb,
  cree_le timestamptz not null default now()
);

create index activity_log_organization_id_idx on public.activity_log (organization_id, cree_le desc);

create or replace function public.log_activity(
  p_organization_id uuid,
  p_workspace_id uuid,
  p_action text,
  p_cible_type text default null,
  p_cible_id uuid default null,
  p_metadonnees jsonb default '{}'::jsonb
) returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.activity_log (organization_id, workspace_id, acteur_id, action, cible_type, cible_id, metadonnees)
  values (p_organization_id, p_workspace_id, auth.uid(), p_action, p_cible_type, p_cible_id, p_metadonnees)
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.log_activity(uuid, uuid, text, text, uuid, jsonb) to authenticated;
