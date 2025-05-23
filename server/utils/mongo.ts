import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI as string;

const client = new MongoClient(uri);

let db: Db;

export async function connectToMongo(): Promise<Db> {
  if (!db) {
    try {
      await client.connect();
      db = client.db('mcq_generator'); 
      console.log('✅ Connected to MongoDB Atlas');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
  return db;
}
