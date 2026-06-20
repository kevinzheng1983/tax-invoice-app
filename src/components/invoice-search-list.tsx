"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/app-shell";
import type { InvoiceDTO } from "@/lib/data";
import { formatCurrency, formatDisplayDate } from "@/lib/format";

export function InvoiceSearchList({ invoices }: { invoices: InvoiceDTO[] }) {
  const [query, setQuery] = useState("");
  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("en-AU");
    if (!normalizedQuery) return invoices;
    return invoices.filter((invoice) =>
      invoice.customer.toLocaleLowerCase("en-AU").includes(normalizedQuery),
    );
  }, [invoices, query]);

  return <section className="invoice-search-section">
    <label className="search-box"><Icon name="search"/><input aria-label="Search invoices by customer name" type="search" placeholder="Search by customer name" value={query} onChange={(event) => setQuery(event.target.value)}/></label>
    {filteredInvoices.length ? <div className="receipt-list roomy">{filteredInvoices.map((invoice) => <Link className="receipt-row" href={`/invoices/preview?id=${invoice.id}`} key={invoice.id}><span className="receipt-main"><b>{invoice.number}</b><small>{invoice.customer}</small></span><span className="receipt-amount"><b>{formatCurrency(invoice.amount)}</b><small>{formatDisplayDate(invoice.date)}</small></span><Icon name="chevron"/></Link>)}</div> : <div className="compact-empty search-empty"><p>No matching invoices</p><span>Try another customer name.</span></div>}
  </section>;
}
