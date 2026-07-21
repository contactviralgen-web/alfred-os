-- Vue d'agrégation pour le classement des produits les plus rentables.
-- `security_invoker = true` est essentiel : sans cette option, une vue
-- s'exécute par défaut avec les droits de son créateur (contournant la RLS
-- des tables sous-jacentes) — ce qui romprait l'isolation multi-tenant.
create view public.v_top_products
with (security_invoker = true) as
select
  oi.product_id,
  p.organization_id,
  p.workspace_id,
  p.nom,
  p.categorie,
  p.image_url,
  sum(oi.quantite) as quantite_vendue,
  sum(oi.quantite * oi.prix_unitaire) as chiffre_affaires,
  sum(oi.quantite * oi.marge_unitaire) as marge_totale
from public.order_items oi
join public.products p on p.id = oi.product_id
join public.orders o on o.id = oi.order_id and o.statut <> 'annulee'
group by oi.product_id, p.organization_id, p.workspace_id, p.nom, p.categorie, p.image_url;

grant select on public.v_top_products to authenticated;
