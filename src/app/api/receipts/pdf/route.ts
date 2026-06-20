const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

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

function buildReceiptPdf(data: { number: string; date: string; customer: string; description: string; amount: number; providerLabel: string; providerNumber: string }) {
  const amount = formatAmount(data.amount);
  const commands = [
    "0.03 0.47 0.28 RG 2.5 w 44 790 m 551 790 l S",
    text("F2", 20, 44, 754, "Zhaoyang Shi", "0.03 0.47 0.28"),
    text("F2", 20, 462, 754, "RECEIPT", "0.03 0.47 0.28"),
    text("F1", 9.5, 44, 718, "ABN: 86 164 178 873"),
    text("F1", 9.5, 44, 702, "Address: 86 Andaman St, Jamboree Heights, QLD, 4074"),
    text("F1", 9.5, 44, 686, "Email: zhaoyangshi@gmail.com"),
    text("F1", 9.5, 44, 670, "Tel No. 0410174441"),
    text("F1", 9.5, 44, 654, `${data.providerLabel}: ${data.providerNumber}`),
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
    text("F3", 25, 405, 365, "Zhaoyang Shi", "0.16 0.20 0.18"),
    text("F2", 10.5, 44, 150, "Payment Details"),
    text("F1", 9.5, 44, 119, "BSB: 064178"),
    text("F1", 9.5, 44, 102, "Account number: 10389373"),
    text("F1", 9.5, 44, 85, "Account name: Zhaoyang Shi"),
    "0.03 0.47 0.28 RG 2.5 w 44 52 m 551 52 l S",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>",
    `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n%PDFGEN\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new TextEncoder().encode(pdf);
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
    providerLabel: params.get("providerLabel")?.slice(0, 40) || "Provider Number",
    providerNumber: params.get("providerNumber")?.slice(0, 50) || "AAMT40649",
  };
  const filename = data.number.replace(/[^a-zA-Z0-9_-]/g, "-") || "receipt";
  const pdf = buildReceiptPdf(data);

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
