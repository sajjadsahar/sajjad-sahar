import { Skill, SkillCategory, SkillProficiency, Project } from '../types.js';

export const SKILL_DESCRIPTIONS: Record<string, string> = {
  // Programming
  'java': 'Strong object-oriented architecture, multi-threading, Collections framework, JDBC, and enterprise design patterns.',
  'c++': 'Systems-level programming, dynamic memory management, custom linked data structures, and algorithmic optimization.',
  'javascript': 'Modern ES6+ syntax, asynchronous event loops, closures, functional programming, and full-stack execution.',
  'python': 'Data processing, machine learning pipeline modeling, scripting, and lightweight backend microservice integration.',

  // Frontend
  'react': 'Declarative component architecture, custom hooks, context state management, and modern SPA lifecycle optimization.',
  'html5': 'Semantic document markup, accessibility standards (WCAG AA), SEO compliance, and modern browser APIs.',
  'css3 / tailwind css': 'Responsive utility-first styling, grid/flexbox layouts, custom theme configurations, and fluid micro-animations.',
  'tailwind css': 'Rapid responsive styling with modern utility classes, design token configuration, and dark mode theming.',
  'vite': 'Lightning-fast HMR, optimized ESM bundler, modern build tooling, and lightweight dev server orchestration.',
  'material ui': 'Production-ready component libraries, theme customization, and consistent design system implementation.',

  // Backend
  'node.js': 'Event-driven asynchronous runtime, non-blocking I/O, RESTful services, and scalable backend architectural design.',
  'express.js': 'Lightweight routing framework, robust middleware pipelines, error handling, and API security headers.',
  'rest apis': 'Resource-oriented architectural design, stateless HTTP methods, standardized JSON status codes, and endpoint pagination.',
  'jwt authentication': 'Stateless authorization tokens, secure cookie storage, role-based access control, and cryptographic verification.',

  // Database
  'mongodb': 'NoSQL document storage, flexible schema design, aggregation pipelines, and high-performance indexing.',
  'mongoose': 'Object Data Modeling (ODM), schema validation hooks, population references, and business logic encapsulation.',
  'sql / relational dbs': 'Normalized relational schemas, ACID transactions, complex JOINs, foreign key constraints, and query tuning.',
  'sql': 'Structured relational queries, data normalization, transactional integrity, and stored procedures.',

  // Tools
  'git & github': 'Distributed version control, atomic commits, feature branch workflows, PR reviews, and CI/CD repository management.',
  'vs code': 'Optimized development workspace, language servers, multi-environment debugging, and productivity workflows.',
  'postman': 'API endpoint testing, automated collection runners, mock servers, and request payload debugging.',

  // AI / Machine Learning
  'machine learning': 'Supervised and unsupervised learning, feature engineering, regression, classification, and model evaluation metrics.',
  'deep learning': 'Multi-layer neural networks, backpropagation, convolutional layers, and hyperparameter optimization.',
  'natural language processing (nlp)': 'TF-IDF text vectorization, sentiment classification, tokenization, and clinical triage modeling.',
  'generative ai & llms': 'Prompt engineering, Gemini API integration, multimodal workflows, and automated text augmentation.'
};

