-- p_workspace_id devient optionnel (les événements au niveau organisation,
-- comme la modification des informations de l'organisation, n'ont pas de
-- workspace associé).
create or replace function public.log_activity(
  p_organization_id uuid,
  p_workspace_id uuid default null,
  p_action text default '',
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
