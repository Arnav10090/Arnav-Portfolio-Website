/**
 * Skills data with categorized skills and strategic emphasis
 * Requirements: 2.4, 8.1
 */

import type { Skill } from '../lib/types';

import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiNodedotjs, SiExpress, SiDjango,
  SiPostgresql, SiMongodb, SiMysql,
  SiDocker, SiKubernetes,
  SiGit, SiGithubactions, SiPostman,
  SiHtml5, SiCss3, SiJavascript, SiFigma,
  SiPython, SiCplusplus, SiC,
  SiScikitlearn, SiTensorflow, SiPytorch,
  SiPandas, SiNumpy, SiPlotly,
  SiGooglecloud, SiFastapi, SiGraphql, SiSocketdotio,
  SiJsonwebtokens
} from 'react-icons/si';
import { FaJava, FaPuzzlePiece, FaUsers, FaBrain, FaCode, FaLock, FaDatabase, FaRobot, FaLightbulb, FaChartBar, FaProjectDiagram, FaNetworkWired } from 'react-icons/fa';
import { TbVectorTriangle, TbBrandOpenai } from 'react-icons/tb';
import { MdModelTraining, MdDataExploration } from 'react-icons/md';

export const skillCategories: Record<string, Skill[]> = {
  languages: [
    { name: 'JavaScript', category: 'languages', proficiency: 'expert', strategic: true, icon: SiJavascript },
    { name: 'TypeScript', category: 'languages', proficiency: 'expert', strategic: true, icon: SiTypescript },
    { name: 'Python', category: 'languages', proficiency: 'advanced', strategic: false, icon: SiPython },
    { name: 'Java', category: 'languages', proficiency: 'intermediate', strategic: false, icon: FaJava },
    { name: 'C++', category: 'languages', proficiency: 'intermediate', strategic: false, icon: SiCplusplus },
    { name: 'C', category: 'languages', proficiency: 'intermediate', strategic: false, icon: SiC }
  ],
  frontend: [
    { name: 'React', category: 'frontend', proficiency: 'expert', strategic: true, icon: SiReact },
    { name: 'Next.js', category: 'frontend', proficiency: 'expert', strategic: true, icon: SiNextdotjs },
    { name: 'Tailwind CSS', category: 'frontend', proficiency: 'advanced', strategic: false, icon: SiTailwindcss },
    { name: 'HTML5', category: 'frontend', proficiency: 'expert', strategic: false, icon: SiHtml5 },
    { name: 'CSS3', category: 'frontend', proficiency: 'expert', strategic: false, icon: SiCss3 },
    { name: 'Figma', category: 'frontend', proficiency: 'advanced', strategic: false, icon: SiFigma }
  ],
  backend: [
    { name: 'Node.js', category: 'backend', proficiency: 'expert', strategic: true, icon: SiNodedotjs },
    { name: 'Express.js', category: 'backend', proficiency: 'advanced', strategic: false, icon: SiExpress },
    { name: 'Django', category: 'backend', proficiency: 'intermediate', strategic: false, icon: SiDjango },
    { name: 'RESTful API Design', category: 'backend', proficiency: 'expert', strategic: false, icon: FaCode },
    { name: 'Authentication & Authorization', category: 'backend', proficiency: 'advanced', strategic: false, icon: FaLock },
    { name: 'JWT / OAuth 2.0', category: 'backend', proficiency: 'advanced', strategic: false, icon: SiJsonwebtokens },
    { name: 'GraphQL', category: 'backend', proficiency: 'intermediate', strategic: false, icon: SiGraphql },
    { name: 'WebSockets', category: 'backend', proficiency: 'intermediate', strategic: false, icon: SiSocketdotio },
    { name: 'SQLAlchemy', category: 'backend', proficiency: 'intermediate', strategic: false, icon: FaDatabase },
    { name: 'Drizzle ORM', category: 'backend', proficiency: 'intermediate', strategic: false, icon: FaDatabase }
  ],
  database: [
    { name: 'PostgreSQL', category: 'database', proficiency: 'expert', strategic: true, icon: SiPostgresql },
    { name: 'MySQL', category: 'database', proficiency: 'advanced', strategic: false, icon: SiMysql },
    { name: 'MongoDB', category: 'database', proficiency: 'advanced', strategic: false, icon: SiMongodb },
    { name: 'ORM / ODM', category: 'database', proficiency: 'advanced', strategic: false, icon: FaDatabase }
  ],
  devops: [
    { name: 'Docker', category: 'devops', proficiency: 'advanced', strategic: true, icon: SiDocker },
    { name: 'Kubernetes', category: 'devops', proficiency: 'intermediate', strategic: false, icon: SiKubernetes },
    { name: 'Git', category: 'devops', proficiency: 'expert', strategic: true, icon: SiGit },
    { name: 'GitHub Actions', category: 'devops', proficiency: 'advanced', strategic: false, icon: SiGithubactions },
    { name: 'CI/CD Pipelines', category: 'devops', proficiency: 'advanced', strategic: false, icon: FaCode },
    { name: 'Postman', category: 'devops', proficiency: 'advanced', strategic: false, icon: SiPostman }
  ],
  aiPractices: [
    { name: 'AI / LLM Integration', category: 'aiPractices', proficiency: 'advanced', strategic: true, icon: FaBrain },
    { name: 'Prompt Engineering', category: 'aiPractices', proficiency: 'advanced', strategic: false, icon: FaRobot },
    { name: 'System Thinking', category: 'aiPractices', proficiency: 'expert', strategic: false, icon: FaLightbulb },
    { name: 'Problem Solving', category: 'aiPractices', proficiency: 'expert', strategic: true, icon: FaPuzzlePiece },
    { name: 'Team Collaboration', category: 'aiPractices', proficiency: 'expert', strategic: true, icon: FaUsers }
  ],
  machineLearning: [
    { name: 'scikit-learn', category: 'machineLearning', proficiency: 'advanced', strategic: true, icon: SiScikitlearn },
    { name: 'TensorFlow', category: 'machineLearning', proficiency: 'intermediate', strategic: false, icon: SiTensorflow },
    { name: 'PyTorch', category: 'machineLearning', proficiency: 'intermediate', strategic: false, icon: SiPytorch },
    { name: 'FAISS', category: 'machineLearning', proficiency: 'advanced', strategic: true, icon: FaDatabase },
    { name: 'Sentence-Transformers', category: 'machineLearning', proficiency: 'advanced', strategic: false, icon: TbVectorTriangle },
    { name: 'spaCy', category: 'machineLearning', proficiency: 'advanced', strategic: true, icon: FaBrain },
    { name: 'RAG', category: 'machineLearning', proficiency: 'advanced', strategic: true, icon: FaProjectDiagram },
    { name: 'LLM App Dev', category: 'machineLearning', proficiency: 'advanced', strategic: true, icon: TbBrandOpenai },
    { name: 'Prompt Engineering', category: 'machineLearning', proficiency: 'advanced', strategic: false, icon: FaRobot },
    { name: 'Multi-agent Orchestration', category: 'machineLearning', proficiency: 'advanced', strategic: true, icon: FaUsers },
    { name: 'Gemini API', category: 'machineLearning', proficiency: 'advanced', strategic: false, icon: FaBrain },
    { name: 'Groq SDK', category: 'machineLearning', proficiency: 'intermediate', strategic: false, icon: FaCode }
  ],
  dataAnalytics: [
    { name: 'pandas', category: 'dataAnalytics', proficiency: 'advanced', strategic: true, icon: SiPandas },
    { name: 'NumPy', category: 'dataAnalytics', proficiency: 'advanced', strategic: false, icon: SiNumpy },
    { name: 'matplotlib', category: 'dataAnalytics', proficiency: 'intermediate', strategic: false, icon: SiPlotly },
    { name: 'seaborn', category: 'dataAnalytics', proficiency: 'intermediate', strategic: false, icon: FaChartBar },
    { name: 'Data preprocessing', category: 'dataAnalytics', proficiency: 'advanced', strategic: false, icon: MdDataExploration },
    { name: 'Feature extraction', category: 'dataAnalytics', proficiency: 'advanced', strategic: false, icon: FaProjectDiagram },
    { name: 'NLP', category: 'dataAnalytics', proficiency: 'advanced', strategic: true, icon: FaBrain },
    { name: 'Model evaluation', category: 'dataAnalytics', proficiency: 'advanced', strategic: false, icon: MdModelTraining },
    { name: 'Hyperparameter tuning', category: 'dataAnalytics', proficiency: 'intermediate', strategic: false, icon: FaCode }
  ],
  devopsAI: [
    { name: 'GCP / Vertex AI', category: 'devopsAI', proficiency: 'intermediate', strategic: true, icon: SiGooglecloud },
    { name: 'n8n (workflow automation)', category: 'devopsAI', proficiency: 'advanced', strategic: false, icon: FaProjectDiagram },
    { name: 'Docker', category: 'devopsAI', proficiency: 'advanced', strategic: true, icon: SiDocker }
  ],
  backendAI: [
    { name: 'FastAPI', category: 'backendAI', proficiency: 'advanced', strategic: true, icon: SiFastapi },
    { name: 'NetworkX', category: 'backendAI', proficiency: 'intermediate', strategic: false, icon: FaNetworkWired },
    { name: 'JWT / OAuth 2.0', category: 'backendAI', proficiency: 'advanced', strategic: false, icon: SiJsonwebtokens }
  ]
};

// Flattened skills array for easy iteration
export const allSkills: Skill[] = Object.values(skillCategories).flat();

// Strategic skills for emphasis (React and .NET MVC)
export const strategicSkills: Skill[] = allSkills.filter(skill => skill.strategic);

// Skills by proficiency level
export const skillsByProficiency = {
  expert: allSkills.filter(skill => skill.proficiency === 'expert'),
  proficient: allSkills.filter(skill => skill.proficiency === 'proficient'),
  familiar: allSkills.filter(skill => skill.proficiency === 'familiar'),
  learning: allSkills.filter(skill => skill.proficiency === 'learning')
};