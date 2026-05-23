import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { createApp } from './app.js';
import { seedDefaultPortfolio } from './services/portfolio.service.js';

async function bootstrap() {
  await connectDatabase();

  if (env.SEED_ON_START) {
    await seedDefaultPortfolio();
  }

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Portfolio API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start portfolio API:', error);
  process.exit(1);
});
