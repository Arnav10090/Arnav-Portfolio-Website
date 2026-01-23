'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { skillCategories } from '@/data/skills';
import type { Skill } from '@/lib/types';

interface SkillsSectionProps {
  className?: string;
}

// Category display names and descriptions
const categoryInfo = {
  frontend: {
    title: 'Frontend Development',
    description: 'User interface and experience technologies'
  },
  backend: {
    title: 'Backend Development', 
    description: 'Server-side and API development'
  },
  enterprise: {
    title: 'Enterprise Technologies',
    description: 'Large-scale business application frameworks'
  },
  database: {
    title: 'Database & Data Management',
    description: 'Data storage and management systems'
  },
  cloud: {
    title: 'Cloud & Deployment',
    description: 'Cloud platforms and deployment services'
  },
  tools: {
    title: 'Development Tools',
    description: 'Development environment and productivity tools'
  },
  emerging: {
    title: 'Emerging Technologies',
    description: 'Learning and exploring new technologies'
  }
};

// Get badge variant based on skill properties
const getBadgeVariant = (skill: Skill): 'strategic' | 'standard' | 'subtle' => {
  if (skill.strategic) return 'strategic';
  if (skill.proficiency === 'learning') return 'subtle';
  return 'standard';
};

// Get proficiency indicator
const getProficiencyIndicator = (proficiency: Skill['proficiency']): string => {
  switch (proficiency) {
    case 'expert': return '●●●';
    case 'proficient': return '●●○';
    case 'familiar': return '●○○';
    case 'learning': return '○○○';
    default: return '';
  }
};

export function SkillsSection({ className }: SkillsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`py-16 md:py-24 bg-white dark:bg-gray-800 ${className || ''}`}
      aria-labelledby="skills-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          level={2}
          subtitle="Technical expertise across the full development stack with strategic focus on React and .NET MVC"
          className={`transition-all duration-700 ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-8'
          }`}
          id="skills-heading"
        >
          Technical Skills
        </SectionHeading>

        <div className="space-y-12 md:space-y-16">
          {Object.entries(skillCategories).map(([categoryKey, skills], categoryIndex) => {
            const category = categoryKey as keyof typeof categoryInfo;
            const info = categoryInfo[category];
            
            return (
              <div
                key={category}
                className={`transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${categoryIndex * 100}ms` : '0ms'
                }}
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    {info.description}
                  </p>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3" role="list" aria-label={`${info.title} skills`}>
                  {skills.map((skill, skillIndex) => (
                    <div
                      key={skill.name}
                      className={`transition-all duration-500 ${
                        isVisible
                          ? 'opacity-100 transform translate-y-0'
                          : 'opacity-0 transform translate-y-4'
                      }`}
                      style={{
                        transitionDelay: isVisible 
                          ? `${categoryIndex * 100 + skillIndex * 50}ms` 
                          : '0ms'
                      }}
                      role="listitem"
                    >
                      <Badge
                        variant={getBadgeVariant(skill)}
                        className="w-full justify-center text-center py-2 px-3 hover:scale-105 transition-transform duration-200"
                        title={`${skill.name} - ${skill.proficiency} level`}
                        aria-label={`${skill.name}, proficiency level: ${skill.proficiency}${skill.strategic ? ', strategic focus area' : ''}`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium">
                            {skill.name}
                            {skill.strategic && ' ★'}
                          </span>
                          <span 
                            className="text-xs opacity-70"
                            aria-hidden="true"
                          >
                            {getProficiencyIndicator(skill.proficiency)}
                          </span>
                        </span>
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Category Separator */}
                {categoryIndex < Object.keys(skillCategories).length - 1 && (
                  <div className="mt-8 border-b border-gray-100" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>

        {/* Strategic Skills Highlight */}
        <div className={`mt-16 md:mt-20 text-center transition-all duration-700 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}
        style={{
          transitionDelay: isVisible ? `${Object.keys(skillCategories).length * 100}ms` : '0ms'
        }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Strategic Focus Areas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Currently specializing in React for modern frontend development and .NET MVC for enterprise-grade backend systems
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {Object.values(skillCategories)
                .flat()
                .filter(skill => skill.strategic)
                .map(skill => (
                  <Badge
                    key={skill.name}
                    variant="strategic"
                    className="text-base py-2 px-4 font-semibold"
                  >
                    {skill.name} ★
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-12 md:mt-16 transition-all duration-700 ${
          isVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-8'
        }`}
        style={{
          transitionDelay: isVisible ? `${Object.keys(skillCategories).length * 100 + 200}ms` : '0ms'
        }}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to put these skills to work on your next project?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-label="Navigate to projects section"
            >
              View My Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Navigate to contact section"
            >
              Let's Collaborate
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}