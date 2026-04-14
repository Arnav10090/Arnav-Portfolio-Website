import React, { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { skillCategories } from '@/data/skills';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { cn } from '@/lib/utils';

type TabId = 'fullstack' | 'aiml';

interface TabConfig {
  id: TabId;
  label: string;
  categories: string[];
}

export function SkillsSection({ id }: { id?: string }) {
  // State management for active tab
  const [activeTab, setActiveTabState] = useState<TabId>('fullstack');

  // Tab configuration
  const tabs: TabConfig[] = [
    {
      id: 'fullstack',
      label: 'Full Stack Development',
      categories: ['languages', 'frontend', 'backend', 'database', 'devops']
    },
    {
      id: 'aiml',
      label: 'AI & Gen AI',
      categories: ['machineLearning', 'dataAnalytics', 'devopsAI', 'backendAI']
    }
  ];

  // Validated setActiveTab function
  const setActiveTab = (tabId: string) => {
    if (tabId === 'fullstack' || tabId === 'aiml') {
      setActiveTabState(tabId);
    } else {
      console.warn(`Invalid tab ID: ${tabId}, defaulting to fullstack`);
      setActiveTabState('fullstack');
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      setActiveTab(tabs[prevIndex].id);
      document.getElementById(`${tabs[prevIndex].id}-tab`)?.focus();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
      setActiveTab(tabs[nextIndex].id);
      document.getElementById(`${tabs[nextIndex].id}-tab`)?.focus();
    }
  };

  // Get active tab configuration
  const activeTabConfig = tabs.find(tab => tab.id === activeTab) || tabs[0];

  // Category display names
  const categoryDisplayNames: Record<string, string> = {
    languages: 'Programming Languages',
    frontend: 'Frontend Engineering',
    backend: 'Backend & API Engineering',
    database: 'Databases & Data Layer',
    devops: 'Cloud, DevOps & Delivery',
    aiPractices: 'AI & Engineering Practices',
    machineLearning: 'Machine Learning & AI',
    dataAnalytics: 'Data & Analytics',
    devopsAI: 'Cloud, DevOps & Delivery',
    backendAI: 'Backend & API Engineering'
  };

  // Brand colors for skills
  const getBrandColors = (categoryKey: string): Record<string, string> => {
    const colorMaps: Record<string, Record<string, string>> = {
      languages: {
        'JavaScript': '#F7DF1E',
        'TypeScript': '#3178C6',
        'Python': '#3776AB',
        'Java': '#007396',
        'C++': '#00599C',
        'C': '#A8B9CC',
      },
      frontend: {
        'React': '#61DAFB',
        'Next.js': 'var(--text-primary)',
        'Tailwind CSS': '#06B6D4',
        'HTML5': '#E34F26',
        'CSS3': '#1572B6',
        'Figma': '#F24E1E',
      },
      backend: {
        'Node.js': '#339933',
        'Express.js': 'var(--text-primary)',
        'Django': '#092E20',
        'RESTful API Design': '#FF6C37',
        'Authentication & Authorization': '#8B5CF6',
        'JWT / OAuth 2.0': '#000000',
        'GraphQL': '#E10098',
        'WebSockets': '#010101',
        'SQLAlchemy': '#D71F00',
        'Drizzle ORM': '#C5F74F',
      },
      database: {
        'PostgreSQL': '#336791',
        'MySQL': '#4479A1',
        'MongoDB': '#47A248',
        'ORM / ODM': '#10B981',
      },
      devops: {
        'Docker': '#2496ED',
        'Kubernetes': '#326CE5',
        'Git': '#F05032',
        'GitHub Actions': '#2088FF',
        'CI/CD Pipelines': '#FF6C37',
        'Postman': '#FF6C37',
      },
      aiPractices: {
        'AI / LLM Integration': '#F59E0B',
        'Prompt Engineering': '#8B5CF6',
        'System Thinking': '#3B82F6',
        'Problem Solving': '#8B5CF6',
        'Team Collaboration': '#10B981',
      },
      machineLearning: {
        'scikit-learn': '#F7931E',
        'TensorFlow': '#FF6F00',
        'PyTorch': '#EE4C2C',
        'FAISS': '#00A3E0',
        'Sentence-Transformers': '#4B8BBE',
        'spaCy': '#09A3D5',
        'RAG': '#8B5CF6',
        'LLM App Dev': '#10B981',
        'Prompt Engineering': '#F59E0B',
        'Multi-agent Orchestration': '#3B82F6',
        'Gemini API': '#4285F4',
        'Groq SDK': '#F97316',
      },
      dataAnalytics: {
        'pandas': '#150458',
        'NumPy': '#013243',
        'matplotlib': '#11557C',
        'seaborn': '#3776AB',
        'Data preprocessing': '#06B6D4',
        'Feature extraction': '#8B5CF6',
        'NLP': '#10B981',
        'Model evaluation': '#F59E0B',
        'Hyperparameter tuning': '#EF4444',
      },
      devopsAI: {
        'GCP / Vertex AI': '#4285F4',
        'n8n (workflow automation)': '#EA4B71',
        'Docker': '#2496ED',
      },
      backendAI: {
        'FastAPI': '#009688',
        'NetworkX': '#FF6B6B',
        'JWT / OAuth 2.0': '#000000',
      },
    };
    return colorMaps[categoryKey] || {};
  };

  // Render skill category card
  const renderSkillCategory = (categoryKey: string) => {
    const skills = skillCategories[categoryKey];
    if (!skills || skills.length === 0) return null;

    const displayName = categoryDisplayNames[categoryKey] || categoryKey;
    const brandColors = getBrandColors(categoryKey);

    return (
      <Card key={categoryKey} variant="base" className="p-5 sm:p-6 hover:border-primary-500/30 transition-colors border border-gray-900 dark:border-transparent">
        <h3 className="text-lg font-semibold text-text-primary mb-4 sm:mb-5">
          {displayName}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="group flex flex-col items-center gap-3 p-3 rounded-lg transition-colors justify-center"
            >
              {skill.icon ? (
                <skill.icon
                  className="w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-300"
                  style={{ color: brandColors[skill.name] || 'var(--text-secondary)' }}
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-elevated" />
              )}
              <span className="text-sm sm:text-base font-medium text-text-secondary group-hover:text-text-primary transition-colors text-center">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </Card>
    );
  };
  return (
    <section
      id={id}
      className="py-16 sm:py-20 md:py-24 bg-slate-50 dark:bg-background"
      aria-labelledby="skills-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetric layout: Content Left (85%), Visual Right (15%) */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Main Content (85%) */}
          <div className="w-full lg:w-[85%]">
            <h2
              id="contact-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent leading-tight text-center"
            >
              Technical Skills
            </h2>
            <p
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto text-center"
            >
              Technical expertise across the full development stack
            </p>

            {/* Tab Toggle */}
            <div 
              role="tablist" 
              aria-label="Skill categories"
              className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12"
            >
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  id={`${tab.id}-tab`}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={cn(
                    'px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panel with Conditional Rendering */}
            <div
              role="tabpanel"
              id={`${activeTab}-panel`}
              aria-labelledby={`${activeTab}-tab`}
              className="animate-fade-up transition-opacity duration-300"
            >
              {activeTab === 'fullstack' ? (
                // Custom layout for Full Stack tab
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
                  {/* Left column - Programming Languages, Frontend, Backend */}
                  {renderSkillCategory('languages')}
                  {renderSkillCategory('frontend')}
                  {renderSkillCategory('backend')}
                  
                  {/* Right column - Database and DevOps stacked */}
                  <div className="flex flex-col gap-6 sm:gap-7 md:gap-8">
                    {renderSkillCategory('database')}
                    {renderSkillCategory('devops')}
                  </div>
                </div>
              ) : (
                // Default grid layout for AI/ML tab
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
                  {activeTabConfig.categories.map((categoryKey) => renderSkillCategory(categoryKey))}
                </div>
              )}
            </div>

            {/* Strategic Focus Area */}
            <div className="mt-12 sm:mt-16 animate-fade-up" style={{ animationDelay: '200ms' }}>
              <div className="relative rounded-xl overflow-hidden p-[1px]">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-500/20 dark:to-purple-500/20 opacity-50" />
                <div className="relative bg-white dark:bg-[#0a0e1a] border border-transparent dark:border-white/10 rounded-xl p-6 sm:p-8 text-center shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Strategic Focus Areas</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-4 leading-relaxed">
                    Specializing in AI-enabled Full Stack ecosystems, Machine Learning pipelines, and Multi-agent AI applications — bridging backend reliability with intelligent automation.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['React', 'Next.js', 'Node.js', 'LLM APIs', 'Django'].map(skill => (
                      <span key={skill} className="px-3 py-1 text-xs sm:text-sm rounded-lg bg-blue-50 dark:bg-white/5 text-blue-700 dark:text-blue-100 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Decorative Background (15%) */}
          <div className="hidden lg:block lg:w-[15%] relative min-h-[600px]">
            <DecorativeBackground position="right" variant="compact" className="!static !w-full !h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}