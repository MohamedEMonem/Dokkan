import { QRCodeSVG } from "qrcode.react";
import type { IOrder as Order } from "@/types/entities/order.types";
import { EOrderStatus, EPaymentStatus } from "@/types/entities/order.types";

interface InvoicePdfDocumentProps {
  order: Order;
  watermarkText?: string;
  showWatermark?: boolean;
}

const theme = {
  primary: "#005B7F",
  primaryDark: "#004A66",
  primaryLight: "#007AA3",
  accent: "#C49A6C",
  accentLight: "#EBD8B7",
  cream: "#FAF8F5",
  warm: "#FAF6F0",
  surface: "#FFFFFF",
  text: "#2B2B2B",
  muted: "#6B6B6B",
  border: "#E7DDD0",
} as const;

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

const formatMoney = (value: number, currency: string) =>
  currencyFormatter(currency).format(value);

const styles = {
  stage: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  page: {
    position: "relative" as const,
    width: "100%",
    maxWidth: "194mm",
    minHeight: "230mm",
    margin: "0 auto",
    padding: "14mm 12mm 12mm 16mm",
    backgroundColor: theme.cream,
    color: theme.text,
    fontFamily: "Cairo, Arial, Helvetica, sans-serif",
    boxSizing: "border-box" as const,
    overflow: "hidden" as const,
  },
  glow: {
    position: "absolute" as const,
    top: "-40mm",
    right: "-40mm",
    width: "140mm",
    height: "140mm",
    borderRadius: "9999px",
    background:
      "radial-gradient(circle, rgba(0,91,127,0.14) 0%, rgba(0,91,127,0.04) 45%, rgba(0,91,127,0) 75%)",
    pointerEvents: "none" as const,
  },
  watermark: {
    position: "absolute" as const,
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none" as const,
    transform: "rotate(-24deg)",
    fontSize: "56px",
    fontWeight: 900,
    letterSpacing: "0.45em",
    color: "rgba(0, 91, 127, 0.06)",
    userSelect: "none" as const,
    textTransform: "uppercase" as const,
  },
  shell: {
    position: "relative" as const,
    zIndex: 1,
    display: "grid",
    gap: "10px",
  },
  topAccent: {
    height: "6px",
    borderRadius: "9999px",
    background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.primary} 45%, ${theme.primaryLight} 100%)`,
  },
  hero: {
    borderRadius: "28px",
    overflow: "hidden" as const,
    background: `linear-gradient(90deg, #4f46e5 0%, #8b5cf6 50%, #ec4899 100%)`,
    color: "#ffffff",
    boxShadow: "0 22px 45px rgba(79, 70, 229, 0.14)",
  },
  heroInner: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 14px 14px 16px",
    alignItems: "flex-start",
  },
  brand: { display: "flex", alignItems: "flex-start", gap: "14px", flex: 1 },
  logo: {
    width: "44px",
    height: "44px",
    borderRadius: "16px",
    overflow: "hidden" as const,
    background: `linear-gradient(135deg, ${theme.accent} 0%, #d8b792 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoFallback: {
    color: theme.primaryDark,
    fontSize: "19px",
    fontWeight: 900,
    letterSpacing: "0.2em",
  },
  eyebrow: {
    margin: 0,
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.26em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.9)",
  },
  title: {
    margin: 0,
    marginTop: "4px",
    fontSize: "28px",
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.02,
  },
  subtitle: {
    marginTop: "8px",
    maxWidth: "540px",
    fontSize: "11px",
    lineHeight: 1.5,
    color: "rgba(255,255,255,0.88)",
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 8px",
    borderRadius: "9999px",
    border: "1px solid rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.92)",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
  },
  heroMeta: {
    minWidth: "170px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "8px",
  },
  metaLabel: {
    margin: 0,
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.72)",
  },
  metaValue: {
    margin: 0,
    marginTop: "4px",
    fontSize: "12px",
    fontWeight: 800,
    color: "#ffffff",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 10px",
    marginTop: "10px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "12px",
    paddingLeft: "2px",
  },
  card: {
    borderRadius: "12px",
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    boxShadow: "0 6px 12px rgba(43, 43, 43, 0.04)",
    padding: "10px",
  },
  sectionLabel: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: theme.primary,
  },
  customerName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 900,
    color: theme.primaryDark,
  },
  mutedText: {
    margin: 0,
    fontSize: "11px",
    lineHeight: 1.45,
    color: theme.text,
  },
  orderInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "6px 0",
    borderBottom: `1px dashed ${theme.border}`,
  },
  orderInfoLabel: { fontSize: "11px", fontWeight: 700, color: theme.muted },
  orderInfoValue: {
    fontSize: "11px",
    fontWeight: 800,
    color: theme.primaryDark,
    textAlign: "right" as const,
  },
  badgeBase: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    padding: "3px 8px",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    border: "1px solid transparent",
  },
  tableShell: {
    borderRadius: "20px",
    overflow: "hidden" as const,
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    boxShadow: "0 8px 24px rgba(43, 43, 43, 0.06)",
  },
  tableHeaderBar: {
    padding: "8px 12px",
    background: `linear-gradient(135deg, ${theme.warm}, ${theme.cream})`,
    borderBottom: `1px solid ${theme.border}`,
  },
  tableHeaderTitle: {
    margin: 0,
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: theme.primary,
  },
  table: { width: "100%", borderCollapse: "collapse" as const },
  th: {
    padding: "8px 10px",
    fontSize: "10px",
    fontWeight: 800,
    textAlign: "left" as const,
    color: theme.surface,
    backgroundColor: theme.primary,
  },
  td: {
    padding: "8px 10px",
    verticalAlign: "top" as const,
    borderBottom: `1px solid ${theme.border}`,
    fontSize: "10px",
    color: theme.text,
  },
  totalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 0.95fr",
    gap: "12px",
  },
  notesCard: {
    borderRadius: "12px",
    backgroundColor: theme.warm,
    border: `1px solid ${theme.border}`,
    padding: "10px",
  },
  summaryCard: {
    borderRadius: "12px",
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    padding: "12px",
  },
  sectionSmall: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: theme.primary,
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    fontSize: "11px",
    color: theme.text,
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    fontSize: "18px",
    fontWeight: 900,
    color: theme.primaryDark,
  },
  summaryTotalLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  summaryPill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: "9999px",
    backgroundColor: theme.accentLight,
    color: theme.primaryDark,
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
  },
  divider: { borderTop: `1px dashed ${theme.border}`, margin: "6px 0" },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    paddingTop: "4px",
    borderTop: `1px solid ${theme.border}`,
  },
  footerText: {
    margin: 0,
    maxWidth: "540px",
    fontSize: "10px",
    lineHeight: 1.45,
    color: theme.muted,
  },
  footerBadge: {
    padding: "8px 12px",
    borderRadius: "12px",
    backgroundColor: theme.primaryDark,
    color: "#ffffff",
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
  },
} as const;

const badgeStyle = (background: string, color: string) => ({
  ...styles.badgeBase,
  backgroundColor: background,
  color,
});

const paymentBadgeStyles: Record<string, ReturnType<typeof badgeStyle>> = {
  Paid: badgeStyle("#ecfdf5", "#047857"),
  Pending: badgeStyle("#fff7ed", theme.accent),
  Failed: badgeStyle("#fef2f2", "#be123c"),
  Refunded: badgeStyle("#f8fafc", theme.muted),
};
const statusBadgeStyles: Record<string, ReturnType<typeof badgeStyle>> = {
  Draft: badgeStyle("#f8fafc", theme.muted),
  Processing: badgeStyle("#eff6ff", theme.primary),
  Packed: badgeStyle("#eef2ff", theme.primaryLight),
  Shipped: badgeStyle("#ecfeff", theme.primaryDark),
  Delivered: badgeStyle("#ecfdf5", "#047857"),
  Cancelled: badgeStyle("#fef2f2", "#be123c"),
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.orderInfoRow}>
      <span style={styles.orderInfoLabel}>{label}</span>
      <span style={styles.orderInfoValue}>{value}</span>
    </div>
  );
}

export function InvoicePdfDocument({
  order,
  watermarkText,
  showWatermark = true,
}: InvoicePdfDocumentProps) {
  // normalize incoming `IOrder` into invoice-friendly shape used by the template
  const currency = "USD";

  const items: Array<{
    id: string;
    name: string;
    sku?: string;
    quantity: number;
    price: number;
    description?: string;
  }> = (order.orderItems ?? []).map((it) => ({
    id: it.id,
    name: it.product?.title ?? `Item ${it.id}`,
    sku: it.product?.id,
    quantity: it.quantity,
    price: it.priceAtPurchase,
    description: undefined,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );
  const discountAmount = 0;
  const shippingFee = order.shippingCost ?? 0;
  const taxAmount = order.taxAmount ?? 0;
  const total = subtotal + taxAmount + shippingFee - discountAmount;

  const resolvedWatermark =
    watermarkText ??
    (order.paymentStatus === EPaymentStatus.Success ? "PAID" : "DRAFT");

  const footerMessage =
    "Thank you for your purchase. Please contact billing if anything looks incorrect.";

  const invoiceNumber = `INV-${String(order.id).replace(/\D/g, "") || order.id}`;
  const date = order.createdAt ?? new Date().toISOString();
  const paymentMethod = order.shippingAddress?.phoneNumber ? "Phone" : "Online";
  const mapStatus = (s: EOrderStatus | string) => {
    switch (String(s)) {
      case "Shipped":
        return "Shipped";
      case "Delivered":
        return "Delivered";
      case "Cancelled":
        return "Cancelled";
      case "Pending":
      default:
        return "Processing";
    }
  };
  const orderStatusLabel = mapStatus(order.status as EOrderStatus);
  const paymentStatusLabel =
    order.paymentStatus === EPaymentStatus.Success ? "Paid" : "Pending";

  const company = {
    name: order.store?.name ?? "Dokkan Commerce",
    logoUrl: "/logo.png",
    email: "billing@dokkan.com",
    phone: "+20 2 1234 5678",
    address: "Business District, Cairo, Egypt",
    website: "www.dokkan.com",
    taxId: "EG-TAX-884214",
  };

  const customer = {
    name: order.customer?.name ?? "Customer",
    email: order.customer?.email ?? "",
    phone: order.shippingAddress?.phoneNumber ?? "",
    address: order.shippingAddress?.line1 ?? "",
    city: order.shippingAddress?.city ?? "",
    country: order.shippingAddress?.country ?? "",
  };

  return (
    <div style={styles.stage}>
      <div style={styles.page}>
        <div style={styles.glow} />
        {showWatermark ? (
          <div style={styles.watermark}>{resolvedWatermark}</div>
        ) : null}

        <div style={styles.shell}>
          <div style={styles.topAccent} />

          <section style={styles.hero}>
            <div style={styles.heroInner}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  flex: 1,
                }}
              >
                <h1 style={{ ...styles.title, fontSize: "34px" }}>INVOICE</h1>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.9)",
                    fontWeight: 700,
                  }}
                >
                  {invoiceNumber}
                </p>
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "12px",
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.95 }}>Date</span>
                    <strong style={{ marginLeft: "6px" }}>
                      {formatDate(date)}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ opacity: 0.95 }}>Items</span>
                    <strong style={{ marginLeft: "6px" }}>
                      {items.length}
                    </strong>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QRCodeSVG
                  value={`https://dokkan/orders/${order.id}`}
                  size={72}
                  includeMargin={false}
                  fgColor={theme.primaryDark}
                  bgColor="#ffffff"
                />
              </div>
            </div>
          </section>

          <section style={styles.infoGrid}>
            <div style={styles.card}>
              <h2 style={styles.sectionLabel}>Bill To</h2>
              <p style={styles.customerName}>{customer.name}</p>
              <div style={{ marginTop: "10px", display: "grid", gap: "6px" }}>
                <p style={styles.mutedText}>{customer.email}</p>
                <p style={styles.mutedText}>{customer.phone}</p>
                <p style={styles.mutedText}>{customer.address}</p>
                {customer.city || customer.country ? (
                  <p style={styles.mutedText}>
                    {[customer.city, customer.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : null}
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionLabel}>Invoice Details</h2>
              <div style={{ display: "grid", gap: "8px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <span style={styles.orderInfoLabel}>Order Status</span>
                  <span
                    style={
                      statusBadgeStyles[
                        orderStatusLabel as keyof typeof statusBadgeStyles
                      ]
                    }
                  >
                    {orderStatusLabel}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <span style={styles.orderInfoLabel}>Payment Status</span>
                  <span
                    style={
                      paymentBadgeStyles[
                        paymentStatusLabel as keyof typeof paymentBadgeStyles
                      ]
                    }
                  >
                    {paymentStatusLabel}
                  </span>
                </div>
                <InfoRow label="Payment Method" value={paymentMethod} />
                <InfoRow label="Tax ID" value={company.taxId ?? "N/A"} />
                <InfoRow label="Support Email" value={company.email} />
                <InfoRow label="Support Phone" value={company.phone} />
              </div>
            </div>
          </section>

          <section style={styles.tableShell}>
            <div style={styles.tableHeaderBar}>
              <h2 style={styles.tableHeaderTitle}>Order Items</h2>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Qty</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Price</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Total</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index: number) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? theme.surface : theme.warm,
                      }}
                    >
                      <td style={styles.td}>
                        <div
                          style={{ fontWeight: 800, color: theme.primaryDark }}
                        >
                          {item.name}
                        </div>
                        {item.description ? (
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: "9px",
                              lineHeight: 1.35,
                              color: theme.muted,
                              maxWidth: "280px",
                            }}
                          >
                            {item.description}
                          </p>
                        ) : null}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          textAlign: "center",
                          fontWeight: 700,
                          color: theme.primaryDark,
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                          fontWeight: 700,
                          color: theme.primaryDark,
                        }}
                      >
                        {formatMoney(item.price, currency)}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          textAlign: "right",
                          fontWeight: 900,
                          color: theme.primaryDark,
                        }}
                      >
                        {formatMoney(itemTotal, currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section style={styles.totalGrid}>
            <div style={styles.notesCard}>
              <h3 style={styles.sectionSmall}>Notes</h3>
              <p style={styles.mutedText}>{footerMessage}</p>
            </div>

            <div style={styles.summaryCard}>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 700, color: theme.primaryDark }}>
                    {formatMoney(subtotal, currency)}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 700, color: theme.primaryDark }}>
                    - {formatMoney(discountAmount, currency)}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Shipping</span>
                  <span style={{ fontWeight: 700, color: theme.primaryDark }}>
                    {formatMoney(shippingFee, currency)}
                  </span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Tax</span>
                  <span style={{ fontWeight: 700, color: theme.primaryDark }}>
                    {formatMoney(taxAmount, currency)}
                  </span>
                </div>

                <div style={styles.divider} />

                <div style={styles.summaryTotal}>
                  <span style={styles.summaryTotalLabel}>
                    Total
                    <span style={styles.summaryPill}>Due Now</span>
                  </span>
                  <span>{formatMoney(total, currency)}</span>
                </div>
              </div>
            </div>
          </section>

          <footer style={styles.footer}>
            <p style={styles.footerText}>{footerMessage}</p>
            <div style={styles.footerBadge}>Generated for {customer.name}</div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default InvoicePdfDocument;
