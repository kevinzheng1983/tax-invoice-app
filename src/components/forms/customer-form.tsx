"use client";

import { useActionState } from "react";
import { createCustomer, updateCustomer, type CustomerActionState } from "@/app/customers/actions";
import type { CustomerDTO } from "@/lib/data";

const initialState: CustomerActionState = {};

export function CustomerForm({ customer }: { customer?: CustomerDTO }) {
  const action = customer ? updateCustomer.bind(null, customer.id) : createCustomer;
  const [state, formAction, pending] = useActionState(action, initialState);

  return <form className="customer-form" action={formAction}>
    <label><span>Name</span><input name="name" defaultValue={customer?.name ?? ""} autoComplete="name" required /></label>
    <label><span>Email</span><input name="email" defaultValue={customer?.email ?? ""} autoComplete="email" inputMode="email" type="email" /></label>
    <label><span>Phone</span><input name="phone" defaultValue={customer?.phone ?? ""} autoComplete="tel" inputMode="tel" /></label>
    <label><span>Insurance Company <small>(optional)</small></span><select name="insuranceCompany" defaultValue={customer?.insuranceCompany ?? ""}><option value="">None</option><option value="Medibank">Medibank</option><option value="Bupa">Bupa</option><option value="HCF">HCF</option><option value="ARHG">ARHG</option><option value="AHM">AHM</option></select></label>
    <label><span>Address</span><textarea name="address" defaultValue={customer?.address ?? ""} autoComplete="street-address" rows={3} /></label>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    <button className="primary-button" disabled={pending} type="submit">{pending ? "Saving..." : customer ? "Save changes" : "Add customer"}</button>
  </form>;
}
