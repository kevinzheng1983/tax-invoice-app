import Link from "next/link";
import { AppShell, BottomNav, Icon } from "@/components/app-shell";
import { InvoiceSearchList } from "@/components/invoice-search-list";
import { getInvoicePeriod } from "@/lib/data";
import { todayInBrisbane } from "@/lib/format";
import { monthsBefore } from "@/lib/invoice-period";

export default async function InvoicesPage() {
  const end = todayInBrisbane();
  const start = monthsBefore(end, 3);
  const { invoices, hasOlder } = await getInvoicePeriod(start, end, true);
  return <AppShell bottom={<BottomNav active="invoices" />}>
    <header className="page-header"><div><p className="eyebrow">Past 3 months</p><h1>Invoices</h1></div><Link className="round-button" href="/invoices/new" aria-label="New invoice"><Icon name="plus"/></Link></header>
    <InvoiceSearchList key={`${start}-${end}`} invoices={invoices} initialStart={start} end={end} initialHasOlder={hasOlder}/>
  </AppShell>;
}
