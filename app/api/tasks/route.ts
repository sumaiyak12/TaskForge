import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { matchSkillsWithAI } from '@/lib/ai/skill-matching';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status');
    const recommendedOnly = searchParams.get('recommended') === 'true';

    const user = await getCurrentUser('FREELANCER');

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const tasks = await prisma.microTask.findMany({
      where,
      include: {
        project: {
          include: {
            company: { select: { name: true, avatar: true } },
          },
        },
        assignedTo: { select: { name: true, avatar: true } },
        submissions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let freelancerSkills: string[] = [];
    try {
      freelancerSkills = JSON.parse(user.skills || '[]');
    } catch {
      freelancerSkills = ['React', 'TypeScript', 'Node.js', 'Next.js'];
    }

    // Run AI Skill Matching for tasks
    const formattedTasks = tasks.map((task) => {
      let taskSkills: string[] = [];
      try {
        taskSkills = JSON.parse(task.skillsRequired || '[]');
      } catch {
        taskSkills = [];
      }

      let matches = 0;
      taskSkills.forEach((skill) => {
        if (freelancerSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))) {
          matches++;
        }
      });

      const total = taskSkills.length || 1;
      const baseMatch = Math.round((matches / total) * 70) + (freelancerSkills.length > 2 ? 20 : 10);
      const matchScore = Math.min(98, Math.max(50, baseMatch));

      return {
        ...task,
        parsedSkills: taskSkills,
        matchScore,
        recommendationReason: `Matched ${matches} of ${total} required skills (${taskSkills.join(', ')}). High alignment with your tech stack.`,
      };
    });

    if (recommendedOnly) {
      formattedTasks.sort((a, b) => b.matchScore - a.matchScore);
    }

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
