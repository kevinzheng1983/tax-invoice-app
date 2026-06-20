"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

export type ProviderSettingsActionState = { error?: string; saved?: boolean };

const providerSettingsSchema = z.object({
  defaultProviderNumber: z.string().trim().min(1, "Default Provider Number is required.").max(50),
  medibankProviderNumber: z.string().trim().min(1, "Medibank Provider Number is required.").max(50),
  bupaProviderNumber: z.string().trim().min(1, "Bupa Provider Number is required.").max(50),
  hcfProviderNumber: z.string().trim().min(1, "HCF Provider Number is required.").max(50),
  arhgProviderNumber: z.string().trim().min(1, "ARHG Provider Number is required.").max(50),
});

export async function updateProviderSettings(_state: ProviderSettingsActionState, formData: FormData): Promise<ProviderSettingsActionState> {
  const parsed = providerSettingsSchema.safeParse({
    defaultProviderNumber: formData.get("defaultProviderNumber"),
    medibankProviderNumber: formData.get("medibankProviderNumber"),
    bupaProviderNumber: formData.get("bupaProviderNumber"),
    hcfProviderNumber: formData.get("hcfProviderNumber"),
    arhgProviderNumber: formData.get("arhgProviderNumber"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the provider numbers." };

  const { error } = await createAdminClient().from("business_settings").upsert({
    id: true,
    default_provider_number: parsed.data.defaultProviderNumber,
    medibank_provider_number: parsed.data.medibankProviderNumber,
    bupa_provider_number: parsed.data.bupaProviderNumber,
    hcf_provider_number: parsed.data.hcfProviderNumber,
    arhg_provider_number: parsed.data.arhgProviderNumber,
  });
  if (error) return { error: "Could not update provider numbers. Please try again." };
  revalidatePath("/settings");
  revalidatePath("/invoices/preview/print");
  return { saved: true };
}

