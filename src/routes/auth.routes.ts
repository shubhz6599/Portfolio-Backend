import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { AdminUserModel } from '../models.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRoutes = Router();

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

authRoutes.post(
  '/login',
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const admin = await AdminUserModel.findOne({ email: payload.email.toLowerCase() });

    if (!admin) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const matches = await bcrypt.compare(payload.password, admin.passwordHash);

    if (!matches) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const signOptions: jwt.SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    };

    const token = jwt.sign(
      {
        sub: admin.id,
        email: admin.email,
        role: admin.role
      },
      env.JWT_SECRET,
      signOptions
    );

    res.json({
      token,
      admin: {
        email: admin.email,
        role: admin.role
      }
    });
  })
);
