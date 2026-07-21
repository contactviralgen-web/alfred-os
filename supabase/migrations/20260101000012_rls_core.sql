-- Row Level Security : isolation stricte par organisation/workspace.
-- Toute table portant organization_id ou workspace_id doit avoir RLS activé.

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.workspaces enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.permissions enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.organization_members enable row level security;
alter table public.workspace_members enable row level security;
alter table public.invitations enable row level security;
alter table public.activity_log enable row level security;

-- profiles : chacun voit/modifie son propre profil, et peut voir les profils des
-- membres avec qui il partage au moins une organisation.
create policy "profils_lecture" on public.profiles for select
using (
  id = auth.uid()
  or exists (
    select 1 from public.organization_members m1
    join public.organization_members m2 on m2.organization_id = m1.organization_id
    where m1.user_id = auth.uid() and m2.user_id = profiles.id and m1.statut = 'actif' and m2.statut = 'actif'
  )
);

create policy "profils_maj_soi" on public.profiles for update
using (id = auth.uid());

-- organizations : lecture pour les membres, écriture réservée aux permissions
-- adéquates. La création passe exclusivement par la fonction create_organization()
-- (aucune policy insert ici : refus par défaut pour les clients).
create policy "organisations_lecture" on public.organizations for select
using (public.is_organization_member(id));

create policy "organisations_maj" on public.organizations for update
using (public.has_permission(id, 'core.organization.manage'));

-- workspaces
create policy "workspaces_lecture" on public.workspaces for select
using (public.is_organization_member(organization_id));

create policy "workspaces_creation" on public.workspaces for insert
with check (public.has_permission(organization_id, 'core.workspace.manage'));

create policy "workspaces_maj" on public.workspaces for update
using (public.has_permission(organization_id, 'core.workspace.manage'));

create policy "workspaces_suppression" on public.workspaces for delete
using (public.has_permission(organization_id, 'core.workspace.manage'));

-- teams
create policy "teams_lecture" on public.teams for select
using (public.is_organization_member(organization_id));

create policy "teams_creation" on public.teams for insert
with check (public.has_permission(organization_id, 'core.teams.manage'));

create policy "teams_maj" on public.teams for update
using (public.has_permission(organization_id, 'core.teams.manage'));

create policy "teams_suppression" on public.teams for delete
using (public.has_permission(organization_id, 'core.teams.manage'));

-- team_members
create policy "team_members_lecture" on public.team_members for select
using (exists (
  select 1 from public.teams t
  where t.id = team_members.team_id and public.is_organization_member(t.organization_id)
));

create policy "team_members_creation" on public.team_members for insert
with check (exists (
  select 1 from public.teams t
  where t.id = team_members.team_id and public.has_permission(t.organization_id, 'core.teams.manage')
));

create policy "team_members_suppression" on public.team_members for delete
using (exists (
  select 1 from public.teams t
  where t.id = team_members.team_id and public.has_permission(t.organization_id, 'core.teams.manage')
));

-- permissions : catalogue global en lecture seule pour les utilisateurs authentifiés.
create policy "permissions_lecture" on public.permissions for select
using (auth.role() = 'authenticated');

-- roles : rôles système visibles par tous les authentifiés, rôles personnalisés
-- visibles par les membres de l'organisation. Les rôles système ne sont jamais
-- modifiables/supprimables par les clients (est_systeme = true).
create policy "roles_lecture" on public.roles for select
using (organization_id is null or public.is_organization_member(organization_id));

create policy "roles_creation" on public.roles for insert
with check (organization_id is not null and public.has_permission(organization_id, 'core.roles.manage'));

create policy "roles_maj" on public.roles for update
using (organization_id is not null and not est_systeme and public.has_permission(organization_id, 'core.roles.manage'));

create policy "roles_suppression" on public.roles for delete
using (organization_id is not null and not est_systeme and public.has_permission(organization_id, 'core.roles.manage'));

-- role_permissions
create policy "role_permissions_lecture" on public.role_permissions for select
using (exists (
  select 1 from public.roles r
  where r.id = role_permissions.role_id
    and (r.organization_id is null or public.is_organization_member(r.organization_id))
));

create policy "role_permissions_creation" on public.role_permissions for insert
with check (exists (
  select 1 from public.roles r
  where r.id = role_permissions.role_id and not r.est_systeme
    and r.organization_id is not null and public.has_permission(r.organization_id, 'core.roles.manage')
));

create policy "role_permissions_suppression" on public.role_permissions for delete
using (exists (
  select 1 from public.roles r
  where r.id = role_permissions.role_id and not r.est_systeme
    and r.organization_id is not null and public.has_permission(r.organization_id, 'core.roles.manage')
));

-- organization_members : lecture par les membres, modification/suppression réservée
-- à la permission de gestion des membres. L'ajout se fait via create_organization()
-- ou accept_invitation() (SECURITY DEFINER) : pas de policy insert cliente.
create policy "organization_members_lecture" on public.organization_members for select
using (public.is_organization_member(organization_id));

create policy "organization_members_maj" on public.organization_members for update
using (public.has_permission(organization_id, 'core.members.manage'));

create policy "organization_members_suppression" on public.organization_members for delete
using (public.has_permission(organization_id, 'core.members.manage'));

-- workspace_members
create policy "workspace_members_lecture" on public.workspace_members for select
using (public.is_workspace_member(workspace_id));

create policy "workspace_members_creation" on public.workspace_members for insert
with check (exists (
  select 1 from public.workspaces w
  where w.id = workspace_members.workspace_id and public.has_permission(w.organization_id, 'core.members.manage')
));

create policy "workspace_members_maj" on public.workspace_members for update
using (exists (
  select 1 from public.workspaces w
  where w.id = workspace_members.workspace_id and public.has_permission(w.organization_id, 'core.members.manage')
));

create policy "workspace_members_suppression" on public.workspace_members for delete
using (exists (
  select 1 from public.workspaces w
  where w.id = workspace_members.workspace_id and public.has_permission(w.organization_id, 'core.members.manage')
));

-- invitations : gérées par les membres ayant la permission d'invitation.
-- L'acceptation par l'invité (qui n'est pas encore membre) passe par la fonction
-- accept_invitation() (SECURITY DEFINER), donc pas de policy select/update publique
-- par token ici.
create policy "invitations_lecture" on public.invitations for select
using (public.has_permission(organization_id, 'core.members.invite'));

create policy "invitations_creation" on public.invitations for insert
with check (public.has_permission(organization_id, 'core.members.invite'));

create policy "invitations_maj" on public.invitations for update
using (public.has_permission(organization_id, 'core.members.invite'));

create policy "invitations_suppression" on public.invitations for delete
using (public.has_permission(organization_id, 'core.members.invite'));

-- activity_log : lecture seule pour les membres ayant la permission dédiée.
-- Aucune écriture cliente : uniquement via log_activity().
create policy "activity_log_lecture" on public.activity_log for select
using (public.has_permission(organization_id, 'core.activity_log.read'));
