import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

interface MailOptions {
  to: string;
  subject: string;
  template: string; // Name of the .hbs file
  data: Record<string, any>; // Dynamic data for the template
  from?: string; // Optional override for the sender
  attachments?: any[]; // Optional attachments support
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "localhost",
      port: parseInt(process.env.SMTP_PORT || "1025"),
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
      ignoreTLS: !process.env.SMTP_USER,
    });
  }

  /**
   * Internal helper to compile templates
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
      throw new Error(
        `Email template "${templateName}" not found at ${filePath}`,
      );
    }

    const htmlSource = fs.readFileSync(filePath, "utf-8");
    const template = handlebars.compile(htmlSource);
    return template(data);
  }

  /**
   * The All-In-One reusable method
   */
  public async sendMail({
    to,
    subject,
    template,
    data,
    from,
    attachments,
  }: MailOptions): Promise<boolean> {
    try {
      const htmlContent = this.compileTemplate(template, data);

      const info = await this.transporter.sendMail({
        from: from || process.env.EMAIL_FROM || '"Dokkan" <noreply@dokkan.com>',
        to,
        subject,
        html: htmlContent,
        attachments,
      });

      console.log(
        `[EmailService] Email "${subject}" sent to ${to}. ID: ${info.messageId}`,
      );
      return true;
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${to}:`, error);
      return false;
    }
  }
}

export const emailService = new EmailService();
