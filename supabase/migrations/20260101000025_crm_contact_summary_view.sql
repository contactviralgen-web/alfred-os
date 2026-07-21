-- Agrège l'historique de commandes par client CRM (nombre de commandes,
-- montant total dépensé, date de dernière commande).
create view public.v_crm_contact_summary
with (security_invoker = true) as
select
  c.id as contact_id,
  c.workspace_id,
  count(o.id) as nombre_commandes,
  coalesce(sum(o.montant_total) filter (where o.statut <> 'annulee'), 0) as total_depense,
  max(o.cree_le) as derniere_commande_le
from public.crm_contacts c
left join public.orders o on o.contact_id = c.id
group by c.id, c.workspace_id;

grant select on public.v_crm_contact_summary to authenticated;
