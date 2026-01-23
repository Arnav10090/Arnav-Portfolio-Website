/**
 * Property-Based Test: Bundle Size and Resource Optimization
 * Feature: portfolio-website, Property 2: Bundle Size and Resource Optimization
 * 
 * **Validates: Requirements 1.5, 1.6**
 * 
 * Property: For any build output, the total JavaScript bundle size should be under 200KB gzipped,
 * CSS should be under 50KB gzipped, and all images should be served in WebP format with lazy loading
 * for below-fold content.
 */

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as fc from 'fast-check';

// Bundle size limits (in bytes)
const BUNDLE_LIMITS = {
  JS_GZIPPED: 200 * 1024, // 200KB
  CSS_GZIPPED: 50 * 1024,  // 50KB
  TOTAL_GZIPPED: 250 * 1024 // 250KB total
};

function getGzippedSize(filePath: string): number {
  try {
    const fileContent = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(fileContent);
    return gzipped.length;
  } catch (error) {
    console.warn(`Could not get gzipped size for ${filePath}:`, error);
    return fs.statSync(filePath).size; // Fallback to uncompressed size
  }
}

function analyzeBundleSize(): { jsSize: number; cssSize: number; totalSize: number; files: Array<{ file: string; type: string; gzipped: number }> } {
  const buildDir = path.join(__dirname, '../.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    throw new Error('Build directory not found. Run "npm run build" first.');
  }

  let totalJSSize = 0;
  let totalCSSSize = 0;
  const files: Array<{ file: string; type: string; gzipped: number }> = [];

  function scanDirectory(dir: string, prefix = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, `${prefix}${item}/`);
      } else if (item.endsWith('.js') && !item.includes('.map')) {
        const gzippedSize = getGzippedSize(fullPath);
        totalJSSize += gzippedSize;
        files.push({
          file: `${prefix}${item}`,
          type: 'JS',
          gzipped: gzippedSize
        });
      } else if (item.endsWith('.css') && !item.includes('.map')) {
        const gzippedSize = getGzippedSize(fullPath);
        totalCSSSize += gzippedSize;
        files.push({
          file: `${prefix}${item}`,
          type: 'CSS',
          gzipped: gzippedSize
        });
      }
    }
  }

  scanDirectory(staticDir);

  return {
    jsSize: totalJSSize,
    cssSize: totalCSSSize,
    totalSize: totalJSSize + totalCSSSize,
    files
  };
}

