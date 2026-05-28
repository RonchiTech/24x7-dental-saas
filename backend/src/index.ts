import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import viewerStateRoutes from './routes/viewerState';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/viewer-state', viewerStateRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT ?? 4000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

export default app;
