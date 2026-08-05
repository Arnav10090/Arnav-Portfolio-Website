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
    description:
      'Worked on industrial-grade software systems for power and manufacturing domains.',
    achievements: [
      'Designed and built an AI-powered Technical Specification generation platform with 30+ configurable document sections, retrieving contextual engineering knowledge and generating standardized industrial documentation.',
      'Engineered Single Line Diagram (SLD) visualization modules enabling real-time monitoring of motors and critical electrical equipment, contributing to plant-wide operational improvements.',
      'Built and deployed five React + Django web applications digitizing electrical and steel equipment analysis workflows, replacing manual spreadsheet-driven processes and improving workflow efficiency by 43%.',
      'Designed and automated a CRS document generation pipeline using n8n, reducing document turnaround from two weeks to two days while enabling delivery of 7–10 project documents every week.',
    ],
    techStack: ['C++', 'Real-Time Systems', 'Industrial Software', 'Agile'],
    logo: '/images/companies/hitachi-logo.png', // Placeholder
    priority: 'high',
  },
  {
    id: 'payatu-2024',
    company: 'Payatu Security Consulting Pvt. Ltd.',
    companyUrl: 'https://payatu.com', // Placeholder
    role: 'Full Stack Developer Intern',
    duration: 'May - Jul 2025',
    location: 'Pune, India',
    description:
      'Built and optimized full-stack applications for security analytics platforms.',
    achievements: [
      'Developed 15 REST APIs and optimized 8 backend endpoints using indexing, query optimization, and caching, improving API response time by 40%.',
      'Built a real-time logging system processing 1,000+ events per minute with RBAC-based audit tracking for a WiFi administration platform managing over 1,000 users.',
      'Developed responsive Next.js + SCSS interfaces, reducing page load time from 3 seconds to 1.5 seconds while improving maintainability.',
    ],
    techStack: ['Next.js', 'Node.js', 'MySQL', 'REST APIs', 'SCSS'],
    logo: '/images/companies/payatu-logo.png', // Placeholder
    priority: 'high',
  },
];
