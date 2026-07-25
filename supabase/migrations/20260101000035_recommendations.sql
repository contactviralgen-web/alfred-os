-- Entité transverse Recommendation (module 2 du prompt "Amazon Profit
-- Intelligence") : chaque agent (Profit/Ads/Stock/Executive — "Rentabilité",
-- "Publicité", "Stock", "Directeur" côté français) écrit ici ses constats au
-- lieu de les recalculer à la volée à chaque affichage. Le Centre de
-- décisions actuel (construireCentreDecisions dans insights.service.ts) reste
-- en place pour le tableau de bord temps réel ; cette table sert à
-- l'historisation et au futur rapport hebdomadaire de l'Executive Agent
-- (Sprint D), qui a besoin de comparer une semaine à l'autre.

create type public.type_agent_ia as enum ('rentabilite', 'publicite', 'stock', 'directeur');
create type public.statut_recommandation as enum ('nouvelle', 'vue', 'appliquee', 'ignoree');

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  agent public.type_agent_ia not null,
  probleme_detecte text not null,
  analyse_ia text not null,
  recommandation text not null,
  impact_estime_eur numeric(12, 2),
  statut public.statut_recommandation not null default 'nouvelle',
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create index recommendations_workspace_idx on public.recommendations (workspace_id, cree_le desc);
create index recommendations_agent_idx on public.recommendations (workspace_id, agent, statut);

create trigger set_recommendations_modifie_le
  before update on public.recommendations
  for each row execute function public.set_modifie_le();

alter table public.recommendations enable row level security;

create policy "recommendations_lecture" on public.recommendations for select
using (public.is_organization_member(organization_id));
create policy "recommendations_ecriture" on public.recommendations for insert
with check (public.has_permission(organization_id, 'agents.recommendations.manage'));
create policy "recommendations_maj" on public.recommendations for update
using (public.has_permission(organization_id, 'agents.recommendations.manage'));

-- Permission dédiée, même pattern que rentabilite.manage
-- (20260101000027_rentabilite.sql).
insert into public.permissions (cle, module, description) values
  ('agents.recommendations.manage', 'agents', 'Générer et mettre à jour le statut des recommandations des agents IA');

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug in ('owner', 'admin') and r.organization_id is null and p.cle = 'agents.recommendations.manage';

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.cle = 'agents.recommendations.manage'
where r.slug = 'manager' and r.organization_id is null;
