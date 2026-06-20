alter table public.customers
add column insurance_company text
check (
  insurance_company is null
  or insurance_company in ('Medibank', 'Bupa', 'HCF', 'ARHG')
);

