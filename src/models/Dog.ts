import mongoose, { Schema, Document } from 'mongoose';

export interface IDog extends Document {
  name: string;
  breed: string;
  price: number;
  description?: string;
  image?: string;
}

const DogSchema = new Schema<IDog>({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  image: String,
});

// Check if the model exists before creating a new one
export default mongoose.models.Dog || mongoose.model<IDog>('Dog', DogSchema); 