"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

export type InvoiceActionState = { error?: string; invoiceId?: string };

const invoiceSchema = z.object({
  number: z.string().trim().min(1, "Invoice number is required.").max(50),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose an invoice date."),
  customerId: z.string().uuid("Choose a customer."),
  description: z.string().trim().min(1, "Description is required.").max(300),
  amount: z.coerce.number().finite().min(0, "Amount cannot be negative."),
});

function parseInvoice(formData: FormData) {
  return invoiceSchema.safeParse({
    number: formData.get("number"),
    date: formData.get("date"),
    customerId: formData.get("customerId"),
    description: formData.get("description"),
    amount: formData.get("amount"),
  });
}

function invoiceValues(data: z.infer<typeof invoiceSchema>) {
  return {
    invoice_number: data.number,
    invoice_date: data.date,
    customer_id: data.customerId,
    item_description: data.description,
    amount: data.amount,
    tax: 0,
  };
}

function invoiceError(error: { code?: string }) {
  return error.code === "23505"
    ? "That invoice number is already in use."
    : "Could not save this invoice. Please try again.";
}

function refreshInvoices(id?: string) {
  revalidatePath("/");
  revalidatePath("/invoices");
  if (id) {
    revalidatePath(`/invoices/preview?id=${id}`);
    revalidatePath(`/invoices/preview/print?id=${id}`);
  }
}

export async function createInvoice(_state: InvoiceActionState, formData: FormData): Promise<InvoiceActionState> {
  const parsed = parseInvoice(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the invoice details." };
  const { data, error } = await createAdminClient()
    .from("invoices")
    .insert(invoiceValues(parsed.data))
    .select("id")
    .single();
  if (error) return { error: invoiceError(error) };
  refreshInvoices(data.id);
  return { invoiceId: data.id };
}

export async function updateInvoice(id: string, _state: InvoiceActionState, formData: FormData): Promise<InvoiceActionState> {
  const parsed = parseInvoice(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the invoice details." };
  const { error } = await createAdminClient().from("invoices").update(invoiceValues(parsed.data)).eq("id", id);
  if (error) return { error: invoiceError(error) };
  refreshInvoices(id);
  return { invoiceId: id };
}

