import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';

const PORT = parseInt(process.env.PORT ?? '5000', 10);

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.info(`Server running on port ${PORT} in ${process.env.NODE_ENV ?? 'development'} mode`);
  });
};

startServer().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
