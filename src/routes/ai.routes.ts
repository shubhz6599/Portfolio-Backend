// src/routes/ai.routes.ts

import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getAiChatResponse } from '../services/chat.service.js';

export const aiRoutes = Router();

aiRoutes.post(
  '/chat',
  asyncHandler(async (req, res) => {
    const question = String(req.body.question ?? '').trim();
    const confirmedGlobal = Boolean(req.body.confirmedGlobal ?? false); // 👈 add this

    if (!question) {
      res.status(400).json({ message: 'Question is required.' });
      return;
    }

    const aiResponse = await getAiChatResponse(question); // 👈 pass it

    res.json({
      success: true,
      data: aiResponse,
      timestamp: new Date().toISOString()
    });
  })
);