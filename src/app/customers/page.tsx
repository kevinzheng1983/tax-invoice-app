import Link from "next/link";
import { AppShell, BottomNav, Icon } from "@/components/app-shell";
import { getCustomers } from "@/lib/data";

export default async function CustomersPage() {
  const customers = await getCustomers();
  return <AppShell bottom={<BottomNav active="customers" />}>
    <header className="page-header"><h1>Customers</h1></header>
    <Link className="primary-button" href="/customers/new"><Icon name="plus"/> Add customer</Link>
    {customers.length ? <div className="customer-list">{customers.map((customer) => <Link className="customer-card" href={`/customers/${customer.id}/edit`} key={customer.id}><span className="avatar">{customer.name.split(" ").map((part) => part[0]).join("").slice(0,2).toUpperCase()}</span><span><b>{customer.name}</b><small>{customer.insuranceCompany ? `${customer.insuranceCompany} · ${customer.email || customer.phone || "No contact details"}` : customer.email || customer.phone || "No contact details"}</small></span><Icon name="chevron"/></Link>)}</div> : <section className="empty-state customer-empty"><div className="empty-icon"><Icon name="users"/></div><h2>No customers yet</h2><p>Add a customer to start creating invoices.</p></section>}
  </AppShell>;
}
