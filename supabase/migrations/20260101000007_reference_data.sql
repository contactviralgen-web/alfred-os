-- Données de référence (pas des données de démo) : catalogue de permissions et
-- rôles système. Nécessaires au fonctionnement de l'application, donc versionnées
-- en migration plutôt qu'en seed de développement.
insert into public.permissions (cle, module, description) values
  ('core.organization.manage', 'core', 'Gérer les informations de l''organisation'),
  ('core.workspace.manage', 'core', 'Créer, modifier et supprimer des workspaces'),
  ('core.members.manage', 'core', 'Gérer les membres et leurs rôles'),
  ('core.members.invite', 'core', 'Inviter de nouveaux membres'),
  ('core.teams.manage', 'core', 'Gérer les équipes'),
  ('core.roles.manage', 'core', 'Gérer les rôles et permissions personnalisés'),
  ('core.activity_log.read', 'core', 'Consulter le journal d''activité'),
  ('dashboard.view', 'dashboard', 'Consulter le tableau de bord'),
  ('crm.contacts.read', 'crm', 'Consulter les contacts et prospects du CRM'),
  ('crm.contacts.manage', 'crm', 'Créer et modifier les contacts et prospects du CRM'),
  ('crm.pipeline.manage', 'crm', 'Gérer le pipeline commercial'),
  ('amazon.connection.manage', 'amazon', 'Connecter/déconnecter un compte Amazon SP-API'),
  ('amazon.orders.read', 'amazon', 'Consulter les commandes Amazon synchronisées'),
  ('amazon.listings.manage', 'amazon', 'Gérer et optimiser les fiches produits Amazon'),
  ('stock.products.manage', 'stock', 'Gérer le catalogue produits et les niveaux de stock'),
  ('stock.alerts.manage', 'stock', 'Gérer les alertes de rupture et de réapprovisionnement'),
  ('automation.workflows.manage', 'automation', 'Créer et modifier des automatisations'),
  ('automation.workflows.execute', 'automation', 'Déclencher/consulter l''exécution des automatisations'),
  ('agents.chat.use', 'agents', 'Discuter avec les agents IA'),
  ('agents.settings.manage', 'agents', 'Configurer la mémoire et les outils des agents IA');

insert into public.roles (organization_id, nom, slug, est_systeme, description) values
  (null, 'Propriétaire', 'owner', true, 'Accès complet à l''organisation, y compris la facturation et les rôles'),
  (null, 'Administrateur', 'admin', true, 'Accès complet à la gestion opérationnelle de l''organisation'),
  (null, 'Manager', 'manager', true, 'Gestion du CRM, du stock et des automatisations au quotidien'),
  (null, 'Membre', 'membre', true, 'Accès aux modules métier en lecture/écriture limitée'),
  (null, 'Lecteur', 'lecteur', true, 'Accès en lecture seule au tableau de bord');

-- owner et admin : toutes les permissions du catalogue.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.slug in ('owner', 'admin') and r.organization_id is null;

-- manager : gestion opérationnelle quotidienne.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.cle in (
  'dashboard.view',
  'core.members.invite',
  'core.activity_log.read',
  'crm.contacts.read', 'crm.contacts.manage', 'crm.pipeline.manage',
  'amazon.orders.read',
  'stock.products.manage', 'stock.alerts.manage',
  'automation.workflows.execute',
  'agents.chat.use'
)
where r.slug = 'manager' and r.organization_id is null;

-- membre : usage courant des modules métier.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.cle in (
  'dashboard.view',
  'crm.contacts.read',
  'agents.chat.use'
)
where r.slug = 'membre' and r.organization_id is null;

-- lecteur : lecture seule du tableau de bord.
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.cle = 'dashboard.view'
where r.slug = 'lecteur' and r.organization_id is null;
