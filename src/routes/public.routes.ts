import { Router } from 'express';
import { getPortfolioContent } from '../services/portfolio.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ProjectModel } from '../models.js';

export const publicRoutes = Router();

publicRoutes.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'shubham-portfolio-api',
    timestamp: new Date().toISOString()
  });
});

publicRoutes.get(
  '/portfolio',
  asyncHandler(async (_req, res) => {
    res.json(await getPortfolioContent());
  })
);

publicRoutes.get(
  '/projects',
  asyncHandler(async (_req, res) => {
    const projects = await ProjectModel.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json(projects);
  })
);

publicRoutes.get(
  '/projects/:slug',
  asyncHandler(async (req, res) => {
    const project = await ProjectModel.findOne({ slug: req.params.slug }).lean();

    if (!project) {
      res.status(404).json({ message: 'Project not found.' });
      return;
    }

    res.json(project);
  })
);
