import 'dotenv/config';
import { connectDB } from '../src/config/db';
import app from '../src/app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Ensure DB is connected before handling any request
const handler = async (req: VercelRequest, res: VercelResponse) => {
  await connectDB();
  return app(req as any, res as any);
};

export default handler;
