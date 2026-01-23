/**
 * Property-Based Test: Experience Content Structure and Framework Compliance
 * Feature: portfolio-website, Property 4: Content Structure and Framework Compliance
 * **Validates: Requirements 2.3, 2.4**
 * 
 * Tests that experience content follows proper structure with strategic skill emphasis,
 * achievements contain measurable results, and the Hitachi internship receives primary emphasis.
 */

import { test, expect } from '@playwright/test';
import * as fc from 'fast-check';
import { experiences } from '../src/data/experience';
import { allSkills, strategicSkills } from '../src/data/skills';

// Generate random viewport widths for responsive testing
function generateViewportWidths(count: number): number[] {
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    const width = Math.floor(Math.random() * (1920 - 320 + 1)) + 320;
    widths.push(width);
  }
  return widths;
}

// Calculate appropriate height based on width
function calculateHeight(width: number): number {
  if (width <= 768) return Math.max(600, Math.floor(width * 1.5));
  if (width <= 1024) return Math.max(768, Math.floor(width * 0.75));
  return Math.max(800, Math.floor(width * 0.6));
}

// Property-based test generator for metrics validation
const metricPatternArbitrary = fc.oneof(
  fc.tuple(fc.integer({ min: 1, max: 9999 }), fc.constantFrom('%', 'KB', 'MB', 'GB', 'ms', 's', 'min', 'hours', 'days', 'weeks', 'months', 'years', 'x', 'times', '+')),
  fc.integer({ min: 1, max: 9999 }).map(n => `${n},${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`), // Numbers with commas
  fc.integer({ min: 1, max: 100 }).map(n => `${n}%`), // Percentages
  fc.integer({ min: 1, max: 500 }).map(n => `${n}+ daily`) // Daily metrics
);

