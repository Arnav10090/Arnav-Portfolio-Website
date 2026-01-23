# Portfolio Website

A production-grade portfolio website built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS with custom design system
- 📱 Fully responsive design
- ♿ Accessibility compliant (WCAG 2.1 AA)
- 🚀 Optimized for Core Web Vitals
- 📧 Contact form with email integration
- 📊 Analytics integration
- 🔒 Security headers and best practices

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Update environment variables in `.env.local`
5. Run the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── layout/         # Layout components (Header, Footer)
│   ├── sections/       # Page sections (Hero, Experience, etc.)
│   └── ui/            # Reusable UI components
├── data/              # Content data files
└── lib/               # Utility functions and configurations
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically on push to main branch

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT License
