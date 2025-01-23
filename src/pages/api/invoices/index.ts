import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { sendInvoiceEmail } from '@/lib/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { customerData, items } = req.body;

    await connectDB();

    const invoice = await Invoice.create({
      customerName: customerData.name,
      customerEmail: customerData.email,
      items: items.map((item: any) => ({
        dogId: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
    });

    await sendInvoiceEmail(invoice);

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ message: 'Error creating invoice', error });
  }
} 