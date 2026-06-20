import { notFound } from "next/navigation";
import { AppShell, TopBar } from "@/components/app-shell";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getCustomers, getInvoice, getNextInvoiceNumber } from "@/lib/data";
import { todayInBrisbane } from "@/lib/format";

export default async function CopyInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [sourceInvoice, customers, nextNumber] = await Promise.all([
    getInvoice(id),
    getCustomers(),
    getNextInvoiceNumber(),
  ]);
  if (!sourceInvoice) notFound();

  return <AppShell className="form-page"><TopBar title="Copy invoice" back={`/invoices/preview?id=${id}`}/><InvoiceForm mode="create" invoice={sourceInvoice} customers={customers} defaultNumber={nextNumber} defaultDate={todayInBrisbane()}/></AppShell>;
}
