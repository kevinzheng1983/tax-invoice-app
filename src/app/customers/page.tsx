import Link from "next/link";
import { AppShell, BottomNav, Icon } from "@/components/app-shell";
import { CustomerSearchList } from "@/components/customer-search-list";
import { getCustomers } from "@/lib/data";

export default async function CustomersPage() {
  const customers = await getCustomers();
  return <AppShell bottom={<BottomNav active="customers" />}>
    <header className="page-header"><h1>Customers</h1></header>
    <Link className="primary-button" href="/customers/new"><Icon name="plus"/> Add customer</Link>
    {customers.length ? <CustomerSearchList customers={customers}/> : <section className="empty-state customer-empty"><div className="empty-icon"><Icon name="users"/></div><h2>No customers yet</h2><p>Add a customer to start creating invoices.</p></section>}
  </AppShell>;
}
