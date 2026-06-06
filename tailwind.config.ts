import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Define responsive breakpoints
    screens: {
      sm: '640px', // Mobile breakpoint (0-640px default)
      md: '768px', // Tablet breakpoint (641-1024px range)
      lg: '1024px', // Desktop breakpoint (1025-1440px range)
      xl: '1440px', // Large desktop breakpoint (1441px+)
      '2xl': '1536px',
    },
    extend: {
      // Spacing scale (8px base)
      spacing: {
        '0.5': '0.125rem', // 2px
        '1': '0.25rem', // 4px
        '2': '0.5rem', // 8px
        '3': '0.75rem', // 12px
        '4': '1rem', // 16px
        '6': '1.5rem', // 24px
        '8': '2rem', // 32px
        '10': '2.5rem', // 40px
        '12': '3rem', // 48px
        '16': '4rem', // 64px
        '20': '5rem', // 80px
        '30': '7.5rem', // 120px
        '40': '10rem', // 160px
        '18': '4.5rem',
        '88': '22rem',
        section: '6rem', // 96px
      },
      // Border radius scale
      borderRadius: {
        none: '0',
        sm: '0.375rem', // 6px
        DEFAULT: '0.75rem', // 12px
        md: '0.75rem', // 12px
        lg: '1rem', // 16px
        xl: '1.5rem', // 24px
        full: '9999px',
      },
      // Shadow scale (4 levels)
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        medium:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        floating:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      // Color palette with background gradients and accent colors
      colors: {
        background: {
          DEFAULT: '#0a0e1a', // Deep navy base
          secondary: '#1a1f2e', // Slightly lighter
        },
        surface: {
          50: '#0F172A', // Base card
          100: '#121B2F', // Elevated surface
          glass: 'rgba(30, 41, 59, 0.5)', // Glassmorphism
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Main accent
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          blue: '#3b82f6', // Primary blue for text/links (5.24:1 contrast)
          'blue-dark': '#2563eb', // Darker blue for button backgrounds (5.17:1 with white text)
          purple: '#a855f7',
          green: '#10b981',
          red: '#ef4444',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      // Typography system (72px display to 12px tiny)
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        tiny: ['0.75rem', { lineHeight: '1rem' }], // 12px
        xs: ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        sm: ['0.9375rem', { lineHeight: '1.5rem' }], // 15px
        base: ['1rem', { lineHeight: '1.75rem' }], // 16px
        md: ['1.0625rem', { lineHeight: '1.75rem' }], // 17px
        lg: ['1.125rem', { lineHeight: '1.7' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.75rem', { lineHeight: '2.25rem' }], // 28px
        '4xl': ['2rem', { lineHeight: '2.5rem' }], // 32px
        '5xl': ['3rem', { lineHeight: '1.2' }], // 48px
        '6xl': ['3.5rem', { lineHeight: '1.1' }], // 56px
        '7xl': ['4.5rem', { lineHeight: '1' }], // 72px - Display
      },
      letterSpacing: {
        tighter: '-0.05em', // -2px at 72px
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      // Animation timing functions
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Animation duration scale
      transitionDuration: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left':
          'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right':
          'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
