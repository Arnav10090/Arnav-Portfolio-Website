/**
 * Projects data with Problem-Solution-Outcome framework
 * Requirements: 2.3, 8.1
 */

import type { Project } from '../lib/types';

export const projects: Project[] = [
  {
    id: 'skillbridge-ai-onboarding',
    title: 'SkillBridge – AI Adaptive Onboarding Engine',
    description:
      'AI-powered onboarding platform that analyzes candidate resumes against job descriptions, identifies multidimensional skill gaps, and generates deterministic, prerequisite-aware personalized learning roadmaps.',
    problem:
      'Traditional onboarding relies on manual assessments and keyword matching, making it difficult to accurately identify transferable skills, prerequisite dependencies, and personalized learning paths for candidates transitioning into new roles.',
    solution:
      "Architected a FastAPI backend implementing a 6-stage asynchronous processing pipeline with a 3-layer skill matching algorithm (Exact Match, Skill Family Mapping, and custom 384-dimensional semantic hashing). Designed a custom Weighted Graph Traversal (WGT) algorithm with Kahn's Topological Sort to generate deterministic prerequisite-aware learning pathways across a structured skill taxonomy.",
    outcome:
      'Processed 2,484 resumes and 2,277 job descriptions to enrich a 71-skill taxonomy, generating deterministic learning pathways across a curated 58-module catalog using 5 REST APIs and an interactive DAG visualization.',
    techStack: [
      'FastAPI',
      'React',
      'Python',
      'SQLite',
      'Docker',
      'Custom WGT Algorithm',
      "Kahn's Topological Sort",
      'Semantic Matching',
      'React Flow',
      'SQLAlchemy',
    ],
    featured: true,
    imageUrl: '/images/projects/skillbridge logo.png',
    githubUrl: 'https://github.com/Arnav10090/SkillBridge',
    liveUrl: 'https://skill-bridge-red-six.vercel.app/',
  },
  {
    id: 'autopilot-ai-project-planner',
    title: 'Autopilot – AI Powered Project Planning Platform',
    description:
      'Multi-agent AI platform that transforms high-level software requirements into structured, execution-ready project plans using coordinated AI agents and backend orchestration.',
    problem:
      'Planning complex software projects manually requires significant effort to decompose requirements, select technologies, assess risks, and organize implementation tasks. Generic LLMs often produce inconsistent outputs that cannot be directly executed.',
    solution:
      'Engineered a backend orchestration platform coordinating 4 specialized AI agents through a unified Express.js REST API. Implemented structured JSON validation, PostgreSQL persistence, OAuth authentication, and sequential AI execution to automate requirement analysis, technology selection, task planning, and risk assessment.',
    outcome:
      'Orchestrated 4 AI agents, engineered 16 REST APIs, generated structured execution plans containing 35–50 engineering tasks across 6 planning modules, and supported multi-format export to PDF, DOCX, CSV, JSON, and Markdown.',
    techStack: [
      'Next.js',
      'Express.js',
      'Node.js',
      'PostgreSQL',
      'Groq API',
      'OAuth 2.0',
      'Passport.js',
      'Ajv',
      'Multi-Agent AI',
      'Project Planning',
    ],
    featured: true,
    imageUrl: '/images/projects/autopilot-pic.webp',
    githubUrl: 'https://github.com/Arnav10090/autopilot-ai',
    liveUrl: 'https://autopilot-ai-six.vercel.app/',
  },
  {
    id: 'ai-content-generator',
    title: 'ContentForge AI – Production AI SaaS Platform',
    description:
      'Production-ready AI SaaS platform featuring authenticated content generation, subscription billing, persistent generation history, and specialized AI workflows powered by Llama 3.1.',
    problem:
      'Most AI content generation tools provide basic prompting but lack production SaaS capabilities such as authentication, billing, persistent storage, and centralized management of generated content.',
    solution:
      'Architected a scalable serverless Next.js application using Neon PostgreSQL and Drizzle ORM with secure Clerk authentication, Groq-powered AI generation, Server Actions, and Razorpay subscription billing. Engineered reusable prompt pipelines supporting 18 specialized AI templates with persistent history and credit-based usage management.',
    outcome:
      'Built 18 AI generation templates, engineered 7 REST API endpoints, designed relational PostgreSQL persistence for subscriptions and generation history, and implemented a dynamic credit allocation system supporting 10,000 initial credits per user.',
    techStack: [
      'Next.js',
      'TypeScript',
      'PostgreSQL',
      'Drizzle ORM',
      'Neon',
      'Clerk',
      'Razorpay',
      'Groq API',
      'Server Actions',
      'AI SaaS',
    ],
    featured: true,
    imageUrl: '/images/projects/ai-content-pic.webp',
    githubUrl: 'https://github.com/Arnav10090/ContentForge-AI',
    liveUrl: 'https://contentforgeapp.vercel.app/',
  },
  {
    id: 'book-store-platform',
    title: 'BookStore Management Platform',
    description:
      'Production-ready MERN application for secure book inventory management featuring stateless authentication, automated asset handling, and a decoupled frontend-backend architecture.',
    problem:
      'Managing digital book inventories requires secure authentication, scalable media handling, and synchronized application state. Traditional tightly coupled architectures complicate independent deployment, while unmanaged file uploads often lead to orphaned assets and inconsistent data.',
    solution:
      'Engineered a decoupled MERN architecture using React and Express, implementing a RESTful MVC backend, stateless JWT authentication with bcrypt password hashing, and automated token management through Axios interceptors. Designed a multipart file processing pipeline with Multer and custom file lifecycle management to automatically remove orphaned assets while maintaining synchronized global state using React Context.',
    outcome:
      'Built 8 REST API endpoints, designed 3 MongoDB schemas, developed 17 modular React components, and implemented an automated authentication pipeline with 12-round bcrypt hashing and stateless JWT authorization.',
    techStack: [
      'Node.js',
      'Express.js',
      'React',
      'MongoDB',
      'JWT',
      'Mongoose',
      'Multer',
      'Axios',
      'React Context',
      'Tailwind CSS',
    ],
    featured: false,
    imageUrl: '/images/projects/bookstore-pic.webp',
    githubUrl: 'https://github.com/Arnav10090/BookStoreApp',
    liveUrl:
      'https://drive.google.com/drive/folders/1lMtkuTlEySZfb5HmXho0qkMCwin6nDCY?usp=sharing',
  },
  {
    id: 'passvault',
    title: 'PassVault',
    description:
      'Zero-knowledge password manager built with the MERN stack, implementing client-side AES-256 encryption, secure authentication, and privacy-first credential storage.',
    problem:
      'Managing credentials across multiple platforms increases security risks, while many password managers require users to trust centralized services with sensitive information. A secure solution should ensure encrypted storage without exposing plaintext credentials to the server.',
    solution:
      'Architected a secure MERN application implementing a zero-knowledge encryption pipeline using AES-256 encryption before database persistence. Built stateless JWT authentication with bcrypt password hashing, secured REST APIs using Helmet and express-validator, and implemented protected routing with React Context for secure session management.',
    outcome:
      'Engineered 8 REST API endpoints, designed 2 MongoDB schemas, developed 13 reusable React components, and implemented end-to-end AES-256 encryption with stateless JWT authentication for secure credential management.',
    techStack: [
      'React',
      'Node.js',
      'Express.js',
      'MongoDB',
      'JWT',
      'CryptoJS',
      'Helmet',
      'Express Validator',
      'Framer Motion',
      'React Context',
    ],
    featured: true,
    imageUrl: '/images/projects/passvault-pic.webp',
    githubUrl: 'https://github.com/Arnav10090/PassVault',
    liveUrl:
      'https://drive.google.com/drive/folders/1q4Ku0e4T5S_vgDZxgKne6n0veLylWoyL?usp=sharing',
  },
];
