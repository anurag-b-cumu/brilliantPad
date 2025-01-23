import mongoose, { Schema, Document } from 'mongoose';

interface IInvoiceItem {
  dogId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

interface IBrilliantPads {
  quantity: number;
  price: number;
}

export interface IInvoice extends Document {
  customerName: string;
  customerEmail: string;
  items: Array<{
    dogId: IDog;
    quantity: number;
    price: number;
  }>;
  brilliantPads?: {
    quantity: number;
    price: number;
  };
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentId?: string;
  createdAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  items: [{
    dogId: {
      type: Schema.Types.ObjectId,
      ref: 'Dog',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  }],
  brilliantPads: {
    quantity: { type: Number },
    price: { type: Number }
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending',
  },
  paymentId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema); 