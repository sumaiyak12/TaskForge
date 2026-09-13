import { generateTextWithGemini } from './gemini';

export interface GeneratedMicroTask {
  title: string;
  description: string;
  budget: number;
  deadlineDays: number;
  skillsRequired: string[];
}

export async function breakdownProjectWithAI(
  projectTitle: string,
  projectDescription: string,
  totalBudget: number,
  totalDeadlineDays: number = 14
): Promise<GeneratedMicroTask[]> {
  const prompt = `You are TaskForge AI, an expert project manager and software architect.
Decompose the following project into 3 to 6 independent, well-budgeted micro-tasks.

Project Title: "${projectTitle}"
Project Description: "${projectDescription}"
Total Budget: ${totalBudget} INR
Total Project Timeline: ${totalDeadlineDays} days

Rules:
1. The sum of task budgets must exactly equal ${totalBudget} INR.
2. Each task must have a clear deliverable, target skills, and deadline within ${totalDeadlineDays} days.
3. Return ONLY a valid JSON array of objects with keys: "title", "description", "budget", "deadlineDays", "skillsRequired". Do not output markdown codeblocks if possible, or wrap strictly in \`\`\`json.`;

  const fallbackTasks: GeneratedMicroTask[] = [
    {
      title: `Design & UI Prototype for ${projectTitle}`,
      description: `Create high-fidelity responsive UI wireframes, design system components, and interactive prototypes for ${projectTitle}.`,
      budget: Math.round(totalBudget * 0.25),
      deadlineDays: Math.max(2, Math.round(totalDeadlineDays * 0.25)),
      skillsRequired: ['Figma', 'UI/UX', 'Tailwind CSS', 'React'],
    },
    {
      title: `Core Backend Architecture & API System`,
      description: `Build database schema, server route handlers, role middleware, and standard CRUD APIs for ${projectTitle}.`,
      budget: Math.round(totalBudget * 0.40),
      deadlineDays: Math.max(4, Math.round(totalDeadlineDays * 0.50)),
      skillsRequired: ['Next.js', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
    },
    {
      title: `Frontend Component Integration & State Management`,
      description: `Connect React UI components to backend endpoints with state management, form validation, and animations.`,
      budget: Math.round(totalBudget * 0.25),
      deadlineDays: Math.max(3, Math.round(totalDeadlineDays * 0.75)),
      skillsRequired: ['React', 'Next.js', 'TypeScript', 'Zod'],
    },
    {
      title: `Quality Assurance, Testing & Deployment Setup`,
      description: `Conduct end-to-end user flow testing, security verification, speed optimization, and Vercel production setup.`,
      budget: totalBudget - Math.round(totalBudget * 0.25) - Math.round(totalBudget * 0.40) - Math.round(totalBudget * 0.25),
      deadlineDays: totalDeadlineDays,
      skillsRequired: ['Jest', 'Lighthouse', 'Vercel', 'DevOps'],
    },
  ];

  try {
    const rawResult = await generateTextWithGemini(prompt, JSON.stringify(fallbackTasks));
    const jsonMatch = rawResult.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed: GeneratedMicroTask[] = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error parsing AI project breakdown:', error);
  }

  return fallbackTasks;
}
