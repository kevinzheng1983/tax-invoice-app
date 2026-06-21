import { AppShell, TopBar } from "@/components/app-shell";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getCustomers, getNextInvoiceNumber } from "@/lib/data";
import { todayInBrisbane } from "@/lib/format";

export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<{ customerId?: string }> }) {
  const [customers, defaultNumber, query] = await Promise.all([getCustomers(), getNextInvoiceNumber(), searchParams]);
  const defaultCustomerId = customers.some((customer) => customer.id === query.customerId) ? query.customerId : undefined;
  return <AppShell className="form-page"><TopBar title="New invoice"/><InvoiceForm customers={customers} defaultNumber={defaultNumber} defaultDate={todayInBrisbane()} defaultCustomerId={defaultCustomerId}/></AppShell>;
}
