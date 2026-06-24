import { createElement } from "react";
import { createRoot } from "react-dom/client";
import html2pdf from "html2pdf.js";
import type { IOrder as Order } from "@/types/entities/order.types";
import InvoicePdfDocument from "../components/InvoicePdfDocument";

export interface GenerateInvoicePdfOptions {
  filename?: string;
  watermarkText?: string;
}

type InvoicePdfOptions = {
  pagebreak?: {
    mode?: Array<"css">;
  };
  margin: [number, number, number, number];
  filename: string;
  image: {
    type: "jpeg";
    quality: number;
  };
  html2canvas: {
    scale: number;
    useCORS: boolean;
    backgroundColor: string;
    logging: boolean;
    scrollX: number;
    scrollY: number;
  };
  jsPDF: {
    unit: "mm";
    format: "a4";
    orientation: "portrait";
  };
};

const waitForNextPaint = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

export async function generateInvoicePdf(
  order: Order,
  options: GenerateInvoicePdfOptions = {},
): Promise<void> {
  if (typeof document === "undefined") {
    throw new Error("Invoice PDF generation is only available in the browser.");
  }

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.pointerEvents = "none";
  iframe.style.opacity = "0";
  iframe.style.border = "0";

  document.body.appendChild(iframe);

  const frameDocument = iframe.contentDocument;

  if (!frameDocument) {
    iframe.remove();
    throw new Error("Unable to create invoice preview document.");
  }

  frameDocument.open();
  frameDocument.write(
    "<!doctype html><html><head><meta charset='utf-8'></head><body></body></html>",
  );
  frameDocument.close();

  const rootContainer = frameDocument.body;
  const root = createRoot(rootContainer);

  try {
    // Render the invoice off-screen so html2pdf can capture the same UI used in the app.
    root.render(
      createElement(InvoicePdfDocument, {
        order,
        showWatermark: true,
        watermarkText: options.watermarkText,
      }),
    );

    await waitForNextPaint();

    const invoiceNumber = `INV-${String(order.id).replace(/\D/g, "") || order.id}`;
    const pdfFilename = options.filename ?? `invoice-${invoiceNumber}.pdf`;
    const targetNode = rootContainer.firstElementChild as HTMLElement | null;

    if (!targetNode) {
      throw new Error("Unable to render invoice content for PDF generation.");
    }

    const pdfOptions: InvoicePdfOptions = {
      margin: [12, 12, 12, 12],
      filename: pdfFilename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css"],
      },
    };

    await html2pdf().set(pdfOptions).from(targetNode).save();
  } finally {
    root.unmount();
    iframe.remove();
  }
}
