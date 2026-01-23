/**
 * SEO metadata and site configuration
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */

import type { SEOMetadata } from '../lib/types';

export const siteMetadata: SEOMetadata = {
  title: 'Arnav Tiwari - Software Engineer | React & .NET Developer',
  description: 'Software Engineering student at IIIT Nagpur with expertise in React, .NET MVC, and full-stack development. Currently interning at Hitachi, building safety-critical industrial systems.',
  keywords: [
    'Arnav Tiwari',
    'Software Engineer',
    'React Developer',
    '.NET Developer',
    'Full Stack Developer',
    'IIIT Nagpur',
    'Hitachi Intern',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'Web Development',
    'Frontend Developer',
    'Backend Developer'
  ],
  ogTitle: 'Arnav Tiwari - Software Engineer & Full Stack Developer',
  ogDescription: 'Experienced software engineer specializing in React and .NET MVC development. Building safety-critical systems at Hitachi with proven track record in full-stack development.',
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
  jobTitle: 'Software Engineer',
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
    '.NET MVC',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'MongoDB',
    'Full Stack Development',
    'Web Development',
    'Software Engineering'
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
  role: 'Software Engineer',
  location: 'Nagpur, India',
  university: 'IIIT Nagpur',
  degree: 'Bachelor of Technology in Computer Science',
  graduationYear: '2026',
  email: 'arnav.tiwari@example.com',
  phone: '+91 98765 43210',
  website: 'https://arnavtiwari.dev',
  resumeUrl: '/resume/Arnav_Tiwari_Resume.pdf'
};

export const socialLinks = {
  linkedin: 'https://linkedin.com/in/arnavtiwari',
  github: 'https://github.com/arnavtiwari',
  twitter: 'https://twitter.com/arnavtiwari',
  email: 'mailto:arnav.tiwari@example.com'
};