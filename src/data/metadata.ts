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
  role: 'Backend-focused Software Engineer building production AI systems',
  status: 'I engineer robust backend architectures, multi-agent AI systems, and production-grade automation workflows.',
  description:
    'Backend-focused Software Engineer at Hitachi India building production AI systems, scalable backend architectures, and industrial automation pipelines. My work involves orchestrating complex multi-agent LLM systems, engineering custom vector search algorithms, and developing robust REST APIs. I specialize in backend engineering, systems architecture, and delivering high-performance software that solves real operational problems.',
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
