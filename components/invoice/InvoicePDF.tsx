// Dynamically imported (client-side only) — safe to use @react-pdf/renderer here.

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { GeneratedInvoice } from "@/app/api/generate-invoice/route";
import { InvoiceFormData, calcDueDate, calcTotals } from "./types";

// ── Color palette (mirrors ProposalPDF exactly) ───────────────────────────────
const C = {
  navy:        "#0B1F3A",
  navyMid:     "#152D4F",
  accent:      "#2E6FE0",
  accentLight: "#EBF2FF",
  textDark:    "#111827",
  textMuted:   "#6B7280",
  textLight:   "#9CA3AF",
  textWhite:   "#FFFFFF",
  border:      "#D1D9E6",
  rowAlt:      "#F7F9FC",
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.textDark,
    // paddingTop: 0 — full header sits flush at top edge on page 1.
    // Pages 2+ use a fixed in-flow spacer to push content below slim header.
    paddingTop: 0,
    paddingBottom: 44, // clears the fixed footer bar
    backgroundColor: C.textWhite,
    flexDirection: "column",
  },

  // ─── Full-width dark navy header bar (page 1 only) ───────────────────────────
  headerBar: {
    backgroundColor: C.navy,
    paddingHorizontal: 48,
    paddingTop: 32,
    paddingBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  headerLeft: {
    flexDirection: "column",
  },
  businessName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: C.textWhite,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  contactLine: {
    fontSize: 8.5,
    color: "#A8BDD4",
    marginTop: 2,
    letterSpacing: 0.2,
  },
  headerRight: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
  invoiceLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#A8BDD4",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  invoiceNumber: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: C.textWhite,
    letterSpacing: 0.5,
  },

  // ─── Thin blue accent bar below the header ──────────────────────────────────
  accentBar: {
    height: 3,
    backgroundColor: C.accent,
  },

  // ─── Slim header bar (pages 2+) ──────────────────────────────────────────────
  slimHeaderBar: {
    backgroundColor: C.navy,
    paddingHorizontal: 48,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: C.accent,
  },
  slimBusinessName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#A8BDD4",
    letterSpacing: 0.5,
  },
  slimPageNum: {
    fontSize: 8,
    color: "#A8BDD4",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },

  // ─── Body content area ───────────────────────────────────────────────────────
  body: {
    flexDirection: "column",
    paddingHorizontal: 48,
    paddingTop: 28,
  },

  // ─── Metadata strip (bill-to + dates) ───────────────────────────────────────
  meta: {
    flexDirection: "row",
    marginBottom: 28,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  metaCol: {
    flexDirection: "column",
    marginRight: 44,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.textLight,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.textDark,
  },
  metaValueSub: {
    fontSize: 9,
    color: C.textMuted,
    marginTop: 1,
  },

  // ─── Line items table ────────────────────────────────────────────────────────
  table: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: C.navy,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.textWhite,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.rowAlt,
  },
  tableRowLast: {
    flexDirection: "row",
    backgroundColor: C.textWhite,
  },
  tableRowLastAlt: {
    flexDirection: "row",
    backgroundColor: C.rowAlt,
  },
  // Header column cells
  colDescH:   { flex: 1,   paddingVertical: 8, paddingHorizontal: 12 },
  colQtyH:    { width: 44, paddingVertical: 8, paddingHorizontal: 8,  textAlign: "right", borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.1)" },
  colRateH:   { width: 80, paddingVertical: 8, paddingHorizontal: 12, textAlign: "right", borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.1)" },
  colAmountH: { width: 88, paddingVertical: 8, paddingHorizontal: 12, textAlign: "right", borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.1)" },
  // Body column cells
  colDesc:   { flex: 1,   paddingVertical: 8, paddingHorizontal: 12 },
  colQty:    { width: 44, paddingVertical: 8, paddingHorizontal: 8,  textAlign: "right", borderLeftWidth: 1, borderLeftColor: C.border },
  colRate:   { width: 80, paddingVertical: 8, paddingHorizontal: 12, textAlign: "right", borderLeftWidth: 1, borderLeftColor: C.border },
  colAmount: { width: 88, paddingVertical: 8, paddingHorizontal: 12, textAlign: "right", borderLeftWidth: 1, borderLeftColor: C.border },

  tableHeaderText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.textWhite,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableCellText: {
    fontSize: 9.5,
    color: C.textDark,
  },

  // ─── Totals block ────────────────────────────────────────────────────────────
  totalsBlock: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  totalsInner: {
    width: 220,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.textWhite,
  },
  totalsRowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: C.navy,
    borderTopWidth: 2,
    borderTopColor: C.accent,
  },
  totalsLabel: {
    fontSize: 9.5,
    color: C.textMuted,
  },
  totalsValue: {
    fontSize: 9.5,
    color: C.textDark,
  },
  totalsBoldLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.textWhite,
  },
  totalsBoldValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.textWhite,
  },

  // ─── Notes / payment terms ───────────────────────────────────────────────────
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.textLight,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  notesText: {
    fontSize: 9.5,
    color: C.textDark,
    lineHeight: 1.75,
    marginBottom: 16,
  },

  // ─── Footer bar (full-width navy, fixed to bottom of every page) ─────────────
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.navy,
    paddingHorizontal: 48,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    flexDirection: "column",
  },
  brandingText: {
    fontSize: 7,
    color: "#5B7A9E",
  },
  pageNumber: {
    fontSize: 8,
    color: "#A8BDD4",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ── Main PDF document ─────────────────────────────────────────────────────────
interface Props {
  invoice: GeneratedInvoice;
  formData: InvoiceFormData;
  showBranding?: boolean;
}

export default function InvoicePDF({ invoice, formData, showBranding = false }: Props) {
  const { subtotal, taxRate, taxAmount, total } = calcTotals(formData);
  const dueDate = calcDueDate(formData.invoiceDate, formData.paymentTerms);
  const filledItems = formData.lineItems.filter((i) => i.description || i.rate);
  const contactParts = [formData.email, formData.phone].filter(Boolean);

  return (
    <Document
      title={`Invoice ${formData.invoiceNumber} — ${formData.clientCompany || formData.clientName}`}
      author={formData.businessName}
      creator="Sealdx"
    >
      <Page size="A4" style={s.page}>

        {/* ── Full-width dark navy header bar (page 1 only — not fixed) ── */}
        <View style={s.headerBar}>
          <View style={s.headerLeft}>
            <Text style={s.businessName}>{formData.businessName}</Text>
            <Text style={s.contactLine}>{formData.yourName}</Text>
            {contactParts.map((c, i) => (
              <Text key={i} style={s.contactLine}>{c}</Text>
            ))}
          </View>
          <View style={s.headerRight}>
            <Text style={s.invoiceLabel}>Invoice</Text>
            <Text style={s.invoiceNumber}>{formData.invoiceNumber}</Text>
          </View>
        </View>

        {/* ── Thin blue accent bar (page 1 only — not fixed) ── */}
        <View style={s.accentBar} />

        {/* ── Slim header for pages 2+ (fixed, absolute — visual overlay) ── */}
        <View
          fixed
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
          render={({ pageNumber, ...rest }) =>
            pageNumber > 1 ? (
              <View style={s.slimHeaderBar}>
                <Text style={s.slimBusinessName}>{formData.businessName}</Text>
                <Text style={s.slimPageNum}>{pageNumber} / {(rest as Record<string, number>).totalPages}</Text>
              </View>
            ) : null
          }
        />

        {/* ── Spacer for pages 2+ to push body content below slim header ── */}
        <View
          fixed
          render={({ pageNumber }) =>
            pageNumber > 1 ? <View style={{ height: 32 }} /> : null
          }
        />

        {/* ── Body ── */}
        <View style={s.body}>

          {/* Metadata strip */}
          <View style={s.meta}>
            <View style={s.metaCol}>
              <Text style={s.metaLabel}>Billed To</Text>
              <Text style={s.metaValue}>{formData.clientName}</Text>
              {formData.clientCompany ? (
                <Text style={s.metaValueSub}>{formData.clientCompany}</Text>
              ) : null}
              {formData.clientEmail ? (
                <Text style={s.metaValueSub}>{formData.clientEmail}</Text>
              ) : null}
            </View>
            <View style={s.metaCol}>
              <Text style={s.metaLabel}>Invoice Date</Text>
              <Text style={s.metaValue}>{fmtDate(formData.invoiceDate)}</Text>
            </View>
            <View style={s.metaCol}>
              <Text style={s.metaLabel}>Due Date</Text>
              <Text style={s.metaValue}>{dueDate}</Text>
            </View>
            <View style={s.metaCol}>
              <Text style={s.metaLabel}>Terms</Text>
              <Text style={s.metaValue}>{formData.paymentTerms}</Text>
            </View>
          </View>

          {/* ── Line items table ── */}
          <View style={s.table}>
            {/* Dark navy header row */}
            <View style={s.tableHeaderRow}>
              <View style={s.colDescH}><Text style={s.tableHeaderText}>Description</Text></View>
              <View style={s.colQtyH}><Text style={s.tableHeaderText}>Qty</Text></View>
              <View style={s.colRateH}><Text style={s.tableHeaderText}>Rate</Text></View>
              <View style={s.colAmountH}><Text style={s.tableHeaderText}>Amount</Text></View>
            </View>

            {/* Alternating rows */}
            {filledItems.map((item, i) => {
              const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
              const isAlt = i % 2 === 1;
              const isLast = i === filledItems.length - 1;
              const rowStyle = isLast
                ? (isAlt ? s.tableRowLastAlt : s.tableRowLast)
                : (isAlt ? s.tableRowAlt : s.tableRow);
              return (
                <View key={item.id} style={rowStyle}>
                  <View style={s.colDesc}>
                    <Text style={s.tableCellText}>{item.description || "—"}</Text>
                  </View>
                  <View style={s.colQty}>
                    <Text style={s.tableCellText}>{item.quantity}</Text>
                  </View>
                  <View style={s.colRate}>
                    <Text style={s.tableCellText}>{fmtMoney(parseFloat(item.rate) || 0)}</Text>
                  </View>
                  <View style={s.colAmount}>
                    <Text style={s.tableCellText}>{fmtMoney(amount)}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* ── Totals ── */}
          <View style={s.totalsBlock}>
            <View style={s.totalsInner}>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>Subtotal</Text>
                <Text style={s.totalsValue}>{fmtMoney(subtotal)}</Text>
              </View>
              {taxRate > 0 && (
                <View style={s.totalsRow}>
                  <Text style={s.totalsLabel}>Tax ({taxRate}%)</Text>
                  <Text style={s.totalsValue}>{fmtMoney(taxAmount)}</Text>
                </View>
              )}
              {/* Blue accent total row */}
              <View style={s.totalsRowLast}>
                <Text style={s.totalsBoldLabel}>Total Due</Text>
                <Text style={s.totalsBoldValue}>{fmtMoney(total)}</Text>
              </View>
            </View>
          </View>

          {/* ── Payment terms + notes ── */}
          {(invoice.paymentTermsText || invoice.polishedNotes) && (
            <>
              <View style={s.sectionDivider} />
              {invoice.paymentTermsText ? (
                <View>
                  <Text style={s.notesLabel}>Payment Terms</Text>
                  <Text style={s.notesText}>{invoice.paymentTermsText}</Text>
                </View>
              ) : null}
              {invoice.polishedNotes ? (
                <View>
                  <Text style={s.notesLabel}>Notes</Text>
                  <Text style={s.notesText}>{invoice.polishedNotes}</Text>
                </View>
              ) : null}
            </>
          )}

        </View>

        {/* ── Full-width dark navy footer bar (every page) ── */}
        <View style={s.footer} fixed>
          <View style={s.footerLeft}>
            {showBranding && (
              <Text style={s.brandingText}>Created with Sealdx · sealdx.com</Text>
            )}
          </View>
          <Text
            style={s.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  );
}
