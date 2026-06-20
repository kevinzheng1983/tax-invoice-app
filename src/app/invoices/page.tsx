import Link from "next/link";
import { AppShell, BottomNav, Icon } from "@/components/app-shell";
import { InvoiceSearchList } from "@/components/invoice-search-list";
import { getInvoices } from "@/lib/data";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return <AppShell bottom={<BottomNav active="invoices" />}>
    <header className="page-header"><div><p className="eyebrow">All records</p><h1>Invoices</h1></div><Link className="round-button" href="/invoices/new" aria-label="New invoice"><Icon name="plus"/></Link></header>
    {invoices.length ? <InvoiceSearchList invoices={invoices}/> : <section className="empty-state"><div className="empty-icon"><Icon name="file"/></div><h2>No invoices yet</h2><p>Create your first invoice and it will be saved securely.</p><Link className="primary-button" href="/invoices/new"><Icon name="plus"/> New invoice</Link></section>}
  </AppShell>;
}
