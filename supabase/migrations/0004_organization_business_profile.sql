-- Enrichit `organizations` avec les infos business utilisées pour la page
-- Paramètres > Entreprise, destinées à alimenter le contexte des agents IA
-- une fois branchés (secteur, description libre, canaux de vente, marge cible).

alter table organizations
  add column business_description text,
  add column industry text,
  add column sales_channels text[] not null default '{}',
  add column target_margin_pct numeric,
  add column currency text not null default 'EUR';
