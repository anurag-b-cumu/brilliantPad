import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Dog from '@/models/Dog';
import { sampleDogs } from '@/data/sampleDogs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Clear existing dogs
    await Dog.deleteMany({});

    // Insert sample dogs
    const dogs = await Dog.insertMany(sampleDogs);

    res.status(200).json({ message: 'Database seeded successfully', dogs });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ message: 'Error seeding database', error });
  }
} 