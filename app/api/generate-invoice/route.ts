import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: string;
  rate: string;
}

interface InvoiceRequest {
  businessName: string;
  yourName: string;
  email: string;
  phone: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  invoiceNumber: string;
  invoiceDate: string;
  paymentTerms: string;
  lineItems: InvoiceLineItem[];
  taxRate: string;
  notes: string;
}

// Shape returned to the frontend
export interface GeneratedInvoice {
  paymentTermsText: string; // professional payment terms paragraph
  polishedNotes: string;    // polished version of the user's memo/notes
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body: InvoiceRequest = await req.json();

    const subtotal = body.lineItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
    }, 0);
    const taxRate = parseFloat(body.taxRate) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const notesInstruction = body.notes
      ? `Polish this raw memo into professional, warm language (1–3 sentences, same meaning): "${body.notes}"`
      : `Write a brief, warm thank-you note from ${body.businessName} to ${body.clientName} (1–2 sentences).`;

    const userPrompt = `
Write two short pieces of copy for a professional invoice.

INVOICE CONTEXT:
- Sender: ${body.businessName} (${body.yourName})
- Client: ${body.clientName}, ${body.clientCompany}
- Invoice #: ${body.invoiceNumber}, dated ${body.invoiceDate}
- Payment terms: ${body.paymentTerms}
- Total due: $${total.toFixed(2)}

INSTRUCTIONS:
1. paymentTermsText: One professional sentence about payment expectations. Mention "${body.paymentTerms}" and the $${total.toFixed(2)} amount. Under 40 words.
2. polishedNotes: ${notesInstruction}

Return ONLY this JSON (no markdown fences, no extra text):
{"paymentTermsText": "...", "polishedNotes": "..."}
    `.trim();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system:
        "You are a professional business writer specializing in invoices. " +
        "You write clear, concise, courteous copy and always return valid JSON.",
      messages: [{ role: "user", content: userPrompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type from Claude");

    console.log("Claude raw response:", content.text);

    // Strip markdown fences if Claude wrapped the JSON in ```json ... ``` anyway
    const rawText = content.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const invoice: GeneratedInvoice = JSON.parse(rawText);
    return NextResponse.json({ invoice }, { status: 200 });
  } catch (err) {
    // Log full error details so they appear in the Next.js terminal
    if (err instanceof Error) {
      console.error("generate-invoice error:", err.message);
      console.error("Stack:", err.stack);
      // Anthropic SDK errors have a .status and .error property
      const apiErr = err as Error & { status?: number; error?: unknown };
      if (apiErr.status) console.error("Anthropic status:", apiErr.status, "body:", apiErr.error);
    } else {
      console.error("generate-invoice unknown error:", err);
    }
    return NextResponse.json(
      { error: "Failed to generate invoice content. Please try again." },
      { status: 500 }
    );
  }
}