export const CATEGORY_METADATA: Record<string, {
  description: string;
  focus: string;
  accent: string;
  tagColor: string;
}> = {
  'All': {
    description: 'Comprehensive overview across full-stack engineering, systems programming, databases, and applied AI.',
    focus: 'Holistic Software Engineering',
    accent: 'from-cyan-500 to-blue-600',
    tagColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  },
  'Programming': {
    description: 'Core foundation in imperative, functional, and object-oriented languages with strict algorithmic rigor.',
    focus: 'Data Structures & OOP Systems',
    accent: 'from-blue-500 to-indigo-600',
    tagColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
  },
  'Frontend': {
    description: 'Modern UI engineering, reactive state management, responsive design systems, and performant web apps.',
    focus: 'React & Component Architectures',
    accent: 'from-cyan-400 to-teal-500',
    tagColor: 'border-teal-500/30 text-teal-400 bg-teal-500/10'
  },
  'Backend': {
    description: 'Scalable server architectures, RESTful API design, stateless authentication, and service orchestration.',
    focus: 'Node.js & Express Microservices',
    accent: 'from-emerald-400 to-green-600',
    tagColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  'Database': {
    description: 'Relational schemas, NoSQL document stores, query optimization, ACID compliance, and data modeling.',
    focus: 'MongoDB & SQL Architectures',
    accent: 'from-amber-400 to-orange-500',
    tagColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  },
  'Tools': {
    description: 'Distributed version control, automated API testing, build systems, and developer productivity tooling.',
    focus: 'Git, GitHub & Postman Toolchains',
    accent: 'from-purple-400 to-violet-600',
    tagColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
  },
  'AI / Machine Learning': {
    description: 'Neural network architectures, natural language processing pipelines, scikit-learn, and generative AI models.',
    focus: 'NLP & Deep Learning Pipelines',
    accent: 'from-fuchsia-400 to-pink-600',
    tagColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10'
  }
};

export function getSkillDescription(skill: Skill): string {
  if (skill.description) return skill.description;
  const key = skill.name.toLowerCase().trim();
  if (SKILL_DESCRIPTIONS[key]) return SKILL_DESCRIPTIONS[key];

  // Partial match
  for (const [k, desc] of Object.entries(SKILL_DESCRIPTIONS)) {
    if (key.includes(k) || k.includes(key)) return desc;
  }

  return `Production proficiency in ${skill.name} applied across full-stack engineering and distributed architectures.`;
}

export function getSkillProficiencyScore(proficiency: SkillProficiency): number {
  if (typeof proficiency === 'number') return Math.min(100, Math.max(0, proficiency));
  const str = String(proficiency).toLowerCase();
  if (str.includes('adv')) return 92;
  if (str.includes('inter')) return 78;
  if (str.includes('learn')) return 55;
  if (str.includes('beg')) return 40;
  const parsed = parseInt(str, 10);
  if (!isNaN(parsed)) return parsed;
  return 80;
}

const SKILL_ALIASES: Record<string, string[]> = {
  'java': ['java', 'swing', 'jdbc', 'oop'],
  'c++': ['c++', 'cpp', 'linked lists', 'data structures', 'algorithms', 'c / c++'],
  'javascript': ['javascript', 'js', 'react', 'node', 'express', 'mern'],
  'python': ['python', 'fastapi', 'pandas', 'tensorflow', 'machine learning', 'nlp', 'ai'],
  'react': ['react', 'react.js', 'reactjs', 'mern', 'frontend'],
  'html5': ['html', 'html5', 'web', 'frontend'],
  'css3 / tailwind css': ['css', 'css3', 'tailwind', 'tailwind css'],
  'tailwind css': ['tailwind', 'tailwind css', 'css'],
  'vite': ['vite', 'react', 'frontend'],
  'node.js': ['node', 'node.js', 'nodejs', 'express', 'mern', 'backend'],
  'express.js': ['express', 'express.js', 'node', 'node.js', 'mern'],
  'rest apis': ['rest', 'rest apis', 'rest api', 'api', 'express', 'node.js'],
  'jwt authentication': ['jwt', 'authentication', 'auth', 'node.js', 'express'],
  'mongodb': ['mongodb', 'mongo', 'mongoose', 'mern', 'database'],
  'mongoose': ['mongoose', 'mongodb', 'mern'],
  'sql / relational dbs': ['sql', 'mysql', 'postgresql', 'relational', 'database'],
  'git & github': ['git', 'github'],
  'machine learning': ['machine learning', 'ml', 'ai', 'scikit-learn', 'tensorflow'],
  'deep learning': ['deep learning', 'neural networks', 'tensorflow', 'ai'],
  'natural language processing (nlp)': ['nlp', 'natural language', 'text vectorization', 'sentiment'],
  'generative ai & llms': ['generative ai', 'llm', 'gemini', 'ai']
};

export function findRelatedProjects(skill: Skill, projects: Project[]): Project[] {
  if (!projects || projects.length === 0) return [];
  const skillLower = skill.name.toLowerCase();
  const aliases = SKILL_ALIASES[skillLower] || [skillLower];

  const matched = projects.filter((project) => {
    // 1. Direct tech match in project.technologies
    const hasTech = (project.technologies || []).some(t => {
      const tLow = t.toLowerCase();
      return aliases.some(alias => tLow.includes(alias) || alias.includes(tLow));
    });
    if (hasTech) return true;

    // 2. Category match
    const pCat = (project.category || '').toLowerCase();
    const sCat = (skill.category as string).toLowerCase();
    if ((sCat.includes('frontend') || sCat.includes('backend')) && pCat.includes('mern')) return true;
    if (skillLower.includes('java') && pCat.includes('java')) return true;
    if (skillLower.includes('c++') && pCat.includes('c++')) return true;
    if (skillLower.includes('sql') && pCat.includes('database')) return true;
    if (skill.category === 'AI / Machine Learning' && pCat.includes('ai')) return true;

    // 3. Project description or features match
    const pDesc = (project.description || '').toLowerCase();
    return aliases.some(alias => alias.length > 2 && pDesc.includes(alias));
  });

  return matched.slice(0, 3);
}

export function getCategoryRelatedProjects(category: string, projects: Project[]): Project[] {
  if (!projects || projects.length === 0) return [];
  if (category === 'All') return projects.slice(0, 4);

  const catLower = category.toLowerCase();
  return projects.filter(p => {
    const pCat = (p.category || '').toLowerCase();
    if (catLower.includes('programming') && (pCat.includes('java') || pCat.includes('c++'))) return true;
    if (catLower.includes('frontend') && (pCat.includes('web') || pCat.includes('mern'))) return true;
    if (catLower.includes('backend') && (pCat.includes('mern') || pCat.includes('database'))) return true;
    if (catLower.includes('database') && (pCat.includes('database') || pCat.includes('mern'))) return true;
    if (catLower.includes('ai') && pCat.includes('ai')) return true;
    if (catLower.includes('tools') && p.githubUrl) return true;
    return false;
  }).slice(0, 3);
}
