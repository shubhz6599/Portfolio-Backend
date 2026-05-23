import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth.middleware.js';
import {
  EnquiryModel,
  ExperienceModel,
  ProjectModel,
  SkillGroupModel
} from '../models.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const adminRoutes = Router();

adminRoutes.use(requireAdmin);

const metricSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  note: z.string().trim().min(1)
});

const projectSchema = z.object({
  order: z.number().optional(),
  slug: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(160),
  summary: z.string().trim().min(10).max(500),
  problem: z.string().trim().min(10).max(800),
  solution: z.string().trim().min(10).max(1000),
  impact: z.string().trim().min(10).max(800),
  metrics: z.array(metricSchema).default([]),
  stack: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean().default(false),
  links: z
    .object({
      live: z.string().url().optional().or(z.literal('')),
      repo: z.string().url().optional().or(z.literal('')),
      caseStudy: z.string().url().optional().or(z.literal(''))
    })
    .default({})
});

const skillSchema = z.object({
  order: z.number().optional(),
  name: z.string().trim().min(2).max(100),
  signal: z.string().trim().min(2).max(100),
  tools: z.array(z.string().trim().min(1)).default([])
});

const experienceSchema = z.object({
  order: z.number().optional(),
  company: z.string().trim().min(2).max(160),
  location: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(140),
  period: z.string().trim().min(2).max(80),
  highlights: z.array(z.string().trim().min(5)).default([])
});

adminRoutes.get(
  '/enquiries',
  asyncHandler(async (_req, res) => {
    const enquiries = await EnquiryModel.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json(enquiries);
  })
);

adminRoutes.patch(
  '/enquiries/:id',
  asyncHandler(async (req, res) => {
    const payload = z
      .object({
        status: z.enum(['new', 'read', 'replied', 'archived'])
      })
      .parse(req.body);

    const enquiry = await EnquiryModel.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    }).lean();

    if (!enquiry) {
      res.status(404).json({ message: 'Enquiry not found.' });
      return;
    }

    res.json(enquiry);
  })
);

adminRoutes.post(
  '/projects',
  asyncHandler(async (req, res) => {
    const project = await ProjectModel.create(projectSchema.parse(req.body));
    res.status(201).json(project);
  })
);

adminRoutes.patch(
  '/projects/:id',
  asyncHandler(async (req, res) => {
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      projectSchema.partial().parse(req.body),
      { new: true, runValidators: true }
    ).lean();

    if (!project) {
      res.status(404).json({ message: 'Project not found.' });
      return;
    }

    res.json(project);
  })
);

adminRoutes.delete(
  '/projects/:id',
  asyncHandler(async (req, res) => {
    await ProjectModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  })
);

adminRoutes.post(
  '/skills',
  asyncHandler(async (req, res) => {
    const skill = await SkillGroupModel.create(skillSchema.parse(req.body));
    res.status(201).json(skill);
  })
);

adminRoutes.patch(
  '/skills/:id',
  asyncHandler(async (req, res) => {
    const skill = await SkillGroupModel.findByIdAndUpdate(
      req.params.id,
      skillSchema.partial().parse(req.body),
      { new: true, runValidators: true }
    ).lean();

    if (!skill) {
      res.status(404).json({ message: 'Skill group not found.' });
      return;
    }

    res.json(skill);
  })
);

adminRoutes.delete(
  '/skills/:id',
  asyncHandler(async (req, res) => {
    await SkillGroupModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  })
);

adminRoutes.post(
  '/experiences',
  asyncHandler(async (req, res) => {
    const experience = await ExperienceModel.create(experienceSchema.parse(req.body));
    res.status(201).json(experience);
  })
);

adminRoutes.patch(
  '/experiences/:id',
  asyncHandler(async (req, res) => {
    const experience = await ExperienceModel.findByIdAndUpdate(
      req.params.id,
      experienceSchema.partial().parse(req.body),
      { new: true, runValidators: true }
    ).lean();

    if (!experience) {
      res.status(404).json({ message: 'Experience not found.' });
      return;
    }

    res.json(experience);
  })
);

adminRoutes.delete(
  '/experiences/:id',
  asyncHandler(async (req, res) => {
    await ExperienceModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  })
);
