import dynamic from 'next/dynamic';
import { ClientLayout } from '@/components/ClientLayout';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { projects } from '@/data/projects';

// Dynamic imports for below-the-fold sections to reduce initial bundle size
const ProjectsSection = dynamic(() => import('@/components/sections/ProjectsSection').then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => <div className="py-16 md:py-24 flex items-center justify-center"><div className="animate-pulse text-gray-400 dark:text-gray-600">Loading projects...</div></div>
});

const SkillsSection = dynamic(() => import('@/components/sections/SkillsSection').then(mod => ({ default: mod.SkillsSection })), {
  loading: () => <div className="py-16 md:py-24 flex items-center justify-center"><div className="animate-pulse text-gray-400 dark:text-gray-600">Loading skills...</div></div>
});

const AboutSection = dynamic(() => import('@/components/sections/AboutSection').then(mod => ({ default: mod.AboutSection })), {
  loading: () => <div className="py-16 md:py-24 flex items-center justify-center"><div className="animate-pulse text-gray-400 dark:text-gray-600">Loading about...</div></div>
});

const ResumeSection = dynamic(() => import('@/components/sections/ResumeSection').then(mod => ({ default: mod.ResumeSection })), {
  loading: () => <div className="py-16 md:py-24 flex items-center justify-center"><div className="animate-pulse text-gray-400 dark:text-gray-600">Loading resume...</div></div>
});

const ContactSection = dynamic(() => import('@/components/sections/ContactSection').then(mod => ({ default: mod.ContactSection })), {
  loading: () => <div className="py-16 md:py-24 flex items-center justify-center"><div className="animate-pulse text-gray-400 dark:text-gray-600">Loading contact...</div></div>
});

export default function Home() {
  // Get featured project images for preloading
  const featuredImages = projects
    .filter(p => p.featured && p.imageUrl)
    .map(p => p.imageUrl)
    .slice(0, 2); // Preload only first 2 featured images

  return (
    <ClientLayout>
      {/* Preload critical images for LCP optimization */}
      {featuredImages.map((imageUrl) => (
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
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <ResumeSection />
        <ContactSection />
      </main>
    </ClientLayout>
  );
}
