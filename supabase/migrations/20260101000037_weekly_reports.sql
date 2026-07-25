-- Executive Agent : rapport hebdomadaire structuré (module document
-- "chaque semaine : voici les 5 décisions prioritaires"). Généré à la
-- demande pour le MVP (bouton "Générer maintenant" côté UI) plutôt que par
-- cron — cf. risque technique identifié dans le plan de recadrage : pas de
-- pg_cron/Vercel Cron pour ne pas ajouter d'infra pour une démo.

create type public.sante_business as enum ('bonne', 'a_surveiller', 'critique');

create table public.executive_weekly_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  sante_business public.sante_business not null,
  sante_libelle text not null,
  top_problemes text[] not null default '{}',
  top_opportunites text[] not null default '{}',
  actions_recommandees text[] not null default '{}',
  periode_debut timestamptz not null,
  periode_fin timestamptz not null,
  cree_le timestamptz not null default now()
);

create index executive_weekly_reports_workspace_idx on public.executive_weekly_reports (workspace_id, cree_le desc);

alter table public.executive_weekly_reports enable row level security;

create policy "executive_weekly_reports_lecture" on public.executive_weekly_reports for select
using (public.is_organization_member(organization_id));
create policy "executive_weekly_reports_ecriture" on public.executive_weekly_reports for insert
with check (public.has_permission(organization_id, 'agents.recommendations.manage'));
