/**
 * Projects data with Problem-Solution-Outcome framework
 * Requirements: 2.3, 8.1
 */

import type { Project } from '../lib/types';

export const projects: Project[] = [
  {
    id: 'skillbridge-ai-onboarding',
    title: 'SkillBridge - AI Adaptive Onboarding Engine',
    description: 'An AI-driven platform that compares resumes against job descriptions, identifies precise skill gaps, and generates personalized, dependency-aware learning roadmaps.',
    problem: 'Traditional onboarding is one-size-fits-all, while manually mapping candidate skills to role requirements is slow, inconsistent, and weak at handling partial matches and prerequisite dependencies.',
    solution: 'Built a React + FastAPI system that ingests PDF/DOCX/TXT resumes and job descriptions, uses LLM-assisted skill extraction with alias-based fallback, performs 3-layer gap analysis using exact matching, skill-family mapping, and semantic similarity, and generates prioritized learning paths through a custom WGT scoring engine with interactive DAG visualization.',
    outcome: 'Delivered an end-to-end product with async background analysis, live progress tracking, readiness scoring, reasoning traces, and curated learning recommendations. Grounded the engine in a 71-skill taxonomy, 43 prerequisite links, 58 curated modules, and data-driven weighting derived from 2,484 resumes and 2,277 job descriptions.',
    techStack: [
      'React',
      'Vite',
      'FastAPI',
      'Python',
      'SQLite',
      'Sentence-Transformers',
      'Ollama/OpenAI',
      'React Flow',
      'Docker'
    ],
    featured: true,
    imageUrl: '/images/projects/skillbridge logo.png',
    githubUrl: 'https://github.com/Arnav10090/SkillBridge',
    liveUrl: 'https://drive.google.com/drive/folders/1LjLLtnDewEqzZFRbJHt7Jd9RcFqlIcmZ?usp=sharing'
  },
  {
    id: 'autopilot-ai-project-planner',
    title: 'Autopilot – AI Powered Project Planning Platform',
    description: 'An AI-driven platform that converts high-level ideas into detailed, execution-ready project plans.',
    problem: 'Project planning is time-consuming and error-prone, often lacking structured risk assessment and realistic execution breakdowns.',
    solution: 'Designed a full-stack system using a multi-agent AI architecture with Google Gemini and Groq SDK to analyze requirements, recommend tech stacks, assess risks, and generate task-level plans through RESTful orchestration.',
    outcome: 'Delivered a production-ready system with OAuth authentication, analytics dashboard, multi-format exports, and accessibility support.',
    techStack: [
      'Next.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'PostgreSQL',
      'Google Gemini',
      'Groq SDK',
      'Tailwind CSS'
    ],
    featured: true,
    imageUrl: '/images/projects/autopilot-pic.webp', // Placeholder, assuming images structure
    githubUrl: 'https://github.com/Arnav10090/autopilot-ai', // Placeholder
    liveUrl: 'https://drive.google.com/drive/folders/1-84TLzj0sAQjrpG2JpKtJ6hxSG7RqriY?usp=sharing'
  },
  {
    id: 'ai-content-generator',
    title: 'AI-Powered Content Generation Platform',
    description: 'A scalable SaaS platform for fast, high-quality AI content generation.',
    problem: 'Manual content creation workflows are slow and difficult to scale.',
    solution: 'Built an LLM-powered system using Google Gemini API with secure authentication, subscriptions, and optimized prompts.',
    outcome: 'Enabled 70% faster content generation and supported 10,000+ monthly AI generations.',
    techStack: [
      'Next.js',
      'TypeScript',
      'PostgreSQL',
      'Drizzle ORM',
      'Google Gemini API',
      'Clerk',
      'Razorpay',
      'Tailwind CSS'
    ],
    featured: true,
    imageUrl: '/images/projects/ai-content-pic.webp', // Placeholder
    githubUrl: 'https://github.com/Arnav10090/Ai-content-generator', // Placeholder
    liveUrl: 'https://drive.google.com/drive/folders/1xXE_vjTLvuoxLPGrFpws63ZTJb9taBur?usp=sharing'
  },
  {
    id: 'book-store-platform',
    title: 'BookStore – Personalized Book Collection Platform',
    description: 'A full-stack platform for managing and organizing personal book collections.',
    problem: 'Lack of simple and secure systems for managing personalized digital book collections.',
    solution: 'Developed RESTful APIs with JWT-based authentication and a responsive React frontend.',
    outcome: 'Delivered a modular and secure production-style full-stack application.',
    techStack: [
      'React',
      'Vite',
      'Node.js',
      'Express.js',
      'MongoDB',
      'JWT',
      'Tailwind CSS'
    ],
    featured: false,
    imageUrl: '/images/projects/bookstore-pic.webp', // Placeholder
    githubUrl: 'https://github.com/Arnav10090/BookStoreApp', // Placeholder
    liveUrl: 'https://drive.google.com/drive/folders/1lMtkuTlEySZfb5HmXho0qkMCwin6nDCY?usp=sharing'
  },
  {
    id: 'passvault',
    title: 'PassVault - Secure Passward Storage Platform',
    description: 'A secure, military-grade password manager with zero-knowledge architecture.',
    problem: 'Managing multiple passwords securely across different platforms is complex and risky.',
    solution: 'Developed a robust password manager using MERN stack with AES-256 encryption and zero-knowledge architecture to ensure data privacy.',
    outcome: 'Provided a secure, user-friendly platform for managing passwords with real-time sync and military-grade encryption.',
    techStack: [
      'React',
      'Node.js',
      'MongoDB',
      'Express',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
      'JWT'
    ],
    featured: true,
    imageUrl: '/images/projects/passvault-pic.webp', // Placeholder
    githubUrl: 'https://github.com/Arnav10090/PassVault', // Placeholder
    liveUrl: 'https://drive.google.com/drive/folders/1q4Ku0e4T5S_vgDZxgKne6n0veLylWoyL?usp=sharing'
  }
];