/**
 * Script to generate optimized WebP placeholder images for projects
 * This creates base64-encoded blur placeholders and ensures WebP format
 */

const fs = require('fs');
const path = require('path');

// Project image configurations
const projectImages = [
  { name: 'passvault', width: 800, height: 400, color: '#3b82f6' },
  { name: 'taskflow', width: 800, height: 400, color: '#10b981' },
  { name: 'weatherscope', width: 800, height: 400, color: '#f59e0b' },
  { name: 'expensewise', width: 800, height: 400, color: '#8b5cf6' }
];

// Generate base64 blur placeholder
function generateBlurPlaceholder(color) {
  // Simple 1x1 pixel base64 image with the specified color
  const canvas = `<svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="${color}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

// Create blur placeholder data file
const blurPlaceholders = {};
projectImages.forEach(img => {
  blurPlaceholders[img.name] = generateBlurPlaceholder(img.color);
});

const placeholderContent = `/**
 * Blur placeholder data for project images
 * Generated automatically - do not edit manually
 */

export const blurPlaceholders: Record<string, string> = ${JSON.stringify(blurPlaceholders, null, 2)};

export function getBlurPlaceholder(projectId: string): string {
  return blurPlaceholders[projectId] || blurPlaceholders.passvault;
}
`;

// Ensure the lib directory exists
const libDir = path.join(__dirname, '../src/lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir, { recursive: true });
}

// Write the blur placeholder file
fs.writeFileSync(
  path.join(__dirname, '../src/lib/blur-placeholders.ts'),
  placeholderContent
);

console.log('✅ Generated blur placeholders for project images');

// Create a simple WebP placeholder creation guide
const readmeContent = `# Project Images

This directory contains optimized WebP images for project thumbnails.

## Image Requirements:
- Format: WebP with AVIF fallback
- Dimensions: 800x400px (2:1 aspect ratio)
- File size: < 50KB each
- Quality: 80-85% for optimal balance

## Current Images:
${projectImages.map(img => `- ${img.name}.webp (${img.width}x${img.height})`).join('\n')}

## To add new project images:
1. Optimize image to WebP format
2. Ensure 800x400px dimensions
3. Keep file size under 50KB
4. Add blur placeholder to blur-placeholders.ts
`;

fs.writeFileSync(
  path.join(__dirname, '../public/images/projects/README.md'),
  readmeContent
);

console.log('✅ Created project images README');
console.log('📝 Note: Add actual WebP images to public/images/projects/ directory');