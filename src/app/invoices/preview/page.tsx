import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell, TopBar } from "@/components/app-shell";
import { DeleteInvoiceButton } from "@/components/delete-invoice-button";
import { getInvoice } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";

export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) notFound();
  const invoice = await getInvoice(id);
  if (!invoice) notFound();
  return <AppShell className="preview-page"><TopBar title="Receipt preview" back="/invoices" action={<DeleteInvoiceButton id={id} number={invoice.number}/>}/>
    <article className="receipt-preview"><h2>RECEIPT</h2><dl className="receipt-meta"><div><dt>Receipt no.</dt><dd>{invoice.number}</dd></div><div><dt>Receipt date</dt><dd>{formatDisplayDate(invoice.date)}</dd></div></dl><div className="bill-to"><span>Bill to</span><strong>{invoice.customer}</strong></div><div className="line-item"><span>{invoice.description}</span><b>{formatCurrency(invoice.amount)}</b></div><div className="receipt-total"><span><b>Total</b> AUD</span><strong>{formatCurrency(invoice.amount)}</strong></div></article>
    <div className="preview-actions"><Link className="secondary-button" href={`/invoices/${id}/edit`}>Edit</Link><Link className="secondary-button" href={`/invoices/${id}/copy`}>Copy &amp; Edit</Link><Link className="primary-button" href={`/invoices/preview/print?id=${id}`}>View & download PDF</Link></div>
  </AppShell>;
}
