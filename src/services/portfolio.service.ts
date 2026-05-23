import {
  ExperienceModel,
  ProfileModel,
  ProjectModel,
  SkillGroupModel
} from '../models.js';
import { defaultPortfolio } from '../data/defaultPortfolio.js';

export async function seedDefaultPortfolio(): Promise<void> {
  await ProfileModel.updateOne(
    { key: 'main' },
    { $set: { ...defaultPortfolio.profile, metrics: defaultPortfolio.metrics } },
    { upsert: true }
  );

  await Promise.all(
    defaultPortfolio.projects.map((project) =>
      ProjectModel.updateOne({ slug: project.slug }, { $set: project }, { upsert: true })
    )
  );

  await Promise.all(
    defaultPortfolio.skills.map((skill) =>
      SkillGroupModel.updateOne({ name: skill.name }, { $set: skill }, { upsert: true })
    )
  );

  await Promise.all(
    defaultPortfolio.experiences.map((experience) =>
      ExperienceModel.updateOne(
        { company: experience.company, period: experience.period },
        { $set: experience },
        { upsert: true }
      )
    )
  );
}

export async function getPortfolioContent() {
  const [profile, projects, skills, experiences] = await Promise.all([
    ProfileModel.findOne({ key: 'main' }).lean(),
    ProjectModel.find().sort({ order: 1, createdAt: 1 }).lean(),
    SkillGroupModel.find().sort({ order: 1, createdAt: 1 }).lean(),
    ExperienceModel.find().sort({ order: 1, createdAt: 1 }).lean()
  ]);

  return {
    profile: profile ?? defaultPortfolio.profile,
    metrics: profile?.metrics?.length ? profile.metrics : defaultPortfolio.metrics,
    projects: projects.length ? projects : defaultPortfolio.projects,
    skills: skills.length ? skills : defaultPortfolio.skills,
    experiences: experiences.length ? experiences : defaultPortfolio.experiences
  };
}
