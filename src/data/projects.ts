/**
 * Projects data with Problem-Solution-Outcome framework
 * Requirements: 2.3, 8.1
 */

import type { Project } from '../lib/types';

export const projects: Project[] = [
  {
    id: 'skillbridge-ai-onboarding',
    title: 'SkillBridge - AI Adaptive Onboarding Engine',
    description:
      'An AI-driven platform that compares resumes against job descriptions, identifies precise skill gaps, and generates personalized, dependency-aware learning roadmaps.',
    problem:
      'Traditional onboarding is one-size-fits-all, while manually mapping candidate skills to role requirements is slow, inconsistent, and weak at handling partial matches and prerequisite dependencies.',
    solution:
      'Built a React + FastAPI system that ingests PDF/DOCX/TXT resumes and job descriptions, uses LLM-assisted skill extraction with alias-based fallback, performs 3-layer gap analysis using exact matching, skill-family mapping, and semantic similarity, and generates prioritized learning paths through a custom WGT scoring engine with interactive DAG visualization.',
    outcome:
      'Delivered an end-to-end product with async background analysis, live progress tracking, readiness scoring, reasoning traces, and curated learning recommendations. Grounded the engine in a 71-skill taxonomy, 43 prerequisite links, 58 curated modules, and data-driven weighting derived from 2,484 resumes and 2,277 job descriptions.',
    techStack: [
      'React',
      'Vite',
      'FastAPI',
      'Python',
      'SQLite',
      'Sentence-Transformers',
      'Ollama/OpenAI',
      'React Flow',
      'Docker',
    ],
    featured: true,
    imageUrl: '/images/projects/skillbridge logo.png',
    githubUrl: 'https://github.com/Arnav10090/SkillBridge',
    liveUrl: 'https://skill-bridge-red-six.vercel.app/',
  },
  {
    id: 'autopilot-ai-project-planner',
    title: 'Autopilot — AI-Powered Project Planning Platform',
    description:
      'Autopilot converts high-level ideas into execution-ready project plans.',
    problem:
      'Project planning is time-consuming, inconsistent, and often misses hidden dependencies and risks, causing delays and scope creep.',
    solution:
      'Autopilot converts high-level ideas into execution-ready project plans. It ingests requirements (text, briefs, or user interviews), extracts objectives, and decomposes them into milestones, tasks, and deliverables. The platform builds a dependency graph, estimates effort and duration, and runs automated risk analysis to flag technical, resourcing, and timeline risks with mitigation suggestions. Multi-agent orchestration allows iterative refinement and stakeholder-facing exports (CSV, JSON, task manager integrations).',
    outcome:
      'Deliver clear, prioritized roadmaps and task lists that reduce planning time, improve predictability, and create actionable handoffs for engineering and PM teams.',
    techStack: [
      'Next.js frontend',
      'TypeScript',
      'Node/Express APIs',
      'PostgreSQL',
      'Groq/LLM orchestration',
      'OAuth integrations',
    ],
    featured: true,
    imageUrl: '/images/projects/autopilot-pic.webp',
    githubUrl: 'https://github.com/Arnav10090/autopilot-ai',
    liveUrl: 'https://autopilot-ai-six.vercel.app/',
  },
  {
    id: 'ai-content-generator',
    title: 'AI‑Powered Content Generation Platform',
    description:
      'A secure, multi-tenant content generation service driven by LLMs with prompt templates, editorial controls, and generation pipelines.',
    problem:
      'Creating consistent, high-volume content is slow, expensive, and difficult to scale while maintaining brand voice and quality.',
    solution:
      'A secure, multi-tenant content generation service driven by LLMs with prompt templates, editorial controls, and generation pipelines. Users create templates for article types, product descriptions, or social posts; the system fills templates with structured inputs, applies brand/style constraints, and runs automated quality checks (readability, SEO, profanity/consistency filters). Editorial review workflows, versioning, and scheduled publishing make the output production-ready. Analytics track content performance to iteratively improve prompts and templates.',
    outcome:
      'Up to 70% faster content production, consistent brand voice across channels, and the ability to scale to thousands of monthly generations with governance and analytics.',
    techStack: [
      'Next.js/React frontend',
      'TypeScript',
      'serverless LLM calls',
      'secure API keys/subscriptions',
      'scheduler',
      'CMS/analytics integrations',
    ],
    featured: true,
    imageUrl: '/images/projects/ai-content-pic.webp',
    githubUrl: 'https://github.com/Arnav10090/Ai-content-generator',
    liveUrl: 'https://ai-content-generator-3reg.vercel.app/',
  },
  {
    id: 'book-store-platform',
    title: 'BookStore — Personalized Book Collection Platform',
    description:
      'BookStore provides a responsive web app and RESTful APIs for managing personal libraries.',
    problem:
      'Readers lack a simple, private, and flexible tool to catalog, organize, and discover books with rich metadata and cross-device sync.',
    solution:
      'BookStore provides a responsive web app and RESTful APIs for managing personal libraries: add/import books, organize shelves and tags, rate and review, and discover recommendations. JWT-based auth secures accounts; backend enriches metadata (covers, descriptions, author info) and supports search/filtering and CSV/JSON import-export. Optional social features allow sharing curated lists while keeping private data protected.',
    outcome:
      'A polished experience for building and maintaining personal libraries, discovering new reads, and keeping collections portable and private.',
    techStack: [
      'React',
      'Vite',
      'Node.js',
      'Express.js',
      'MongoDB',
      'JWT',
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
    title: 'PassVault — Secure Password Storage Platform',
    description:
      'PassVault is a zero‑knowledge, client-encrypted password manager.',
    problem:
      'Managing many credentials securely is difficult; many solutions trade off usability or keep servers capable of decrypting user data.',
    solution:
      'PassVault is a zero‑knowledge, client-encrypted password manager. All encryption and key derivation happen client-side; the server stores only encrypted blobs and metadata. Features include secure sync across devices, encrypted backups, password generation, strength scoring, secure sharing with ephemeral access, MFA support, and audit logs. Recovery flows are designed to preserve zero-knowledge guarantees (recoverable keys via user-held hints or hardware tokens).',
    outcome:
      'Military-grade security with simple daily usability—secure cross-device sync, safe sharing, and enterprise-ready auditability without exposing plaintext credentials to the server.',
    techStack: [
      'React UI',
      'Node backend for encrypted storage & sync',
      'end-to-end encryption libraries',
      'WebCrypto/hardware token support',
    ],
    featured: true,
    imageUrl: '/images/projects/passvault-pic.webp',
    githubUrl: 'https://github.com/Arnav10090/PassVault',
    liveUrl:
      'https://drive.google.com/drive/folders/1q4Ku0e4T5S_vgDZxgKne6n0veLylWoyL?usp=sharing',
  },
];
