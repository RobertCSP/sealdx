// This component is only ever imported dynamically (client-side) so it's safe
// to use @react-pdf/renderer here without SSR issues.

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { GeneratedProposal } from "@/app/api/generate-proposal/route";
import { ProposalFormData } from "./types";

// ── Color palette ─────────────────────────────────────────────────────────────
const C = {
  navy:        "#0B1F3A", // deep header/footer background
  navyMid:     "#152D4F", // slightly lighter navy for accents
  accent:      "#2E6FE0", // blue accent line on section headers
  accentLight: "#EBF2FF", // alternating table row tint
  textDark:    "#111827", // near-black body text
  textMuted:   "#6B7280", // secondary text
  textLight:   "#9CA3AF", // captions, page numbers
  textWhite:   "#FFFFFF",
  border:      "#D1D9E6", // subtle rule between sections
  rowAlt:      "#F7F9FC", // alternating table row
  rowTotal:    "#0B1F3A", // total row background
};

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.textDark,
    // No paddingTop — the full header on page 1 sits flush at the top edge.
    // Pages 2+ use a fixed in-flow spacer to push content below the slim header.
    paddingTop: 0,
    // paddingBottom: clears the fixed footer bar (~44px) on every page.
    // The signature section is fixed+absolute (bottom: 44) on the last page only,
    // sitting right above the footer. Body content flows freely on other pages.
    paddingBottom: 44,
    backgroundColor: C.textWhite,
    flexDirection: "column",
  },

  // ─── Full-width dark navy header bar ────────────────────────────────────────
  headerBar: {
    backgroundColor: C.navy,
    paddingHorizontal: 48,
    paddingTop: 36,
    paddingBottom: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 0,
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
    color: "#A8BDD4", // muted blue-white
    marginTop: 2,
    letterSpacing: 0.2,
  },
  headerRight: {
    alignItems: "flex-end",
    flexDirection: "column",
  },
  proposalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#A8BDD4",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  // ─── Thin blue accent bar below the header ──────────────────────────────────
  accentBar: {
    height: 3,
    backgroundColor: C.accent,
  },

  // ─── Body content area ──────────────────────────────────────────────────────
  body: {
    flexDirection: "column",
    paddingHorizontal: 48,
    paddingTop: 30,
    // No paddingBottom here — the page-level paddingBottom handles footer clearance
  },

  // ─── Metadata strip ─────────────────────────────────────────────────────────
  meta: {
    flexDirection: "row",
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  metaItem: {
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

  // ─── Section ────────────────────────────────────────────────────────────────
  section: {
    flexDirection: "column",
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  // Blue accent line on the left of each section title
  sectionAccent: {
    width: 3,
    height: 16,
    backgroundColor: C.accent,
    borderRadius: 2,
    marginRight: 10,
  },
  sectionNumber: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.accent,
    letterSpacing: 1,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  sectionBody: {
    fontSize: 9.5,
    color: C.textDark,
    lineHeight: 1.75,
  },
  boldSpan: {
    fontFamily: "Helvetica-Bold",
  },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 28,
  },

  // ─── Pricing table ──────────────────────────────────────────────────────────
  table: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  // Dark navy header row
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: C.navy,
  },
  // Standard row (white background)
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.textWhite,
  },
  // Alternating row (very light blue-gray)
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
  // Navy total row
  tableTotalRow: {
    flexDirection: "row",
    backgroundColor: C.navy,
    borderTopWidth: 2,
    borderTopColor: C.accent,
  },
  tableColService: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableColPrice: {
    width: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: "right",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.1)",
  },
  tableColPriceBody: {
    width: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    textAlign: "right",
    borderLeftWidth: 1,
    borderLeftColor: C.border,
  },
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
  tableTotalText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.textWhite,
  },

  // ─── Slim header bar (pages 2+) ─────────────────────────────────────────────
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
    marginTop: 2,
  },
  pageNumber: {
    fontSize: 8,
    color: "#A8BDD4",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },

  // ─── Signature section (white content area, last page only) ──────────────────
  signatureSection: {
    flexDirection: "column",
    paddingHorizontal: 48,
    paddingTop: 24,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
    backgroundColor: C.textWhite,
  },
  signatureTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.textLight,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 20,
  },
  signatureColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureCol: {
    flex: 1,
    flexDirection: "column",
    marginRight: 40,
  },
  signatureParty: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    marginBottom: 18,
  },
  signatureRule: {
    borderBottomWidth: 1,
    borderBottomColor: C.textDark,
    marginBottom: 6,
  },
  signatureLabel: {
    fontSize: 8,
    color: C.textMuted,
  },
  signatureDateRule: {
    borderBottomWidth: 1,
    borderBottomColor: C.textDark,
    marginTop: 14,
    marginBottom: 6,
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function addDays(d: Date, n: number) {
  const result = new Date(d);
  result.setDate(result.getDate() + n);
  return result;
}

// ── Sub-components ────────────────────────────────────────────────────────────

/**
 * Parses **bold** markers and renders them as actual bold text inline.
 */
function RichText({ children }: { children: string }) {
  const segments = children.split(/\*\*(.*?)\*\*/g);
  return (
    <Text style={s.sectionBody}>
      {segments.map((seg, i) =>
        i % 2 === 1
          ? <Text key={i} style={s.boldSpan}>{seg}</Text>
          : <Text key={i}>{seg}</Text>
      )}
    </Text>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.section}>
      <View style={s.sectionHeader}>
        {/* Blue accent bar on the left */}
        <View style={s.sectionAccent} />
        <Text style={s.sectionNumber}>{number}</Text>
        <Text style={s.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function SectionDivider() {
  return <View style={s.sectionDivider} />;
}

function PricingTable({
  rows,
  total,
}: {
  rows: { service: string; price: string }[];
  total: string;
}) {
  return (
    <View style={s.table}>
      {/* Dark navy header row */}
      <View style={s.tableHeaderRow}>
        <View style={s.tableColService}>
          <Text style={s.tableHeaderText}>Service / Deliverable</Text>
        </View>
        <View style={s.tableColPrice}>
          <Text style={s.tableHeaderText}>Price</Text>
        </View>
      </View>

      {/* Alternating rows */}
      {rows.map((row, i) => {
        const isAlt = i % 2 === 1;
        const isLast = i === rows.length - 1;
        const rowStyle = isLast
          ? isAlt ? s.tableRowLastAlt : s.tableRowLast
          : isAlt ? s.tableRowAlt : s.tableRow;
        return (
          <View key={i} style={rowStyle}>
            <View style={s.tableColService}>
              <Text style={s.tableCellText}>{row.service}</Text>
            </View>
            <View style={s.tableColPriceBody}>
              <Text style={s.tableCellText}>{row.price}</Text>
            </View>
          </View>
        );
      })}

      {/* Navy total row */}
      <View style={s.tableTotalRow}>
        <View style={s.tableColService}>
          <Text style={s.tableTotalText}>Total Investment</Text>
        </View>
        <View style={s.tableColPrice}>
          <Text style={s.tableTotalText}>{total}</Text>
        </View>
      </View>
    </View>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────

interface Props {
  proposal: GeneratedProposal;
  formData: ProposalFormData;
  showBranding?: boolean;
}

export default function ProposalPDF({ proposal, formData, showBranding = false }: Props) {
  const today = new Date();
  const validUntil = addDays(today, 30);
  const contactParts = [formData.email, formData.phone].filter(Boolean);

  return (
    <Document
      title={`${formData.projectTitle} — Proposal`}
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
            <Text style={s.proposalLabel}>Proposal</Text>
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
        {/* Fixed + in-flow (no position:absolute) so it takes up real space */}
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
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Prepared For</Text>
              <Text style={s.metaValue}>{formData.clientName}</Text>
              {formData.clientCompany ? (
                <Text style={s.metaValueSub}>{formData.clientCompany}</Text>
              ) : null}
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Date</Text>
              <Text style={s.metaValue}>{formatDate(today)}</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaLabel}>Valid Until</Text>
              <Text style={s.metaValue}>{formatDate(validUntil)}</Text>
            </View>
          </View>

          {/* 01 — Introduction */}
          <Section number="01" title="Introduction">
            <RichText>{proposal.introduction}</RichText>
          </Section>
          <SectionDivider />

          {/* 02 — Scope of Work */}
          <Section number="02" title="Scope of Work">
            <RichText>{proposal.scopeOfWork}</RichText>
          </Section>
          <SectionDivider />

          {/* 03 — Timeline */}
          <Section number="03" title="Timeline">
            <RichText>{proposal.timeline}</RichText>
          </Section>
          <SectionDivider />

          {/* 04 — Pricing */}
          <Section number="04" title="Investment">
            <PricingTable
              rows={proposal.pricingTable}
              total={proposal.totalAmount}
            />
          </Section>
          <SectionDivider />

          {/* 05 — Terms & Conditions */}
          <Section number="05" title="Terms & Conditions">
            <RichText>{proposal.termsAndConditions}</RichText>
          </Section>
          <SectionDivider />

          {/* 06 — Next Steps */}
          <Section number="06" title="Next Steps">
            <RichText>{proposal.nextSteps}</RichText>
          </Section>

        </View>

        {/* ── Signature section — fixed above footer, last page only ── */}
        <View
          fixed
          style={{ position: "absolute", bottom: 44, left: 0, right: 0 }}
          render={({ pageNumber, ...rest }) =>
            pageNumber === (rest as Record<string, number>).totalPages ? (
              <View style={s.signatureSection}>
                <Text style={s.signatureTitle}>Authorization {"&"} Acceptance</Text>
                <View style={s.signatureColumns}>

                  {/* Left: Authorized by (business) */}
                  <View style={s.signatureCol}>
                    <Text style={s.signatureParty}>Authorized By</Text>
                    <Text style={s.signatureName}>{formData.businessName}</Text>
                    <View style={s.signatureRule} />
                    <Text style={s.signatureLabel}>Signature</Text>
                  </View>

                  {/* Right: Accepted by (client) */}
                  <View style={[s.signatureCol, { marginRight: 0 }]}>
                    <Text style={s.signatureParty}>Accepted By</Text>
                    <Text style={s.signatureName}>{formData.clientName}</Text>
                    <View style={s.signatureRule} />
                    <Text style={s.signatureLabel}>Signature</Text>
                    <View style={s.signatureDateRule} />
                    <Text style={s.signatureLabel}>Date</Text>
                  </View>

                </View>
              </View>
            ) : null
          }
        />

        {/* ── Full-width dark navy footer bar ── */}
        <View style={s.footer} fixed>
          <View style={s.footerLeft}>
            {showBranding && (
              <Text style={s.brandingText}>Created with Sealdx · getsealdx.com</Text>
            )}
          </View>
          <Text
            style={s.pageNumber}
            render={({ pageNumber, ...rest }) =>
              `${pageNumber} / ${(rest as Record<string, number>).totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  );
}
