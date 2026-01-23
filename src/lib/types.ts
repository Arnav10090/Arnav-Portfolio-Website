/**
 * Core TypeScript interfaces for portfolio website data structures
 * Implements comprehensive type definitions with strict typing
 * Requirements: 8.1, 8.4
 */

/**
 * Experience interface for work history and internships
 */
export interface Experience {
  /** Unique identifier for the experience */
  id: string;
  /** Company name */
  company: string;
  /** Optional company website URL */
  companyUrl?: string;
  /** Job role/position title */
  role: string;
  /** Duration of employment (e.g., "June 2024 - June 2025") */
  duration: string;
  /** Work location */
  location: string;
  /** Brief description of the role */
  description: string;
  /** Array of specific achievements with metrics */
  achievements: string[];
  /** Technologies and tools used */
  techStack: string[];
  /** Optional company logo URL */
  logo?: string;
  /** Priority level for display ordering */
  priority: 'high' | 'medium' | 'low';
}

/**
 * Project interface following Problem-Solution-Outcome framework
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  /** Project title */
  title: string;
  /** Brief project description */
  description: string;
  /** Problem statement that the project addresses */
  problem: string;
  /** Solution approach and implementation */
  solution: string;
  /** Measurable outcomes and results */
  outcome: string;
  /** Technologies and tools used */
  techStack: string[];
  /** Optional GitHub repository URL */
  githubUrl?: string;
  /** Optional live demo URL */
  liveUrl?: string;
  /** Optional project image/thumbnail URL */
  imageUrl?: string;
  /** Whether this project should be featured prominently */
  featured: boolean;
}

/**
 * Skill interface with categorization and proficiency levels
 */
export interface Skill {
  /** Skill name */
  name: string;
  /** Skill category for organization */
  category: 'frontend' | 'backend' | 'database' | 'enterprise' | 'cloud' | 'tools' | 'emerging';
  /** Proficiency level */
  proficiency: 'expert' | 'proficient' | 'familiar' | 'learning';
  /** Whether this skill should receive strategic emphasis (.NET MVC, React) */
  strategic: boolean;
}

/**
 * Contact form data interface with validation requirements
 */
export interface ContactFormData {
  /** Sender's full name */
  name: string;
  /** Sender's email address */
  email: string;
  /** Message content */
  message: string;
  /** Honeypot field for bot protection (should remain empty) */
  honeypot?: string;
}

/**
 * Analytics event interface for tracking user interactions
 * Re-exported from analytics.ts for consistency
 */
export interface AnalyticsEvent {
  /** Event name/type */
  name: 'resume_download' | 'contact_submit' | 'project_click' | 'external_link';
  /** Optional event properties */
  properties?: Record<string, string | number>;
}

/**
 * Form validation state interface
 */
export interface FormValidationState {
  /** Whether the form is currently valid */
  isValid: boolean;
  /** Field-specific error messages */
  errors: Partial<Record<keyof ContactFormData, string>>;
  /** Whether the form has been submitted */
  isSubmitted: boolean;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
}

/**
 * API response interface for contact form submissions
 */
export interface ContactFormResponse {
  /** Whether the submission was successful */
  success: boolean;
  /** Response message */
  message: string;
  /** Optional error details */
  error?: string;
}

/**
 * SEO metadata interface for page optimization
 */
export interface SEOMetadata {
  /** Page title */
  title: string;
  /** Meta description */
  description: string;
  /** Keywords for SEO */
  keywords: string[];
  /** Open Graph title */
  ogTitle?: string;
  /** Open Graph description */
  ogDescription?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Canonical URL */
  canonicalUrl?: string;
}

/**
 * Navigation item interface for header/footer links
 */
export interface NavigationItem {
  /** Display label */
  label: string;
  /** Link href or section ID for smooth scrolling */
  href: string;
  /** Whether this is an external link */
  external?: boolean;
  /** Optional icon name */
  icon?: string;
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  /** Primary brand color */
  primaryColor: string;
  /** Secondary accent color */
  secondaryColor: string;
  /** Background color */
  backgroundColor: string;
  /** Text color */
  textColor: string;
  /** Font family */
  fontFamily: string;
}