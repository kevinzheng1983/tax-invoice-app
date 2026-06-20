import Link from "next/link";
import { AppShell, BottomNav, Icon } from "@/components/app-shell";
import { getInvoices } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return <AppShell bottom={<BottomNav active="invoices" />}>
    <header className="page-header"><div><p className="eyebrow">All records</p><h1>Invoices</h1></div><Link className="round-button" href="/invoices/new" aria-label="New invoice"><Icon name="plus"/></Link></header>
    {invoices.length ? <div className="receipt-list roomy">{invoices.map((invoice) => <Link className="receipt-row" href={`/invoices/preview?id=${invoice.id}`} key={invoice.id}><span className="receipt-main"><b>{invoice.number}</b><small>{invoice.customer}</small></span><span className="receipt-amount"><b>{formatCurrency(invoice.amount)}</b><small>{formatDisplayDate(invoice.date)}</small></span><Icon name="chevron"/></Link>)}</div> : <section className="empty-state"><div className="empty-icon"><Icon name="file"/></div><h2>No invoices yet</h2><p>Create your first invoice and it will be saved securely.</p><Link className="primary-button" href="/invoices/new"><Icon name="plus"/> New invoice</Link></section>}
  </AppShell>;
}

