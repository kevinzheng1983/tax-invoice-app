import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { receiptPdfFilename } from "@/lib/format";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const encoder = new TextEncoder();
const signatureImage = readFile(join(process.cwd(), "public", "signature.jpg"));

function joinBytes(parts: Uint8Array[]) {
  const length = parts.reduce((total, part) => total + part.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

function pdfText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/([\\()])/g, "\\$1");
}

function formatPdfDate(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
}

function text(font: "F1" | "F2" | "F3", size: number, x: number, y: number, value: string, color = "0.08 0.10 0.09") {
  return `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${y} Tm (${pdfText(value)}) Tj ET`;
}

function buildReceiptPdf(data: { number: string; date: string; customer: string; description: string; amount: number; defaultProviderNumber: string; providerLabel: string; providerNumber: string }, signature: Uint8Array) {
  const amount = formatAmount(data.amount);
  const commands = [
    "0.03 0.47 0.28 RG 2.5 w 44 790 m 551 790 l S",
    text("F2", 20, 44, 754, "Zhaoyang Shi", "0.03 0.47 0.28"),
    text("F2", 20, 462, 754, "RECEIPT", "0.03 0.47 0.28"),
    text("F1", 9.5, 44, 718, "ABN: 86 164 178 873"),
    text("F1", 9.5, 44, 702, "Address: 25 Manchester Tce, Taringa, QLD, 4068"),
    text("F1", 9.5, 44, 686, "Email: zhaoyangshi@gmail.com"),
    text("F1", 9.5, 44, 670, "Tel No. 0410174441"),
    text("F1", 9.5, 44, 654, `Provider Number: ${data.defaultProviderNumber}`),
    ...(data.providerLabel && data.providerNumber ? [text("F1", 9.5, 44, 638, `${data.providerLabel}: ${data.providerNumber}`)] : []),
    text("F2", 10.5, 44, 565, "Bill To"),
    text("F1", 10.5, 44, 543, data.customer),
    text("F2", 10.5, 362, 565, "Receipt #"),
    text("F1", 10.5, 474, 565, data.number),
    text("F2", 10.5, 362, 543, "Receipt Date"),
    text("F1", 10.5, 462, 543, formatPdfDate(data.date)),
    "0.84 0.87 0.85 RG 0.7 w 44 493 507 34 re S",
    "0.97 0.98 0.97 rg 44 493 507 34 re f",
    text("F2", 10.5, 55, 505, "DESCRIPTION"),
    text("F2", 10.5, 477, 505, "AMOUNT"),
    "0.84 0.87 0.85 RG 0.7 w 44 453 507 40 re S",
    "395 453 m 395 527 l S",
    text("F1", 10.5, 55, 468, data.description),
    text("F1", 10.5, 480, 468, amount),
    text("F2", 14, 356, 420, "TOTAL"),
    text("F2", 15, 476, 420, amount, "0.03 0.47 0.28"),
    "q 200 0 0 122 352 294 cm /Signature Do Q",
    text("F2", 10.5, 44, 150, "Payment Details"),
    text("F1", 9.5, 44, 119, "BSB: 064178"),
    text("F1", 9.5, 44, 102, "Account number: 10389373"),
    text("F1", 9.5, 44, 85, "Account name: Zhaoyang Shi"),
    "0.03 0.47 0.28 RG 2.5 w 44 52 m 551 52 l S",
  ].join("\n");

  const imageObject = joinBytes([
    encoder.encode(`<< /Type /XObject /Subtype /Image /Width 448 /Height 274 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${signature.length} >>\nstream\n`),
    signature,
    encoder.encode("\nendstream"),
  ]);
  const objects: Array<string | Uint8Array> = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> /XObject << /Signature 7 0 R >> >> /Contents 8 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>",
    imageObject,
    `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`,
  ];

  const parts: Uint8Array[] = [];
  let pdfLength = 0;
  const append = (value: string | Uint8Array) => {
    const bytes = typeof value === "string" ? encoder.encode(value) : value;
    parts.push(bytes);
    pdfLength += bytes.length;
  };
  append("%PDF-1.4\n%PDFGEN\n");
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdfLength);
    append(`${index + 1} 0 obj\n`);
    append(object);
    append("\nendobj\n");
  });
  const xrefOffset = pdfLength;
  append(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  append(offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join(""));
  append(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return joinBytes(parts);
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const rawAmount = Number(params.get("amount") ?? "0");
  const data = {
    number: params.get("number")?.slice(0, 40) || "RECEIPT",
    date: params.get("date")?.slice(0, 20) || "",
    customer: params.get("customer")?.slice(0, 80) || "Customer",
    description: params.get("description")?.slice(0, 120) || "Service",
    amount: Number.isFinite(rawAmount) && rawAmount >= 0 ? rawAmount : 0,
    defaultProviderNumber: params.get("defaultProviderNumber")?.slice(0, 50) || "AAMT40649",
    providerLabel: params.get("providerLabel")?.slice(0, 40) || "",
    providerNumber: params.get("providerNumber")?.slice(0, 50) || "",
  };
  const filename = receiptPdfFilename(data.number, data.customer);
  const asciiFilename = filename.normalize("NFKD").replace(/[^\x20-\x7E]/g, "").replace(/["\\]/g, "-") || "receipt.pdf";
  const encodedFilename = encodeURIComponent(filename).replace(/['()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
  const pdf = buildReceiptPdf(data, new Uint8Array(await signatureImage));

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
      "Cache-Control": "no-store",
    },
  });
}
