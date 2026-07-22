-- Ajoute le canal de la commande à la vue de marge nette, pour permettre au
-- module Amazon de calculer un CA/bénéfice réel filtré sur le canal Amazon
-- (create or replace view : ajout de colonne en fin de liste, sans casser
-- les lectures existantes en select("*")).
create or replace view public.v_product_margins
with (security_invoker = true) as
select
  oi.id as order_item_id,
  o.id as order_id,
  o.organization_id,
  o.workspace_id,
  o.cree_le,
  o.statut,
  p.id as product_id,
  p.nom as produit_nom,
  p.categorie,
  p.prix_achat,
  oi.quantite,
  oi.prix_unitaire,
  (oi.quantite * oi.prix_unitaire) as chiffre_affaires,
  coalesce(pcs.cout_transport_flat, 0) as cout_transport_flat,
  coalesce(pcs.cout_douane_flat, 0) as cout_douane_flat,
  coalesce(pcs.frais_amazon_pct, 15.00) as frais_amazon_pct,
  coalesce(pcs.frais_fba_flat, 0) as frais_fba_flat,
  coalesce(pcs.frais_stockage_unitaire_flat, 0) as frais_stockage_unitaire_flat,
  coalesce(pcs.taux_retour_pct, 0) as taux_retour_pct,
  coalesce(pcs.cout_divers_flat, 0) as cout_divers_flat,
  coalesce(wcs.taux_tva_pct, 20.00) as taux_tva_pct,
  coalesce(wcs.prix_ttc, true) as prix_ttc,
  o.canal
from public.order_items oi
join public.orders o on o.id = oi.order_id
join public.products p on p.id = oi.product_id
left join public.product_cost_settings pcs on pcs.product_id = p.id
left join public.workspace_cost_settings wcs on wcs.workspace_id = o.workspace_id;

grant select on public.v_product_margins to authenticated;
