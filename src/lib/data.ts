import "server-only";
import { todayInBrisbane } from "@/lib/format";

import { connection } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { defaultProviderSettings, type InsuranceCompany, type ProviderSettings } from "@/lib/provider";

export type CustomerDTO = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  insuranceCompany: InsuranceCompany | null;
};

export type InvoiceDTO = {
  id: string;
  number: string;
  date: string;
  customer: string;
  customerId: string;
  description: string;
  amount: number;
  insuranceCompany: InsuranceCompany | null;
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  invoice_date: string;
  item_description: string;
  amount: number;
  customer_id: string;
  customers: { name: string; insurance_company: string | null } | null;
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
    insuranceCompany: row.customers?.insurance_company as InsuranceCompany | null,
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
    .select("id,name,email,phone,address,insurance_company")
    .order("name");
  if (error) dataError("Could not load customers.", error);
  return (data ?? []).map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    insuranceCompany: customer.insurance_company as InsuranceCompany | null,
  }));
}

export async function getCustomer(id: string): Promise<CustomerDTO | null> {
  await connection();
  const { data, error } = await createAdminClient()
    .from("customers")
    .select("id,name,email,phone,address,insurance_company")
    .eq("id", id)
    .maybeSingle();
  if (error) dataError("Could not load this customer.", error);
  return data ? {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    insuranceCompany: data.insurance_company as InsuranceCompany | null,
  } : null;
}

export async function getCustomerCount() {
  await connection();
  const { count, error } = await createAdminClient().from("customers").select("id", { count: "exact", head: true });
  if (error) dataError("Could not load the customer count.", error);
  return count ?? 0;
}

export async function getInvoices(limit?: number): Promise<InvoiceDTO[]> {
  await connection();
  let query = createAdminClient()
    .from("invoices")
    .select("id,invoice_number,invoice_date,item_description,amount,customer_id,customers(name,insurance_company)")
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
    .select("id,invoice_number,invoice_date,item_description,amount,customer_id,customers(name,insurance_company)")
    .eq("id", id)
    .maybeSingle();
  if (error) dataError("Could not load this invoice.", error);
  return data ? invoiceDTO(data as InvoiceRow) : null;
}

export async function getDashboardData() {
  await connection();
  const client = createAdminClient();
  const today = todayInBrisbane();
  const [summary, recentInvoices] = await Promise.all([
    client.rpc("get_invoice_summary", { as_of_date: today }),
    getInvoices(4),
  ]);
  if (summary.error) dataError("Could not load invoice totals.", summary.error);
  if (!summary.data || summary.data.length !== 6) throw new Error("Incomplete invoice summary.");
  return {
    allTimeTotal: Number(summary.data[0].all_time_total),
    months: summary.data.map((row) => ({ month: row.month, amount: Number(row.amount) })),
    recentInvoices,
  };
}

export async function getInvoicePeriod(start: string, end: string, inclusiveEnd = false) {
  await connection();
  const client = createAdminClient();
  const invoices: InvoiceDTO[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = client.from("invoices")
      .select("id,invoice_number,invoice_date,item_description,amount,customer_id,customers(name,insurance_company)")
      .gte("invoice_date", start);
    query = inclusiveEnd ? query.lte("invoice_date", end) : query.lt("invoice_date", end);
    const { data, error } = await query.order("invoice_date", { ascending: false })
      .order("created_at", { ascending: false }).order("id").range(offset, offset + 499);
    if (error) dataError("Could not load invoices.", error);
    invoices.push(...((data ?? []) as InvoiceRow[]).map(invoiceDTO));
    if (!data || data.length < 500) break;
  }
  const { count, error } = await client.from("invoices").select("id", { count: "exact", head: true }).lt("invoice_date", start);
  if (error) dataError("Could not check older invoices.", error);
  return { invoices, hasOlder: (count ?? 0) > 0 };
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

export async function getProviderSettings(): Promise<ProviderSettings> {
  await connection();
  const { data, error } = await createAdminClient()
    .from("business_settings")
    .select("default_provider_number,medibank_provider_number,bupa_provider_number,hcf_provider_number,arhg_provider_number,ahm_provider_number")
    .eq("id", true)
    .maybeSingle();
  if (error) dataError("Could not load provider settings.", error);
  if (!data) return defaultProviderSettings;
  return {
    defaultProviderNumber: data.default_provider_number,
    medibankProviderNumber: data.medibank_provider_number,
    bupaProviderNumber: data.bupa_provider_number,
    hcfProviderNumber: data.hcf_provider_number,
    arhgProviderNumber: data.arhg_provider_number,
    ahmProviderNumber: data.ahm_provider_number,
  };
}
