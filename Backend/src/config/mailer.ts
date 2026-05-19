import nodemailer from "nodemailer";

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toBoolean(value: string | undefined, fallback = false) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["true", "1", "yes", "on"].includes(value.toLowerCase());
}

const smtpHost = process.env.SMTP_HOST?.trim() || "localhost";
const smtpPort = toNumber(process.env.SMTP_PORT, 1025);
const smtpSecure =
  process.env.SMTP_SECURE !== undefined
    ? toBoolean(process.env.SMTP_SECURE)
    : smtpPort === 465;
const smtpRequireTls = toBoolean(process.env.SMTP_REQUIRE_TLS, false);
const smtpIgnoreTls =
  process.env.SMTP_IGNORE_TLS !== undefined
    ? toBoolean(process.env.SMTP_IGNORE_TLS)
    : smtpHost === "localhost" || smtpHost === "mailpit";

export const mailTransporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  requireTLS: smtpRequireTls,
  ignoreTLS: smtpIgnoreTls,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});