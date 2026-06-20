import "server-only";

import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export type CustomerDTO = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
};

export type InvoiceDTO = {
  id: string;
  number: string;
  date: string;
  customer: string;
  customerId: string;
  description: string;
  amount: number;
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  item_description: string;
  amount: number;
  customer_id: string;
  customers: { name: string } | null;
};

function invoiceDTO(row: InvoiceRow): InvoiceDTO {
  return {
    id: row.id,
    number: row.invoice_number,
    date: row.invoice_date,
    customer: row.customers?.name ?? "Unknown customer",
    customerId: row.customer_id,
    description: row.item_description,
    amount: Number(row.amount),
  };
}

function dataError(message: string, error: { message: string }) {
  console.error(message, error.message);
  throw new Error(message);
}

export async function getCustomers(): Promise<CustomerDTO[]> {
  await connection();
  const { data, error } = await createAdminClient()
    .from("customers")
    .select("id,name,email,phone,address")
    .order("name");
  if (error) dataError("Could not load customers.", error);
  return data ?? [];
}

export async function getCustomer(id: string): Promise<CustomerDTO | null> {
  await connection();
  const { data, error } = await createAdminClient()
    .from("customers")
    .select("id,name,email,phone,address")
    .eq("id", id)
    .maybeSingle();
  if (error) dataError("Could not load this customer.", error);
  return data;
}

export async function getInvoices(limit?: number): Promise<InvoiceDTO[]> {
  await connection();
  let query = createAdminClient()
    .from("invoices")
    .select("id,invoice_number,invoice_date,item_description,amount,customer_id,customers(name)")
    .order("invoice_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) dataError("Could not load invoices.", error);
  return ((data ?? []) as InvoiceRow[]).map(invoiceDTO);
}

export async function getInvoice(id: string): Promise<InvoiceDTO | null> {
  await connection();
  const { data, error } = await createAdminClient()
    .from("invoices")
    .select("id,invoice_number,invoice_date,item_description,amount,customer_id,customers(name)")
    .eq("id", id)
    .maybeSingle();
  if (error) dataError("Could not load this invoice.", error);
  return data ? invoiceDTO(data as InvoiceRow) : null;
}

export async function getDashboardData() {
  await connection();
  const client = createAdminClient();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 10);
  const [invoicesResult, customersResult, recentInvoices] = await Promise.all([
    client.from("invoices").select("amount").gte("invoice_date", monthStart),
    client.from("customers").select("id", { count: "exact", head: true }),
    getInvoices(4),
  ]);
  if (invoicesResult.error) dataError("Could not load the monthly summary.", invoicesResult.error);
  if (customersResult.error) dataError("Could not load the customer count.", customersResult.error);
  const monthlyInvoices = invoicesResult.data ?? [];
  return {
    monthTotal: monthlyInvoices.reduce((total, item) => total + Number(item.amount), 0),
    invoiceCount: monthlyInvoices.length,
    customerCount: customersResult.count ?? 0,
    recentInvoices,
  };
}

export async function getNextInvoiceNumber() {
  await connection();
  const { data, error } = await createAdminClient()
    .from("invoices")
    .select("invoice_number")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) dataError("Could not generate an invoice number.", error);
  const highest = (data ?? []).reduce((max, item) => {
    const match = item.invoice_number.match(/(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `INV-${String(highest + 1).padStart(4, "0")}`;
}

