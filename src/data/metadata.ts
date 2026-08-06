/**
 * SEO metadata and site configuration
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import type { SEOMetadata } from '../lib/types';

export const siteMetadata: SEOMetadata = {
  title:
    'Arnav Tiwari – Backend-focused Software Engineer | Production AI Systems',
  description:
    'Backend-focused Software Engineer specializing in building production AI systems, scalable architectures, and automation workflows.',
  keywords: [
    'Arnav Tiwari',
    'Backend Engineer',
    'Software Engineer',
    'AI Engineering',
    'Production AI Systems',
    'Workflow Automation',
    'Node.js',
    'FastAPI',
    'LLM Engineering',
    'Multi-Agent Systems',
    'TypeScript',
    'System Architecture',
    'System Design',
    'IIIT Nagpur',
  ],
  ogTitle:
    'Arnav Tiwari – Backend-focused Software Engineer Building Production AI Systems',
  ogDescription:
    'Backend-focused Software Engineer building production AI systems, scalable backend architectures, and enterprise automation workflows.',
  ogImage: '/images/og-image.jpg',
  canonicalUrl: 'https://arnavtiwari.dev',
};

/**
 * Structured data (JSON-LD) for person schema
 * Requirements: 7.3
 */
export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Arnav Tiwari',
  url: 'https://arnavtiwari.dev',
  image: 'https://arnavtiwari.dev/images/og-image.jpg',
  jobTitle: 'Backend-focused Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Hitachi',
    url: 'https://www.hitachi.com',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Indian Institute of Information Technology Nagpur',
    url: 'https://iiitn.ac.in',
  },
  knowsAbout: [
    'FastAPI',
    'Node.js',
    'TypeScript',
    'AI Systems Engineering',
    'LLM Orchestration',
    'Multi-Agent Systems',
    'Vector Databases',
    'FAISS',
    'scikit-learn',
    'spaCy',
    'PostgreSQL',
    'Backend Development',
    'System Architecture',
  ],
  sameAs: [
    'https://linkedin.com/in/arnavtiwari',
    'https://github.com/arnavtiwari',
    'https://twitter.com/arnavtiwari',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nagpur',
    addressCountry: 'IN',
  },
};

export const personalInfo = {
  name: 'Arnav Tiwari',
  role: 'Software Engineer building AI-powered Full-Stack Systems',
  status: 'I build AI-powered full-stack applications, scalable backend systems, and production-ready software that transforms complex ideas into reliable products.',
  description:
    "I'm a Software Engineer passionate about building AI-powered applications that solve real engineering problems. My experience spans full-stack development, backend architecture, and intelligent software systems.\n\nAt Hitachi India Pvt. Ltd., I contributed to industrial software by developing React and Django applications, AI-assisted engineering tools, and workflow automation solutions. Beyond industry, I've built production-ready AI platforms—including multi-agent systems, adaptive onboarding engines, and SaaS applications—taking products from architecture to deployment with a strong focus on scalability, reliability, and user experience.",
  location: 'Nagpur, India',
  university: 'Indian Institute of Information Technology Nagpur',
  degree: 'B.Tech in Computer Science Engineering',
  graduationYear: '2026',
  email: 'arnavt292@gmail.com',
  phone: '+91 83298 46328',
  website: 'https://arnavtiwari.dev',
  resumeUrl: '/resume/Arnav_Tiwari_Resume.pdf',
};

export const socialLinks = {
  linkedin: 'https://linkedin.com/in/arnavtiwari',
  github: 'https://github.com/arnavtiwari',
  twitter: 'https://twitter.com/arnavtiwari',
  email: 'mailto:arnavt292@gmail.com',
};
