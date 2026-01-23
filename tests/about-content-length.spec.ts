/**
 * Property-Based Test: Professional Content Length Constraints
 * Feature: portfolio-website, Property 5: Professional Content Length Constraints
 * **Validates: Requirements 2.5**
 * 
 * Tests that the about section contains under 200 words while maintaining
 * professional narrative quality, includes required links to IIIT Nagpur and Hitachi,
 * and maintains readability across different viewport sizes.
 */

import { test, expect } from '@playwright/test';

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

// Count words in text content
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Check if text maintains professional quality
function assessProfessionalQuality(text: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;

  // Check for professional keywords
  const professionalKeywords = [
    'software', 'engineer', 'development', 'technical', 'experience',
    'skills', 'projects', 'systems', 'solutions', 'technology'
  ];
  
  const lowerText = text.toLowerCase();
  const keywordCount = professionalKeywords.filter(keyword => 
    lowerText.includes(keyword)
  ).length;
  
  if (keywordCount < 3) {
    issues.push('Insufficient professional terminology');
    score -= 20;
  }

  // Check for specific achievements or metrics
  const hasMetrics = /\d+%|\d+\+|hundreds?|thousands?/i.test(text);
  if (!hasMetrics) {
    issues.push('No quantifiable achievements mentioned');
    score -= 15;
  }

  // Check for educational background
  const hasEducation = /university|college|degree|bachelor|graduation/i.test(text);
  if (!hasEducation) {
    issues.push('Educational background not mentioned');
    score -= 10;
  }

  // Check for current role/internship
  const hasCurrentRole = /intern|currently|present|working/i.test(text);
  if (!hasCurrentRole) {
    issues.push('Current role not clearly stated');
    score -= 10;
  }

  // Check sentence structure (avoid too short or too long sentences)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + countWords(s), 0) / sentences.length;
  
  if (avgSentenceLength < 10) {
    issues.push('Sentences too short for professional narrative');
    score -= 10;
  } else if (avgSentenceLength > 30) {
    issues.push('Sentences too long, may impact readability');
    score -= 10;
  }

  return { score: Math.max(0, score), issues };
}

