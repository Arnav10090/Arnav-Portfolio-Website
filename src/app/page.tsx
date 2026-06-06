'use client';

import dynamic from 'next/dynamic';
import { ClientLayout } from '@/components/ClientLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { projects } from '@/data/projects';

// Lazy load below-the-fold sections for better initial load performance
// ssr: false prevents hydration mismatches from browser extensions
const AboutSection = dynamic(
  () =>
    import('@/components/sections/AboutSection').then(mod => ({
      default: mod.AboutSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

const SkillsSection = dynamic(
  () =>
    import('@/components/sections/SkillsSection').then(mod => ({
      default: mod.SkillsSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

const ExperienceSection = dynamic(
  () =>
    import('@/components/sections/ExperienceSection').then(mod => ({
      default: mod.ExperienceSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

const ProjectsSection = dynamic(
  () =>
    import('@/components/sections/ProjectsSection').then(mod => ({
      default: mod.ProjectsSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

const ResumeSection = dynamic(
  () =>
    import('@/components/sections/ResumeSection').then(mod => ({
      default: mod.ResumeSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

const CTASection = dynamic(
  () =>
    import('@/components/sections/CTASection').then(mod => ({
      default: mod.CTASection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

const ContactSection = dynamic(
  () =>
    import('@/components/sections/ContactSection').then(mod => ({
      default: mod.ContactSection,
    })),
  {
    loading: () => <div className="min-h-screen" />,
    ssr: false,
  }
);

export default function Home() {
  // Get featured project images for preloading
  const featuredImages = projects
    .filter(p => p.featured && p.imageUrl)
    .map(p => p.imageUrl)
    .slice(0, 2); // Preload only first 2 featured images

  return (
    <ClientLayout>
      {/* Preload critical images for LCP optimization */}
      {featuredImages.map(imageUrl => (
        <link
          key={imageUrl}
          rel="preload"
          as="image"
          href={imageUrl}
          // @ts-ignore - Next.js specific attribute
          imageSrcSet={`${imageUrl}?w=640 640w, ${imageUrl}?w=750 750w, ${imageUrl}?w=828 828w`}
          imageSizes="(max-width: 768px) 100vw, 50vw"
        />
      ))}

      <main id="main-content" role="main">
        <HeroSection />
        <AboutSection id="about" />
        <SkillsSection id="skills" />
        <ExperienceSection />
        <ProjectsSection id="projects" />
        <ResumeSection id="resume" />
        <CTASection />
        <ContactSection id="contact" />
      </main>
    </ClientLayout>
  );
}
