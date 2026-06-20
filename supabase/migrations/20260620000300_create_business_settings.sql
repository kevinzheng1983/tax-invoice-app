create table public.business_settings (
  id boolean primary key default true check (id),
  default_provider_number text not null default 'AAMT40649'
    check (length(btrim(default_provider_number)) > 0),
  medibank_provider_number text not null default '0843394W'
    check (length(btrim(medibank_provider_number)) > 0),
  bupa_provider_number text not null default '0843394W'
    check (length(btrim(bupa_provider_number)) > 0),
  hcf_provider_number text not null default '0843394W'
    check (length(btrim(hcf_provider_number)) > 0),
  arhg_provider_number text not null default '0843394W'
    check (length(btrim(arhg_provider_number)) > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger business_settings_set_updated_at
before update on public.business_settings
for each row execute function public.set_updated_at();

alter table public.business_settings enable row level security;
revoke all on table public.business_settings from anon, authenticated;
grant all on table public.business_settings to service_role;

insert into public.business_settings (id)
values (true)
on conflict (id) do nothing;

