'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ContactForm } from '@/components/ContactForm';
import { contactInfo, socialLinks } from '@/data/contact';
import { trackExternalLink } from '@/lib/analytics';
import { Card } from '@/components/ui/Card';
import { fadeUpVariant, fadeInVariant } from '@/lib/animation-variants';

interface ContactSectionProps {
  className?: string;
  id?: string;
}

// Icon components for social links
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
const EmailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);
const LocationIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// Icon mapping
const iconMap = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  email: EmailIcon,
  twitter: TwitterIcon,
  location: LocationIcon,
  phone: PhoneIcon,
};

export function ContactSection({ className, id }: ContactSectionProps) {
  const shouldReduce = useReducedMotion();

  const handleSocialLinkClick = (url: string, platform: string) => {
    trackExternalLink(url);
  };

  return (
    <section
      id={id}
      className="py-20 sm:py-28 md:py-32 lg:py-40 bg-white dark:bg-background"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduce ? 0 : 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="text-center"
        >
          <h2
            id="contact-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent leading-tight"
          >
            Get In Touch
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
            Let's discuss opportunities and build something amazing together
          </p>
        </motion.div>

        {/* Two-column layout: stacks on mobile/tablet, 40/60 split on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 sm:gap-12 lg:gap-16 items-start">
          {/* Contact Form - appears first on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              duration: shouldReduce ? 0 : 0.6,
              delay: shouldReduce ? 0 : 0.15,
            }}
            viewport={{ once: true, margin: '-50px' }}
            className="order-1 lg:order-2"
          >
            <ContactForm />
          </motion.div>

          {/* Contact Information - appears second on mobile, first on desktop */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: {
                transition: { staggerChildren: shouldReduce ? 0 : 0.1 },
              },
            }}
            className="order-2 lg:order-1 space-y-8 sm:space-y-10 md:space-y-12"
          >
            <motion.div variants={fadeUpVariant}>
              <h3 className="text-xl sm:text-2xl font-semibold text-text-primary mb-4 sm:mb-6">
                Let's Connect
              </h3>
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6 sm:mb-8">
                I'm actively seeking full-time software engineering
                opportunities for 2026. Whether you're a recruiter, hiring
                manager, or fellow developer, I'd love to hear from you.
              </p>
            </motion.div>

            <div className="space-y-5 sm:space-y-6">
              <motion.div
                variants={fadeUpVariant}
                className="flex items-center space-x-3 sm:space-x-4 text-text-secondary"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface flex items-center justify-center text-primary-400">
                  <LocationIcon />
                </div>
                <span className="text-base sm:text-lg">
                  {contactInfo.location}
                </span>
              </motion.div>

              <motion.div
                variants={fadeUpVariant}
                className="flex items-center space-x-3 sm:space-x-4 text-text-secondary"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 min-w-[44px] min-h-[44px] rounded-full bg-surface flex items-center justify-center text-primary-400">
                  <EmailIcon />
                </div>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-base sm:text-lg text-text-primary hover:text-primary-400 transition-colors break-all"
                >
                  {contactInfo.email}
                </a>
              </motion.div>
            </div>

            <motion.div
              variants={fadeUpVariant}
              className="pt-6 sm:pt-8 border-t border-border"
            >
              <h4 className="text-xs sm:text-sm font-medium text-text-secondary uppercase tracking-wider mb-5 sm:mb-6">
                Find Me Online
              </h4>
              <motion.div
                className="flex flex-wrap gap-3 sm:gap-4"
                variants={{
                  visible: {
                    transition: { staggerChildren: shouldReduce ? 0 : 0.05 },
                  },
                }}
              >
                {socialLinks.map(link => {
                  const Icon = iconMap[link.icon as keyof typeof iconMap];
                  if (!Icon) return null;
                  return (
                    <motion.a
                      variants={fadeInVariant}
                      whileHover={shouldReduce ? {} : { scale: 1.1, y: -2 }}
                      whileTap={shouldReduce ? {} : { scale: 0.95 }}
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-transparent border border-black dark:border-white flex items-center justify-center text-text-secondary hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-colors duration-300"
                      aria-label={link.label}
                      onClick={() =>
                        handleSocialLinkClick(
                          link.href,
                          link.label.toLowerCase()
                        )
                      }
                    >
                      <Icon />
                    </motion.a>
                  );
                })}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduce ? 0 : 0.6 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mt-16 sm:mt-20 md:mt-24 text-center"
        >
          <Card className="p-6 sm:p-8 md:p-10 lg:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-base sm:text-lg text-text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto">
              I'm passionate about creating impactful software solutions and
              would love to discuss how my skills in full-stack and Agentic AI
              development can contribute to your team's success.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <motion.a
                whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }}
                whileTap={shouldReduce ? {} : { scale: 0.96 }}
                href={`mailto:${contactInfo.email}?subject=Job Opportunity&body=Hi Arnav,%0D%0A%0D%0AI'd like to discuss a potential opportunity with you.`}
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] border border-primary-500 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 hover:border-primary-600 transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background"
                onClick={() =>
                  handleSocialLinkClick(
                    `mailto:${contactInfo.email}`,
                    'email-cta'
                  )
                }
                aria-label="Send email to discuss opportunities"
                suppressHydrationWarning
              >
                <EmailIcon />
                <span className="ml-3">Email Me Directly</span>
              </motion.a>
              <motion.a
                whileHover={shouldReduce ? {} : { scale: 1.04, y: -2 }}
                whileTap={shouldReduce ? {} : { scale: 0.96 }}
                href="/api/resume"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 min-h-[44px] border border-gray-200 dark:border-white/10 bg-transparent text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-300 shadow-lg hover:shadow-xl group relative"
                download
                aria-label="Download resume as PDF"
                suppressHydrationWarning
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Resume
                </span>
              </motion.a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
