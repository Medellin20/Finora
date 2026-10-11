create table if not exists public.demandes (
  id text primary key,
  created_at timestamptz not null,
  data jsonb not null
);
create index if not exists demandes_created_at_idx on public.demandes (created_at desc);

create table if not exists public.settings (
  id text primary key check (id = 'main'),
  updated_at timestamptz not null default now(),
  data jsonb not null
);

alter table public.demandes enable row level security;
alter table public.settings enable row level security;
revoke all on public.demandes from anon, authenticated;
revoke all on public.settings from anon, authenticated;
grant all on public.demandes to service_role;
grant all on public.settings to service_role;
