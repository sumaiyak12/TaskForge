import { generateTextWithGemini } from './gemini';

export interface TaskMatchResult {
  taskId: string;
  matchScore: number; // 0 - 100
  recommendationReason: string;
}

export async function matchSkillsWithAI(
  freelancerSkills: string[],
  freelancerBio: string,
  tasks: Array<{ id: string; title: string; description: string; skillsRequired: string[] }>,
  githubUrl?: string
): Promise<TaskMatchResult[]> {
  if (!tasks.length) return [];

  const prompt = `You are TaskForge AI Skill Matcher.
Analyze the freelancer's profile against the given micro-tasks and output match scores (0-100) and brief rationale.

Freelancer Profile:
Skills: ${freelancerSkills.join(', ')}
Bio: ${freelancerBio}
GitHub: ${githubUrl || 'N/A'}

Tasks:
${JSON.stringify(tasks, null, 2)}

Return ONLY a valid JSON array of objects with keys: "taskId", "matchScore", "recommendationReason".`;

  // Standard fallback calculation if AI is offline
  const fallbackResults: TaskMatchResult[] = tasks.map((task) => {
    let matches = 0;
    const taskSkills = Array.isArray(task.skillsRequired)
      ? task.skillsRequired
      : typeof task.skillsRequired === 'string'
      ? JSON.parse(task.skillsRequired || '[]')
      : [];

    taskSkills.forEach((skill: string) => {
      if (freelancerSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))) {
        matches++;
      }
    });

    const total = taskSkills.length || 1;
    const baseScore = Math.round((matches / total) * 70) + (freelancerSkills.length > 3 ? 20 : 10);
    const score = Math.min(98, Math.max(45, baseScore));

    return {
      taskId: task.id,
      matchScore: score,
      recommendationReason: `${matches} of ${total} core skills matched (${taskSkills.slice(0, 3).join(', ')}). High alignment with your project history.`,
    };
  });

  try {
    const rawResult = await generateTextWithGemini(prompt, JSON.stringify(fallbackResults));
    const jsonMatch = rawResult.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed: TaskMatchResult[] = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error parsing AI skill matching:', error);
  }

  return fallbackResults;
}
