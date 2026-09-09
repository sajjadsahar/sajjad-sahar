import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

function buildResume() {
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'Sajjad_Sahar_Resume.pdf');
  const cvPath = path.join(publicDir, 'cv.pdf');

  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 36, bottom: 36, left: 40, right: 40 },
    info: {
      Title: 'Sajjad Sahar - Resume / Curriculum Vitae',
      Author: 'Sajjad Sahar',
      Subject: 'Software Engineering & AI Developer Resume',
      Keywords: 'Sajjad Sahar, Full-Stack, MERN, React, Node.js, AI, Cisco, Google, Anthropic',
    }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  // Palette
  const PRIMARY = '#0284c7'; // Vibrant Cyan / Sky
  const DARK = '#0f172a'; // Deep Slate
  const BODY = '#334155'; // Slate 700
  const MUTED = '#64748b'; // Slate 500
  const ACCENT = '#0891b2'; // Cyan 600
  const LINE = '#cbd5e1'; // Slate 300

  // Header
  doc.fontSize(22).fillColor(DARK).font('Helvetica-Bold').text('SAJJAD SAHAR', { characterSpacing: 1 });
  doc.fontSize(11).fillColor(PRIMARY).font('Helvetica-Bold').text('FULL-STACK SOFTWARE ENGINEER & AI SYSTEMS DEVELOPER');
  doc.moveDown(0.2);

  doc.fontSize(9).fillColor(BODY).font('Helvetica').text(
    'Islamabad, Pakistan  •  Phone: +92 348 5039425  •  Email: 65441@students.riphah.edu.pk  •  GitHub: github.com/sajjadsahar'
  );
  doc.fontSize(9).fillColor(BODY).font('Helvetica').text(
    'LinkedIn: linkedin.com/in/sajjadsahar  •  Portfolio: https://ais-dev-6qhskcefaoljoyn355yhqq-375452645443.asia-southeast1.run.app'
  );
  doc.moveDown(0.4);

  // Divider
  doc.strokeColor(LINE).lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
  doc.moveDown(0.6);

  // Helper function for section titles
  function sectionHeader(title) {
    doc.fontSize(11).fillColor(DARK).font('Helvetica-Bold').text(title.toUpperCase(), { characterSpacing: 1 });
    doc.moveDown(0.1);
    doc.strokeColor(ACCENT).lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.4);
  }

  // Section: Summary
  sectionHeader('Professional Summary');
  doc.fontSize(9.5).fillColor(BODY).font('Helvetica').text(
    'High-achieving Software Engineering student at Riphah International University with an exceptional 3.98/4.0 CGPA (Top 1% of department, Dean’s Honor List). Proven expertise across modern web architecture with the MERN stack (React, Node.js, Express, MongoDB, TypeScript) alongside core systems engineering in Java (OOP) and C++ (DSA). Multiple industry-certified in Artificial Intelligence and Generative AI by Cisco, Google, Google Cloud, and Anthropic. Dedicated to engineering robust, scalable, and human-centered software systems.',
    { lineGap: 2 }
  );
  doc.moveDown(0.6);

  // Section: Education
  sectionHeader('Education & Academic Merit');
  doc.fontSize(10).fillColor(DARK).font('Helvetica-Bold').text('Bachelor of Science in Software Engineering (BS SE)');
  doc.fontSize(9).fillColor(PRIMARY).font('Helvetica-Bold').text('Riphah International University, Islamabad  |  Expected 2026');
  doc.fontSize(9).fillColor(BODY).font('Helvetica').text(
    'Cumulative GPA: 3.98 / 4.0  (5th Semester)  •  Awarded Dean’s Honor List for Academic Distinction'
  );
  doc.fontSize(8.5).fillColor(MUTED).font('Helvetica').text(
    'Relevant Coursework: Advanced Data Structures & Algorithms, Object-Oriented Software Design (Java/C++), Database Systems (SQL/NoSQL), Operating Systems, Software Testing & Quality Assurance, Artificial Intelligence.'
  );
  doc.moveDown(0.6);

  // Section: Technical Skills
  sectionHeader('Technical Skills & Proficiencies');
  const skills = [
    { cat: 'Full-Stack Web', items: 'React 19, TypeScript, JavaScript (ES6+), Node.js, Express.js, RESTful APIs, HTML5, CSS3, Tailwind CSS' },
    { cat: 'Systems & Languages', items: 'Java (OOP, SOLID Principles, Design Patterns), C++ (Pointers, Memory Management, STL), Python, SQL' },
    { cat: 'Databases & Storage', items: 'MongoDB (Mongoose), PostgreSQL, MySQL, Relational Database Modeling, Normalization' },
    { cat: 'AI & Machine Learning', items: 'Google Gemini 2.5 API, Google AI Studio, Anthropic Claude Models, Prompt Engineering, NLP, Data Analysis' },
    { cat: 'Tools & DevOps', items: 'Git, GitHub, Docker, Postman, Linux/Unix, Vite, npm, Authentication (JWT, Bcrypt), Cloud Deployment' }
  ];

  skills.forEach(s => {
    doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold').text(`${s.cat}: `, { continued: true });
    doc.font('Helvetica').fillColor(BODY).text(s.items);
  });
  doc.moveDown(0.6);

  // Section: Verified Industry Certifications
  sectionHeader('Verified Industry Certifications');
  const certs = [
    { title: 'Data Science Essentials With Python', org: 'Cisco', id: 'a11287f8-e69f-44d0-ba21-c48b171da1f3', date: 'July 2026' },
    { title: 'Develop AI-Powered Prototypes in Google AI Studio', org: 'Google', id: '25558633', date: 'July 2026' },
    { title: 'Create Your First Gemini Enterprise Application', org: 'Google Cloud', id: 'a5151d34-4d06-40f7-aa5d-4114141267b5', date: 'July 2026' },
    { title: 'Introduction to Modern AI', org: 'Cisco', id: '373e9741-348b-4d58-b015-b71ef6e2125b', date: 'June 2026' },
    { title: 'Certificate of Completion: AI Fluency for Students', org: 'Anthropic', id: '2uxkfhf8ooze', date: 'June 2026' },
    { title: 'Certificate of Completion: Full-Stack MERN Development', org: 'Apna College', id: '69a9928fae16f2c65303b794', date: 'April 2026' }
  ];

  certs.forEach(c => {
    doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold').text(`•  ${c.title}`, { continued: true });
    doc.font('Helvetica').fillColor(MUTED).text(` — ${c.org}  |  Credential ID: ${c.id}  (${c.date})`);
  });
  doc.moveDown(0.6);

  // Section: Featured Projects
  sectionHeader('Featured Engineering Projects');
  
  const projects = [
    {
      title: 'AI Prompt Studio & Generative Workspace',
      tech: 'React 19, TypeScript, Express, Google GenAI SDK, Tailwind CSS',
      desc: 'Engineered an interactive developer sandbox for exploring Google Gemini multimodal models. Features real-time parameter tuning (temperature, top-p, system instructions), automated token tracking, prompt templates, and streaming responses with markdown formatting.'
    },
    {
      title: 'Wanderlust — Full-Stack Travel Marketplace',
      tech: 'Node.js, Express, MongoDB, Mongoose, EJS/React, Cloudinary, Mapbox',
      desc: 'Architected a production-ready rental booking application with MVC architecture, session authentication, cookie management, reviews/ratings engine, geolocation geocoding with Mapbox, and responsive modern layout.'
    },
    {
      title: 'Police Station Management & Automated FIR System',
      tech: 'Java (OOP), JavaFX / Swing, Relational Database (SQL), JDBC',
      desc: 'Developed an enterprise desktop information system applying OOP principles (Inheritance, Polymorphism, Encapsulation). Includes digitized First Information Report (FIR) logging, case status dispatch, and role-based officer permissions.'
    },
    {
      title: 'High-Performance Data Structures & Algorithms Suite',
      tech: 'C++, Standard Template Library (STL), Custom Memory Allocators',
      desc: 'Implemented self-balancing AVL trees, Red-Black trees, graph traversal algorithms (Dijkstra, BFS, DFS), and cache-conscious data structures with automated benchmarking against standard libraries.'
    }
  ];

  projects.forEach(p => {
    doc.fontSize(9.5).fillColor(DARK).font('Helvetica-Bold').text(p.title, { continued: true });
    doc.font('Helvetica').fillColor(PRIMARY).text(`  [${p.tech}]`);
    doc.fontSize(8.5).fillColor(BODY).font('Helvetica').text(p.desc, { lineGap: 1.5 });
    doc.moveDown(0.3);
  });
  doc.moveDown(0.4);

  // Section: Honors & Achievements
  sectionHeader('Honors & Extracurricular Leadership');
  doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold').text('•  Dean’s Honor List: ', { continued: true });
  doc.font('Helvetica').fillColor(BODY).text('Recognized for highest academic standing across all 5 completed university semesters (CGPA 3.98).');
  doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold').text('•  Academic Peer Mentor: ', { continued: true });
  doc.font('Helvetica').fillColor(BODY).text('Mentored 40+ junior software engineering students in Object-Oriented Programming and Data Structures.');
  doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold').text('•  Active Problem Solver: ', { continued: true });
  doc.font('Helvetica').fillColor(BODY).text('Practiced 200+ algorithmic problems across LeetCode, Codeforces, and HackerRank with high runtime efficiency.');

  doc.end();

  writeStream.on('finish', () => {
    // Also copy to cv.pdf
    fs.copyFileSync(outputPath, cvPath);
    console.log('Successfully generated Sajjad_Sahar_Resume.pdf and cv.pdf');
  });
}

buildResume();
