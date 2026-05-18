import mongoose from 'mongoose';

/**
 * Establishes a connection to MongoDB using the MONGO_URI environment variable.
 * Exits the process if the connection fails.
 */
export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
