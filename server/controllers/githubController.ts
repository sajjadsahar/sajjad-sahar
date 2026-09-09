import { Request, Response } from 'express';
import { db } from '../config/database.js';
import { config } from '../config/environment.js';

let cachedRepos: { data: any[]; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function getGitHubRepos(_req: Request, res: Response) {
  try {
    const profile = db.getProfile();
    const username = profile.githubUsername || 'sajjadsahar';

    if (cachedRepos && (Date.now() - cachedRepos.timestamp < CACHE_DURATION)) {
      return res.json({ username, repos: cachedRepos.data });
    }

    const headers: Record<string, string> = {
      'User-Agent': 'Sajjad-Sahar-Portfolio-App',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (config.githubToken) {
      headers['Authorization'] = `token ${config.githubToken}`;
    }

    const githubRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      headers
    });

    if (!githubRes.ok) {
      const curatedRepos = [
        {
          id: 101,
          name: 'wanderlust-mern',
          description: 'Full-stack vacation rental web platform built with MongoDB, Express, React, and Node.js with JWT auth and geo-search.',
          html_url: `https://github.com/${username}/wanderlust-mern`,
          stargazers_count: 24,
          forks_count: 8,
          language: 'JavaScript',
          updated_at: new Date().toISOString(),
          topics: ['react', 'nodejs', 'mongodb', 'express', 'mern']
        },
        {
          id: 102,
          name: 'police-management-system-java',
          description: 'Desktop incident and criminal record management system with Java OOP patterns and relational database integration.',
          html_url: `https://github.com/${username}/police-management-system-java`,
          stargazers_count: 19,
          forks_count: 4,
          language: 'Java',
          updated_at: new Date().toISOString(),
          topics: ['java', 'oop', 'jdbc', 'mysql']
        },
        {
          id: 103,
          name: 'fir-management-cpp',
          description: 'First Information Report filing and search engine built in C++ using customized linked lists and dynamic memory control.',
          html_url: `https://github.com/${username}/fir-management-cpp`,
          stargazers_count: 15,
          forks_count: 3,
          language: 'C++',
          updated_at: new Date().toISOString(),
          topics: ['cpp', 'data-structures', 'algorithms']
        },
        {
          id: 104,
          name: 'room-booking-system-sql',
          description: 'Conference room and residency reservation portal backed by normalized SQL schemas and ACID transaction guarantees.',
          html_url: `https://github.com/${username}/room-booking-system-sql`,
          stargazers_count: 12,
          forks_count: 2,
          language: 'SQL',
          updated_at: new Date().toISOString(),
          topics: ['sql', 'database', 'backend']
        }
      ];
      return res.json({ username, repos: curatedRepos });
    }

    const rawData = await githubRes.json();
    const formatted = Array.isArray(rawData) ? rawData.slice(0, 6).map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description || 'Personal software engineering project by Sajjad Sahar',
      html_url: r.html_url,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language || 'Code',
      updated_at: r.updated_at,
      topics: r.topics || []
    })) : [];

    cachedRepos = { data: formatted, timestamp: Date.now() };
    return res.json({ username, repos: formatted });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch GitHub repos' });
  }
}
