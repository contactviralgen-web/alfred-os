-- Les notifications sont personnelles (destinataire_id), pas seulement
-- cloisonnées par organisation : la policy RLS le reflètera.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  destinataire_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  titre text not null,
  message text,
  lien text,
  lue boolean not null default false,
  cree_le timestamptz not null default now()
);

create index notifications_destinataire_idx on public.notifications (destinataire_id, cree_le desc);
