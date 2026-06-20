"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createInvoice, updateInvoice, type InvoiceActionState } from "@/app/invoices/actions";
import { Icon } from "@/components/app-shell";
import type { CustomerDTO, InvoiceDTO } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

const initialState: InvoiceActionState = {};

export function InvoiceForm({ customers, invoice, defaultNumber, defaultDate }: { customers: CustomerDTO[]; invoice?: InvoiceDTO; defaultNumber: string; defaultDate: string }) {
  const router = useRouter();
  const action = invoice ? updateInvoice.bind(null, invoice.id) : createInvoice;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [amount, setAmount] = useState(String(invoice?.amount ?? ""));

  useEffect(() => {
    if (state.invoiceId) router.push(`/invoices/preview?id=${state.invoiceId}`);
  }, [router, state.invoiceId]);

  if (customers.length === 0) {
    return <section className="empty-state"><div className="empty-icon"><Icon name="users" /></div><h2>Add a customer first</h2><p>Every invoice needs a customer before it can be created.</p><Link className="primary-button" href="/customers/new"><Icon name="plus"/> Add customer</Link></section>;
  }

  return <form className="invoice-form" action={formAction}>
    <h2>Invoice details</h2>
    <label><span>Invoice number</span><input name="number" defaultValue={invoice?.number ?? defaultNumber} required /></label>
    <label className="date-field"><span>Invoice date</span><input aria-label="Invoice date" name="date" required type="date" defaultValue={invoice?.date ?? defaultDate} /><Icon name="calendar" /></label>
    <label><span>Customer</span><select name="customerId" required defaultValue={invoice?.customerId ?? ""}><option value="" disabled>Select customer</option>{customers.map((customer) => <option value={customer.id} key={customer.id}>{customer.name}</option>)}</select></label>
    <label><span>Description</span><input name="description" required defaultValue={invoice?.description ?? ""} /></label>
    <label><span>Amount</span><div className="money-input"><span>$</span><input name="amount" inputMode="decimal" min="0" required type="number" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} /></div></label>
    <div className="total-card"><span>Total</span><strong>{formatCurrency(Number(amount) || 0)}</strong></div>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button className="primary-button sticky-action" disabled={pending} type="submit">{pending ? "Saving..." : invoice ? "Save & preview" : "Create & preview"}</button>
  </form>;
}
