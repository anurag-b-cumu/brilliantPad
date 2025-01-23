import type { NextApiRequest, NextApiResponse } from 'next';
import { Stripe } from 'stripe';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

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
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    await connectDB();

    // Update invoice status
    const invoice = await Invoice.findByIdAndUpdate(
      session.metadata?.invoiceId,
      {
        status: 'paid',
        paymentId: session.payment_intent as string,
        'brilliantPads.quantity': parseInt(session.metadata?.brilliantPadsCount || '0'),
        'brilliantPads.price': parseInt(session.metadata?.brilliantPadsCount || '0') * 100,
      },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Here you would typically send confirmation emails to both customer and store owner
    // We'll implement this in the next step

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: 'Error verifying payment', error });
  }
} 