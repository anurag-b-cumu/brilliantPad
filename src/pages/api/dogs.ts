import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Dog from '@/models/Dog';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const dogs = await Dog.find({});
    res.status(200).json(dogs);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    res.status(500).json({ message: 'Error fetching dogs', error });
  }
} 