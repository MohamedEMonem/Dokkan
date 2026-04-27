import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialize Nodemailer with environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "localhost",
      port: parseInt(process.env.SMTP_PORT || "1025"),
      // If we are in production, use auth. Locally, ignore it.
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
      // Ignore TLS for local Mailpit testing
      ignoreTLS: !process.env.SMTP_USER,
    });
  }

  /**
   * Helper to read and compile Handlebars templates
   */
  private compileTemplate(
    templateName: string,
    data: Record<string, any>,
  ): string {
    const filePath = path.join(
      process.cwd(),
      "src",
      "templates",
      `${templateName}.hbs`,
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`Template ${templateName} not found at ${filePath}`);
    }

    const htmlSource = fs.readFileSync(filePath, "utf-8");
    const template = handlebars.compile(htmlSource);
    return template(data);
  }

  /**
   * Send the OTP Verification Email
   */
  public async sendOtpEmail(
    to: string,
    name: string,
    otp: string,
  ): Promise<boolean> {
    try {
      const htmlContent = this.compileTemplate("otp-verification", {
        name,
        otp,
      });

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Dokkan" <noreply@dokkan.com>',
        to,
        subject: "Your Dokkan Verification Code",
        html: htmlContent,
      });

      console.log(`[EmailService] OTP successfully sent to ${to}`);
      return true;
    } catch (error) {
      console.error(`[EmailService] Failed to send OTP to ${to}:`, error);
      return false;
    }
  }
}

// Export a single instance to be used across the app (Singleton pattern)
export const emailService = new EmailService();
