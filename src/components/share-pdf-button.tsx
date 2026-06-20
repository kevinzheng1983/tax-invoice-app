"use client";

import { useState } from "react";
import { Icon } from "@/components/app-shell";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SharePdfButton({ pdfUrl, receiptNumber }: { pdfUrl: string; receiptNumber: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "fallback" | "error">("idle");
  const filename = `${receiptNumber}.pdf`;

  async function sharePdf() {
    setStatus("loading");
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Could not generate PDF");

      const blob = await response.blob();
      const file = new File([blob], filename, { type: "application/pdf" });
      const canShareFile = typeof navigator.share === "function"
        && typeof navigator.canShare === "function"
        && navigator.canShare({ files: [file] });

      if (!canShareFile) {
        downloadBlob(blob, filename);
        setStatus("fallback");
        return;
      }

      try {
        await navigator.share({
          files: [file],
          title: `Receipt ${receiptNumber}`,
        });
        setStatus("idle");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus("idle");
          return;
        }
        downloadBlob(blob, filename);
        setStatus("fallback");
      }
    } catch {
      setStatus("error");
    }
  }

  return <div className="share-pdf-action">
    <button className="primary-button" type="button" onClick={sharePdf} disabled={status === "loading"}>
      <Icon name="share"/>
      {status === "loading" ? "Preparing PDF..." : "Share PDF"}
    </button>
    {status === "fallback" && <p role="status">Sharing is not supported on this device. The PDF was downloaded instead.</p>}
    {status === "error" && <p className="share-error" role="alert">Could not prepare the PDF. Please try again.</p>}
  </div>;
}
