"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/app-shell";
import type { InvoiceDTO } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";
import { loadOlderInvoices } from "@/app/invoices/load-older";

export function InvoiceSearchList({ invoices: initialInvoices, initialStart, end, initialHasOlder }: { invoices: InvoiceDTO[]; initialStart: string; end: string; initialHasOlder: boolean }) {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [start, setStart] = useState(initialStart);
  const [hasOlder, setHasOlder] = useState(initialHasOlder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  async function loadMore() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await loadOlderInvoices(start);
      setInvoices((previous) => {
        const existing = new Set(previous.map((invoice) => invoice.id));
        return [...previous, ...result.invoices.filter((invoice) => !existing.has(invoice.id))];
      });
      setStart(result.start);
      setHasOlder(result.hasOlder);
    } catch {
      setError("Could not load older invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("en-AU");
    if (!normalizedQuery) return invoices;
    return invoices.filter((invoice) =>
      invoice.customer.toLocaleLowerCase("en-AU").includes(normalizedQuery),
    );
  }, [invoices, query]);

  return <section className="invoice-search-section">
    <label className="search-box"><Icon name="search"/><input aria-label="Search invoices by customer name" type="search" placeholder="Search by customer name" value={query} onChange={(event) => setQuery(event.target.value)}/></label>
    <p className="invoice-date-range"><Icon name="calendar"/>{formatDisplayDate(start)} – {formatDisplayDate(end)}</p>
    {query.trim() && <p className="search-scope">Searching invoices in the loaded date range.</p>}
    <div aria-busy={loading}>{filteredInvoices.length ? <div className="receipt-list roomy">{filteredInvoices.map((invoice) => <Link className="receipt-row" href={`/invoices/preview?id=${invoice.id}`} key={invoice.id}><span className="receipt-main"><b>{invoice.number}</b><small>{invoice.customer}</small></span><span className="receipt-amount"><b>{formatCurrency(invoice.amount)}</b><small>{formatDisplayDate(invoice.date)}</small></span><Icon name="chevron"/></Link>)}</div> : <div className="compact-empty search-empty"><p>{query.trim() ? "No matching invoices" : "No invoices in this period"}</p><span>{hasOlder ? "Load older invoices to see earlier records." : query.trim() ? "Try another customer name." : "Create a new invoice to get started."}</span></div>}</div>
    {hasOlder ? <div className="load-older"><button className="secondary-button" type="button" disabled={loading} onClick={loadMore}>{loading ? "Loading..." : "Load older invoices"}</button><p>Load the previous 3 months</p></div> : invoices.length > 0 && <p className="all-loaded" role="status">All older invoices loaded</p>}
    {error && <p className="form-error" role="alert">{error}</p>}
  </section>;
}
