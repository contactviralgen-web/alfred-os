-- Module CRM : entreprises, contacts (clients/prospects), pipeline commercial,
-- activités (notes/appels/emails/RDV formant la timeline d'un contact).
create table public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  nom text not null,
  secteur text,
  site_web text,
  taille text,
  adresse text,
  notes text,
  cree_par uuid references public.profiles (id) on delete set null,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_crm_companies_modifie_le
  before update on public.crm_companies
  for each row execute function public.set_modifie_le();

create type public.statut_contact_crm as enum ('prospect', 'client', 'perdu');

create table public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  company_id uuid references public.crm_companies (id) on delete set null,
  prenom text,
  nom text,
  email text,
  telephone text,
  statut public.statut_contact_crm not null default 'prospect',
  source text,
  score_ia integer,
  tags text[] not null default '{}',
  notes text,
  assigne_a uuid references public.profiles (id) on delete set null,
  cree_par uuid references public.profiles (id) on delete set null,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_crm_contacts_modifie_le
  before update on public.crm_contacts
  for each row execute function public.set_modifie_le();

create index crm_contacts_workspace_idx on public.crm_contacts (workspace_id, statut);

create table public.crm_pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  nom text not null,
  ordre integer not null default 0,
  couleur text not null default 'zinc',
  est_gagne boolean not null default false,
  est_perdu boolean not null default false,
  cree_le timestamptz not null default now()
);

create index crm_pipeline_stages_workspace_idx on public.crm_pipeline_stages (workspace_id, ordre);

create table public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  contact_id uuid references public.crm_contacts (id) on delete set null,
  company_id uuid references public.crm_companies (id) on delete set null,
  stage_id uuid not null references public.crm_pipeline_stages (id),
  titre text not null,
  montant numeric(12, 2) not null default 0,
  date_cloture_prevue date,
  assigne_a uuid references public.profiles (id) on delete set null,
  cree_par uuid references public.profiles (id) on delete set null,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create trigger set_crm_deals_modifie_le
  before update on public.crm_deals
  for each row execute function public.set_modifie_le();

create index crm_deals_workspace_stage_idx on public.crm_deals (workspace_id, stage_id);

create type public.type_activite_crm as enum ('note', 'appel', 'email', 'rdv');

create table public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  contact_id uuid references public.crm_contacts (id) on delete cascade,
  deal_id uuid references public.crm_deals (id) on delete set null,
  type public.type_activite_crm not null default 'note',
  contenu text not null,
  date_activite timestamptz not null default now(),
  cree_par uuid references public.profiles (id) on delete set null,
  cree_le timestamptz not null default now()
);

create index crm_activities_contact_idx on public.crm_activities (contact_id, date_activite desc);

-- RLS : mêmes principes que le reste du projet.
alter table public.crm_companies enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_pipeline_stages enable row level security;
alter table public.crm_deals enable row level security;
alter table public.crm_activities enable row level security;

create policy "crm_companies_lecture" on public.crm_companies for select
using (public.is_organization_member(organization_id));
create policy "crm_companies_ecriture" on public.crm_companies for insert
with check (public.has_permission(organization_id, 'crm.contacts.manage'));
create policy "crm_companies_maj" on public.crm_companies for update
using (public.has_permission(organization_id, 'crm.contacts.manage'));
create policy "crm_companies_suppression" on public.crm_companies for delete
using (public.has_permission(organization_id, 'crm.contacts.manage'));

create policy "crm_contacts_lecture" on public.crm_contacts for select
using (public.is_organization_member(organization_id));
create policy "crm_contacts_ecriture" on public.crm_contacts for insert
with check (public.has_permission(organization_id, 'crm.contacts.manage'));
create policy "crm_contacts_maj" on public.crm_contacts for update
using (public.has_permission(organization_id, 'crm.contacts.manage'));
create policy "crm_contacts_suppression" on public.crm_contacts for delete
using (public.has_permission(organization_id, 'crm.contacts.manage'));

create policy "crm_pipeline_stages_lecture" on public.crm_pipeline_stages for select
using (public.is_organization_member(organization_id));
create policy "crm_pipeline_stages_ecriture" on public.crm_pipeline_stages for insert
with check (public.has_permission(organization_id, 'crm.pipeline.manage'));
create policy "crm_pipeline_stages_maj" on public.crm_pipeline_stages for update
using (public.has_permission(organization_id, 'crm.pipeline.manage'));
create policy "crm_pipeline_stages_suppression" on public.crm_pipeline_stages for delete
using (public.has_permission(organization_id, 'crm.pipeline.manage'));

create policy "crm_deals_lecture" on public.crm_deals for select
using (public.is_organization_member(organization_id));
create policy "crm_deals_ecriture" on public.crm_deals for insert
with check (public.has_permission(organization_id, 'crm.pipeline.manage'));
create policy "crm_deals_maj" on public.crm_deals for update
using (public.has_permission(organization_id, 'crm.pipeline.manage'));
create policy "crm_deals_suppression" on public.crm_deals for delete
using (public.has_permission(organization_id, 'crm.pipeline.manage'));

create policy "crm_activities_lecture" on public.crm_activities for select
using (public.is_organization_member(organization_id));
create policy "crm_activities_ecriture" on public.crm_activities for insert
with check (public.has_permission(organization_id, 'crm.contacts.manage'));
create policy "crm_activities_suppression" on public.crm_activities for delete
using (public.has_permission(organization_id, 'crm.contacts.manage'));

-- Étapes de pipeline par défaut, créées automatiquement pour toute nouvelle organisation.
create or replace function public.seed_crm_pipeline_defaut()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.crm_pipeline_stages (organization_id, workspace_id, nom, ordre, couleur, est_gagne, est_perdu)
  values
    (new.organization_id, new.id, 'Nouveau', 0, 'zinc', false, false),
    (new.organization_id, new.id, 'Qualifié', 1, 'blue', false, false),
    (new.organization_id, new.id, 'Proposition', 2, 'amber', false, false),
    (new.organization_id, new.id, 'Négociation', 3, 'violet', false, false),
    (new.organization_id, new.id, 'Gagné', 4, 'emerald', true, false),
    (new.organization_id, new.id, 'Perdu', 5, 'red', false, true);
  return new;
end;
$$;

create trigger on_workspace_created_seed_pipeline
  after insert on public.workspaces
  for each row execute function public.seed_crm_pipeline_defaut();
