-- Structures backend pour les fonctionnalités IA validées côté Agent Marketing et
-- Agent Financier (optimisation SEO, service client, veille conformité, repricer).
-- Ces tables restent vides tant que les API externes (SP-API, Ads API) ne sont pas
-- connectées : l'UI continue d'afficher des données de démonstration statiques en
-- attendant qu'un job de synchronisation vienne les alimenter (via service_role, donc
-- pas de policy d'écriture côté client pour l'instant).
--
-- Pas de table `products` dédiée : le modèle de données métier n'est pas encore
-- construit (cf. feuille de route), donc chaque table référence directement l'ASIN/nom
-- produit en texte plutôt que par clé étrangère.

create table keyword_performance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  asin text not null,
  product_name text not null,
  keyword text not null,
  search_volume integer,
  impressions integer,
  clicks integer,
  purchases integer,
  purchase_share numeric,
  captured_at timestamptz not null default now()
);

create table listing_optimizations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  asin text not null,
  product_name text not null,
  current_title text,
  current_bullets text[],
  current_description text,
  suggested_title text,
  suggested_bullets text[],
  suggested_description text,
  status text not null default 'draft' check (status in ('draft', 'applied', 'dismissed')),
  generated_at timestamptz not null default now()
);

create table review_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  amazon_order_id text not null,
  product_name text not null,
  order_date date not null,
  eligible_from date not null,
  eligible_until date not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'not_eligible')),
  created_at timestamptz not null default now()
);

create table customer_messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  amazon_order_id text not null,
  message_type text not null,
  buyer_question text not null,
  ai_suggested_reply text,
  status text not null default 'pending' check (status in ('pending', 'sent')),
  received_at timestamptz not null default now()
);

create table compliance_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  event_type text not null,
  severity text not null check (severity in ('info', 'attention', 'urgent')),
  ai_summary text not null,
  raw_payload jsonb,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

create table price_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations (id) on delete cascade,
  asin text not null,
  product_name text not null,
  current_price numeric not null,
  competitor_price numeric,
  recommended_price numeric not null,
  projected_margin_pct numeric not null,
  floor_margin_pct numeric not null,
  blocked boolean not null default false,
  block_reason text,
  generated_at timestamptz not null default now()
);

alter table keyword_performance enable row level security;
alter table listing_optimizations enable row level security;
alter table review_requests enable row level security;
alter table customer_messages enable row level security;
alter table compliance_notifications enable row level security;
alter table price_recommendations enable row level security;

create policy "Les membres voient les mots-clés de leur organisation"
  on keyword_performance for select using (is_organization_member(organization_id));
create policy "Les membres voient les optimisations de leur organisation"
  on listing_optimizations for select using (is_organization_member(organization_id));
create policy "Les membres voient les demandes d'avis de leur organisation"
  on review_requests for select using (is_organization_member(organization_id));
create policy "Les membres voient les messages de leur organisation"
  on customer_messages for select using (is_organization_member(organization_id));
create policy "Les membres voient les notifications de leur organisation"
  on compliance_notifications for select using (is_organization_member(organization_id));
create policy "Les membres voient les recommandations de prix de leur organisation"
  on price_recommendations for select using (is_organization_member(organization_id));
