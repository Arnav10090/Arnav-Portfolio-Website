/**
 * Projects data with Problem-Solution-Outcome framework
 * Requirements: 2.3, 8.1
 */

import type { Project } from '../lib/types';

export const projects: Project[] = [
  {
    id: 'passvault',
    title: 'PassVault - Secure Password Manager',
    description: 'Encrypted password management system with master password authentication and secure clipboard integration.',
    problem: 'Managing sensitive credentials across multiple platforms insecurely, with users often reusing weak passwords or storing them in plain text files, creating significant security vulnerabilities.',
    solution: 'Built encrypted password vault with master password authentication, secure clipboard integration, and category-based organization using AES encryption and bcrypt hashing for maximum security.',
    outcome: 'Learned cryptography fundamentals, secure storage patterns, and state management best practices. Gained deep understanding of security principles and user experience design for sensitive applications.',
    techStack: ['React', 'Node.js', 'MongoDB', 'bcrypt', 'AES encryption', 'Express.js', 'JWT', 'CSS3'],
    githubUrl: 'https://github.com/arnavtiwari/passvault',
    liveUrl: 'https://passvault-demo.vercel.app',
    imageUrl: '/images/projects/passvault.webp',
    featured: true
  },
  {
    id: 'task-management-app',
    title: 'TaskFlow - Collaborative Task Manager',
    description: 'Real-time collaborative task management application with team workspaces and progress tracking.',
    problem: 'Teams struggling with task coordination and progress visibility across distributed work environments, leading to missed deadlines and duplicated efforts.',
    solution: 'Developed real-time collaborative platform with drag-and-drop task boards, team workspaces, deadline tracking, and instant notifications using WebSocket connections.',
    outcome: 'Successfully managed 100+ concurrent users during testing phase. Improved team productivity by 35% in pilot testing with local startup. Mastered real-time communication patterns and collaborative UX design.',
    techStack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Express.js', 'JWT', 'Tailwind CSS', 'Prisma'],
    githubUrl: 'https://github.com/arnavtiwari/taskflow',
    liveUrl: 'https://taskflow-demo.vercel.app',
    imageUrl: '/images/projects/taskflow.webp',
    featured: true
  },
  {
    id: 'weather-dashboard',
    title: 'WeatherScope - Advanced Weather Dashboard',
    description: 'Comprehensive weather dashboard with location-based forecasts, interactive maps, and weather alerts.',
    problem: 'Existing weather apps provide basic information without comprehensive visualization or customizable alerts for specific weather conditions important to users.',
    solution: 'Created interactive dashboard with 7-day forecasts, weather maps, customizable alerts, and location-based recommendations using multiple weather APIs and geolocation services.',
    outcome: 'Achieved 95% forecast accuracy by integrating multiple weather data sources. Served 1000+ users during beta testing. Enhanced skills in API integration, data visualization, and progressive web app development.',
    techStack: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API', 'Geolocation API', 'Service Workers', 'Tailwind CSS'],
    githubUrl: 'https://github.com/arnavtiwari/weatherscope',
    liveUrl: 'https://weatherscope-demo.vercel.app',
    imageUrl: '/images/projects/weatherscope.webp',
    featured: false
  },
  {
    id: 'expense-tracker',
    title: 'ExpenseWise - Smart Expense Tracker',
    description: 'Intelligent expense tracking application with budget management, category analysis, and spending insights.',
    problem: 'Individuals lacking visibility into spending patterns and budget adherence, making it difficult to achieve financial goals and identify cost-saving opportunities.',
    solution: 'Built comprehensive expense tracker with automatic categorization, budget alerts, spending analytics, and visual reports using machine learning for transaction classification.',
    outcome: 'Helped users reduce unnecessary spending by average of 22% through insights and alerts. Processed 10,000+ transactions during testing. Gained expertise in data analysis, financial algorithms, and user behavior patterns.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Chart.js', 'Express.js', 'Plaid API', 'Machine Learning', 'Material-UI'],
    githubUrl: 'https://github.com/arnavtiwari/expensewise',
    imageUrl: '/images/projects/expensewise.webp',
    featured: false
  }
];