test.describe('Property 4: Content Structure and Framework Compliance', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Property: Experience data structure maintains required fields and strategic emphasis', async () => {
    // Validate experience data structure using property-based testing
    await fc.assert(
      fc.property(fc.constantFrom(...experiences), (experience) => {
        // Verify all required fields are present
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
        
        // Verify achievements array structure
        expect(Array.isArray(experience.achievements)).toBe(true);
        expect(experience.achievements.length).toBeGreaterThan(0);
        experience.achievements.forEach(achievement => {
          expect(typeof achievement).toBe('string');
          expect(achievement.length).toBeGreaterThan(0);
        });
        
        // Verify tech stack array structure
        expect(Array.isArray(experience.techStack)).toBe(true);
        expect(experience.techStack.length).toBeGreaterThan(0);
        experience.techStack.forEach(tech => {
          expect(typeof tech).toBe('string');
          expect(tech.length).toBeGreaterThan(0);
        });
        
        // Verify priority field
        expect(['high', 'medium', 'low']).toContain(experience.priority);
        
        return true;
      }),
      { numRuns: 50 }
    );
  });

  test('Property: Strategic skills (.NET MVC, React) receive proper emphasis in experience display', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to experience section
      const experienceSection = page.locator('#experience');
      await experienceSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify strategic skills are present and emphasized
      const strategicSkillNames = strategicSkills.map(skill => skill.name);
      
      for (const skillName of strategicSkillNames) {
        const skillBadges = page.locator(`text="${skillName}"`);
        const skillCount = await skillBadges.count();
        
        if (skillCount > 0) {
          // Check if strategic skills have star indicator
          const strategicBadge = page.locator(`text="${skillName} ★"`);
          const strategicCount = await strategicBadge.count();
          
          // At least some instances should have strategic emphasis
          expect(strategicCount).toBeGreaterThan(0);
          
          // Verify strategic badge styling
          if (strategicCount > 0) {
            const badgeElement = strategicBadge.first();
            const badgeStyles = await badgeElement.evaluate(el => {
              const parentBadge = el.closest('[class*="bg-purple"], [class*="bg-secondary"]');
              if (parentBadge) {
                const styles = getComputedStyle(parentBadge);
                return {
                  backgroundColor: styles.backgroundColor,
                  color: styles.color,
                  borderColor: styles.borderColor
                };
              }
              return null;
            });
            
            // Strategic badges should have distinct styling (purple/secondary colors)
            if (badgeStyles) {
              expect(badgeStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
              expect(badgeStyles.color).not.toBe('rgba(0, 0, 0, 0)');
            }
          }
        }
      }
    }
  });

  test('Property: Achievements contain measurable results with highlighted metrics', async ({ page }) => {
    await fc.assert(
      fc.property(metricPatternArbitrary, async (metricPattern) => {
        // Navigate to experience section
        const experienceSection = page.locator('#experience');
        await experienceSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        
        // Find all achievement text elements
        const achievementElements = page.locator('[class*="achievement"], li:has-text("developed"), li:has-text("implemented"), li:has-text("architected"), li:has-text("integrated")');
        const achievementCount = await achievementElements.count();
        
        if (achievementCount > 0) {
          // Check that achievements contain metrics
          let foundMetrics = false;
          
          for (let i = 0; i < Math.min(achievementCount, 5); i++) {
            const achievement = achievementElements.nth(i);
            const achievementText = await achievement.textContent();
            
            if (achievementText) {
              // Check for various metric patterns
              const metricPatterns = [
                /\d+(?:,\d{3})*(?:\+)?(?:%|KB|MB|GB|TB|ms|s|min|hours?|days?|weeks?|months?|years?|x|times)/,
                /\d+(?:,\d{3})*\+?\s*(?:daily|weekly|monthly|yearly)/i,
                /\d+(?:\.\d+)?%/,
                /\d+(?:,\d{3})*\+/,
                /reduced.*by\s*\d+/i,
                /increased.*by\s*\d+/i,
                /improved.*by\s*\d+/i
              ];
              
              const hasMetrics = metricPatterns.some(pattern => pattern.test(achievementText));
              if (hasMetrics) {
                foundMetrics = true;
                
                // Verify metrics are highlighted (should have blue color styling)
                const metricElements = achievement.locator('span[class*="text-blue"], span[class*="text-primary"]');
                const metricElementCount = await metricElements.count();
                
                if (metricElementCount > 0) {
                  const metricElement = metricElements.first();
                  const metricStyles = await metricElement.evaluate(el => {
                    const styles = getComputedStyle(el);
                    return {
                      color: styles.color,
                      fontWeight: styles.fontWeight
                    };
                  });
                  
                  // Metrics should have blue color and/or bold weight
                  expect(metricStyles.color).not.toBe('rgba(0, 0, 0, 0)');
                  // Font weight should be semibold or bold (600+)
                  const fontWeight = parseInt(metricStyles.fontWeight) || 400;
                  expect(fontWeight).toBeGreaterThanOrEqual(600);
                }
              }
            }
          }
          
          // At least some achievements should contain measurable metrics
          expect(foundMetrics).toBeTruthy();
        }
        
        return true;
      }),
      { numRuns: 10 }
    );
  });

  test('Property: Hitachi internship receives primary visual emphasis', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to experience section
      const experienceSection = page.locator('#experience');
      await experienceSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Find Hitachi experience card
      const hitachiCard = page.locator('[class*="card"], [class*="Card"]').filter({ hasText: 'Hitachi' });
      await expect(hitachiCard).toBeVisible();
      
      // Verify Hitachi card has left border accent (high priority styling)
      const cardStyles = await hitachiCard.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          borderLeftWidth: styles.borderLeftWidth,
          borderLeftColor: styles.borderLeftColor,
          borderLeftStyle: styles.borderLeftStyle
        };
      });
      
      // Should have prominent left border (4px or more)
      const borderWidth = parseFloat(cardStyles.borderLeftWidth);
      expect(borderWidth).toBeGreaterThanOrEqual(4);
      
      // Border should have blue color (primary color)
      expect(cardStyles.borderLeftColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(cardStyles.borderLeftStyle).toBe('solid');
      
      // Verify Hitachi card appears first (highest priority)
      const allExperienceCards = page.locator('[class*="card"], [class*="Card"]').filter({ hasText: /Software|Developer|Engineer/ });
      const firstCard = allExperienceCards.first();
      const firstCardText = await firstCard.textContent();
      
      expect(firstCardText).toContain('Hitachi');
      
      // Verify enhanced hover effects for high priority card
      await hitachiCard.hover();
      await page.waitForTimeout(200);
      
      const hoverStyles = await hitachiCard.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          transform: styles.transform,
          boxShadow: styles.boxShadow
        };
      });
      
      // Should have transform or enhanced shadow on hover
      const hasHoverEffect = 
        hoverStyles.transform !== 'none' || 
        hoverStyles.boxShadow !== 'none';
      
      expect(hasHoverEffect).toBeTruthy();
    }
  });

  test('Property: Experience cards maintain proper hierarchy and structure', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to experience section
      const experienceSection = page.locator('#experience');
      await experienceSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify section heading is present and properly styled
      const sectionHeading = experienceSection.locator('h2').filter({ hasText: /Experience|Professional/ });
      await expect(sectionHeading).toBeVisible();
      
      const headingStyles = await sectionHeading.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          textAlign: styles.textAlign
        };
      });
      
      // Section heading should be large and prominent
      const headingFontSize = parseFloat(headingStyles.fontSize);
      expect(headingFontSize).toBeGreaterThanOrEqual(24); // At least 1.5rem
      expect(headingStyles.textAlign).toBe('center');
      
      // Verify all experience cards have required elements
      const experienceCards = page.locator('[class*="card"], [class*="Card"]').filter({ hasText: /Software|Developer|Engineer/ });
      const cardCount = await experienceCards.count();
      
      expect(cardCount).toBeGreaterThanOrEqual(1); // At least Hitachi experience
      
      for (let i = 0; i < cardCount; i++) {
        const card = experienceCards.nth(i);
        
        // Each card should have company name
        const companyElement = card.locator('h3, [class*="title"], [class*="company"]').first();
        await expect(companyElement).toBeVisible();
        
        // Each card should have role title
        const roleElement = card.locator('text=/Software|Developer|Engineer|Intern/').first();
        await expect(roleElement).toBeVisible();
        
        // Each card should have duration and location
        const durationElement = card.locator('text=/2024|2023|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/').first();
        await expect(durationElement).toBeVisible();
        
        // Each card should have achievements section
        const achievementsSection = card.locator('text=/Achievement|Key|Developed|Implemented|Architected/').first();
        await expect(achievementsSection).toBeVisible();
        
        // Each card should have tech stack section
        const techStackSection = card.locator('text=/Technologies|Tech|Stack/').first();
        await expect(techStackSection).toBeVisible();
        
        // Verify tech stack badges are present
        const techBadges = card.locator('[class*="badge"], [class*="Badge"]');
        const badgeCount = await techBadges.count();
        expect(badgeCount).toBeGreaterThan(0);
      }
    }
  });

  test('Property: Experience section has prominent visual treatment and generous spacing', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to experience section
      const experienceSection = page.locator('#experience');
      await experienceSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify section has prominent background treatment
      const sectionStyles = await experienceSection.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom
        };
      });
      
      // Should have background styling (gradient or solid color)
      const hasBackground = 
        sectionStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
        sectionStyles.backgroundImage !== 'none';
      
      expect(hasBackground).toBeTruthy();
      
      // Verify generous spacing (should be highest priority section)
      const paddingTop = parseFloat(sectionStyles.paddingTop);
      const paddingBottom = parseFloat(sectionStyles.paddingBottom);
      
      if (width >= 768) {
        // Desktop/tablet should have generous padding (96px+ / 6rem+)
        expect(paddingTop).toBeGreaterThanOrEqual(96);
        expect(paddingBottom).toBeGreaterThanOrEqual(96);
      } else {
        // Mobile should have substantial padding (64px+ / 4rem+)
        expect(paddingTop).toBeGreaterThanOrEqual(64);
        expect(paddingBottom).toBeGreaterThanOrEqual(64);
      }
      
      // Verify spacing between experience cards
      const experienceCards = page.locator('[class*="card"], [class*="Card"]').filter({ hasText: /Software|Developer|Engineer/ });
      const cardCount = await experienceCards.count();
      
      if (cardCount > 1) {
        const firstCard = experienceCards.first();
        const secondCard = experienceCards.nth(1);
        
        const firstCardBox = await firstCard.boundingBox();
        const secondCardBox = await secondCard.boundingBox();
        
        if (firstCardBox && secondCardBox) {
          const spacing = secondCardBox.y - (firstCardBox.y + firstCardBox.height);
          
          // Cards should have generous spacing between them
          if (width >= 768) {
            expect(spacing).toBeGreaterThanOrEqual(48); // 3rem+ on desktop
          } else {
            expect(spacing).toBeGreaterThanOrEqual(32); // 2rem+ on mobile
          }
        }
      }
      
      // Verify call-to-action section is present
      const ctaSection = experienceSection.locator('text=/Get in Touch|Download Resume/').first();
      await expect(ctaSection).toBeVisible();
    }
  });

  test('Property: Tech stack badges properly categorize and emphasize strategic skills', async ({ page }) => {
    await fc.assert(
      fc.property(fc.constantFrom(...experiences), async (experience) => {
        // Navigate to experience section
        const experienceSection = page.locator('#experience');
        await experienceSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        
        // Find the specific experience card
        const experienceCard = page.locator('[class*="card"], [class*="Card"]').filter({ hasText: experience.company });
        
        if (await experienceCard.count() > 0) {
          // Verify all tech stack items are displayed as badges
          for (const tech of experience.techStack) {
            const techBadge = experienceCard.locator(`text="${tech}"`);
            const badgeCount = await techBadge.count();
            
            if (badgeCount > 0) {
              // Check if this tech is strategic
              const isStrategic = strategicSkills.some(skill => skill.name === tech);
              
              if (isStrategic) {
                // Strategic skills should have star indicator
                const strategicBadge = experienceCard.locator(`text="${tech} ★"`);
                const strategicCount = await strategicBadge.count();
                expect(strategicCount).toBeGreaterThan(0);
                
                // Strategic badges should have distinct styling
                const badgeElement = strategicBadge.first();
                const badgeParent = badgeElement.locator('xpath=..');
                const badgeStyles = await badgeParent.evaluate(el => {
                  const styles = getComputedStyle(el);
                  return {
                    backgroundColor: styles.backgroundColor,
                    borderColor: styles.borderColor
                  };
                });
                
                // Should have purple/secondary color scheme
                expect(badgeStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
              } else {
                // Non-strategic skills should not have star indicator
                const nonStrategicBadge = experienceCard.locator(`text="${tech} ★"`);
                const nonStrategicCount = await nonStrategicBadge.count();
                expect(nonStrategicCount).toBe(0);
              }
            }
          }
        }
        
        return true;
      }),
      { numRuns: 10 }
    );
  });
});