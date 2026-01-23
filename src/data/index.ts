/**
 * Central export for all portfolio data
 * Provides easy access to all content data with type safety
 */

// Experience data
export { experiences } from './experience';

// Projects data
export { projects } from './projects';

// Skills data
export { 
  skillCategories, 
  allSkills, 
  strategicSkills, 
  skillsByProficiency 
} from './skills';

// Metadata and SEO
export { 
  siteMetadata, 
  personalInfo, 
  socialLinks as metadataSocialLinks 
} from './metadata';

// Contact information
export { 
  contactInfo, 
  socialLinks, 
  navigationItems, 
  resumeDownload 
} from './contact';

// Re-export types for convenience
export type {
  Experience,
  Project,
  Skill,
  ContactFormData,
  AnalyticsEvent,
  FormValidationState,
  ContactFormResponse,
  SEOMetadata,
  NavigationItem,
  ThemeConfig
} from '../lib/types';