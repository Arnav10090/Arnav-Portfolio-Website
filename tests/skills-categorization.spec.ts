/**
 * Property-Based Test: Skills Categorization and Strategic Emphasis
 * Feature: portfolio-website, Property 4: Content Structure and Framework Compliance
 * **Validates: Requirements 2.4**
 * 
 * Tests that skills are properly organized into categories with visual separation,
 * strategic skills (.NET MVC, React) receive proper emphasis with star indicators,
 * and proficiency indicators are correctly displayed through badge styling.
 */

import { test, expect } from '@playwright/test';
import * as fc from 'fast-check';
import { skillCategories, allSkills, strategicSkills } from '../src/data/skills';
import type { Skill } from '../src/lib/types';

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

// Expected category information
const expectedCategories = [
  'frontend', 'backend', 'enterprise', 'database', 'cloud', 'tools', 'emerging'
];

const categoryDisplayNames = {
  frontend: 'Frontend Development',
  backend: 'Backend Development', 
  enterprise: 'Enterprise Technologies',
  database: 'Database & Data Management',
  cloud: 'Cloud & Deployment',
  tools: 'Development Tools',
  emerging: 'Emerging Technologies'
};

test.describe('Property 4: Content Structure and Framework Compliance - Skills', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Property: Skills data structure maintains required fields and categorization', async () => {
    // Validate skills data structure using property-based testing
    await fc.assert(
      fc.property(fc.constantFrom(...allSkills), (skill) => {
        // Verify all required fields are present
        expect(typeof skill.name).toBe('string');
        expect(skill.name.length).toBeGreaterThan(0);
        
        // Verify category is valid
        expect(expectedCategories).toContain(skill.category);
        
        // Verify proficiency is valid
        expect(['expert', 'proficient', 'familiar', 'learning']).toContain(skill.proficiency);
        
        // Verify strategic is boolean
        expect(typeof skill.strategic).toBe('boolean');
        
        return true;
      }),
      { numRuns: 50 }
    );
  });

  test('Property: All skill categories are properly organized with visual separation', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to skills section
      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify skills section is visible
      await expect(skillsSection).toBeVisible();
      
      // Verify section heading is present and properly styled
      const sectionHeading = skillsSection.locator('h2').filter({ hasText: /Skills|Technical/ });
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
      
      // Verify all expected categories are present
      for (const categoryKey of expectedCategories) {
        const categoryTitle = categoryDisplayNames[categoryKey as keyof typeof categoryDisplayNames];
        const categoryHeading = skillsSection.locator('h3').filter({ hasText: categoryTitle });
        await expect(categoryHeading).toBeVisible();
        
        // Verify category has description
        const categoryDescription = skillsSection.locator(`text=${categoryTitle}`).locator('xpath=following-sibling::p').first();
        await expect(categoryDescription).toBeVisible();
        
        // Verify category has skills
        const categorySection = categoryHeading.locator('xpath=../..'); // Go up to category container
        const skillBadges = categorySection.locator('[class*="badge"], [class*="Badge"]');
        const badgeCount = await skillBadges.count();
        expect(badgeCount).toBeGreaterThan(0);
      }
      
      // Verify visual separation between categories
      const categoryHeadings = skillsSection.locator('h3');
      const categoryCount = await categoryHeadings.count();
      expect(categoryCount).toBe(expectedCategories.length);
      
      // Check spacing between categories
      if (categoryCount > 1) {
        for (let i = 0; i < categoryCount - 1; i++) {
          const currentCategory = categoryHeadings.nth(i);
          const nextCategory = categoryHeadings.nth(i + 1);
          
          const currentBox = await currentCategory.boundingBox();
          const nextBox = await nextCategory.boundingBox();
          
          if (currentBox && nextBox) {
            const spacing = nextBox.y - (currentBox.y + currentBox.height);
            // Categories should have generous spacing between them
            expect(spacing).toBeGreaterThanOrEqual(48); // At least 3rem
          }
        }
      }
    }
  });

  test('Property: Strategic skills (.NET MVC, React) receive proper emphasis with star indicators', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to skills section
      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify strategic skills are present and emphasized
      const strategicSkillNames = strategicSkills.map(skill => skill.name);
      
      for (const skillName of strategicSkillNames) {
        // Check for star indicator
        const strategicBadge = skillsSection.locator(`text="${skillName} ★"`);
        const strategicCount = await strategicBadge.count();
        expect(strategicCount).toBeGreaterThan(0);
        
        // Verify strategic badge styling
        const badgeElement = strategicBadge.first();
        const badgeParent = badgeElement.locator('xpath=..');
        const badgeStyles = await badgeParent.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            color: styles.color,
            borderColor: styles.borderColor
          };
        });
        
        // Strategic badges should have distinct styling (purple/secondary colors)
        expect(badgeStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        expect(badgeStyles.color).not.toBe('rgba(0, 0, 0, 0)');
        
        // Should have purple/secondary color scheme (not gray)
        const bgColor = badgeStyles.backgroundColor;
        const isGrayish = bgColor.includes('128') || bgColor.includes('156') || bgColor.includes('107');
        expect(isGrayish).toBeFalsy(); // Should not be gray
      }
      
      // Verify non-strategic skills do NOT have star indicators
      const nonStrategicSkills = allSkills.filter(skill => !skill.strategic);
      const sampleNonStrategic = nonStrategicSkills.slice(0, 5); // Test a sample
      
      for (const skill of sampleNonStrategic) {
        const nonStrategicBadge = skillsSection.locator(`text="${skill.name} ★"`);
        const nonStrategicCount = await nonStrategicBadge.count();
        expect(nonStrategicCount).toBe(0);
      }
      
      // Verify strategic skills highlight section is present
      const strategicHighlight = skillsSection.locator('text=/Strategic Focus/');
      await expect(strategicHighlight).toBeVisible();
      
      // Verify strategic skills are highlighted in the focus section
      const focusSection = skillsSection.locator('[class*="gradient"]').filter({ hasText: /Strategic Focus/ });
      await expect(focusSection).toBeVisible();
      
      for (const skillName of strategicSkillNames) {
        const focusBadge = focusSection.locator(`text="${skillName} ★"`);
        await expect(focusBadge).toBeVisible();
      }
    }
  });

  test('Property: Proficiency indicators are correctly displayed through badge styling', async ({ page }) => {
    // Navigate to skills section first
    const skillsSection = page.locator('#skills');
    await skillsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Test each category individually
    for (const [categoryKey, skills] of Object.entries(skillCategories)) {
      // Find the specific category section
      const categoryTitle = categoryDisplayNames[categoryKey as keyof typeof categoryDisplayNames];
      const categoryHeading = skillsSection.locator('h3').filter({ hasText: categoryTitle });
      const categorySection = categoryHeading.locator('xpath=../..'); // Go up to category container
      
      // Test a sample of skills from this category
      const sampleSkills = skills.slice(0, Math.min(3, skills.length));
      
      for (const skill of sampleSkills) {
        const skillBadge = categorySection.locator(`text="${skill.name}"`).first();
        const badgeCount = await skillBadge.count();
        
        if (badgeCount > 0) {
          // Verify proficiency indicator is present
          const proficiencyIndicators = {
            'expert': '●●●',
            'proficient': '●●○',
            'familiar': '●○○',
            'learning': '○○○'
          };
          
          const expectedIndicator = proficiencyIndicators[skill.proficiency];
          const indicatorElement = categorySection.locator(`text="${expectedIndicator}"`);
          const indicatorCount = await indicatorElement.count();
          
          // Should have proficiency indicator
          expect(indicatorCount).toBeGreaterThan(0);
          
          // Verify badge variant based on proficiency and strategic status
          const badgeParent = skillBadge.locator('xpath=..');
          const badgeStyles = await badgeParent.evaluate(el => {
            const styles = getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              opacity: styles.opacity
            };
          });
          
          if (skill.proficiency === 'learning') {
            // Learning skills should have subtle styling (lower opacity or lighter colors)
            const opacity = parseFloat(badgeStyles.opacity);
            const isSubtle = opacity < 1.0 || badgeStyles.backgroundColor.includes('249'); // Very light gray
            expect(isSubtle).toBeTruthy();
          }
          
          if (skill.strategic) {
            // Strategic skills should have prominent styling
            expect(badgeStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
            const isGrayish = badgeStyles.backgroundColor.includes('156') || badgeStyles.backgroundColor.includes('107');
            expect(isGrayish).toBeFalsy(); // Should not be standard gray
          }
        }
      }
    }
  });

  test('Property: Skills grid layout adapts responsively to content and viewport', async ({ page }) => {
    const viewportWidths = generateViewportWidths(5);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to skills section
      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Test each category's grid layout
      for (const categoryKey of expectedCategories.slice(0, 3)) { // Test first 3 categories for speed
        const categoryTitle = categoryDisplayNames[categoryKey as keyof typeof categoryDisplayNames];
        const categoryHeading = skillsSection.locator('h3').filter({ hasText: categoryTitle });
        const categorySection = categoryHeading.locator('xpath=../..'); // Go up to category container
        
        // Find the skills grid within this category
        const skillsGrid = categorySection.locator('[class*="grid"]').first();
        await expect(skillsGrid).toBeVisible();
        
        // Verify grid has appropriate number of columns based on viewport
        const skillBadges = skillsGrid.locator('[class*="badge"], [class*="Badge"]');
        const badgeCount = await skillBadges.count();
        
        if (badgeCount >= 2) {
          // Get positions of first few badges to determine grid layout
          const firstBadge = skillBadges.first();
          const secondBadge = skillBadges.nth(1);
          
          const firstBox = await firstBadge.boundingBox();
          const secondBox = await secondBadge.boundingBox();
          
          if (firstBox && secondBox) {
            const isOnSameLine = Math.abs(firstBox.y - secondBox.y) < 10;
            
            if (width >= 1280) {
              // XL screens: should have 6 columns (badges on same line)
              expect(isOnSameLine).toBeTruthy();
            } else if (width >= 1024) {
              // Large screens: should have 5 columns
              expect(isOnSameLine).toBeTruthy();
            } else if (width >= 768) {
              // Medium screens: should have 4 columns
              expect(isOnSameLine).toBeTruthy();
            } else if (width >= 640) {
              // Small screens: should have 3 columns
              expect(isOnSameLine).toBeTruthy();
            } else {
              // Extra small screens: should have 2 columns
              expect(isOnSameLine).toBeTruthy();
            }
            
            // Verify badges have consistent sizing
            expect(Math.abs(firstBox.height - secondBox.height)).toBeLessThan(5);
          }
        }
        
        // Verify badges are properly sized for touch interaction
        for (let i = 0; i < Math.min(badgeCount, 3); i++) {
          const badge = skillBadges.nth(i);
          const badgeBox = await badge.boundingBox();
          
          if (badgeBox) {
            // Badges should be large enough for easy interaction
            expect(badgeBox.height).toBeGreaterThanOrEqual(32); // Minimum touch target
            expect(badgeBox.width).toBeGreaterThanOrEqual(60); // Reasonable minimum width
          }
        }
      }
    }
  });

  test('Property: Skills section maintains proper visual hierarchy and accessibility', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to skills section
      const skillsSection = page.locator('#skills');
      await skillsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify heading hierarchy (H2 for section, H3 for categories)
      const h2Elements = skillsSection.locator('h2');
      const h2Count = await h2Elements.count();
      expect(h2Count).toBe(1); // Should have exactly one H2 (section heading)
      
      const h3Elements = skillsSection.locator('h3');
      const h3Count = await h3Elements.count();
      expect(h3Count).toBe(expectedCategories.length); // One H3 per category
      
      // Verify section has proper background and spacing
      const sectionStyles = await skillsSection.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom
        };
      });
      
      // Should have white background (different from other sections)
      expect(sectionStyles.backgroundColor).toBe('rgb(255, 255, 255)');
      
      // Verify generous spacing
      const paddingTop = parseFloat(sectionStyles.paddingTop);
      const paddingBottom = parseFloat(sectionStyles.paddingBottom);
      
      if (width >= 768) {
        expect(paddingTop).toBeGreaterThanOrEqual(96); // 6rem+ on desktop
        expect(paddingBottom).toBeGreaterThanOrEqual(96);
      } else {
        expect(paddingTop).toBeGreaterThanOrEqual(64); // 4rem+ on mobile
        expect(paddingBottom).toBeGreaterThanOrEqual(64);
      }
      
      // Test accessibility features
      // Verify badges have proper titles/tooltips
      const sampleBadges = skillsSection.locator('[class*="badge"], [class*="Badge"]').first();
      const badgeTitle = await sampleBadges.getAttribute('title');
      expect(badgeTitle).toBeTruthy(); // Should have descriptive title
      expect(badgeTitle).toContain('level'); // Should describe proficiency level
      
      // Verify proficiency indicators have proper ARIA labels
      const proficiencyIndicator = skillsSection.locator('[aria-label*="Proficiency"]').first();
      const indicatorCount = await proficiencyIndicator.count();
      if (indicatorCount > 0) {
        const ariaLabel = await proficiencyIndicator.getAttribute('aria-label');
        expect(ariaLabel).toContain('Proficiency');
      }
      
      // Verify call-to-action section is present and accessible
      const ctaSection = skillsSection.locator('text=/Ready to put these skills/');
      await expect(ctaSection).toBeVisible();
      
      const ctaButtons = skillsSection.locator('a[href="#projects"], a[href="#contact"]');
      const ctaButtonCount = await ctaButtons.count();
      expect(ctaButtonCount).toBeGreaterThanOrEqual(2); // Should have project and contact CTAs
      
      // Verify CTA buttons are properly sized and accessible
      for (let i = 0; i < ctaButtonCount; i++) {
        const button = ctaButtons.nth(i);
        const buttonBox = await button.boundingBox();
        
        if (buttonBox) {
          expect(buttonBox.height).toBeGreaterThanOrEqual(44); // Minimum touch target
        }
        
        // Should have descriptive text
        const buttonText = await button.textContent();
        expect(buttonText?.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('Property: Skills categorization follows expected data structure', async () => {
    // Verify all expected categories exist in data
    for (const expectedCategory of expectedCategories) {
      expect(skillCategories).toHaveProperty(expectedCategory);
      expect(Array.isArray(skillCategories[expectedCategory])).toBeTruthy();
      expect(skillCategories[expectedCategory].length).toBeGreaterThan(0);
    }
    
    // Verify strategic skills are properly distributed
    const strategicSkillsInData = allSkills.filter(skill => skill.strategic);
    expect(strategicSkillsInData.length).toBeGreaterThanOrEqual(2); // At least React and .NET MVC
    
    // Verify React and .NET MVC are marked as strategic
    const reactSkill = allSkills.find(skill => skill.name === 'React');
    const dotnetSkill = allSkills.find(skill => skill.name === '.NET MVC');
    
    expect(reactSkill).toBeTruthy();
    expect(reactSkill?.strategic).toBeTruthy();
    expect(dotnetSkill).toBeTruthy();
    expect(dotnetSkill?.strategic).toBeTruthy();
    
    // Verify proficiency levels are distributed appropriately
    const proficiencyDistribution = {
      expert: allSkills.filter(skill => skill.proficiency === 'expert').length,
      proficient: allSkills.filter(skill => skill.proficiency === 'proficient').length,
      familiar: allSkills.filter(skill => skill.proficiency === 'familiar').length,
      learning: allSkills.filter(skill => skill.proficiency === 'learning').length
    };
    
    // Should have skills at multiple proficiency levels
    expect(proficiencyDistribution.expert).toBeGreaterThan(0);
    expect(proficiencyDistribution.proficient).toBeGreaterThan(0);
    
    // Verify category distribution is reasonable
    for (const [categoryKey, skills] of Object.entries(skillCategories)) {
      expect(skills.length).toBeGreaterThan(0);
      expect(skills.length).toBeLessThan(20); // Reasonable upper limit per category
      
      // All skills in category should have correct category field
      skills.forEach(skill => {
        expect(skill.category).toBe(categoryKey);
      });
    }
  });
});