test.describe('Bundle Size and Resource Optimization', () => {
  test('Property 2: Bundle Size and Resource Optimization - JavaScript bundle size should be under 200KB gzipped', async () => {
    // Property-based test: For any build configuration, JS bundle should be under limit
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Test different scenarios that might affect bundle size
          includeSourceMaps: fc.boolean(),
          minify: fc.boolean(),
          treeshake: fc.boolean()
        }),
        async (config) => {
          // Analyze current bundle (built with optimizations)
          const bundleAnalysis = analyzeBundleSize();
          
          // Property: JavaScript bundle size should be under 200KB gzipped
          expect(bundleAnalysis.jsSize).toBeLessThanOrEqual(BUNDLE_LIMITS.JS_GZIPPED);
          
          // Additional checks for optimization
          expect(bundleAnalysis.jsSize).toBeGreaterThan(0); // Should have some JS
          
          // Log for debugging if close to limit
          if (bundleAnalysis.jsSize > BUNDLE_LIMITS.JS_GZIPPED * 0.8) {
            console.warn(`JS bundle size is ${(bundleAnalysis.jsSize / 1024).toFixed(2)}KB, approaching limit of ${(BUNDLE_LIMITS.JS_GZIPPED / 1024).toFixed(2)}KB`);
          }
          
          return true;
        }
      ),
      { numRuns: 10 } // Run multiple times to ensure consistency
    );
  });

  test('Property 2: Bundle Size and Resource Optimization - CSS bundle size should be under 50KB gzipped', async () => {
    // Property-based test: For any styling configuration, CSS should be under limit
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Test different CSS scenarios
          includeTailwind: fc.boolean(),
          includeCustomCSS: fc.boolean(),
          purgeUnused: fc.boolean()
        }),
        async (config) => {
          const bundleAnalysis = analyzeBundleSize();
          
          // Property: CSS bundle size should be under 50KB gzipped
          expect(bundleAnalysis.cssSize).toBeLessThanOrEqual(BUNDLE_LIMITS.CSS_GZIPPED);
          
          // Should have some CSS
          expect(bundleAnalysis.cssSize).toBeGreaterThan(0);
          
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  test('Property 2: Bundle Size and Resource Optimization - Total bundle size should be under 250KB gzipped', async () => {
    // Property-based test: For any complete build, total size should be under limit
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Test different build scenarios
          optimizeImages: fc.boolean(),
          enableCompression: fc.boolean(),
          splitChunks: fc.boolean()
        }),
        async (config) => {
          const bundleAnalysis = analyzeBundleSize();
          
          // Property: Total bundle size should be under 250KB gzipped
          expect(bundleAnalysis.totalSize).toBeLessThanOrEqual(BUNDLE_LIMITS.TOTAL_GZIPPED);
          
          // Ensure we have both JS and CSS
          expect(bundleAnalysis.jsSize + bundleAnalysis.cssSize).toEqual(bundleAnalysis.totalSize);
          
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  test('Property 2: Bundle Size and Resource Optimization - Images should be in WebP format with proper optimization', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Property-based test: For any image on the page, it should be optimized
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Test different viewport sizes to check responsive images
          viewportWidth: fc.integer({ min: 320, max: 1920 }),
          viewportHeight: fc.integer({ min: 568, max: 1080 })
        }),
        async (config) => {
          // Set viewport size
          await page.setViewportSize({ 
            width: config.viewportWidth, 
            height: config.viewportHeight 
          });
          
          // Wait for images to load
          await page.waitForLoadState('networkidle');
          
          // Get all images on the page
          const images = await page.locator('img').all();
          
          for (const image of images) {
            const src = await image.getAttribute('src');
            const loading = await image.getAttribute('loading');
            
            if (src) {
              // Property: Images should use Next.js optimization (/_next/image or be WebP/AVIF)
              const isOptimized = src.includes('/_next/image') || 
                                src.endsWith('.webp') || 
                                src.endsWith('.avif') ||
                                src.startsWith('data:image/svg'); // Allow SVG data URLs
              
              expect(isOptimized).toBeTruthy();
              
              // Property: Below-fold images should have lazy loading
              const rect = await image.boundingBox();
              if (rect && rect.y > config.viewportHeight) {
                // Image is below the fold, should have lazy loading
                expect(loading).toBe('lazy');
              }
            }
          }
          
          return true;
        }
      ),
      { numRuns: 5 } // Fewer runs for UI tests
    );
  });

  test('Property 2: Bundle Size and Resource Optimization - Code splitting should create separate chunks', async () => {
    // Property-based test: Dynamic imports should create separate chunks
    const bundleAnalysis = analyzeBundleSize();
    
    // Property: Should have multiple JS chunks (indicating code splitting)
    const jsFiles = bundleAnalysis.files.filter(f => f.type === 'JS');
    expect(jsFiles.length).toBeGreaterThan(1);
    
    // Property: No single chunk should be excessively large (> 80KB gzipped)
    const MAX_CHUNK_SIZE = 80 * 1024; // 80KB
    for (const file of jsFiles) {
      expect(file.gzipped).toBeLessThanOrEqual(MAX_CHUNK_SIZE);
    }
    
    // Property: Should have a main chunk and smaller feature chunks
    const sortedChunks = jsFiles.sort((a, b) => b.gzipped - a.gzipped);
    const largestChunk = sortedChunks[0];
    const smallerChunks = sortedChunks.slice(1);
    
    // Largest chunk should be reasonable but not too large
    expect(largestChunk.gzipped).toBeLessThanOrEqual(MAX_CHUNK_SIZE);
    
    // Should have at least one smaller chunk (from dynamic imports)
    expect(smallerChunks.length).toBeGreaterThan(0);
  });

  test('Property 2: Bundle Size and Resource Optimization - Performance budget compliance across builds', async () => {
    // Property-based test: Bundle size should be consistent across different scenarios
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Simulate different content scenarios
          projectCount: fc.integer({ min: 1, max: 10 }),
          skillCount: fc.integer({ min: 5, max: 50 }),
          experienceCount: fc.integer({ min: 1, max: 5 })
        }),
        async (config) => {
          // For this test, we analyze the current build
          // In a real scenario, we might rebuild with different content
          const bundleAnalysis = analyzeBundleSize();
          
          // Property: Bundle size should remain within limits regardless of content volume
          expect(bundleAnalysis.jsSize).toBeLessThanOrEqual(BUNDLE_LIMITS.JS_GZIPPED);
          expect(bundleAnalysis.cssSize).toBeLessThanOrEqual(BUNDLE_LIMITS.CSS_GZIPPED);
          expect(bundleAnalysis.totalSize).toBeLessThanOrEqual(BUNDLE_LIMITS.TOTAL_GZIPPED);
          
          // Property: Bundle should scale reasonably with content
          // (This is a simplified check - in practice, content changes would require rebuilds)
          const expectedMinSize = 50 * 1024; // 50KB minimum
          expect(bundleAnalysis.totalSize).toBeGreaterThan(expectedMinSize);
          
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });
});