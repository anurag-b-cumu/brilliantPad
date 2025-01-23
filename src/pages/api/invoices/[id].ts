import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { getIO } from '@/lib/socket';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const invoice = await Invoice.findById(req.query.id)
        .populate('items.dogId')
        .exec();

      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      res.status(200).json(invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ message: 'Error fetching invoice', error });
    }
  } 
  else if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { status } = req.body;

      console.log('Updating invoice status:', id, status);

      const updatedInvoice = await Invoice.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('items.dogId');

      if (!updatedInvoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      try {
        // Try to emit socket event, but don't fail if socket isn't available
        const io = getIO();
        console.log('Emitting payment confirmation from API:', id);
        io.to(`invoice-${id}`).emit('paymentConfirmed', { invoiceId: id });
      } catch (socketError) {
        console.warn('Socket.IO not available:', socketError);
        // Continue without socket emission
      }

      res.status(200).json(updatedInvoice);
    } catch (error) {
      console.error('Error updating invoice:', error);
      res.status(500).json({ error: 'Failed to update invoice' });
    }
  } 
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 