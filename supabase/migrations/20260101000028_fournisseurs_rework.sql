-- Le score de recommandation fournisseur doit être 100% dérivé de
-- l'historique réel de commandes (ponctualité constatée), jamais d'une note
-- manuelle arbitraire sans base vérifiable — supprimée.
alter table public.suppliers drop column note_performance;

-- Suivi opérationnel : date à laquelle le paiement de la commande est prévu
-- (indépendant du statut de la facture, qui reste géré via supplier_invoices).
alter table public.supplier_orders add column date_paiement_prevue date;
