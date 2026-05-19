import { connectDB } from '../src/config/db';
import app from '../src/app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const handler = async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // Temporary debug endpoint — remove after confirming env vars
  if (req.url === '/api/debug-env') {
    res.status(200).json({
      MONGO_URI_SET: !!process.env.MONGO_URI,
      MONGO_URI_PREFIX: process.env.MONGO_URI?.substring(0, 30) ?? 'NOT SET',
      JWT_SECRET_SET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    });
    return;
  }

  try {
    await connectDB();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(500).json({ success: false, message: 'Database connection failed', error: String(err) });
    return;
  }

  app(req as any, res as any);
};

export default handler;
