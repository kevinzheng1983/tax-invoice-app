import { AppShell, TopBar } from "@/components/app-shell";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getCustomers, getNextInvoiceNumber } from "@/lib/data";

function todayInBrisbane() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Brisbane", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export default async function NewInvoicePage() {
  const [customers, defaultNumber] = await Promise.all([getCustomers(), getNextInvoiceNumber()]);
  return <AppShell className="form-page"><TopBar title="New invoice"/><InvoiceForm customers={customers} defaultNumber={defaultNumber} defaultDate={todayInBrisbane()}/></AppShell>;
}

