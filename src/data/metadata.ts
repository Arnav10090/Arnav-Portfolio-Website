/**
 * SEO metadata and site configuration
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import type { SEOMetadata } from '../lib/types';

export const siteMetadata: SEOMetadata = {
  title: 'Arnav Tiwari – Full Stack Engineer & AI Builder | Full Stack, AI Systems',
  description: 'Final Year Computer Science Engineering student at IIIT Nagpur. Delivered 54% reduction in hazardous incidents and 80% faster document workflows at Hitachi India. Skilled in multi-agent LLM orchestration, ML pipelines (FAISS, scikit-learn, spaCy), RESTful API design, and React/Next.js frontends backed by PostgreSQL and MongoDB.',
  keywords: [
    'Arnav Tiwari',
    'Software Engineer',
    'Full Stack Engineer & AI Builder',
    'Full Stack Developer',
    'Next.js Developer',
    'React Developer',
    'Node.js',
    'AI Applications',
    'AI Systems',
    'LLM Engineering',
    'Multi-Agent Systems',
    'FAISS',
    'scikit-learn',
    'spaCy',
    'PostgreSQL',
    'MongoDB',
    'TypeScript',
    'IIIT Nagpur',
    'India'
  ],
  ogTitle: 'Arnav Tiwari – Full Stack Engineer, AI Builder & CS Student at IIIT Nagpur',
  ogDescription: 'Full Stack Engineer & AI Builder with measurable impact: 54% reduction in hazardous incidents, 80% faster workflows. Specializing in multi-agent LLM systems, ML pipelines, and production-ready full stack applications.',
  ogImage: '/images/og-image.jpg',
  canonicalUrl: 'https://arnavtiwari.dev'
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
  jobTitle: 'Full Stack Engineer & AI Builder',
  worksFor: {
    '@type': 'Organization',
    name: 'Hitachi',
    url: 'https://www.hitachi.com'
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Indian Institute of Information Technology Nagpur',
    url: 'https://iiitn.ac.in'
  },
  knowsAbout: [
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'AI Systems',
    'LLM Engineering',
    'Multi-Agent Systems',
    'FAISS',
    'scikit-learn',
    'spaCy',
    'PostgreSQL',
    'Full Stack Development',
    'System Design'
  ],
  sameAs: [
    'https://linkedin.com/in/arnavtiwari',
    'https://github.com/arnavtiwari',
    'https://twitter.com/arnavtiwari'
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nagpur',
    addressCountry: 'IN'
  }
};

export const personalInfo = {
  name: 'Arnav Tiwari',
  role: 'Full Stack Engineer, AI Builder & CS Student at IIIT Nagpur',
  status: '✦ Open to Full-Time Software Engineering Roles',
  description: 'Full Stack Engineer, AI Builder & Final Year CS Student at IIIT Nagpur. Delivered 54% reduction in hazardous incidents and 80% faster document workflows at Hitachi India and Payatu Security. Skilled in building AI-powered web applications using React/Next.js, Node.js, multi-agent LLM orchestration, and PostgreSQL/MongoDB.',
  location: 'Nagpur, India',
  university: 'Indian Institute of Information Technology Nagpur',
  degree: 'B.Tech in Computer Science Engineering',
  graduationYear: '2026',
  email: 'arnavt292@gmail.com',
  phone: '+91 83298 46328',
  website: 'https://arnavtiwari.dev',
  resumeUrl: '/resume/Arnav_Tiwari_Resume.pdf'
};

export const socialLinks = {
  linkedin: 'https://linkedin.com/in/arnavtiwari',
  github: 'https://github.com/arnavtiwari',
  twitter: 'https://twitter.com/arnavtiwari',
  email: 'mailto:arnavt292@gmail.com'
};