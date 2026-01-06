// utils/mongo.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

let isConnected = false;

export async function connectToMongo(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'mcq_generator', // or whatever DB name you're using
    });

    isConnected = true;
    console.log('✅ Connected to MongoDB via Mongoose');
  } catch (error) {
    console.error('❌ Mongoose connection error:', error);
    throw error;
  }
}
