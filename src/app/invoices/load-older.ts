"use server";

import { getInvoicePeriod } from "@/lib/data";
import { monthsBefore } from "@/lib/invoice-period";

export async function loadOlderInvoices(before: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(before) || Number.isNaN(Date.parse(before))) {
    throw new Error("Invalid invoice period.");
  }
  const start = monthsBefore(before, 3);
  return { ...await getInvoicePeriod(start, before), start };
}
