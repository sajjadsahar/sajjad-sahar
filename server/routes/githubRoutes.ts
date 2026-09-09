import { Router } from 'express';
import { getGitHubRepos } from '../controllers/githubController.js';

const router = Router();

router.get('/repos', getGitHubRepos);

export default router;
