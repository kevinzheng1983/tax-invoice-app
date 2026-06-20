import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell, TopBar } from "@/components/app-shell";
import { DeleteInvoiceButton } from "@/components/delete-invoice-button";
import { SharePdfButton } from "@/components/share-pdf-button";
import { getInvoice, getProviderSettings } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import { getProviderDetails } from "@/lib/provider";

export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) notFound();
  const [invoice, settings] = await Promise.all([getInvoice(id), getProviderSettings()]);
  if (!invoice) notFound();
  const provider = getProviderDetails(invoice.insuranceCompany, settings);
  const pdfParams = new URLSearchParams({ number: invoice.number, date: invoice.date, customer: invoice.customer, description: invoice.description, amount: String(invoice.amount), providerLabel: provider.label, providerNumber: provider.number });
  const pdfUrl = `/api/receipts/pdf?${pdfParams.toString()}`;
  return <AppShell className="preview-page"><TopBar title="Receipt preview" back="/invoices" action={<DeleteInvoiceButton id={id} number={invoice.number}/>}/>
    <article className="receipt-preview"><h2>RECEIPT</h2><dl className="receipt-meta"><div><dt>Receipt no.</dt><dd>{invoice.number}</dd></div><div><dt>Receipt date</dt><dd>{formatDisplayDate(invoice.date)}</dd></div></dl><div className="bill-to"><span>Bill to</span><strong>{invoice.customer}</strong></div><div className="line-item"><span>{invoice.description}</span><b>{formatCurrency(invoice.amount)}</b></div><div className="receipt-total"><span><b>Total</b> AUD</span><strong>{formatCurrency(invoice.amount)}</strong></div></article>
    <div className="preview-actions"><Link className="secondary-button" href={`/invoices/${id}/edit`}>Edit</Link><Link className="secondary-button" href={`/invoices/${id}/copy`}>Copy &amp; Edit</Link><SharePdfButton pdfUrl={pdfUrl} receiptNumber={invoice.number}/><Link className="secondary-button" href={`/invoices/preview/print?id=${id}`}>View &amp; download PDF</Link></div>
  </AppShell>;
}
