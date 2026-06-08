/**
 * SEO metadata and site configuration
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import type { SEOMetadata } from '../lib/types';

export const siteMetadata: SEOMetadata = {
  title:
    'Arnav Tiwari – Software Engineer | AI Products & Automation Systems',
  description:
    'Software Engineer specializing in building AI-powered products, automation workflows, and scalable web applications. Proven track record of reducing hazardous incidents and accelerating document processing through practical engineering and product-focused thinking.',
  keywords: [
    'Arnav Tiwari',
    'Software Engineer',
    'AI Automation',
    'Product Engineering',
    'Generative AI',
    'Workflow Automation',
    'Full Stack Engineer',
    'Next.js Developer',
    'React Developer',
    'Node.js',
    'AI Systems',
    'LLM Engineering',
    'Multi-Agent Systems',
    'TypeScript',
    'System Design',
    'IIIT Nagpur',
  ],
  ogTitle:
    'Arnav Tiwari – Software Engineer Building AI Products & Automation Systems',
  ogDescription:
    'Software Engineer and SDE Intern at Hitachi India focused on building AI-powered products, automation workflows, and scalable web applications.',
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
  jobTitle: 'Software Engineer',
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
    'System Design',
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
  role: 'Software Engineer Building AI Products and Automation Systems',
  status: 'I build scalable software, AI-powered workflows, and automation systems that solve real operational problems.',
  description:
    'Software Engineer and SDE Intern at Hitachi India focused on building AI-powered products, automation workflows, and scalable web applications. My work has reduced hazardous incidents by 54%, accelerated document processing by 80%, and improved operational efficiency through workflow automation and real-time monitoring systems. I enjoy solving complex business problems through practical engineering, AI systems, and product-focused thinking.',
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
