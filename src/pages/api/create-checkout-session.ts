import type { NextApiRequest, NextApiResponse } from 'next';
import { Stripe } from 'stripe';
import connectDB from '@/lib/mongodb';
import Invoice, { IInvoice } from '@/models/Invoice';
import { IDog } from '@/models/Dog';

interface InvoiceItem {
  dogId: IDog;
  quantity: number;
  price: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { invoiceId, brilliantPadsCount } = req.body;

    await connectDB();
    const invoice = await Invoice.findById(invoiceId).populate('items.dogId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const lineItems = [
      ...invoice.items.map((item: InvoiceItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.dogId.name,
            description: `${item.dogId.breed} - ${item.dogId.description || ''}`,
          },
          unit_amount: item.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
      ...(brilliantPadsCount > 0
        ? [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Brilliant Pad',
                description: 'Premium quality pet pad',
              },
              unit_amount: 10000, // $100 in cents
            },
            quantity: brilliantPadsCount,
          }]
        : []),
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/invoice/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/invoice/${invoiceId}`,
      metadata: {
        invoiceId,
        brilliantPadsCount: brilliantPadsCount.toString(),
      },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session', error });
  }
} 