-- Le modèle de données du document "AI Commerce Intelligence" liste
-- explicitement l'ASIN comme champ de l'entité Product (distinct du SKU
-- interne). Nullable : tous les produits n'ont pas encore d'ASIN tant que le
-- SP-API n'est pas réellement connecté (démo).
alter table public.products add column asin text;
