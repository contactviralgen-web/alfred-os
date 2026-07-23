-- Marge plancher par produit : le seuil de marge nette minimum (calculé sur
-- l'ensemble des charges réelles déjà suivies par Rentabilité — achat,
-- transport, douane, frais Amazon/FBA, stockage, retours, TVA) sous lequel
-- un prix ne doit jamais descendre. Sert de garde-fou au futur pilier de
-- repricing automatique (Buy Box) : Pilot pourra ajuster le prix pour
-- gagner le Buy Box, mais jamais en dessous de ce plancher. Demandé dès la
-- création du produit pour qu'aucun produit ne soit jamais sans plancher défini.

alter table public.product_cost_settings
  add column marge_plancher_pct numeric(5, 2) not null default 15.00;
