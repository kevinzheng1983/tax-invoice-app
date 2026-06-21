alter table public.customers
drop constraint if exists customers_insurance_company_check;

alter table public.customers
add constraint customers_insurance_company_check
check (
  insurance_company is null
  or insurance_company in ('Medibank', 'Bupa', 'HCF', 'ARHG', 'AHM')
);

alter table public.business_settings
add column ahm_provider_number text not null default '123456'
check (length(btrim(ahm_provider_number)) > 0);
