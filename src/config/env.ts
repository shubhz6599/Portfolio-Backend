import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { z } from 'zod';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4100),
  CLIENT_ORIGIN: z.string().default('http://localhost:4200'),
  MONGODB_URI: z.string().min(1).default('mongodb://localhost:27017/shubham-portfolio'),
  SEED_ON_START: z.coerce.boolean().default(true),
  JWT_SECRET: z.string().min(32).default('development-secret-change-me-32-chars'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  MAIL_TO: z.string().email().default('shubh.karkhile@gmail.com'),
  MAIL_FROM: z.string().default('Shubham Portfolio <no-reply@example.com>'),
  AUTO_REPLY_ENABLED: z.coerce.boolean().default(true),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: z.coerce.boolean().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);

if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'development-secret-change-me-32-chars') {
  throw new Error('Set a strong JWT_SECRET before running in production.');
}

export const allowedOrigins = env.CLIENT_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
