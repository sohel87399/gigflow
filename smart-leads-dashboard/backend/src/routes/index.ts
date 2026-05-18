import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';

const router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

// Mount routers
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;
