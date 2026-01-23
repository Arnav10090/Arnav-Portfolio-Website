/**
 * Create WebP placeholder images for projects
 * Uses SVG data URLs converted to create lightweight placeholders
 */

const fs = require('fs');
const path = require('path');

// Project configurations with colors and themes
const projects = [
  {
    name: 'passvault',
    title: 'PassVault',
    color: '#3b82f6',
    icon: '🔐',
    description: 'Password Manager'
  },
  {
    name: 'taskflow',
    title: 'TaskFlow',
    color: '#10b981',
    icon: '📋',
    description: 'Task Manager'
  },
  {
    name: 'weatherscope',
    title: 'WeatherScope',
    color: '#f59e0b',
    icon: '🌤️',
    description: 'Weather Dashboard'
  },
  {
    name: 'expensewise',
    title: 'ExpenseWise',
    color: '#8b5cf6',
    icon: '💰',
    description: 'Expense Tracker'
  }
];

// Create SVG placeholder for each project
projects.forEach(project => {
  const svg = `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${project.name}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${project.color};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${project.color};stop-opacity:0.6" />
      </linearGradient>
    </defs>
    <rect width="800" height="400" fill="url(#grad-${project.name})"/>
    <rect x="50" y="50" width="700" height="300" fill="rgba(255,255,255,0.1)" rx="20"/>
    <text x="400" y="180" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">
      ${project.icon}
    </text>
    <text x="400" y="230" font-family="Arial, sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">
      ${project.title}
    </text>
    <text x="400" y="270" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="rgba(255,255,255,0.9)">
      ${project.description}
    </text>
  </svg>`;

  // Write SVG file (can be used as fallback)
  const svgPath = path.join(__dirname, '../public/images/projects', `${project.name}.svg`);
  fs.writeFileSync(svgPath, svg);
  
  console.log(`✅ Created ${project.name}.svg placeholder`);
});

console.log('📝 SVG placeholders created. For production, convert these to WebP format using tools like:');
console.log('   - Online converters (squoosh.app)');
console.log('   - Command line tools (cwebp, imagemagick)');
console.log('   - Build-time optimization tools');