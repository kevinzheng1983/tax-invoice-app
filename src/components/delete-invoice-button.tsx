"use client";

import { deleteInvoice } from "@/app/invoices/actions";
import { Icon } from "@/components/app-shell";

export function DeleteInvoiceButton({ id, number }: { id: string; number: string }) {
  const deleteAction = deleteInvoice.bind(null, id);
  return <form className="delete-invoice-form" action={deleteAction} onSubmit={(event) => {
    if (!window.confirm(`Delete invoice ${number}? This action cannot be undone.`)) event.preventDefault();
  }}><button className="delete-icon-button" type="submit" aria-label={`Delete invoice ${number}`} title="Delete invoice"><Icon name="trash"/></button></form>;
}
