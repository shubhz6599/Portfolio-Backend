import compression from 'compression';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import { allowedOrigins, env } from './config/env.js';
import { authRoutes } from './routes/auth.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { enquiryRoutes } from './routes/enquiry.routes.js';
import { publicRoutes } from './routes/public.routes.js';
import { aiRoutes } from './routes/ai.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );
  app.use(compression());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      }
    })
  );
  app.use(express.json({ limit: '32kb' }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      message: 'Too many enquiry attempts. Please try again later.'
    }
  });

  app.use('/api/enquiries', enquiryLimiter, enquiryRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api', publicRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
