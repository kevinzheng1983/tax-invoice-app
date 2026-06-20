import { notFound } from "next/navigation";
import { AppShell, TopBar } from "@/components/app-shell";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getCustomers, getInvoice } from "@/lib/data";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, customers] = await Promise.all([getInvoice(id), getCustomers()]);
  if (!invoice) notFound();
  return <AppShell className="form-page"><TopBar title="Edit invoice" back={`/invoices/preview?id=${id}`}/><InvoiceForm invoice={invoice} customers={customers} defaultNumber={invoice.number} defaultDate={invoice.date}/></AppShell>;
}
