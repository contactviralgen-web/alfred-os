-- Module Publicité (Ads Agent) : connexions démo Amazon Ads / Meta Ads
-- (même mécanique que amazon_connections — cf. 20260101000029) et campagnes
-- publicitaires avec les métriques nécessaires au calcul ROAS/ACOS. Le TACOS
-- (dépense pub / CA total du workspace, tous canaux) se calcule côté service
-- car il croise cette table avec `orders`, pas seulement les campagnes.

create type public.plateforme_pub as enum ('amazon_ads', 'meta_ads');
create type public.statut_connexion_pub as enum ('connecte', 'deconnecte');
create type public.statut_campagne_pub as enum ('active', 'en_pause', 'terminee');

create table public.ads_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  plateforme public.plateforme_pub not null,
  statut public.statut_connexion_pub not null default 'deconnecte',
  compte_id text,
  connecte_le timestamptz,
  modifie_le timestamptz not null default now(),
  unique (workspace_id, plateforme)
);

create trigger set_ads_connections_modifie_le
  before update on public.ads_connections
  for each row execute function public.set_modifie_le();

create table public.advertising_campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  plateforme public.plateforme_pub not null,
  nom text not null,
  statut public.statut_campagne_pub not null default 'active',
  depense numeric(10, 2) not null default 0,
  impressions integer not null default 0,
  clics integer not null default 0,
  conversions integer not null default 0,
  chiffre_affaires_genere numeric(10, 2) not null default 0,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create index advertising_campaigns_workspace_idx on public.advertising_campaigns (workspace_id, cree_le desc);

create trigger set_advertising_campaigns_modifie_le
  before update on public.advertising_campaigns
  for each row execute function public.set_modifie_le();

-- ROAS = CA généré / dépense. ACOS = dépense / CA généré (%). Les deux à 0
-- quand la dépense ou le CA généré est nul, plutôt que de propager une
-- division par zéro jusqu'à l'UI.
create view public.v_ad_performance
with (security_invoker = true) as
select
  c.*,
  case when c.depense > 0 then round(c.chiffre_affaires_genere / c.depense, 2) else 0 end as roas,
  case when c.chiffre_affaires_genere > 0 then round((c.depense / c.chiffre_affaires_genere) * 100, 2) else 0 end as acos_pct
from public.advertising_campaigns c;

grant select on public.v_ad_performance to authenticated;

alter table public.ads_connections enable row level security;
alter table public.advertising_campaigns enable row level security;

create policy "ads_connections_lecture" on public.ads_connections for select
using (public.is_organization_member(organization_id));
create policy "ads_connections_ecriture" on public.ads_connections for insert
with check (public.has_permission(organization_id, 'publicite.connection.manage'));
create policy "ads_connections_maj" on public.ads_connections for update
using (public.has_permission(organization_id, 'publicite.connection.manage'));

create policy "advertising_campaigns_lecture" on public.advertising_campaigns for select
using (public.is_organization_member(organization_id));
create policy "advertising_campaigns_ecriture" on public.advertising_campaigns for insert
with check (public.has_permission(organization_id, 'publicite.campaigns.manage'));
create policy "advertising_campaigns_maj" on public.advertising_campaigns for update
using (public.has_permission(organization_id, 'publicite.campaigns.manage'));

insert into public.permissions (cle, module, description) values
  ('publicite.connection.manage', 'publicite', 'Connecter/déconnecter les comptes Amazon Ads et Meta Ads'),
  ('publicite.campaigns.manage', 'publicite', 'Consulter et analyser les campagnes publicitaires');

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug in ('owner', 'admin') and r.organization_id is null
  and p.cle in ('publicite.connection.manage', 'publicite.campaigns.manage');

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.cle in ('publicite.connection.manage', 'publicite.campaigns.manage')
where r.slug = 'manager' and r.organization_id is null;
