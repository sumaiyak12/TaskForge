import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { breakdownProjectWithAI } from '@/lib/ai/project-breakdown';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    const where: any = {};
    if (companyId) where.companyId = companyId;

    const projects = await prisma.project.findMany({
      where,
      include: {
        company: {
          select: { name: true, avatar: true, email: true },
        },
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser('COMPANY');
    const { title, description, totalBudget, deadlineDays = 14, generateAiTasks = true } = await req.json();

    if (!title || !description || !totalBudget) {
      return NextResponse.json({ error: 'Title, description, and total budget are required' }, { status: 400 });
    }

    const deadline = new Date(Date.now() + Number(deadlineDays) * 24 * 60 * 60 * 1000);

    const project = await prisma.project.create({
      data: {
        companyId: user.id,
        title,
        description,
        totalBudget: Number(totalBudget),
        currency: 'INR',
        deadline,
        status: 'DRAFT',
      },
    });

    let generatedTasks: any[] = [];

    if (generateAiTasks) {
      const aiTasks = await breakdownProjectWithAI(title, description, Number(totalBudget), Number(deadlineDays));

      for (const t of aiTasks) {
        const taskDeadline = new Date(Date.now() + (t.deadlineDays || 5) * 24 * 60 * 60 * 1000);
        const createdTask = await prisma.microTask.create({
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
        generatedTasks.push(createdTask);
      }
    }

    const fullProject = await prisma.project.findUnique({
      where: { id: project.id },
      include: { tasks: true },
    });

    return NextResponse.json(fullProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
