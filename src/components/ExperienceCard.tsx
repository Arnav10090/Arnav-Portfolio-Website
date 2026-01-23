import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { Experience } from '@/lib/types';
import { allSkills } from '@/data/skills';

interface ExperienceCardProps {
  experience: Experience;
  className?: string;
}

export function ExperienceCard({ experience, className }: ExperienceCardProps) {
  const {
    company,
    companyUrl,
    role,
    duration,
    location,
    description,
    achievements,
    techStack,
    logo,
    priority
  } = experience;

  // Check if skills are strategic based on skills data
  const isStrategicSkill = (skillName: string): boolean => {
    const skill = allSkills.find(s => s.name === skillName);
    return skill?.strategic || false;
  };

  // Highlight metrics in achievements (numbers followed by units or percentages)
  const highlightMetrics = (text: string): React.ReactNode => {
    // Regex to match numbers with units, percentages, or standalone numbers in context
    const metricRegex = /(\d+(?:,\d{3})*(?:\.\d+)?(?:\+)?(?:%|KB|MB|GB|TB|ms|s|min|hours?|days?|weeks?|months?|years?|x|times)?)/g;
    
    const parts = text.split(metricRegex);
    
    return parts.map((part, index) => {
      if (metricRegex.test(part)) {
        return (
          <span key={index} className="text-blue-600 font-semibold">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <Card
      variant="elevated"
      className={cn(
        'transition-all duration-300 hover:shadow-xl',
        // Left border accent for high priority (Hitachi experience)
        priority === 'high' && 'border-l-4 border-l-blue-500',
        className
      )}
      role="article"
      aria-label={`${role} at ${company}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {logo && (
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="w-8 h-8 object-contain"
                />
              )}
              <div>
                {companyUrl ? (
                  <a
                    href={companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm"
                    aria-label={`Visit ${company} website`}
                  >
                    {company}
                  </a>
                ) : (
                  <CardTitle className="text-lg">{company}</CardTitle>
                )}
              </div>
            </div>
            
            <CardTitle className="text-xl mb-1">{role}</CardTitle>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{duration}</span>
              <span className="hidden sm:inline" aria-hidden="true">•</span>
              <span>{location}</span>
            </div>
          </div>
        </div>
        
        <CardDescription className="text-base mt-3 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Achievements Section */}
        {achievements.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Key Achievements
            </h3>
            <ul className="space-y-3" role="list">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3" role="listitem">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-700 leading-relaxed">
                    {highlightMetrics(achievement)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Section */}
        {techStack.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used in this role">
              {techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant={isStrategicSkill(tech) ? 'strategic' : 'standard'}
                  className={cn(
                    'text-xs',
                    isStrategicSkill(tech) && 'bg-purple-100 text-purple-700 border-purple-200'
                  )}
                  role="listitem"
                >
                  {tech}
                  {isStrategicSkill(tech) && ' ★'}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}