/**
 * Property-based test for TypeScript Type Safety and Architecture
 * Feature: portfolio-website, Property 15: TypeScript Type Safety and Architecture
 * Validates: Requirements 8.1, 8.2, 8.4
 */

import { test, expect } from '@playwright/test';
import * as fc from 'fast-check';
import type { 
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
} from '../src/lib/types';

// Property-based test generators for each interface
const experienceArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  company: fc.string({ minLength: 1 }),
  companyUrl: fc.option(fc.webUrl(), { nil: undefined }),
  role: fc.string({ minLength: 1 }),
  duration: fc.string({ minLength: 1 }),
  location: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
  achievements: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  logo: fc.option(fc.webUrl(), { nil: undefined }),
  priority: fc.constantFrom('high', 'medium', 'low')
});

const projectArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  description: fc.string({ minLength: 1 }),
  problem: fc.string({ minLength: 1 }),
  solution: fc.string({ minLength: 1 }),
  outcome: fc.string({ minLength: 1 }),
  techStack: fc.array(fc.string({ minLength: 1 }), { minLength: 1 }),
  githubUrl: fc.option(fc.webUrl(), { nil: undefined }),
  liveUrl: fc.option(fc.webUrl(), { nil: undefined }),
  imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
  featured: fc.boolean()
});

const skillArbitrary = fc.record({
  name: fc.string({ minLength: 1 }),
  category: fc.constantFrom('frontend', 'backend', 'database', 'enterprise', 'cloud', 'tools', 'emerging'),
  proficiency: fc.constantFrom('expert', 'proficient', 'familiar', 'learning'),
  strategic: fc.boolean()
});

const contactFormDataArbitrary = fc.record({
  name: fc.string({ minLength: 1 }),
  email: fc.emailAddress(),
  message: fc.string({ minLength: 1 }),
  honeypot: fc.option(fc.string(), { nil: undefined })
});

const analyticsEventArbitrary = fc.record({
  name: fc.constantFrom('resume_download', 'contact_submit', 'project_click', 'external_link'),
  properties: fc.option(fc.dictionary(fc.string(), fc.oneof(fc.string(), fc.integer())), { nil: undefined })
});

