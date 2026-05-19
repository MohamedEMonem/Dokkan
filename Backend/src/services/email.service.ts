import "dotenv/config";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { mailTransporter } from "../config/mailer.js";

interface MailOptions {
  to: string;
  subject: string;
  template: string; // Name of the .hbs file
  data: Record<string, any>; // Dynamic data for the template
  from?: string; // Optional override for the sender
  attachments?: any[]; // Optional attachments support
}

interface OrderConfirmationItem {
  name: string;
  quantity: number;
  unitPrice: string;
  lineTotal?: string;
}

interface OrderConfirmationEmailData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  totalAmount: string;
  items: OrderConfirmationItem[];
  orderDate?: string;
  storeName?: string;
}

class EmailService {
  private transporter = mailTransporter;

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

  public async sendOrderConfirmationEmail(
    orderData: OrderConfirmationEmailData,
  ): Promise<boolean> {
    const normalizedItems = orderData.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal || item.unitPrice,
    }));

    return this.sendMail({
      to: orderData.customerEmail,
      subject: `Your Dokkan order ${orderData.orderNumber} is confirmed`,
      template: "order-confirmed",
      data: {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        totalAmount: orderData.totalAmount,
        orderDate: orderData.orderDate || new Date().toLocaleDateString(),
        items: normalizedItems,
        storeName: orderData.storeName || "Dokkan",
      },
    });
  }

  public async sendOrderConfirmation(
    customerEmail: string,
    orderData: Omit<OrderConfirmationEmailData, "customerEmail">,
  ): Promise<boolean> {
    return this.sendOrderConfirmationEmail({
      ...orderData,
      customerEmail,
    });
  }
}

export const emailService = new EmailService();
