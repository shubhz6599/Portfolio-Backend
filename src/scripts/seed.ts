import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDatabase } from '../config/database.js';
import { AdminUserModel } from '../models.js';
import { seedDefaultPortfolio } from '../services/portfolio.service.js';

async function seed() {
  await connectDatabase();
  await seedDefaultPortfolio();

  if (env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
    await AdminUserModel.updateOne(
      { email: env.ADMIN_EMAIL.toLowerCase() },
      {
        $set: {
          email: env.ADMIN_EMAIL.toLowerCase(),
          passwordHash,
          role: 'admin'
        }
      },
      { upsert: true }
    );
  }

  await mongoose.disconnect();
}

seed()
  .then(() => {
    console.log('Portfolio database seeded.');
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  });
