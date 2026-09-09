import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { 
  Profile, 
  Project, 
  Certificate, 
  Skill, 
  Experience, 
  Achievement, 
  Blog, 
  ContactMessage, 
  AnalyticsSummary 
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio_db.json');

export interface DatabaseSchema {
  admin: {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: string;
  };
  profile: Profile;
  projects: Project[];
  certificates: Certificate[];
  skills: Skill[];
  experience: Experience[];
  achievements: Achievement[];
  blogs: Blog[];
  messages: ContactMessage[];
  analytics: AnalyticsSummary;
}

// Initial realistic default data for Sajjad Sahar
export const getInitialData = (): DatabaseSchema => {
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('Sajjad@65441', salt);

  return {
    admin: {
      id: 'admin-1',
      username: 'sajjad',
      email: '65441@students.riphah.edu.pk',
      passwordHash: defaultPasswordHash,
      createdAt: new Date().toISOString()
    },
    profile: {
      name: 'Sajjad Sahar',
      title: 'Software Engineer | Full-Stack Developer | AI Enthusiast',
      field: 'Software Engineering / Full-Stack Development / AI & Machine Learning',
      university: 'Riphah International University',
      program: 'BS Software Engineering',
      currentSemester: '5th Semester',
      cgpa: '3.98',
      bio: "I’m a Software Engineering student and developer passionate about building modern web applications and exploring Artificial Intelligence. I enjoy turning ideas into practical, scalable, and user-friendly software.",
      aboutText: "Driven by curiosity and engineering rigor, I specialize in full-stack architecture with the MERN stack alongside core software engineering in Java and C++. Maintaining a 3.98 CGPA at Riphah International University, I blend strong theoretical foundations in Data Structures and Algorithms with production-ready software development.",
      developmentPhilosophy: "I believe software should be engineered with clean architectural boundaries, intuitive interfaces, and robust scalability. Code is written once but read, maintained, and scaled continuously.",
      careerGoals: "Aiming to build mission-critical distributed systems and leverage generative AI to solve complex enterprise and societal challenges.",
      avatarUrl: "/sajjad_photo.jpg",
      resumeUrl: "/api/resume/download",
      githubUsername: "sajjadsahar",
      location: "Islamabad, Pakistan",
      availableForHire: true,
      socialLinks: {
        github: "https://github.com/sajjadsahar",
        linkedin: "https://linkedin.com/in/sajjadsahar",
        facebook: "https://web.facebook.com/sajjad.sahar.942/",
        email: "65441@students.riphah.edu.pk",
        whatsapp: "03485039425"
      }
    },
    projects: [
      {
        id: 'proj-1',
        title: 'Wanderlust Travel & Booking Platform',
        slug: 'wanderlust-travel-booking',
        description: 'Comprehensive full-stack vacation rental platform engineered with Node.js, Express, MongoDB, and modern React interface featuring map geocoding and secure checkout.',
        category: 'MERN',
        technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'REST APIs', 'Tailwind CSS'],
        imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        githubUrl: 'https://github.com/sajjadsahar/wanderlust-mern',
        liveDemoUrl: 'https://wanderlust-demo.example.com',
        date: '2025-01',
        featured: true,
        features: [
          'Dynamic property listings with multi-filter search by location, amenities, and price',
          'Interactive map integration and geo-spatial query caching',
          'JWT-based secure authentication and role authorization for hosts and guests',
          'Responsive booking calendar with date clash validation',
          'User review and rating system with moderation controls'
        ],
        challenges: 'Managing atomic database transactions for overlapping reservation dates and optimizing image upload pipelines for property photo galleries.',
        whatILearned: 'Mastered MongoDB indexing strategies, RESTful API versioning, and clean state management across complex booking workflows.',
        views: 245
      },
      {
        id: 'proj-2',
        title: 'Police Management System',
        slug: 'police-management-system',
        description: 'Robust desktop and service application built in Java utilizing Object-Oriented Design patterns, encapsulated records, role-based access control, and report generation.',
        category: 'Java',
        technologies: ['Java', 'OOP', 'Swing', 'JDBC', 'MySQL', 'Design Patterns'],
        imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
        githubUrl: 'https://github.com/sajjadsahar/police-management-system-java',
        date: '2024-11',
        featured: true,
        features: [
          'Strict role-based hierarchy: Officers, Station Heads, and Administrators',
          'Criminal history tracking with automated case status transitions',
          'Complaint filing and duty shift scheduling module',
          'Secure relational database integration with prepared statements'
        ],
        challenges: 'Structuring clean inheritance and polymorphism across departmental officers while ensuring data privacy across case files.',
        whatILearned: 'Deepened practical understanding of SOLID principles, relational schema normalization, and thread safety in Java desktop apps.',
        views: 180
      },
      {
        id: 'proj-3',
        title: 'FIR Management System',
        slug: 'fir-management-system',
        description: 'High-performance First Information Report (FIR) logging engine developed in C++ employing customized linked lists, dynamic memory allocation, and algorithmic search.',
        category: 'C++',
        technologies: ['C++', 'Data Structures', 'Linked Lists', 'Algorithms', 'File Handling'],
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        githubUrl: 'https://github.com/sajjadsahar/fir-management-cpp',
        date: '2024-06',
        featured: true,
        features: [
          'Custom singly and doubly linked list data structures for instant O(1) case node insertion',
          'Fast binary search and hash index lookups by FIR identification numbers',
          'Persistent binary file storage ensuring zero data loss across restarts',
          'Comprehensive memory leak audit using clean pointer deallocation'
        ],
        challenges: 'Preventing memory fragmentation and managing linked-list node integrity during bulk deletions and case reassignment.',
        whatILearned: 'Gained profound appreciation for pointers, hardware memory limits, and optimal algorithmic time complexities.',
        views: 154
      },
      {
        id: 'proj-4',
        title: 'Enterprise Room Booking System',
        slug: 'room-booking-system',
        description: 'Scalable conference and hostel room reservation engine backed by structured SQL schemas, foreign key constraints, and transactional consistency.',
        category: 'Database',
        technologies: ['SQL', 'PostgreSQL / MySQL', 'Node.js', 'Express', 'Tailwind CSS'],
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        githubUrl: 'https://github.com/sajjadsahar/room-booking-system-sql',
        liveDemoUrl: 'https://room-booking.example.com',
        date: '2024-09',
        featured: true,
        features: [
          'High-throughput room availability lookup with ACID transaction guarantees',
          'Automated invoice generation and reservation status tracking',
          'Interactive floor plan visualizer and capacity management'
        ],
        challenges: 'Handling race conditions when two users attempt to reserve the same room at the exact same millisecond.',
        whatILearned: 'Implemented row-level locking (SELECT ... FOR UPDATE) and stored procedures for mission-critical concurrency control.',
        views: 132
      },
      {
        id: 'proj-5',
        title: 'AI Medical Diagnosis & NLP Symptom Analyzer',
        slug: 'ai-symptom-analyzer',
        description: 'Machine learning model pipeline trained to categorize clinical symptom descriptions and recommend preliminary triage levels using NLP and scikit-learn.',
        category: 'AI/ML',
        technologies: ['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'FastAPI', 'Pandas'],
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        githubUrl: 'https://github.com/sajjadsahar/ai-symptom-nlp',
        date: '2025-02',
        featured: false,
        features: [
          'TF-IDF text vectorization and sentiment/urgency classification',
          'FastAPI lightweight inference microservice',
          'Confidence score distribution and triage urgency matrix'
        ],
        challenges: 'Handling noisy patient vocabulary and misspellings in free-form medical symptom inputs.',
        whatILearned: 'Text normalization techniques, data balancing with SMOTE, and deploying containerized ML models.',
        views: 198
      }
    ],
    certificates: [
      {
        id: 'cert-1',
        title: 'Data Science Essentials With Python',
        issuingOrganization: 'Cisco',
        issueDate: 'July 25, 2026',
        expiryDate: 'Never',
        certificateId: 'a11287f8-e69f-44d0-ba21-c48b171da1f3',
        fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        fileType: 'image',
        skillsCovered: ['Python', 'Data Science', 'Data Analysis', 'Programming', 'AI Fundamentals'],
        description: 'Foundational credential issued by Cisco validating core data science principles, analytical methodologies, and computational data processing using Python.',
        verificationUrl: '',
        category: 'Data Science / Programming / AI',
        featured: true,
        views: 240
      },
      {
        id: 'cert-2',
        title: 'Develop AI-Powered Prototypes in Google AI Studio',
        issuingOrganization: 'Google',
        issueDate: 'July 2026',
        expiryDate: 'No Expiration',
        certificateId: '25558633',
        fileUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
        fileType: 'image',
        skillsCovered: ['Google AI Studio', 'Generative AI', 'AI Prototyping', 'Prompt Engineering', 'Gemini Models'],
        description: 'Official credential from Google recognizing proficiency in designing, experimenting with, and developing AI-powered prototypes within Google AI Studio.',
        verificationUrl: '',
        category: 'Artificial Intelligence / Generative AI',
        featured: true,
        views: 310
      },
      {
        id: 'cert-3',
        title: 'Create Your First Gemini Enterprise Application',
        issuingOrganization: 'Google Cloud',
        issueDate: 'July 9, 2026',
        expiryDate: 'Never',
        certificateId: 'a5151d34-4d06-40f7-aa5d-4114141267b5',
        fileUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
        fileType: 'image',
        skillsCovered: ['Google Cloud', 'Gemini API', 'Enterprise Applications', 'Generative AI', 'Cloud Architecture'],
        description: 'Professional credential by Google Cloud confirming competencies in architecting, building, and deploying enterprise-grade applications powered by Gemini models on Google Cloud.',
        verificationUrl: '',
        category: 'Artificial Intelligence / Cloud / Generative AI',
        featured: true,
        views: 285
      },
      {
        id: 'cert-4',
        title: 'Introduction to Modern AI',
        issuingOrganization: 'Cisco',
        issueDate: 'June 15, 2026',
        expiryDate: 'Never',
        certificateId: '373e9741-348b-4d58-b015-b71ef6e2125b',
        fileUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
        fileType: 'image',
        skillsCovered: ['Artificial Intelligence', 'Machine Learning Concepts', 'Modern AI Systems', 'AI Ethics'],
        description: 'Certificate from Cisco introducing the foundational concepts, paradigms, architectures, and real-world applications of modern artificial intelligence.',
        verificationUrl: '',
        category: 'Artificial Intelligence',
        featured: false,
        views: 195
      },
      {
        id: 'cert-5',
        title: 'Certificate of Completion: AI Fluency for Students',
        issuingOrganization: 'Anthropic',
        issueDate: 'June 2026',
        expiryDate: 'No Expiration',
        certificateId: '2uxkfhf8ooze',
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        fileType: 'image',
        skillsCovered: ['AI Fluency', 'Language Models', 'Anthropic Claude', 'Prompting', 'AI Literacy'],
        description: 'Certificate of completion awarded by Anthropic validating foundational AI fluency, responsible interaction, and effective use of modern AI technologies.',
        verificationUrl: '',
        category: 'Artificial Intelligence / AI Literacy',
        featured: true,
        views: 230
      },
      {
        id: 'cert-6',
        title: 'Certificate of Completion',
        issuingOrganization: 'Apna College',
        issueDate: 'April 2026',
        expiryDate: 'No Expiration',
        certificateId: '69a9928fae16f2c65303b794',
        fileUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        fileType: 'image',
        skillsCovered: ['Web Development', 'MERN Stack', 'React.js', 'Node.js', 'MongoDB', 'JavaScript'],
        description: 'Certificate of completion awarded by Apna College certifying the successful completion of the Web Development and MERN Stack training program.',
        verificationUrl: '',
        category: 'Web Development / MERN Stack',
        featured: false,
        views: 210
      }
    ],
    skills: [
      // Programming
      { id: 'sk-1', name: 'Java', category: 'Programming', proficiency: 'Advanced', yearsOfExperience: '3 yrs', featured: true },
      { id: 'sk-2', name: 'C++', category: 'Programming', proficiency: 'Advanced', yearsOfExperience: '3 yrs', featured: true },
      { id: 'sk-3', name: 'JavaScript', category: 'Programming', proficiency: 'Advanced', yearsOfExperience: '3 yrs', featured: true },
      { id: 'sk-4', name: 'Python', category: 'Programming', proficiency: 'Intermediate', yearsOfExperience: '2 yrs', featured: true },
      
      // Frontend
      { id: 'sk-5', name: 'React', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: '2.5 yrs', featured: true },
      { id: 'sk-6', name: 'HTML5', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: '4 yrs', featured: false },
      { id: 'sk-7', name: 'CSS3 / Tailwind CSS', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: '3 yrs', featured: true },
      { id: 'sk-8', name: 'Vite', category: 'Frontend', proficiency: 'Advanced', yearsOfExperience: '2 yrs', featured: false },
      { id: 'sk-9', name: 'Material UI', category: 'Frontend', proficiency: 'Intermediate', yearsOfExperience: '1.5 yrs', featured: false },
      
      // Backend
      { id: 'sk-10', name: 'Node.js', category: 'Backend', proficiency: 'Advanced', yearsOfExperience: '2.5 yrs', featured: true },
      { id: 'sk-11', name: 'Express.js', category: 'Backend', proficiency: 'Advanced', yearsOfExperience: '2.5 yrs', featured: true },
      { id: 'sk-12', name: 'REST APIs', category: 'Backend', proficiency: 'Advanced', yearsOfExperience: '3 yrs', featured: true },
      { id: 'sk-13', name: 'JWT Authentication', category: 'Backend', proficiency: 'Advanced', yearsOfExperience: '2 yrs', featured: false },
      
      // Database
      { id: 'sk-14', name: 'MongoDB', category: 'Database', proficiency: 'Advanced', yearsOfExperience: '2.5 yrs', featured: true },
      { id: 'sk-15', name: 'Mongoose', category: 'Database', proficiency: 'Advanced', yearsOfExperience: '2 yrs', featured: false },
      { id: 'sk-16', name: 'SQL / Relational DBs', category: 'Database', proficiency: 'Advanced', yearsOfExperience: '2.5 yrs', featured: true },
      
      // Tools
      { id: 'sk-17', name: 'Git & GitHub', category: 'Tools', proficiency: 'Advanced', yearsOfExperience: '3.5 yrs', featured: true },
      { id: 'sk-18', name: 'VS Code', category: 'Tools', proficiency: 'Advanced', yearsOfExperience: '4 yrs', featured: false },
      { id: 'sk-19', name: 'Postman', category: 'Tools', proficiency: 'Advanced', yearsOfExperience: '2.5 yrs', featured: false },
      
      // AI / Machine Learning
      { id: 'sk-20', name: 'Machine Learning', category: 'AI / Machine Learning', proficiency: 'Intermediate', yearsOfExperience: '1.5 yrs', featured: true },
      { id: 'sk-21', name: 'Deep Learning', category: 'AI / Machine Learning', proficiency: 'Intermediate', yearsOfExperience: '1 yr', featured: false },
      { id: 'sk-22', name: 'Natural Language Processing (NLP)', category: 'AI / Machine Learning', proficiency: 'Intermediate', yearsOfExperience: '1 yr', featured: true },
      { id: 'sk-23', name: 'Generative AI & LLMs', category: 'AI / Machine Learning', proficiency: 'Learning', yearsOfExperience: '1 yr', featured: true }
    ],
    experience: [
      {
        id: 'exp-1',
        organization: 'Riphah International University',
        position: 'BS Software Engineering (Undergraduate)',
        type: 'Education',
        startDate: '2022-09',
        endDate: 'Present (2026)',
        current: true,
        location: 'Islamabad, Pakistan',
        description: 'Pursuing Bachelor of Science in Software Engineering, currently in 5th semester maintaining an outstanding CGPA of 3.98 out of 4.0.',
        achievements: [
          'Ranked consistently top 1% of the department cohort with CGPA 3.98',
          'Dean’s Honor Roll recipient for academic distinction across consecutive semesters',
          'Active peer mentor teaching Data Structures, Object-Oriented Programming, and Web Architectures'
        ],
        technologies: ['C++', 'Java', 'Data Structures', 'Database Systems', 'Algorithms', 'Software Design']
      },
      {
        id: 'exp-2',
        organization: 'ACM Student Chapter / Dev Society',
        position: 'Technical Lead & Competitive Programming Mentor',
        type: 'Leadership',
        startDate: '2023-10',
        endDate: 'Present',
        current: true,
        location: 'University Campus',
        description: 'Organizing algorithmic problem-solving workshops, hackathons, and web development bootcamps for student engineers.',
        achievements: [
          'Conducted hands-on sessions for 120+ students on MERN stack and Git best practices',
          'Mentored competitive programming teams preparing for national ICPC qualifiers'
        ],
        technologies: ['Problem Solving', 'MERN Stack', 'Git', 'Clean Code Architecture']
      },
      {
        id: 'exp-3',
        organization: 'Freelance & Open Source Software',
        position: 'Full-Stack Developer',
        type: 'Experience',
        startDate: '2023-01',
        endDate: 'Present',
        current: true,
        location: 'Remote',
        description: 'Architecting custom client portals, booking systems, and responsive web applications for small businesses and academic initiatives.',
        achievements: [
          'Delivered 6+ bespoke web applications with 100% on-time milestone records',
          'Optimized database queries and API response times by up to 65%'
        ],
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Docker']
      }
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Outstanding Academic Merit Award (CGPA 3.98)',
        organization: 'Riphah International University',
        date: '2024-11',
        category: 'Academic',
        description: 'Awarded highest academic honor and merit distinction for maintaining a 3.98 CGPA in Software Engineering.',
        featured: true
      },
      {
        id: 'ach-2',
        title: '1st Place Winner - Speed Programming Contest',
        organization: 'Riphah Tech Olympiad',
        date: '2024-05',
        category: 'Competition',
        description: 'Secured 1st position among 40+ competitor teams by solving complex graph and dynamic programming challenges in record time.',
        featured: true
      },
      {
        id: 'ach-3',
        title: 'Merit-Based University Scholarship',
        organization: 'Riphah Academic Scholarship Board',
        date: '2023-09',
        category: 'Scholarship',
        description: 'Continuous 100% academic merit tuition scholarship awarded based on semester GPA excellence.',
        featured: true
      },
      {
        id: 'ach-4',
        title: 'Finalist - National University Hackathon',
        organization: 'IEEE Student Branch',
        date: '2024-03',
        category: 'Hackathon',
        description: 'Engineered a real-time crisis dispatch prototype using WebSockets and location intelligence within 36 continuous hours.',
        featured: false
      }
    ],
    blogs: [
      {
        id: 'blog-1',
        title: 'Building Scalable MERN Applications: Lessons from Wanderlust',
        slug: 'building-scalable-mern-applications',
        excerpt: 'A deep dive into RESTful architecture, MongoDB connection pooling, JWT security, and state management in production web apps.',
        category: 'Full-Stack Development',
        tags: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'Web Architecture'],
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        published: true,
        publishedAt: '2025-02-14',
        readingTimeMinutes: 6,
        content: `## Why Architecture Matters in Modern Full-Stack Development

When engineering web applications that handle real-time users, the traditional "tutorial" way of putting business logic in route handlers quickly breaks down. In building my Wanderlust project, I adopted a clean multi-layer pattern:

### 1. Controller and Service Separation
Instead of embedding database calls inside Express request handlers:
- **Routes** define endpoints and apply authentication middlewares.
- **Controllers** handle HTTP status codes, request validation, and responses.
- **Services** encapsulate the raw business logic and database queries.

### 2. Efficient MongoDB Indexing
Without appropriate compound indexes, querying properties by price range and location results in full collection scans:
\`\`\`javascript
listingSchema.index({ location: 'text', price: 1 });
\`\`\`
This reduced our query response latency from 320ms to under 18ms under simulated concurrent traffic.

### 3. Bulletproof JWT Security
Always store sensitive access tokens in secure HTTP-only cookies or well-guarded memory closures to protect users against Cross-Site Scripting (XSS).`,
        views: 312
      },
      {
        id: 'blog-2',
        title: 'From OOP to Memory Control: What C++ and Java Taught Me About Clean Code',
        slug: 'from-oop-to-memory-control-cpp-java',
        excerpt: 'Why every modern web developer benefits profoundly from mastering low-level pointers, memory layouts, and SOLID design patterns.',
        category: 'Computer Science',
        tags: ['Java', 'C++', 'Data Structures', 'OOP', 'Memory Management'],
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        published: true,
        publishedAt: '2025-01-20',
        readingTimeMinutes: 5,
        content: `## Bridging High-Level and Systems Programming

Many junior developers start directly with frameworks like React and never understand what happens underneath the browser runtime or V8 engine.

### The Power of Explicit Memory Management
Building my **FIR Management System** entirely using custom linked lists in C++ forced me to grapple with:
- Stack vs Heap memory allocations
- Dynamic pointer arithmetic
- Preventing memory leaks with clean destructors

\`\`\`cpp
struct CaseNode {
    int firNumber;
    std::string incidentDescription;
    CaseNode* next;
    CaseNode(int id, std::string desc) : firNumber(id), incidentDescription(desc), next(nullptr) {}
};
\`\`\`

When you understand how nodes link together in memory, you write significantly faster and leaner JavaScript and Node.js code!`,
        views: 245
      }
    ],
    messages: [
      {
        id: 'msg-1',
        name: 'Dr. Tariq Mahmood',
        email: 'tariq.mahmood@example.com',
        subject: 'Research Collaboration on Applied Machine Learning',
        message: 'Hello Sajjad, I reviewed your academic record and recent projects. Your CGPA and practical development skills are impressive. Would you be open to discussing an undergraduate research opportunity?',
        createdAt: '2025-02-18T10:30:00.000Z',
        read: false,
        replied: false
      }
    ],
    analytics: {
      pageViews: 1420,
      projectViews: 909,
      certificateViews: 1240,
      blogViews: 557,
      messageCount: 1,
      dailyViews: [
        { date: '2025-02-28', views: 98 },
        { date: '2025-03-01', views: 134 },
        { date: '2025-03-02', views: 180 },
        { date: '2025-03-03', views: 165 },
        { date: '2025-03-04', views: 210 },
        { date: '2025-03-05', views: 240 },
        { date: '2025-03-06', views: 293 }
      ]
    }
  };
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return parsed;
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing default seed data:', err);
    }
    const initial = getInitialData();
    this.saveDataDirect(initial);
    return initial;
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database file:', err);
    }
  }

  public save() {
    this.saveDataDirect(this.data);
  }

  // Getters
  public getAdmin() { return this.data.admin; }
  public getProfile() { return this.data.profile; }
  public getProjects() { return this.data.projects; }
  public getCertificates() { return this.data.certificates; }
  public getSkills() { return this.data.skills; }
  public getExperience() { return this.data.experience; }
  public getAchievements() { return this.data.achievements; }
  public getBlogs() { return this.data.blogs; }
  public getMessages() { return this.data.messages; }
  public getAnalytics() { return this.data.analytics; }
  public getPortfolioData() {
    return {
      profile: this.data.profile,
      projects: this.data.projects,
      certificates: this.data.certificates,
      skills: this.data.skills,
      experience: this.data.experience,
      achievements: this.data.achievements,
      blogs: this.data.blogs
    };
  }

  // Updaters
  public updateAdmin(admin: DatabaseSchema['admin']) {
    this.data.admin = admin;
    this.save();
  }

  public updateProfile(profile: Partial<Profile>) {
    this.data.profile = { ...this.data.profile, ...profile };
    this.save();
    return this.data.profile;
  }

  // Projects CRUD
  public addProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      views: 0
    };
    this.data.projects.unshift(newProject);
    this.save();
    return newProject;
  }

  public updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.data.projects[index] = { ...this.data.projects[index], ...updates };
    this.save();
    return this.data.projects[index];
  }

  public deleteProject(id: string): boolean {
    const initialLength = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    const deleted = this.data.projects.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  public incrementProjectViews(id: string) {
    const p = this.data.projects.find(p => p.id === id);
    if (p) {
      p.views = (p.views || 0) + 1;
      this.data.analytics.projectViews = (this.data.analytics.projectViews || 0) + 1;
      this.save();
    }
  }

  // Certificates CRUD
  public addCertificate(cert: Omit<Certificate, 'id'>): Certificate {
    const newCert: Certificate = {
      ...cert,
      id: `cert-${Date.now()}`,
      views: 0
    };
    this.data.certificates.unshift(newCert);
    this.save();
    return newCert;
  }

  public updateCertificate(id: string, updates: Partial<Certificate>): Certificate | null {
    const index = this.data.certificates.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.certificates[index] = { ...this.data.certificates[index], ...updates };
    this.save();
    return this.data.certificates[index];
  }

  public deleteCertificate(id: string): boolean {
    const initialLength = this.data.certificates.length;
    this.data.certificates = this.data.certificates.filter(c => c.id !== id);
    const deleted = this.data.certificates.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  public incrementCertificateViews(id: string) {
    const c = this.data.certificates.find(c => c.id === id);
    if (c) {
      c.views = (c.views || 0) + 1;
      this.data.analytics.certificateViews = (this.data.analytics.certificateViews || 0) + 1;
      this.save();
    }
  }

  // Skills CRUD
  public addSkill(skill: Omit<Skill, 'id'>): Skill {
    const newSkill: Skill = {
      ...skill,
      id: `sk-${Date.now()}`
    };
    this.data.skills.push(newSkill);
    this.save();
    return newSkill;
  }

  public updateSkill(id: string, updates: Partial<Skill>): Skill | null {
    const index = this.data.skills.findIndex(s => s.id === id);
    if (index === -1) return null;
    this.data.skills[index] = { ...this.data.skills[index], ...updates };
    this.save();
    return this.data.skills[index];
  }

  public deleteSkill(id: string): boolean {
    const initialLength = this.data.skills.length;
    this.data.skills = this.data.skills.filter(s => s.id !== id);
    const deleted = this.data.skills.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  // Experience CRUD
  public addExperience(exp: Omit<Experience, 'id'>): Experience {
    const newExp: Experience = {
      ...exp,
      id: `exp-${Date.now()}`
    };
    this.data.experience.unshift(newExp);
    this.save();
    return newExp;
  }

  public updateExperience(id: string, updates: Partial<Experience>): Experience | null {
    const index = this.data.experience.findIndex(e => e.id === id);
    if (index === -1) return null;
    this.data.experience[index] = { ...this.data.experience[index], ...updates };
    this.save();
    return this.data.experience[index];
  }

  public deleteExperience(id: string): boolean {
    const initialLength = this.data.experience.length;
    this.data.experience = this.data.experience.filter(e => e.id !== id);
    const deleted = this.data.experience.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  // Achievements CRUD
  public addAchievement(ach: Omit<Achievement, 'id'>): Achievement {
    const newAch: Achievement = {
      ...ach,
      id: `ach-${Date.now()}`
    };
    this.data.achievements.unshift(newAch);
    this.save();
    return newAch;
  }

  public updateAchievement(id: string, updates: Partial<Achievement>): Achievement | null {
    const index = this.data.achievements.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.data.achievements[index] = { ...this.data.achievements[index], ...updates };
    this.save();
    return this.data.achievements[index];
  }

  public deleteAchievement(id: string): boolean {
    const initialLength = this.data.achievements.length;
    this.data.achievements = this.data.achievements.filter(a => a.id !== id);
    const deleted = this.data.achievements.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  // Blogs CRUD
  public addBlog(blog: Omit<Blog, 'id'>): Blog {
    const newBlog: Blog = {
      ...blog,
      id: `blog-${Date.now()}`,
      views: 0
    };
    this.data.blogs.unshift(newBlog);
    this.save();
    return newBlog;
  }

  public updateBlog(id: string, updates: Partial<Blog>): Blog | null {
    const index = this.data.blogs.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.data.blogs[index] = { ...this.data.blogs[index], ...updates };
    this.save();
    return this.data.blogs[index];
  }

  public deleteBlog(id: string): boolean {
    const initialLength = this.data.blogs.length;
    this.data.blogs = this.data.blogs.filter(b => b.id !== id);
    const deleted = this.data.blogs.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  public incrementBlogViews(id: string) {
    const b = this.data.blogs.find(b => b.id === id);
    if (b) {
      b.views = (b.views || 0) + 1;
      this.data.analytics.blogViews = (this.data.analytics.blogViews || 0) + 1;
      this.save();
    }
  }

  // Messages
  public addMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read' | 'replied'>): ContactMessage {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      replied: false
    };
    this.data.messages.unshift(newMsg);
    this.data.analytics.messageCount = (this.data.analytics.messageCount || 0) + 1;
    this.save();
    return newMsg;
  }

  public markMessageRead(id: string, read: boolean = true): boolean {
    const msg = this.data.messages.find(m => m.id === id);
    if (msg) {
      msg.read = read;
      this.save();
      return true;
    }
    return false;
  }

  public deleteMessage(id: string): boolean {
    const initialLength = this.data.messages.length;
    this.data.messages = this.data.messages.filter(m => m.id !== id);
    const deleted = this.data.messages.length < initialLength;
    if (deleted) this.save();
    return deleted;
  }

  // Analytics
  public recordPageView() {
    this.data.analytics.pageViews = (this.data.analytics.pageViews || 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    const dayEntry = this.data.analytics.dailyViews.find(d => d.date === today);
    if (dayEntry) {
      dayEntry.views += 1;
    } else {
      this.data.analytics.dailyViews.push({ date: today, views: 1 });
      if (this.data.analytics.dailyViews.length > 14) {
        this.data.analytics.dailyViews.shift();
      }
    }
    this.save();
  }

  // Reset/Re-seed
  public resetToDefault() {
    this.data = getInitialData();
    this.save();
    return true;
  }
}

export const db = new Database();
