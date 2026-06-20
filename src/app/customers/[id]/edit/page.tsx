import { notFound } from "next/navigation";
import { deleteCustomer } from "@/app/customers/actions";
import { AppShell, TopBar } from "@/components/app-shell";
import { CustomerForm } from "@/components/forms/customer-form";
import { getCustomer } from "@/lib/data";

export default async function EditCustomerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params;
  const [customer, query] = await Promise.all([getCustomer(id), searchParams]);
  if (!customer) notFound();
  const deleteAction = deleteCustomer.bind(null, id);
  const deleteMessage = query.error === "used" ? "This customer is used by an invoice and cannot be deleted." : query.error ? "Could not delete this customer." : null;
  return <AppShell className="form-page"><TopBar title="Edit customer" back="/customers"/><CustomerForm customer={customer}/>{deleteMessage && <p className="form-error standalone-error" role="alert">{deleteMessage}</p>}<form className="danger-zone" action={deleteAction}><button className="danger-button" type="submit">Delete customer</button></form></AppShell>;
}

