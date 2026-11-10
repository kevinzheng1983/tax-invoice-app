-- Aggregate money inside PostgreSQL; return six summary rows, never invoice details.
create function public.get_invoice_summary(as_of_date date)
returns table (all_time_total numeric, month text, amount numeric)
language sql
stable
security invoker
set search_path = ''
as $$
  with bounds as (
    select date_trunc('month', as_of_date::timestamp)::date as current_month
  ), months as (
    select (b.current_month - n * interval '1 month')::date as month_start
    from bounds b cross join generate_series(0, 5) as n
  ), monthly as (
    select date_trunc('month', i.invoice_date::timestamp)::date as month_start,
           sum(i.amount) as amount
    from public.invoices i cross join bounds b
    where i.invoice_date >= (b.current_month - interval '5 months')::date
      and i.invoice_date <= as_of_date
    group by 1
  ), total as (
    select coalesce(sum(i.amount), 0) as amount from public.invoices i
  )
  select t.amount, to_char(m.month_start, 'YYYY-MM'), coalesce(s.amount, 0)
  from months m
  cross join total t
  left join monthly s on s.month_start = m.month_start
  order by m.month_start;
$$;

revoke all on function public.get_invoice_summary(date) from public, anon, authenticated;
grant execute on function public.get_invoice_summary(date) to service_role;
