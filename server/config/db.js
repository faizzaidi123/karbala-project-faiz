import mongoose from 'mongoose';

let isMongoConnected = false;

export async function connectDB(mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/karbala_db') {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    isMongoConnected = true;
    console.log('✅ Successfully connected to MongoDB:', mongoUri);
  } catch (err) {
    isMongoConnected = false;
    console.warn('⚠️ MongoDB connection could not be established (running in-memory fallback cache):', err.message);
  }
  return isMongoConnected;
}

export function getMongoStatus() {
  return isMongoConnected;
}