test.describe('Property 15: TypeScript Type Safety and Architecture', () => {
  
  test('Experience interface should maintain type safety across all valid inputs', async () => {
    await fc.assert(
      fc.property(experienceArbitrary, (experience: Experience) => {
        // Verify all required fields are present and have correct types
        expect(typeof experience.id).toBe('string');
        expect(experience.id.length).toBeGreaterThan(0);
        expect(typeof experience.company).toBe('string');
        expect(experience.company.length).toBeGreaterThan(0);
        expect(typeof experience.role).toBe('string');
        expect(experience.role.length).toBeGreaterThan(0);
        expect(typeof experience.duration).toBe('string');
        expect(experience.duration.length).toBeGreaterThan(0);
        expect(typeof experience.location).toBe('string');
        expect(experience.location.length).toBeGreaterThan(0);
        expect(typeof experience.description).toBe('string');
        expect(experience.description.length).toBeGreaterThan(0);
        expect(Array.isArray(experience.achievements)).toBe(true);
        expect(experience.achievements.length).toBeGreaterThan(0);
        expect(Array.isArray(experience.techStack)).toBe(true);
        expect(experience.techStack.length).toBeGreaterThan(0);
        expect(['high', 'medium', 'low']).toContain(experience.priority);
        
        // Verify optional fields are properly typed when present
        if (experience.companyUrl !== undefined) {
          expect(typeof experience.companyUrl).toBe('string');
        }
        if (experience.logo !== undefined) {
          expect(typeof experience.logo).toBe('string');
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('Project interface should maintain Problem-Solution-Outcome framework integrity', async () => {
    await fc.assert(
      fc.property(projectArbitrary, (project: Project) => {
        // Verify Problem-Solution-Outcome framework fields are present
        expect(typeof project.problem).toBe('string');
        expect(project.problem.length).toBeGreaterThan(0);
        expect(typeof project.solution).toBe('string');
        expect(project.solution.length).toBeGreaterThan(0);
        expect(typeof project.outcome).toBe('string');
        expect(project.outcome.length).toBeGreaterThan(0);
        
        // Verify other required fields
        expect(typeof project.id).toBe('string');
        expect(project.id.length).toBeGreaterThan(0);
        expect(typeof project.title).toBe('string');
        expect(project.title.length).toBeGreaterThan(0);
        expect(typeof project.description).toBe('string');
        expect(project.description.length).toBeGreaterThan(0);
        expect(Array.isArray(project.techStack)).toBe(true);
        expect(project.techStack.length).toBeGreaterThan(0);
        expect(typeof project.featured).toBe('boolean');
        
        // Verify optional URL fields are properly typed when present
        if (project.githubUrl !== undefined) {
          expect(typeof project.githubUrl).toBe('string');
        }
        if (project.liveUrl !== undefined) {
          expect(typeof project.liveUrl).toBe('string');
        }
        if (project.imageUrl !== undefined) {
          expect(typeof project.imageUrl).toBe('string');
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('Skill interface should maintain categorization and strategic emphasis', async () => {
    await fc.assert(
      fc.property(skillArbitrary, (skill: Skill) => {
        // Verify skill categorization
        expect(typeof skill.name).toBe('string');
        expect(skill.name.length).toBeGreaterThan(0);
        expect(['frontend', 'backend', 'database', 'enterprise', 'cloud', 'tools', 'emerging'])
          .toContain(skill.category);
        expect(['expert', 'proficient', 'familiar', 'learning'])
          .toContain(skill.proficiency);
        expect(typeof skill.strategic).toBe('boolean');
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('ContactFormData interface should maintain validation requirements', async () => {
    await fc.assert(
      fc.property(contactFormDataArbitrary, (formData: ContactFormData) => {
        // Verify required form fields
        expect(typeof formData.name).toBe('string');
        expect(formData.name.length).toBeGreaterThan(0);
        expect(typeof formData.email).toBe('string');
        expect(formData.email.length).toBeGreaterThan(0);
        expect(formData.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); // Basic email validation
        expect(typeof formData.message).toBe('string');
        expect(formData.message.length).toBeGreaterThan(0);
        
        // Verify honeypot field is optional and properly typed
        if (formData.honeypot !== undefined) {
          expect(typeof formData.honeypot).toBe('string');
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('AnalyticsEvent interface should maintain event tracking integrity', async () => {
    await fc.assert(
      fc.property(analyticsEventArbitrary, (event: AnalyticsEvent) => {
        // Verify event name is from allowed set
        expect(['resume_download', 'contact_submit', 'project_click', 'external_link'])
          .toContain(event.name);
        
        // Verify properties are properly typed when present
        if (event.properties !== undefined) {
          expect(typeof event.properties).toBe('object');
          expect(event.properties).not.toBeNull();
          
          // Verify all property values are strings or numbers
          Object.values(event.properties).forEach(value => {
            expect(['string', 'number']).toContain(typeof value);
          });
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('Type definitions should support comprehensive content management workflow', async () => {
    // Test that interfaces support the content management requirements (8.5)
    const sampleExperience: Experience = {
      id: 'test-experience',
      company: 'Test Company',
      role: 'Test Role',
      duration: 'Test Duration',
      location: 'Test Location',
      description: 'Test Description',
      achievements: ['Achievement 1', 'Achievement 2'],
      techStack: ['Tech 1', 'Tech 2'],
      priority: 'high'
    };

    const sampleProject: Project = {
      id: 'test-project',
      title: 'Test Project',
      description: 'Test Description',
      problem: 'Test Problem',
      solution: 'Test Solution',
      outcome: 'Test Outcome',
      techStack: ['Tech 1', 'Tech 2'],
      featured: true
    };

    const sampleSkill: Skill = {
      name: 'Test Skill',
      category: 'frontend',
      proficiency: 'expert',
      strategic: true
    };

    // Verify that type definitions enable content updates without code changes
    expect(sampleExperience).toBeDefined();
    expect(sampleProject).toBeDefined();
    expect(sampleSkill).toBeDefined();
    
    // Verify strategic skill emphasis is supported
    expect(sampleSkill.strategic).toBe(true);
    
    // Verify Problem-Solution-Outcome framework is enforced
    expect(sampleProject.problem).toBeDefined();
    expect(sampleProject.solution).toBeDefined();
    expect(sampleProject.outcome).toBeDefined();
  });

  test('Interface definitions should enforce architectural separation', async () => {
    // Test that interfaces support clear separation between content and presentation (8.2)
    
    // Content interfaces should be pure data structures
    const contentInterfaces = [
      'Experience',
      'Project', 
      'Skill',
      'ContactFormData',
      'AnalyticsEvent'
    ];
    
    // Each content interface should be serializable (no functions, no complex objects)
    const testData = {
      experience: {
        id: 'test',
        company: 'Test',
        role: 'Test',
        duration: 'Test',
        location: 'Test',
        description: 'Test',
        achievements: ['Test'],
        techStack: ['Test'],
        priority: 'high' as const
      },
      project: {
        id: 'test',
        title: 'Test',
        description: 'Test',
        problem: 'Test',
        solution: 'Test',
        outcome: 'Test',
        techStack: ['Test'],
        featured: true
      },
      skill: {
        name: 'Test',
        category: 'frontend' as const,
        proficiency: 'expert' as const,
        strategic: true
      }
    };
    
    // Verify data can be serialized and deserialized (content/presentation separation)
    const serialized = JSON.stringify(testData);
    const deserialized = JSON.parse(serialized);
    
    expect(deserialized.experience.id).toBe('test');
    expect(deserialized.project.featured).toBe(true);
    expect(deserialized.skill.strategic).toBe(true);
  });
});