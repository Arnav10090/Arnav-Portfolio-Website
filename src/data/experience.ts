/**
 * Experience data with Hitachi internship details and achievements
 * Requirements: 2.2, 2.3, 2.4, 8.1
 */

import type { Experience } from '../lib/types';

export const experiences: Experience[] = [
  {
    id: 'hitachi-2024',
    company: 'Hitachi India Pvt Ltd',
    companyUrl: 'https://www.hitachi.com',
    role: 'Software Developer Intern',
    duration: 'Jul 2025 - Present',
    location: 'Nagpur, India',
    description: 'Worked on industrial-grade software systems for power and manufacturing domains.',
    achievements: [
      'Engineered SLD visualization modules for steel plant electrical layouts, enabling real-time anomaly detection of motors — contributing to a 33% reduction in motor failures and 54% reduction in hazardous incidents.',
      'Ported Hitachi applications to IntervalZero RTX64 RTOS, eliminating Windows OS dependency and enabling deterministic scheduling — improving system efficiency by 43% and reducing task allocation time by 76%.',
      'Built React + Django interfaces for 5 HICADS systems (DPS, RCTMS, PTMS, TTMS, ICQIS), digitalizing manual equipment pipelines and reducing operator time by 57%.',
      'Automated CRS document generation pipeline using n8n, cutting turnaround from 2 weeks to 2 days (80% faster) — enabling delivery of 7-10 project documents weekly that previously took a month.'
    ],
    techStack: [
      'C++',
      'Real-Time Systems',
      'Industrial Software',
      'Agile'
    ],
    logo: '/images/companies/hitachi-logo.png', // Placeholder
    priority: 'high'
  },
  {
    id: 'payatu-2024',
    company: 'Payatu Security Consulting Pvt. Ltd.',
    companyUrl: 'https://payatu.com', // Placeholder
    role: 'Full Stack Developer Intern',
    duration: 'May - Jul 2025',
    location: 'Pune, India',
    description: 'Built and optimized full-stack applications for security analytics platforms.',
    achievements: [
      'Built responsive Next.js + SCSS interfaces, reducing page load time from 3s → 1.5s (50% faster) and improving UI maintainability.',
      'Developed 15 REST API endpoints and optimized 8 via indexing, query optimization, and caching on a MySQL-backed Node.js backend — improving response time by 40%.',
      'Built a real-time logger handling 1,000+ log events/minute for a 4-role RBAC WiFi admin dashboard managing 1,000+ users.',
      'Contributed to production-level code with 90% test coverage, following agile development practices.'
    ],
    techStack: [
      'Next.js',
      'Node.js',
      'MySQL',
      'REST APIs',
      'SCSS'
    ],
    logo: '/images/companies/payatu-logo.png', // Placeholder
    priority: 'high'
  }
];