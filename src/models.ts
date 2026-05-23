import mongoose, { Schema } from 'mongoose';

const metricSchema = new Schema(
  {
    value: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    note: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const linksSchema = new Schema(
  {
    live: { type: String, trim: true },
    repo: { type: String, trim: true },
    caseStudy: { type: String, trim: true }
  },
  { _id: false }
);

const profileSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    linkedin: { type: String, required: true, trim: true },
    github: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    metrics: { type: [metricSchema], default: [] }
  },
  { timestamps: true, versionKey: false }
);

const projectSchema = new Schema(
  {
    order: { type: Number, default: 100 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    problem: { type: String, required: true, trim: true },
    solution: { type: String, required: true, trim: true },
    impact: { type: String, required: true, trim: true },
    metrics: { type: [metricSchema], default: [] },
    stack: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    links: { type: linksSchema, default: {} }
  },
  { timestamps: true, versionKey: false }
);

const skillGroupSchema = new Schema(
  {
    order: { type: Number, default: 100 },
    name: { type: String, required: true, unique: true, trim: true },
    signal: { type: String, required: true, trim: true },
    tools: { type: [String], default: [] }
  },
  { timestamps: true, versionKey: false }
);

const experienceSchema = new Schema(
  {
    order: { type: Number, default: 100 },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    highlights: { type: [String], default: [] }
  },
  { timestamps: true, versionKey: false }
);

const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    projectType: { type: String, required: true, trim: true },
    budget: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new'
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'skipped', 'failed'],
      default: 'pending'
    },
    emailError: { type: String },
    ipHash: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true, versionKey: false }
);

const adminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' }
  },
  { timestamps: true, versionKey: false }
);

projectSchema.index({ featured: 1, order: 1 });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });

export const ProfileModel = mongoose.model('Profile', profileSchema);
export const ProjectModel = mongoose.model('Project', projectSchema);
export const SkillGroupModel = mongoose.model('SkillGroup', skillGroupSchema);
export const ExperienceModel = mongoose.model('Experience', experienceSchema);
export const EnquiryModel = mongoose.model('Enquiry', enquirySchema);
export const AdminUserModel = mongoose.model('AdminUser', adminUserSchema);
