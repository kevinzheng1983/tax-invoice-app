import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/app-shell";
import { getInvoice } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";

export default async function PrintReceiptPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  if (!id) notFound();
  const invoice = await getInvoice(id);
  if (!invoice) notFound();
  const params = new URLSearchParams({ number: invoice.number, date: invoice.date, customer: invoice.customer, description: invoice.description, amount: String(invoice.amount) });
  return <main className="print-screen"><div className="print-toolbar"><Link href={`/invoices/preview?id=${id}`}><Icon name="back"/> Back to preview</Link><a className="download-button" href={`/api/receipts/pdf?${params.toString()}`} download={`${invoice.number}.pdf`}>Download PDF</a></div>
    <article className="a4-receipt"><header className="a4-header"><h1>Zhaoyang Shi</h1><strong>RECEIPT</strong></header><section className="business-details"><p>ABN: 86 164 178 873</p><p>Address: 86 Andaman St, Jamboree Heights, QLD, 4074</p><p>Email: zhaoyangshi@gmail.com</p><p>Tel No. 0410174441</p><p>Provider Number: AAMT40649</p><p>Medibank Provider Number: 0843394W</p></section><section className="a4-meta"><div><b>Bill To</b><span>{invoice.customer}</span></div><dl><div><dt>Receipt #</dt><dd>{invoice.number}</dd></div><div><dt>Receipt Date</dt><dd>{formatDisplayDate(invoice.date)}</dd></div></dl></section><table><thead><tr><th>DESCRIPTION</th><th>AMOUNT</th></tr></thead><tbody><tr><td>{invoice.description}</td><td>{formatCurrency(invoice.amount)}</td></tr></tbody></table><div className="a4-total"><b>TOTAL</b><strong>{formatCurrency(invoice.amount)}</strong></div><div className="signature">Zhaoyang Shi</div><footer className="payment-details"><b>Payment Details</b><p>BSB: 064178</p><p>Account number: 10389373</p><p>Account name: Zhaoyang Shi</p></footer></article>
  </main>;
}

