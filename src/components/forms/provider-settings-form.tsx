"use client";

import { useActionState } from "react";
import { updateProviderSettings, type ProviderSettingsActionState } from "@/app/settings/actions";
import type { ProviderSettings } from "@/lib/provider";

const initialState: ProviderSettingsActionState = {};

export function ProviderSettingsForm({ settings }: { settings: ProviderSettings }) {
  const [state, formAction, pending] = useActionState(updateProviderSettings, initialState);
  return <form className="customer-form settings-form" action={formAction}>
    <div className="form-section-heading"><h2>Provider numbers</h2><p>Receipts automatically use the customer&apos;s selected insurance company.</p></div>
    <label><span>Default Provider Number</span><input name="defaultProviderNumber" defaultValue={settings.defaultProviderNumber} required /></label>
    <label><span>Medibank Provider Number</span><input name="medibankProviderNumber" defaultValue={settings.medibankProviderNumber} required /></label>
    <label><span>Bupa Provider Number</span><input name="bupaProviderNumber" defaultValue={settings.bupaProviderNumber} required /></label>
    <label><span>HCF Provider Number</span><input name="hcfProviderNumber" defaultValue={settings.hcfProviderNumber} required /></label>
    <label><span>ARHG Provider Number</span><input name="arhgProviderNumber" defaultValue={settings.arhgProviderNumber} required /></label>
    {state.error && <p className="form-error" role="alert">{state.error}</p>}
    {state.saved && <p className="form-success" role="status">Provider numbers updated.</p>}
    <button className="primary-button" disabled={pending} type="submit">{pending ? "Saving..." : "Save provider numbers"}</button>
  </form>;
}

