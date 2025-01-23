import nodemailer from 'nodemailer';
import { IInvoice } from '@/models/Invoice';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: 465, // Gmail's secure SMTP port
  secure: true, // Use TLS
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD, // Gmail App Password
  },
  tls: {
    // Do not fail on invalid certificates
    rejectUnauthorized: false,
  },
});

// Verify the connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

export async function sendInvoiceEmail(invoice: IInvoice) {
  try {
    const customerEmail = {
      from: `Brilliant Pad Store <${process.env.EMAIL_FROM}>`,
      to: invoice.customerEmail,
      subject: 'Your Invoice from Brilliant Pad Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Thank you for your purchase!</h1>
          <p>Your invoice number: <strong>${invoice._id}</strong></p>
          <p>Total amount: <strong>$${invoice.totalAmount}</strong></p>
          <p>
            <a 
              href="${process.env.NEXTAUTH_URL}/invoice/${invoice._id}"
              style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;"
            >
              View Invoice and Complete Payment
            </a>
          </p>
        </div>
      `,
    };

    const storeOwnerEmail = {
      from: `Brilliant Pad Store <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM, // Store owner's email
      subject: 'New Invoice Generated',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">New Invoice Generated</h1>
          <p>Invoice number: <strong>${invoice._id}</strong></p>
          <p>Customer: <strong>${invoice.customerName}</strong></p>
          <p>Email: <strong>${invoice.customerEmail}</strong></p>
          <p>Total amount: <strong>$${invoice.totalAmount}</strong></p>
        </div>
      `,
    };

    // Send emails in parallel
    const [customerResult, ownerResult] = await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(storeOwnerEmail),
    ]);

    console.log('Customer email sent:', customerResult.messageId);
    console.log('Store owner email sent:', ownerResult.messageId);

    return { customerResult, ownerResult };
  } catch (error) {
    console.error('Error sending emails:', error);
    throw error;
  }
}

export async function sendPaymentConfirmationEmail(invoice: IInvoice) {
  try {
    const customerEmail = {
      from: `Brilliant Pad Store <${process.env.EMAIL_FROM}>`,
      to: invoice.customerEmail,
      subject: 'Payment Confirmation - Brilliant Pad Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Payment Confirmed!</h1>
          <p>Thank you for your payment. Your order has been confirmed.</p>
          <p>Invoice number: <strong>${invoice._id}</strong></p>
          <p>Total amount paid: <strong>$${invoice.totalAmount}</strong></p>
          <div style="margin-top: 20px; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
            <h2 style="color: #4b5563; margin-top: 0;">Next Steps</h2>
            <p>Our team will process your order and contact you shortly regarding delivery arrangements.</p>
          </div>
        </div>
      `,
    };

    const storeOwnerEmail = {
      from: `Brilliant Pad Store <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM,
      subject: 'Payment Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">Payment Received</h1>
          <p>Invoice number: <strong>${invoice._id}</strong></p>
          <p>Customer: <strong>${invoice.customerName}</strong></p>
          <p>Email: <strong>${invoice.customerEmail}</strong></p>
          <p>Total amount: <strong>$${invoice.totalAmount}</strong></p>
        </div>
      `,
    };

    const [customerResult, ownerResult] = await Promise.all([
      transporter.sendMail(customerEmail),
      transporter.sendMail(storeOwnerEmail),
    ]);

    console.log('Customer confirmation email sent:', customerResult.messageId);
    console.log('Store owner confirmation email sent:', ownerResult.messageId);

    return { customerResult, ownerResult };
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    throw error;
  }
} 