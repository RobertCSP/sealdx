import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

// Shape of the data we receive from the frontend form
interface LineItem {
  id: string;
  service: string;
  price: string;
}

interface ProposalRequest {
  businessName: string;
  yourName: string;
  email: string;
  phone: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  projectTitle: string;
  servicesDescription: string;
  timeline: string;
  lineItems: LineItem[];
  paymentTerms: string;
  additionalNotes: string;
}

// Shape of the structured JSON we ask Claude to return
export interface GeneratedProposal {
  introduction: string;
  scopeOfWork: string;
  timeline: string;
  pricingTable: { service: string; price: string }[];
  totalAmount: string;
  termsAndConditions: string;
  nextSteps: string;
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body: ProposalRequest = await req.json();

    // Build a readable summary of the line items for the prompt
    const lineItemsSummary = body.lineItems
      .filter((item) => item.service || item.price)
      .map((item) => `- ${item.service || "Service"}: $${item.price || "0"}`)
      .join("\n");

    const total = body.lineItems.reduce((sum, item) => {
      const n = parseFloat(item.price);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    const userPrompt = `
Here is the raw information for a business proposal. Turn it into a polished, professional proposal.

SENDER (the business writing this proposal):
- Business: ${body.businessName}
- Contact: ${body.yourName}
- Email: ${body.email}
${body.phone ? `- Phone: ${body.phone}` : ""}

CLIENT (who this proposal is for):
- Name: ${body.clientName}
- Company: ${body.clientCompany}
${body.clientEmail ? `- Email: ${body.clientEmail}` : ""}

PROJECT:
- Title: ${body.projectTitle}
- Description of services: ${body.servicesDescription}
- Timeline: ${body.timeline}
- Payment terms: ${body.paymentTerms}
${body.additionalNotes ? `- Additional notes: ${body.additionalNotes}` : ""}

PRICING:
${lineItemsSummary}
Total: $${total.toFixed(2)}

Return a JSON object with exactly these fields:
{
  "introduction": "A warm, confident opening paragraph addressed to ${body.clientName} at ${body.clientCompany}. Thank them for the opportunity and summarize why ${body.businessName} is the right partner for this project.",
  "scopeOfWork": "A detailed, professional breakdown of exactly what will be delivered. Use clear paragraphs. Be specific so the client knows exactly what they're getting.",
  "timeline": "A clear description of the project timeline with phases if appropriate. Based on: ${body.timeline}.",
  "pricingTable": [{ "service": "service name", "price": "formatted price string e.g. $1,200.00" }],
  "totalAmount": "the total formatted as a dollar amount e.g. $3,500.00",
  "termsAndConditions": "Professional, fair terms covering: payment schedule (based on '${body.paymentTerms}'), revision policy (2 rounds of revisions included), what happens if scope changes, IP ownership (client owns final deliverables upon full payment), and cancellation terms.",
  "nextSteps": "A confident, action-oriented closing. Tell the client exactly what to do next to move forward (e.g. sign and return, pay deposit). Express enthusiasm for the project."
}

Return ONLY valid JSON. No markdown fences, no extra text.
    `.trim();

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      system: `You are an expert business proposal writer with 20 years of experience helping agencies, freelancers, and consultants win clients. You write proposals that are professional, clear, and persuasive — never generic. You always tailor the language to the specific project and client. Your proposals make clients feel confident and excited to say yes. You always return valid JSON exactly as instructed.`,
      messages: [{ role: "user", content: userPrompt }],
    });

    // Extract the text content from Claude's response
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Strip markdown fences if Claude wrapped the JSON anyway, then parse
    const rawText = content.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const proposal: GeneratedProposal = JSON.parse(rawText);

    return NextResponse.json({ proposal }, { status: 200 });
  } catch (err) {
    console.error("generate-proposal error:", err);
    return NextResponse.json(
      { error: "Failed to generate proposal. Please try again." },
      { status: 500 }
    );
  }
}
