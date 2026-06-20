import Link from "next/link";
import { AppShell, BottomNav, Icon } from "@/components/app-shell";
import { getDashboardData } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";

export default async function Home() {
  const data = await getDashboardData();
  return <AppShell bottom={<BottomNav active="home" />}>
    <header className="page-header home-header"><p className="eyebrow">Good morning</p><h1>Invoices</h1></header>
    <section className="summary-card" aria-label="Monthly summary"><p>This month</p><strong>{formatCurrency(data.monthTotal)}</strong><div className="summary-stats"><div><Icon name="file"/><span><b>{data.invoiceCount}</b> invoices</span></div><div><Icon name="users"/><span><b>{data.customerCount}</b> customers</span></div></div></section>
    <Link className="primary-button new-invoice-button" href="/invoices/new"><Icon name="plus"/> New invoice</Link>
    <section className="list-section"><div className="section-heading"><h2>Recent invoices</h2><Link href="/invoices">View all</Link></div>
      {data.recentInvoices.length ? <div className="receipt-list">{data.recentInvoices.map((invoice) => <Link className="receipt-row" href={`/invoices/preview?id=${invoice.id}`} key={invoice.id}><span className="receipt-main"><b>{invoice.number}</b><small>{invoice.customer}</small></span><span className="receipt-amount"><b>{formatCurrency(invoice.amount)}</b><small>{formatDisplayDate(invoice.date)}</small></span><Icon name="chevron"/></Link>)}</div> : <div className="compact-empty"><p>No invoices yet.</p><span>Your first invoice will appear here.</span></div>}
    </section>
  </AppShell>;
}

