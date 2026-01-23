/**
 * Experience data with Hitachi internship details and achievements
 * Requirements: 2.2, 2.3, 2.4, 8.1
 */

import type { Experience } from '../lib/types';

export const experiences: Experience[] = [
  {
    id: 'hitachi-2024',
    company: 'Hitachi',
    companyUrl: 'https://www.hitachi.com',
    role: 'Software Engineering Intern',
    duration: 'June 2024 - June 2025',
    location: 'Nagpur, India',
    description: 'Built and maintained safety-critical industrial permit and work clearance systems used across manufacturing facilities.',
    achievements: [
      'Developed Permit & Work Clearance System handling 500+ daily permit requests across multiple industrial sites with real-time approval workflows and compliance tracking',
      'Architected TTMS, RCTMS, PTMS, and ICQIS dashboards using React and .NET MVC, reducing manual audit time by 40%',
      'Implemented role-based access control and comprehensive audit trails for safety-critical operations, ensuring 100% compliance with industrial safety standards',
      'Integrated MongoDB for document management and REST APIs for cross-system communication, improving data retrieval speed by 60%'
    ],
    techStack: ['React', 'Node.js', 'MongoDB', '.NET MVC', 'REST APIs', 'SQL Server', 'C#', 'JavaScript', 'TypeScript'],
    logo: '/images/companies/hitachi-logo.png',
    priority: 'high'
  },
  {
    id: 'freelance-2023',
    company: 'Freelance Developer',
    role: 'Full Stack Developer',
    duration: 'January 2023 - May 2024',
    location: 'Remote',
    description: 'Developed custom web applications and provided technical consulting for small businesses and startups.',
    achievements: [
      'Built 5+ responsive web applications using React, Node.js, and MongoDB for local businesses',
      'Implemented e-commerce solutions with payment gateway integration, increasing client revenue by 30%',
      'Provided technical consulting and code reviews for startup teams',
      'Maintained 98% client satisfaction rate with on-time project delivery'
    ],
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'],
    priority: 'medium'
  }
];