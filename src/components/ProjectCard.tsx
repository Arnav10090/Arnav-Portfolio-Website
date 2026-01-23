import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getBlurPlaceholder } from '@/lib/blur-placeholders';
import { trackProjectClick } from '@/lib/analytics';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    id,
    title,
    description,
    problem,
    solution,
    outcome,
    techStack,
    githubUrl,
    liveUrl,
    imageUrl,
    featured
  } = project;

  const handleGitHubClick = () => {
    trackProjectClick(id, 'github');
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLiveClick = () => {
    trackProjectClick(id, 'live');
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      variant={featured ? 'elevated' : 'standard'}
      className="h-full flex flex-col group"
      role="article"
      aria-label={`${title} project`}
    >
      {/* Project Image */}
      {imageUrl && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={`Screenshot of ${title} showing ${description}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading={featured ? "eager" : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL={getBlurPlaceholder(project.id)}
            quality={85}
            priority={featured}
          />
        </div>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {title}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Problem Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2" aria-hidden="true"></span>
            Problem
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {problem}
          </p>
        </div>

        {/* Solution Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" aria-hidden="true"></span>
            Solution
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {solution}
          </p>
        </div>

        {/* Outcome Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2" aria-hidden="true"></span>
            Outcome
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {outcome}
          </p>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used in this project">
            {techStack.map((tech) => (
              <Badge
                key={tech}
                variant="standard"
                className="text-xs"
                role="listitem"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100">
        <div className="flex gap-3 w-full">
          {githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={handleGitHubClick}
              aria-label={`View ${title} source code on GitHub`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </Button>
          )}
          {liveUrl && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={handleLiveClick}
              aria-label={`View ${title} live demo`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Live Demo
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};