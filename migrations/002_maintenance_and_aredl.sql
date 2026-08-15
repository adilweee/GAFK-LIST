alter table public.levels add column if not exists aredl_placement integer check (aredl_placement is null or aredl_placement > 0);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  maintenance_enabled boolean not null default false
);

insert into public.site_settings (id, maintenance_enabled) values (true, false) on conflict (id) do nothing;

alter table public.site_settings enable row level security;
