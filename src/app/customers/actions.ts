"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

export type CustomerActionState = { error?: string };

const customerSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required.").max(120),
  email: z.string().trim().max(200).refine((value) => !value || /^\S+@\S+\.\S+$/.test(value), "Enter a valid email address."),
  phone: z.string().trim().max(50),
  address: z.string().trim().max(300),
  insuranceCompany: z.enum(["", "Medibank", "Bupa", "HCF", "ARHG"]),
});

function parseCustomer(formData: FormData) {
  return customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    insuranceCompany: formData.get("insuranceCompany"),
  });
}

function customerValues(data: z.infer<typeof customerSchema>) {
  return {
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    insurance_company: data.insuranceCompany || null,
  };
}

function refreshCustomers() {
  revalidatePath("/");
  revalidatePath("/customers");
  revalidatePath("/invoices/new");
}

export async function createCustomer(_state: CustomerActionState, formData: FormData): Promise<CustomerActionState> {
  const parsed = parseCustomer(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the customer details." };
  const { error } = await createAdminClient().from("customers").insert(customerValues(parsed.data));
  if (error) return { error: "Could not add this customer. Please try again." };
  refreshCustomers();
  redirect("/customers");
}

export async function updateCustomer(id: string, _state: CustomerActionState, formData: FormData): Promise<CustomerActionState> {
  const parsed = parseCustomer(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the customer details." };
  const { error } = await createAdminClient().from("customers").update(customerValues(parsed.data)).eq("id", id);
  if (error) return { error: "Could not update this customer. Please try again." };
  refreshCustomers();
  revalidatePath(`/customers/${id}/edit`);
  redirect("/customers");
}

export async function deleteCustomer(id: string) {
  const { error } = await createAdminClient().from("customers").delete().eq("id", id);
  if (error?.code === "23503") redirect(`/customers/${id}/edit?error=used`);
  if (error) redirect(`/customers/${id}/edit?error=delete`);
  refreshCustomers();
  redirect("/customers");
}
