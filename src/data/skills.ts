/**
 * Skills data with categorized skills and strategic emphasis
 * Requirements: 2.4, 8.1
 */

import type { Skill } from '../lib/types';

export const skillCategories: Record<string, Skill[]> = {
  frontend: [
    { name: 'React', category: 'frontend', proficiency: 'expert', strategic: true },
    { name: 'Next.js', category: 'frontend', proficiency: 'proficient', strategic: false },
    { name: 'TypeScript', category: 'frontend', proficiency: 'proficient', strategic: false },
    { name: 'JavaScript', category: 'frontend', proficiency: 'expert', strategic: false },
    { name: 'HTML5', category: 'frontend', proficiency: 'expert', strategic: false },
    { name: 'CSS3', category: 'frontend', proficiency: 'expert', strategic: false },
    { name: 'Tailwind CSS', category: 'frontend', proficiency: 'proficient', strategic: false },
    { name: 'Bootstrap', category: 'frontend', proficiency: 'proficient', strategic: false },
    { name: 'Material-UI', category: 'frontend', proficiency: 'familiar', strategic: false },
    { name: 'Responsive Design', category: 'frontend', proficiency: 'expert', strategic: false }
  ],
  backend: [
    { name: 'Node.js', category: 'backend', proficiency: 'expert', strategic: false },
    { name: 'Express.js', category: 'backend', proficiency: 'proficient', strategic: false },
    { name: 'REST APIs', category: 'backend', proficiency: 'expert', strategic: false },
    { name: 'GraphQL', category: 'backend', proficiency: 'familiar', strategic: false },
    { name: 'Socket.io', category: 'backend', proficiency: 'proficient', strategic: false },
    { name: 'JWT Authentication', category: 'backend', proficiency: 'proficient', strategic: false },
    { name: 'API Design', category: 'backend', proficiency: 'proficient', strategic: false }
  ],
  enterprise: [
    { name: '.NET MVC', category: 'enterprise', proficiency: 'expert', strategic: true },
    { name: 'C#', category: 'enterprise', proficiency: 'proficient', strategic: false },
    { name: 'ASP.NET Core', category: 'enterprise', proficiency: 'proficient', strategic: false },
    { name: 'Entity Framework', category: 'enterprise', proficiency: 'familiar', strategic: false },
    { name: 'Windows Services', category: 'enterprise', proficiency: 'familiar', strategic: false }
  ],
  database: [
    { name: 'MongoDB', category: 'database', proficiency: 'expert', strategic: false },
    { name: 'SQL Server', category: 'database', proficiency: 'proficient', strategic: false },
    { name: 'PostgreSQL', category: 'database', proficiency: 'proficient', strategic: false },
    { name: 'Prisma ORM', category: 'database', proficiency: 'familiar', strategic: false },
    { name: 'Database Design', category: 'database', proficiency: 'proficient', strategic: false },
    { name: 'Query Optimization', category: 'database', proficiency: 'familiar', strategic: false }
  ],
  cloud: [
    { name: 'Vercel', category: 'cloud', proficiency: 'proficient', strategic: false },
    { name: 'Netlify', category: 'cloud', proficiency: 'proficient', strategic: false },
    { name: 'AWS Basics', category: 'cloud', proficiency: 'familiar', strategic: false },
    { name: 'Heroku', category: 'cloud', proficiency: 'familiar', strategic: false },
    { name: 'Firebase', category: 'cloud', proficiency: 'familiar', strategic: false }
  ],
  tools: [
    { name: 'Git & GitHub', category: 'tools', proficiency: 'expert', strategic: false },
    { name: 'VS Code', category: 'tools', proficiency: 'expert', strategic: false },
    { name: 'Postman', category: 'tools', proficiency: 'proficient', strategic: false },
    { name: 'npm/yarn', category: 'tools', proficiency: 'proficient', strategic: false },
    { name: 'Webpack', category: 'tools', proficiency: 'familiar', strategic: false },
    { name: 'ESLint/Prettier', category: 'tools', proficiency: 'proficient', strategic: false },
    { name: 'Chrome DevTools', category: 'tools', proficiency: 'proficient', strategic: false }
  ],
  emerging: [
    { name: 'Docker', category: 'emerging', proficiency: 'learning', strategic: false },
    { name: 'Kubernetes', category: 'emerging', proficiency: 'learning', strategic: false },
    { name: 'Machine Learning', category: 'emerging', proficiency: 'learning', strategic: false },
    { name: 'Python', category: 'emerging', proficiency: 'familiar', strategic: false },
    { name: 'Rust', category: 'emerging', proficiency: 'learning', strategic: false },
    { name: 'WebAssembly', category: 'emerging', proficiency: 'learning', strategic: false }
  ]
};

// Flattened skills array for easy iteration
export const allSkills: Skill[] = Object.values(skillCategories).flat();

// Strategic skills for emphasis (React and .NET MVC)
export const strategicSkills: Skill[] = allSkills.filter(skill => skill.strategic);

// Skills by proficiency level
export const skillsByProficiency = {
  expert: allSkills.filter(skill => skill.proficiency === 'expert'),
  proficient: allSkills.filter(skill => skill.proficiency === 'proficient'),
  familiar: allSkills.filter(skill => skill.proficiency === 'familiar'),
  learning: allSkills.filter(skill => skill.proficiency === 'learning')
};