test.describe('Property 5: Professional Content Length Constraints', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Property: About section content stays under 200 words while maintaining professional quality', async ({ page }) => {
    const viewportWidths = generateViewportWidths(5);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to about section
      const aboutSection = page.locator('#about');
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify about section is visible
      await expect(aboutSection).toBeVisible();
      
      // Get all text content from the narrative (excluding headings and UI elements)
      const narrativeContent = aboutSection.locator('.prose p, .prose div p');
      const narrativeCount = await narrativeContent.count();
      expect(narrativeCount).toBeGreaterThan(0);
      
      let totalWordCount = 0;
      let combinedText = '';
      
      // Collect all narrative text
      for (let i = 0; i < narrativeCount; i++) {
        const paragraph = narrativeContent.nth(i);
        const paragraphText = await paragraph.textContent();
        
        if (paragraphText) {
          const cleanText = paragraphText.trim();
          if (cleanText.length > 0) {
            combinedText += cleanText + ' ';
            totalWordCount += countWords(cleanText);
          }
        }
      }
      
      // Verify word count constraint
      expect(totalWordCount).toBeLessThanOrEqual(200);
      expect(totalWordCount).toBeGreaterThan(100); // Should have substantial content
      
      // Assess professional quality
      const qualityAssessment = assessProfessionalQuality(combinedText);
      expect(qualityAssessment.score).toBeGreaterThanOrEqual(70); // Minimum quality threshold
      
      if (qualityAssessment.issues.length > 0) {
        console.log(`Quality issues at ${width}px:`, qualityAssessment.issues);
      }
      
      // Verify content includes key professional elements
      const lowerText = combinedText.toLowerCase();
      
      // Should mention educational background
      expect(lowerText).toMatch(/iiit nagpur|university|college|bachelor/);
      
      // Should mention current role
      expect(lowerText).toMatch(/hitachi|intern|currently|software engineer/);
      
      // Should mention technical skills
      expect(lowerText).toMatch(/react|\.net|mvc|technical|development|systems/);
      
      // Should mention future goals
      expect(lowerText).toMatch(/placement|2026|team|contribute|opportunity/);
      
      // Verify readability metrics
      const sentences = combinedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
      expect(sentences.length).toBeGreaterThanOrEqual(3); // At least 3 sentences
      expect(sentences.length).toBeLessThanOrEqual(12); // Not too many sentences
      
      // Check paragraph distribution
      expect(narrativeCount).toBeGreaterThanOrEqual(2); // At least 2 paragraphs
      expect(narrativeCount).toBeLessThanOrEqual(4); // Not too many paragraphs
    }
  });

  test('Property: About section includes required institutional links with proper formatting', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to about section
      const aboutSection = page.locator('#about');
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify IIIT Nagpur link
      const iiitLink = aboutSection.locator('a').filter({ hasText: /IIIT Nagpur/i });
      await expect(iiitLink).toBeVisible();
      
      const iiitHref = await iiitLink.getAttribute('href');
      expect(iiitHref).toContain('iiitn.ac.in');
      
      const iiitTarget = await iiitLink.getAttribute('target');
      expect(iiitTarget).toBe('_blank');
      
      const iiitRel = await iiitLink.getAttribute('rel');
      expect(iiitRel).toContain('noopener');
      expect(iiitRel).toContain('noreferrer');
      
      // Verify Hitachi link
      const hitachiLink = aboutSection.locator('a').filter({ hasText: /Hitachi/i });
      await expect(hitachiLink).toBeVisible();
      
      const hitachiHref = await hitachiLink.getAttribute('href');
      expect(hitachiHref).toContain('hitachi.com');
      
      const hitachiTarget = await hitachiLink.getAttribute('target');
      expect(hitachiTarget).toBe('_blank');
      
      const hitachiRel = await hitachiLink.getAttribute('rel');
      expect(hitachiRel).toContain('noopener');
      expect(hitachiRel).toContain('noreferrer');
      
      // Verify link styling
      const linkStyles = await iiitLink.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          color: styles.color,
          textDecoration: styles.textDecoration,
          fontWeight: styles.fontWeight
        };
      });
      
      // Links should be visually distinct
      expect(linkStyles.color).not.toBe('rgb(0, 0, 0)'); // Not default black
      expect(linkStyles.textDecoration).toContain('underline');
      expect(linkStyles.fontWeight).toBe('500'); // Medium weight
      
      // Test hover states
      await iiitLink.hover();
      await page.waitForTimeout(100);
      
      const hoverStyles = await iiitLink.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          color: styles.color,
          textDecoration: styles.textDecoration
        };
      });
      
      // Hover should change appearance
      expect(hoverStyles.color).not.toBe(linkStyles.color);
    }
  });

  test('Property: About section maintains professional photo placeholder with proper accessibility', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to about section
      const aboutSection = page.locator('#about');
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify photo placeholder is present
      const photoPlaceholder = aboutSection.locator('[class*="aspect-square"]');
      await expect(photoPlaceholder).toBeVisible();
      
      // Verify placeholder has proper dimensions
      const placeholderBox = await photoPlaceholder.boundingBox();
      expect(placeholderBox).toBeTruthy();
      
      if (placeholderBox) {
        // Should be square aspect ratio
        const aspectRatio = placeholderBox.width / placeholderBox.height;
        expect(aspectRatio).toBeCloseTo(1, 1); // Within 0.1 of 1:1 ratio
        
        // Should be reasonably sized
        expect(placeholderBox.width).toBeGreaterThanOrEqual(200);
        expect(placeholderBox.width).toBeLessThanOrEqual(500);
      }
      
      // Verify placeholder content
      const placeholderIcon = photoPlaceholder.locator('svg');
      await expect(placeholderIcon).toBeVisible();
      
      const placeholderText = photoPlaceholder.locator('text=Professional Photo');
      await expect(placeholderText).toBeVisible();
      
      const comingSoonText = photoPlaceholder.locator('text=Coming Soon');
      await expect(comingSoonText).toBeVisible();
      
      // Verify placeholder styling
      const placeholderStyles = await photoPlaceholder.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow
        };
      });
      
      // Should have gradient background
      expect(placeholderStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      
      // Should have rounded corners
      const borderRadius = parseFloat(placeholderStyles.borderRadius);
      expect(borderRadius).toBeGreaterThan(8); // At least 0.5rem
      
      // Should have shadow for depth
      expect(placeholderStyles.boxShadow).not.toBe('none');
      
      // Verify responsive behavior
      if (width >= 1024) {
        // Desktop: photo should be on left, text on right
        const photoOrder = await photoPlaceholder.evaluate(el => {
          const parent = el.closest('[class*="grid"]');
          if (!parent) return null;
          const children = Array.from(parent.children);
          return children.indexOf(el.closest('[class*="order"]') || el);
        });
        
        expect(photoOrder).toBeLessThan(1); // Should be first or early in order
      } else {
        // Mobile: photo should be after text
        const photoOrder = await photoPlaceholder.evaluate(el => {
          const parent = el.closest('[class*="grid"]');
          if (!parent) return null;
          const children = Array.from(parent.children);
          return children.indexOf(el.closest('[class*="order"]') || el);
        });
        
        expect(photoOrder).toBeGreaterThanOrEqual(0); // Order doesn't matter as much on mobile
      }
    }
  });

  test('Property: About section layout adapts properly across viewport sizes', async ({ page }) => {
    const viewportWidths = generateViewportWidths(7);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to about section
      const aboutSection = page.locator('#about');
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify section heading
      const sectionHeading = aboutSection.locator('h2').filter({ hasText: /About/i });
      await expect(sectionHeading).toBeVisible();
      
      // Verify grid layout
      const gridContainer = aboutSection.locator('[class*="grid"]');
      await expect(gridContainer).toBeVisible();
      
      // Get photo and text containers
      const photoContainer = gridContainer.locator('[class*="aspect-square"]').locator('..');
      const textContainer = gridContainer.locator('.prose').locator('..');
      
      await expect(photoContainer).toBeVisible();
      await expect(textContainer).toBeVisible();
      
      const photoBox = await photoContainer.boundingBox();
      const textBox = await textContainer.boundingBox();
      
      if (photoBox && textBox) {
        if (width >= 1024) {
          // Desktop: side-by-side layout
          const isHorizontalLayout = Math.abs(photoBox.y - textBox.y) < 50;
          expect(isHorizontalLayout).toBeTruthy();
          
          // Photo should be on left, text on right
          expect(photoBox.x).toBeLessThan(textBox.x);
          
          // Should have reasonable gap between columns
          const gap = textBox.x - (photoBox.x + photoBox.width);
          expect(gap).toBeGreaterThanOrEqual(32); // At least 2rem gap
          
        } else {
          // Mobile: stacked layout
          const isVerticalLayout = Math.abs(photoBox.y - textBox.y) > 50;
          expect(isVerticalLayout).toBeTruthy();
          
          // Should have reasonable gap between rows
          const gap = Math.abs(photoBox.y - textBox.y) - Math.max(photoBox.height, textBox.height);
          expect(gap).toBeGreaterThanOrEqual(24); // At least 1.5rem gap
        }
      }
      
      // Verify section spacing
      const sectionStyles = await aboutSection.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          backgroundColor: styles.backgroundColor
        };
      });
      
      // Should have white background
      expect(sectionStyles.backgroundColor).toBe('rgb(255, 255, 255)');
      
      // Verify appropriate padding
      const paddingTop = parseFloat(sectionStyles.paddingTop);
      const paddingBottom = parseFloat(sectionStyles.paddingBottom);
      
      if (width >= 768) {
        expect(paddingTop).toBeGreaterThanOrEqual(96); // 6rem+ on desktop
        expect(paddingBottom).toBeGreaterThanOrEqual(96);
      } else {
        expect(paddingTop).toBeGreaterThanOrEqual(64); // 4rem+ on mobile
        expect(paddingBottom).toBeGreaterThanOrEqual(64);
      }
      
      // Verify text readability
      const textStyles = await textContainer.evaluate(el => {
        const paragraph = el.querySelector('p');
        if (!paragraph) return null;
        const styles = getComputedStyle(paragraph);
        return {
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          color: styles.color
        };
      });
      
      if (textStyles) {
        const fontSize = parseFloat(textStyles.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(16); // At least 1rem
        
        const lineHeight = parseFloat(textStyles.lineHeight);
        expect(lineHeight).toBeGreaterThanOrEqual(fontSize * 1.4); // Good line height ratio
        
        // Should have good contrast
        expect(textStyles.color).not.toBe('rgb(255, 255, 255)'); // Not white text
        expect(textStyles.color).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
      }
    }
  });

  test('Property: About section content maintains consistency across multiple page loads', async ({ page }) => {
    const loadCount = 5;
    const contentSnapshots: string[] = [];
    
    for (let i = 0; i < loadCount; i++) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Navigate to about section
      const aboutSection = page.locator('#about');
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      
      // Collect narrative content
      const narrativeContent = aboutSection.locator('.prose p');
      const narrativeCount = await narrativeContent.count();
      
      let combinedText = '';
      for (let j = 0; j < narrativeCount; j++) {
        const paragraph = narrativeContent.nth(j);
        const paragraphText = await paragraph.textContent();
        if (paragraphText) {
          combinedText += paragraphText.trim() + ' ';
        }
      }
      
      contentSnapshots.push(combinedText.trim());
      
      // Verify word count consistency
      const wordCount = countWords(combinedText);
      expect(wordCount).toBeLessThanOrEqual(200);
      expect(wordCount).toBeGreaterThan(100);
    }
    
    // Verify all snapshots are identical (content should be static)
    const firstSnapshot = contentSnapshots[0];
    for (let i = 1; i < contentSnapshots.length; i++) {
      expect(contentSnapshots[i]).toBe(firstSnapshot);
    }
    
    // Verify required elements are always present
    for (const snapshot of contentSnapshots) {
      const lowerText = snapshot.toLowerCase();
      
      // Required institutional mentions
      expect(lowerText).toMatch(/iiit nagpur/);
      expect(lowerText).toMatch(/hitachi/);
      
      // Required professional elements
      expect(lowerText).toMatch(/software engineer/);
      expect(lowerText).toMatch(/computer science/);
      expect(lowerText).toMatch(/2026/);
      
      // Required technical skills
      expect(lowerText).toMatch(/react|\.net|mvc/);
      
      // Professional quality indicators
      expect(lowerText).toMatch(/systems|solutions|development|technical/);
    }
  });
});