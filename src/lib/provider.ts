export type InsuranceCompany = "Medibank" | "Bupa" | "HCF" | "ARHG";

export type ProviderSettings = {
  defaultProviderNumber: string;
  medibankProviderNumber: string;
  bupaProviderNumber: string;
  hcfProviderNumber: string;
  arhgProviderNumber: string;
};

export const defaultProviderSettings: ProviderSettings = {
  defaultProviderNumber: "AAMT40649",
  medibankProviderNumber: "0843394W",
  bupaProviderNumber: "0843394W",
  hcfProviderNumber: "0843394W",
  arhgProviderNumber: "0843394W",
};

export function getProviderDetails(insuranceCompany: InsuranceCompany | null, settings: ProviderSettings) {
  switch (insuranceCompany) {
    case "Medibank": return { label: "Medibank Provider Number", number: settings.medibankProviderNumber };
    case "Bupa": return { label: "Bupa Provider Number", number: settings.bupaProviderNumber };
    case "HCF": return { label: "HCF Provider Number", number: settings.hcfProviderNumber };
    case "ARHG": return { label: "ARHG Provider Number", number: settings.arhgProviderNumber };
    default: return { label: "Provider Number", number: settings.defaultProviderNumber };
  }
}

