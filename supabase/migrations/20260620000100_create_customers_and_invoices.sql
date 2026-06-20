create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) > 0),
  email text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique
    check (length(btrim(invoice_number)) > 0),
  invoice_date date not null default current_date,
  item_description text not null
    check (length(btrim(item_description)) > 0),
  amount numeric(12, 2) not null check (amount >= 0),
  tax numeric(12, 2) not null default 0 check (tax >= 0),
  customer_id uuid not null
    references public.customers(id)
    on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index invoices_customer_id_idx
  on public.invoices(customer_id);

create index invoices_invoice_date_idx
  on public.invoices(invoice_date);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger customers_set_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

create trigger invoices_set_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

alter table public.customers enable row level security;
alter table public.invoices enable row level security;

revoke all on table public.customers from anon, authenticated;
revoke all on table public.invoices from anon, authenticated;

grant all on table public.customers to service_role;
grant all on table public.invoices to service_role;

