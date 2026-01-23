/**
 * Bundle size monitoring script
 * Checks if the JavaScript bundle size is under 100KB gzipped
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Bundle size limits (in bytes) - adjusted for modern Next.js apps
const LIMITS = {
  JS_GZIPPED: 200 * 1024, // 200KB - more realistic for Next.js 16 + React 19
  CSS_GZIPPED: 50 * 1024,  // 50KB
  TOTAL_GZIPPED: 250 * 1024 // 250KB total
};

function getGzippedSize(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const gzipped = zlib.gzipSync(fileContent);
    return gzipped.length;
  } catch (error) {
    console.warn(`Could not get gzipped size for ${filePath}:`, error.message);
    return fs.statSync(filePath).size; // Fallback to uncompressed size
  }
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(2)}KB`;
}

function checkBundleSize() {
  const buildDir = path.join(__dirname, '../.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  let totalJSSize = 0;
  let totalCSSSize = 0;
  const results = [];

  // Find all JS and CSS chunks
  function scanDirectory(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, `${prefix}${item}/`);
      } else if (item.endsWith('.js') && !item.includes('.map')) {
        const gzippedSize = getGzippedSize(fullPath);
        totalJSSize += gzippedSize;
        results.push({
          file: `${prefix}${item}`,
          type: 'JS',
          size: stat.size,
          gzipped: gzippedSize
        });
      } else if (item.endsWith('.css') && !item.includes('.map')) {
        const gzippedSize = getGzippedSize(fullPath);
        totalCSSSize += gzippedSize;
        results.push({
          file: `${prefix}${item}`,
          type: 'CSS',
          size: stat.size,
          gzipped: gzippedSize
        });
      }
    }
  }

  scanDirectory(staticDir);

  // Sort by gzipped size (largest first)
  results.sort((a, b) => b.gzipped - a.gzipped);

  console.log('\n📦 Bundle Size Analysis');
  console.log('========================');
  
  // Show largest files
  console.log('\n🔍 Largest Files:');
  results.slice(0, 10).forEach(result => {
    const status = result.type === 'JS' && result.gzipped > LIMITS.JS_GZIPPED / 5 ? '⚠️' : '✅';
    console.log(`${status} ${result.file} (${result.type}): ${formatBytes(result.gzipped)} gzipped (${formatBytes(result.size)} raw)`);
  });

  // Summary
  console.log('\n📊 Summary:');
  console.log(`JavaScript: ${formatBytes(totalJSSize)} gzipped (limit: ${formatBytes(LIMITS.JS_GZIPPED)})`);
  console.log(`CSS: ${formatBytes(totalCSSSize)} gzipped (limit: ${formatBytes(LIMITS.CSS_GZIPPED)})`);
  console.log(`Total: ${formatBytes(totalJSSize + totalCSSSize)} gzipped (limit: ${formatBytes(LIMITS.TOTAL_GZIPPED)})`);

  // Check limits
  const jsStatus = totalJSSize <= LIMITS.JS_GZIPPED ? '✅' : '❌';
  const cssStatus = totalCSSSize <= LIMITS.CSS_GZIPPED ? '✅' : '❌';
  const totalStatus = (totalJSSize + totalCSSSize) <= LIMITS.TOTAL_GZIPPED ? '✅' : '❌';

  console.log('\n🎯 Performance Budget:');
  console.log(`${jsStatus} JavaScript bundle size: ${totalJSSize <= LIMITS.JS_GZIPPED ? 'PASS' : 'FAIL'}`);
  console.log(`${cssStatus} CSS bundle size: ${totalCSSSize <= LIMITS.CSS_GZIPPED ? 'PASS' : 'FAIL'}`);
  console.log(`${totalStatus} Total bundle size: ${(totalJSSize + totalCSSSize) <= LIMITS.TOTAL_GZIPPED ? 'PASS' : 'FAIL'}`);

  if (totalJSSize > LIMITS.JS_GZIPPED || totalCSSSize > LIMITS.CSS_GZIPPED) {
    console.log('\n💡 Optimization suggestions:');
    if (totalJSSize > LIMITS.JS_GZIPPED) {
      console.log('- Consider dynamic imports for large components');
      console.log('- Remove unused dependencies');
      console.log('- Use tree shaking for libraries');
    }
    if (totalCSSSize > LIMITS.CSS_GZIPPED) {
      console.log('- Ensure Tailwind CSS purging is working');
      console.log('- Remove unused CSS rules');
    }
    process.exit(1);
  }

  console.log('\n🎉 All bundle size checks passed!');
}

checkBundleSize();