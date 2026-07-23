-- Récupération de fonds Amazon (FBA reimbursements) : une fois le SP-API
-- connecté, la détection se ferait automatiquement via le rapport officiel
-- GET_FBA_REIMBURSEMENTS_DATA + les rapports d'inventaire (écarts stock
-- perdu/endommagé/remboursement manquant). En attendant, incidents simulés
-- mais avec la même structure de données. Le dépôt du dossier auprès
-- d'Amazon reste toujours une action du vendeur dans Seller Central (aucune
-- API publique de dépôt de réclamation n'existe côté Amazon) — Pilot
-- détecte, chiffre et PRÉPARE le dossier (généré par IA), le vendeur
-- l'envoie lui-même.

create type public.type_incident_remboursement as enum (
  'stock_perdu', 'stock_endommage', 'remboursement_manquant', 'frais_errone'
);
create type public.statut_reclamation as enum (
  'detecte', 'dossier_pret', 'soumis', 'recupere', 'rejete'
);

create table public.reimbursement_claims (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  type_incident public.type_incident_remboursement not null,
  quantite integer not null default 1 check (quantite > 0),
  montant_estime numeric(10, 2) not null default 0,
  statut public.statut_reclamation not null default 'detecte',
  dossier_texte text,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_reimbursement_claims_modifie_le
  before update on public.reimbursement_claims
  for each row execute function public.set_modifie_le();

create index reimbursement_claims_workspace_idx on public.reimbursement_claims (workspace_id, statut);

alter table public.reimbursement_claims enable row level security;

create policy "reimbursement_claims_lecture" on public.reimbursement_claims for select
using (public.is_organization_member(organization_id));
create policy "reimbursement_claims_ecriture" on public.reimbursement_claims for insert
with check (public.has_permission(organization_id, 'amazon.listings.manage'));
create policy "reimbursement_claims_maj" on public.reimbursement_claims for update
using (public.has_permission(organization_id, 'amazon.listings.manage'));
