-- Données de démonstration réalistes pour Pilot.
--
-- Ce script n'est PAS une migration : il ne s'exécute pas automatiquement sur
-- Supabase Cloud (contrairement à `supabase db reset` en local). Il cible une
-- organisation existante par son slug et peut être rejoué à volonté : il
-- supprime d'abord les données de démo précédentes de cette organisation.
--
-- Utilisation : ajuster v_org_slug ci-dessous, puis exécuter ce fichier via
-- `supabase db execute` ou directement dans le SQL editor de Supabase.

do $$
declare
  v_org_slug text := 'atlas-distribution';
  v_org_id uuid;
  v_workspace_id uuid;
  v_user_id uuid;
  v_product_ids uuid[];
  v_product_id uuid;
  v_prix_achat numeric;
  v_prix_vente numeric;
  v_jour date;
  v_offset int;
  v_nb_commandes int;
  v_order_id uuid;
  v_statut public.statut_commande;
  v_canal public.canal_commande;
  v_nb_items int;
  v_i int;
  v_moyenne_ca numeric;
begin
  select id into v_org_id from public.organizations where slug = v_org_slug;
  if v_org_id is null then
    raise exception 'Organisation "%" introuvable — créez-la avant de lancer ce seed.', v_org_slug;
  end if;

  select id into v_workspace_id from public.workspaces
  where organization_id = v_org_id order by cree_le asc limit 1;

  select user_id into v_user_id from public.organization_members
  where organization_id = v_org_id order by cree_le asc limit 1;

  -- Nettoyage des données de démo précédentes de cette organisation.
  delete from public.crm_activities where organization_id = v_org_id;
  delete from public.crm_contacts where organization_id = v_org_id;
  delete from public.notifications where organization_id = v_org_id;
  delete from public.calendar_events where organization_id = v_org_id;
  delete from public.tasks where organization_id = v_org_id;
  delete from public.revenue_forecasts where organization_id = v_org_id;
  delete from public.revenue_metrics where organization_id = v_org_id;
  delete from public.order_items where order_id in (select id from public.orders where organization_id = v_org_id);
  delete from public.orders where organization_id = v_org_id;
  delete from public.stock_alerts where workspace_id = v_workspace_id;
  delete from public.stock_levels where workspace_id = v_workspace_id;
  delete from public.products where organization_id = v_org_id;

  -- Catalogue produits (4 catégories, marges variées).
  insert into public.products (organization_id, workspace_id, sku, nom, prix_achat, prix_vente, categorie)
  values
    (v_org_id, v_workspace_id, 'ELEC-001', 'Casque audio sans fil Pro', 42.00, 89.90, 'Électronique'),
    (v_org_id, v_workspace_id, 'ELEC-002', 'Chargeur secteur rapide 65W', 9.50, 24.90, 'Électronique'),
    (v_org_id, v_workspace_id, 'ELEC-003', 'Enceinte Bluetooth portable', 28.00, 59.90, 'Électronique'),
    (v_org_id, v_workspace_id, 'ELEC-004', 'Câble USB-C tressé 2m', 3.20, 12.90, 'Électronique'),
    (v_org_id, v_workspace_id, 'ELEC-005', 'Souris ergonomique sans fil', 14.00, 34.90, 'Électronique'),
    (v_org_id, v_workspace_id, 'ELEC-006', 'Webcam Full HD', 22.00, 49.90, 'Électronique'),
    (v_org_id, v_workspace_id, 'MAIS-001', 'Diffuseur d''huiles essentielles', 11.00, 29.90, 'Maison'),
    (v_org_id, v_workspace_id, 'MAIS-002', 'Set de rangement modulaire', 18.00, 44.90, 'Maison'),
    (v_org_id, v_workspace_id, 'MAIS-003', 'Lampe de bureau LED', 9.00, 27.90, 'Maison'),
    (v_org_id, v_workspace_id, 'MAIS-004', 'Coussin de sol ergonomique', 13.50, 32.90, 'Maison'),
    (v_org_id, v_workspace_id, 'MAIS-005', 'Bouilloire électrique design', 16.00, 39.90, 'Maison'),
    (v_org_id, v_workspace_id, 'SPOR-001', 'Tapis de yoga antidérapant', 8.00, 24.90, 'Sport'),
    (v_org_id, v_workspace_id, 'SPOR-002', 'Bandes de résistance (lot de 5)', 6.50, 19.90, 'Sport'),
    (v_org_id, v_workspace_id, 'SPOR-003', 'Gourde isotherme 750ml', 7.00, 22.90, 'Sport'),
    (v_org_id, v_workspace_id, 'SPOR-004', 'Corde à sauter lestée', 5.00, 16.90, 'Sport'),
    (v_org_id, v_workspace_id, 'SPOR-005', 'Sac de sport imperméable', 15.00, 37.90, 'Sport'),
    (v_org_id, v_workspace_id, 'BEAU-001', 'Rouleau de massage jade', 4.50, 18.90, 'Beauté'),
    (v_org_id, v_workspace_id, 'BEAU-002', 'Coffret pinceaux maquillage', 9.50, 26.90, 'Beauté'),
    (v_org_id, v_workspace_id, 'BEAU-003', 'Miroir grossissant LED', 12.00, 31.90, 'Beauté'),
    (v_org_id, v_workspace_id, 'BEAU-004', 'Bandeau démaquillant (lot de 3)', 3.00, 14.90, 'Beauté'),
    (v_org_id, v_workspace_id, 'ELEC-007', 'Support téléphone de bureau', 4.00, 15.90, 'Électronique'),
    (v_org_id, v_workspace_id, 'MAIS-006', 'Organiseur de câbles (lot de 8)', 3.50, 13.90, 'Maison'),
    (v_org_id, v_workspace_id, 'SPOR-006', 'Genouillères de protection', 6.00, 21.90, 'Sport'),
    (v_org_id, v_workspace_id, 'BEAU-005', 'Brosse démêlante anti-casse', 5.50, 19.90, 'Beauté');

  select array_agg(id) into v_product_ids from public.products where workspace_id = v_workspace_id;

  -- 90 jours d'historique de commandes avec tendance de croissance.
  for v_offset in reverse 89..0 loop
    v_jour := current_date - v_offset;
    -- Plus on se rapproche d'aujourd'hui, plus le volume moyen augmente (croissance).
    v_nb_commandes := greatest(1, floor(random() * (2 + (89 - v_offset)::numeric / 18))::int);

    for v_i in 1..v_nb_commandes loop
      v_canal := (array['site_web', 'site_web', 'amazon', 'amazon', 'manuel'])[1 + floor(random() * 5)::int];

      v_statut := case
        when v_offset = 0 and random() < 0.5 then 'en_attente'
        when random() < 0.04 then 'bloquee'
        when random() < 0.03 then 'annulee'
        when v_offset < 3 then (array['confirmee', 'expediee'])[1 + floor(random() * 2)::int]
        else (array['expediee', 'livree', 'livree'])[1 + floor(random() * 3)::int]
      end::public.statut_commande;

      insert into public.orders (
        organization_id, workspace_id, numero_commande, canal, statut,
        montant_total, montant_marge, client_nom, cree_le
      )
      values (
        v_org_id, v_workspace_id,
        'CMD-' || to_char(v_jour, 'YYMMDD') || '-' || lpad(v_i::text, 3, '0'),
        v_canal, v_statut, 0, 0,
        (array['Julie Martin', 'Karim Haddad', 'Sofia Rossi', 'Lucas Bernard', 'Nadia Cohen',
               'Antoine Petit', 'Emma Girard', 'Youssef Amrani', 'Chloé Fontaine', 'Marc Dubois'])[1 + floor(random() * 10)::int],
        v_jour + (random() * interval '20 hours') + interval '4 hours'
      )
      returning id into v_order_id;

      v_nb_items := 1 + floor(random() * 3)::int;
      for v_i in 1..v_nb_items loop
        v_product_id := v_product_ids[1 + floor(random() * array_length(v_product_ids, 1))::int];
        select prix_achat, prix_vente into v_prix_achat, v_prix_vente from public.products where id = v_product_id;

        insert into public.order_items (order_id, product_id, quantite, prix_unitaire, marge_unitaire)
        values (v_order_id, v_product_id, 1 + floor(random() * 2)::int, v_prix_vente, v_prix_vente - v_prix_achat);
      end loop;

      update public.orders o set
        montant_total = coalesce((select sum(quantite * prix_unitaire) from public.order_items where order_id = o.id), 0),
        montant_marge = coalesce((select sum(quantite * marge_unitaire) from public.order_items where order_id = o.id), 0)
      where o.id = v_order_id;
    end loop;
  end loop;

  -- Fiches CRM clients à partir des commandes (un client particulier par nom distinct).
  insert into public.crm_contacts (organization_id, workspace_id, prenom, statut, source)
  select v_org_id, v_workspace_id, distinct_clients.client_nom, 'client', 'commande'
  from (select distinct client_nom from public.orders where workspace_id = v_workspace_id) as distinct_clients;

  update public.orders o
  set contact_id = c.id
  from public.crm_contacts c
  where c.workspace_id = v_workspace_id and c.prenom = o.client_nom and o.workspace_id = v_workspace_id;

  -- Quelques notes/activités de démonstration sur les 5 premiers clients.
  insert into public.crm_activities (organization_id, workspace_id, contact_id, type, contenu, date_activite, cree_par)
  select
    v_org_id, v_workspace_id, c.id, 'note',
    'Client fidèle, plusieurs commandes passées. À recontacter pour une offre de fidélité.',
    now() - (random() * interval '10 days'),
    v_user_id
  from public.crm_contacts c
  where c.workspace_id = v_workspace_id
  order by c.cree_le
  limit 5;

  -- Agrégats journaliers (exclut les commandes annulées).
  insert into public.revenue_metrics (organization_id, workspace_id, date, chiffre_affaires, benefice, nombre_commandes, panier_moyen)
  select
    v_org_id, v_workspace_id, date(cree_le),
    sum(montant_total), sum(montant_marge), count(*),
    round(sum(montant_total) / count(*), 2)
  from public.orders
  where workspace_id = v_workspace_id and statut <> 'annulee'
  group by date(cree_le);

  -- Prévisions (mock) sur les 14 prochains jours, basées sur la moyenne des 14 derniers jours.
  select avg(chiffre_affaires) into v_moyenne_ca
  from public.revenue_metrics
  where workspace_id = v_workspace_id and date >= current_date - 14;

  insert into public.revenue_forecasts (organization_id, workspace_id, date, chiffre_affaires_prevu, intervalle_confiance_bas, intervalle_confiance_haut, modele)
  select
    v_org_id, v_workspace_id,
    current_date + g,
    round(v_moyenne_ca * (1 + g * 0.015), 2),
    round(v_moyenne_ca * (1 + g * 0.015) * 0.82, 2),
    round(v_moyenne_ca * (1 + g * 0.015) * 1.18, 2),
    'mock_v0'
  from generate_series(1, 14) as g;

  -- Stock : 6 produits en tension (rupture/stock bas), le reste en stock sain.
  insert into public.stock_levels (product_id, workspace_id, quantite_disponible, quantite_reservee, seuil_alerte)
  select
    p.id, v_workspace_id,
    case
      when p.sku in ('ELEC-001', 'MAIS-002') then 0
      when p.sku in ('ELEC-003', 'SPOR-005', 'BEAU-002') then 2 + floor(random() * 3)::int
      else 25 + floor(random() * 60)::int
    end,
    floor(random() * 5)::int,
    10
  from public.products p
  where p.workspace_id = v_workspace_id;

  insert into public.stock_alerts (product_id, workspace_id, type, statut)
  select p.id, v_workspace_id,
    case when sl.quantite_disponible = 0 then 'rupture' else 'stock_bas' end::public.type_alerte_stock,
    'ouverte'
  from public.products p
  join public.stock_levels sl on sl.product_id = p.id
  where p.workspace_id = v_workspace_id and sl.quantite_disponible <= sl.seuil_alerte;

  -- Tâches.
  if v_user_id is not null then
    insert into public.tasks (organization_id, workspace_id, assigne_a, titre, description, statut, priorite, echeance_le)
    values
      (v_org_id, v_workspace_id, v_user_id, 'Relancer le fournisseur ELEC-001', 'Rupture de stock sur le casque audio Pro, commande urgente à passer.', 'a_faire', 'haute', current_date + 1),
      (v_org_id, v_workspace_id, v_user_id, 'Valider les 3 commandes bloquées', 'Vérifier les adresses de livraison invalides.', 'a_faire', 'haute', current_date + 2),
      (v_org_id, v_workspace_id, v_user_id, 'Préparer le rapport mensuel', 'Synthèse CA / marge pour la réunion de direction.', 'en_cours', 'normale', current_date + 5),
      (v_org_id, v_workspace_id, v_user_id, 'Répondre aux avis clients récents', null, 'a_faire', 'normale', current_date + 3),
      (v_org_id, v_workspace_id, v_user_id, 'Mettre à jour les fiches produit Maison', null, 'en_cours', 'basse', current_date + 7),
      (v_org_id, v_workspace_id, v_user_id, 'Négocier les tarifs avec le fournisseur Beauté', null, 'a_faire', 'normale', current_date + 10),
      (v_org_id, v_workspace_id, v_user_id, 'Contrôle qualité réception stock', null, 'terminee', 'normale', current_date - 2),
      (v_org_id, v_workspace_id, v_user_id, 'Planifier la prochaine campagne promo', null, 'a_faire', 'basse', current_date + 14);

    insert into public.calendar_events (organization_id, workspace_id, titre, type, debut_le, fin_le, cree_par)
    values
      (v_org_id, v_workspace_id, 'Point hebdo équipe commerciale', 'reunion', current_date + 1 + time '09:00', current_date + 1 + time '09:30', v_user_id),
      (v_org_id, v_workspace_id, 'Échéance renouvellement fournisseur', 'echeance', current_date + 4 + time '00:00', null, v_user_id),
      (v_org_id, v_workspace_id, 'Appel fournisseur Électronique', 'reunion', current_date + 2 + time '14:00', current_date + 2 + time '14:30', v_user_id),
      (v_org_id, v_workspace_id, 'Rappel: renouveler l''assurance transport', 'rappel', current_date + 6 + time '00:00', null, v_user_id),
      (v_org_id, v_workspace_id, 'Revue mensuelle des performances', 'reunion', current_date + 12 + time '10:00', current_date + 12 + time '11:00', v_user_id);

    insert into public.notifications (organization_id, destinataire_id, type, titre, message, lien, lue, cree_le)
    values
      (v_org_id, v_user_id, 'stock', 'Rupture de stock', 'Casque audio sans fil Pro est en rupture de stock.', '/atlas-distribution/general/tableau-de-bord', false, now() - interval '2 hours'),
      (v_org_id, v_user_id, 'commande', 'Commande bloquée', 'Une commande est bloquée depuis 2 jours.', '/atlas-distribution/general/tableau-de-bord', false, now() - interval '5 hours'),
      (v_org_id, v_user_id, 'equipe', 'Nouveau membre', 'Un nouveau membre a rejoint l''organisation.', '/atlas-distribution/general/parametres/membres', false, now() - interval '1 day'),
      (v_org_id, v_user_id, 'ventes', 'Bonne performance', 'Le chiffre d''affaires du jour dépasse la moyenne de 15%.', '/atlas-distribution/general/tableau-de-bord', true, now() - interval '1 day'),
      (v_org_id, v_user_id, 'stock', 'Stock bas', '3 produits atteignent leur seuil d''alerte.', '/atlas-distribution/general/tableau-de-bord', true, now() - interval '2 days'),
      (v_org_id, v_user_id, 'systeme', 'Bienvenue sur Pilot', 'Votre organisation a été créée avec succès.', '/atlas-distribution/general/tableau-de-bord', true, now() - interval '3 days');
  end if;

  raise notice 'Seed terminé pour l''organisation % (workspace %)', v_org_id, v_workspace_id;
end $$;
