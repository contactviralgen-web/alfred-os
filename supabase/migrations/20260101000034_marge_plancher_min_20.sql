-- La marge plancher ne doit jamais être fixée sous 20% (garde-fou du futur
-- repricing automatique) — la valeur par défaut de la colonne s'aligne sur
-- cette règle, déjà appliquée côté validation applicative.

alter table public.product_cost_settings
  alter column marge_plancher_pct set default 20.00;
