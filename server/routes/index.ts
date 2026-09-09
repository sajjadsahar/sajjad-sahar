import { Router } from 'express';
import authRoutes, { downloadResume } from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import projectRoutes from './projectRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import skillRoutes from './skillRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import blogRoutes from './blogRoutes.js';
import messageRoutes from './messageRoutes.js';
import githubRoutes from './githubRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import aiRoutes from './aiRoutes.js';

export const apiRouter = Router();

// Resume download routes
apiRouter.get(['/resume/download', '/cv/download'], downloadResume);

// Auth routes (mounted at /auth)
apiRouter.use('/auth', authRoutes);

// Profile & portfolio routes
apiRouter.use('/', profileRoutes);

// Projects routes (mounted at /projects)
apiRouter.use('/projects', projectRoutes);

// Certificates routes (mounted at /certificates)
apiRouter.use('/certificates', certificateRoutes);

// Skills routes (mounted at /skills)
apiRouter.use('/skills', skillRoutes);

// Experience routes (mounted at /experience)
apiRouter.use('/experience', experienceRoutes);

// Achievements routes (mounted at /achievements)
apiRouter.use('/achievements', achievementRoutes);

// Blogs routes (mounted at /blogs)
apiRouter.use('/blogs', blogRoutes);

// Messages routes (mounted at /messages)
apiRouter.use('/messages', messageRoutes);

// GitHub routes (mounted at /github)
apiRouter.use('/github', githubRoutes);

// Analytics routes (mounted at /analytics)
apiRouter.use('/analytics', analyticsRoutes);

// AI & System routes
apiRouter.use('/', aiRoutes);

export default apiRouter;
