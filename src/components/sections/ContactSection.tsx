'use client';

import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/ContactForm';
import { contactInfo, socialLinks } from '@/data/contact';
import { trackExternalLink } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface ContactSectionProps {
  className?: string;
}

// Icon components for social links
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

export function ContactSection({ className }: ContactSectionProps) {
  const handleSocialLinkClick = (url: string, platform: string) => {
    trackExternalLink(url);
    // Analytics could also track which platform was clicked
    console.log(`Social link clicked: ${platform}`);
  };

  return (
    <section
      id="contact"
      className={cn(
        'py-16 md:py-24 bg-gray-50 dark:bg-gray-900',
        className
      )}
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          level={2}
          subtitle="Let's discuss opportunities and build something amazing together"
          className="mb-12 md:mb-16"
          id="contact-heading"
        >
          Get In Touch
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Let's Connect
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                I'm actively seeking full-time software engineering opportunities for 2026. 
                Whether you're a recruiter, hiring manager, or fellow developer, I'd love to 
                hear from you. Let's discuss how I can contribute to your team's success.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4" role="list" aria-label="Contact information">
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400" role="listitem">
                <LocationIcon />
                <span>{contactInfo.location}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400" role="listitem">
                <EmailIcon />
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
                  onClick={() => handleSocialLinkClick(`mailto:${contactInfo.email}`, 'email')}
                  aria-label={`Send email to ${contactInfo.email}`}
                >
                  {contactInfo.email}
                </a>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400" role="listitem">
                <PhoneIcon />
                <a 
                  href={`tel:${contactInfo.phone}`}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
                  onClick={() => handleSocialLinkClick(`tel:${contactInfo.phone}`, 'phone')}
                  aria-label={`Call ${contactInfo.phone}`}
                >
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            {/* Availability Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4" role="status" aria-live="polite">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
                <span className="text-green-700 font-medium text-sm">
                  {contactInfo.availability}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Find Me Online
              </h4>
              <div className="flex space-x-4" role="list" aria-label="Social media links">
                {socialLinks.map((link) => {
                  const IconComponent = iconMap[link.icon as keyof typeof iconMap];
                  
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="flex items-center justify-center w-12 h-12 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50 transition-all duration-200 hover:transform hover:-translate-y-0.5 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      onClick={() => handleSocialLinkClick(link.href, link.label.toLowerCase())}
                      aria-label={`Visit my ${link.label} profile`}
                      role="listitem"
                    >
                      {IconComponent && <IconComponent />}
                    </a>
                  );
                })}
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Connect with me on professional platforms or check out my latest projects on GitHub.
              </p>
            </div>

            {/* Response Time */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Quick Response Guaranteed
              </h4>
              <p className="text-sm text-blue-700">
                I typically respond to messages within 24 hours. For urgent opportunities, 
                feel free to reach out via LinkedIn for faster communication.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Send Me a Message
            </h3>
            <ContactForm />
          </div>
        </div>

        {/* Additional CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              I'm passionate about creating impactful software solutions and would love to 
              discuss how my skills in React, .NET MVC, and full-stack development can 
              contribute to your team's success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${contactInfo.email}?subject=Job Opportunity&body=Hi Arnav,%0D%0A%0D%0AI'd like to discuss a potential opportunity with you.`}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg hover:transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => handleSocialLinkClick(`mailto:${contactInfo.email}`, 'email-cta')}
                aria-label="Send email to discuss opportunities"
                suppressHydrationWarning
              >
                <EmailIcon />
                <span className="ml-2">Email Me Directly</span>
              </a>
              <a
                href="/api/resume"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-md border border-primary-200 hover:bg-primary-50 hover:border-primary-300 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                download
                aria-label="Download resume as PDF"
                suppressHydrationWarning
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}