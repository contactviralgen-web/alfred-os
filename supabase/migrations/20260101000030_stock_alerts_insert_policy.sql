-- La policy d'écriture de stock_alerts couvrait uniquement l'update (les
-- alertes n'étaient ouvertes que par le seed). Le nouveau module Stock doit
-- pouvoir ouvrir une alerte depuis l'application (ajustement manuel de
-- stock) — policy d'insert manquante, sur le même modèle que la policy
-- d'update existante.
create policy "stock_alerts_ecriture" on public.stock_alerts for insert
with check (exists (
  select 1 from public.products p
  where p.id = stock_alerts.product_id and public.has_permission(p.organization_id, 'stock.alerts.manage')
));
