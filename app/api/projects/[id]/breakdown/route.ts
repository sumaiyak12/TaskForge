import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { breakdownProjectWithAI } from '@/lib/ai/project-breakdown';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const aiTasks = await breakdownProjectWithAI(
      project.title,
      project.description,
      project.totalBudget,
      14
    );

    // Create tasks in DB if none exist yet
    const createdTasks = [];
    for (const t of aiTasks) {
      const taskDeadline = new Date(Date.now() + (t.deadlineDays || 5) * 24 * 60 * 60 * 1000);
      const newTask = await prisma.microTask.create({
        data: {
          projectId: project.id,
          title: t.title,
          description: t.description,
          budget: t.budget,
          deadline: taskDeadline,
          skillsRequired: JSON.stringify(t.skillsRequired || []),
          status: 'OPEN',
        },
      });
      createdTasks.push(newTask);
    }

    return NextResponse.json({
      message: 'AI breakdown generated successfully',
      tasks: createdTasks,
    });
  } catch (error) {
    console.error('Error generating AI project breakdown:', error);
    return NextResponse.json({ error: 'Failed to breakdown project' }, { status: 500 });
  }
}
