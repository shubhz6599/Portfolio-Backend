import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

interface AdminTokenPayload {
  sub: string;
  email: string;
  role: 'admin';
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

  if (!token) {
    res.status(401).json({ message: 'Missing admin token.' });
    return;
  }

  try {
    req.admin = jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired admin token.' });
  }
}
