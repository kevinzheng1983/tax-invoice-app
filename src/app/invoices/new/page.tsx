import { AppShell, TopBar } from "@/components/app-shell";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getCustomers, getNextInvoiceNumber } from "@/lib/data";
import { todayInBrisbane } from "@/lib/format";

export default async function NewInvoicePage() {
  const [customers, defaultNumber] = await Promise.all([getCustomers(), getNextInvoiceNumber()]);
  return <AppShell className="form-page"><TopBar title="New invoice"/><InvoiceForm customers={customers} defaultNumber={defaultNumber} defaultDate={todayInBrisbane()}/></AppShell>;
}
