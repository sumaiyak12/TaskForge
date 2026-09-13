import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { verifySubmissionWithAI } from '@/lib/ai/submission-verification';
import { detectFraudWithAI } from '@/lib/ai/fraud-detection';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser('FREELANCER');
    const { taskId, deliverableUrl, repoUrl, notes } = await req.json();

    if (!taskId || !deliverableUrl) {
      return NextResponse.json({ error: 'Task ID and deliverable URL are required' }, { status: 400 });
    }

    const task = await prisma.microTask.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      return NextResponse.json({ error: 'Micro-task not found' }, { status: 404 });
    }

    // Count previous submissions for this task
    const prevSubmissionsCount = await prisma.submission.count({
      where: { taskId },
    });

    // Run AI Verification & Fraud Check concurrently
    const [verificationResult, fraudResult] = await Promise.all([
      verifySubmissionWithAI(task.title, task.description, deliverableUrl, repoUrl, notes),
      detectFraudWithAI(deliverableUrl, repoUrl, notes, prevSubmissionsCount),
    ]);

    const initialStatus = verificationResult.isReadyForApproval ? 'AI_VERIFIED' : 'SUBMITTED';

    // Create Submission record
    const submission = await prisma.submission.create({
      data: {
        taskId,
        freelancerId: user.id,
        deliverableUrl,
        repoUrl: repoUrl || null,
        notes: notes || null,
        qualityScore: verificationResult.qualityScore,
        qualityReport: JSON.stringify(verificationResult.qualityReport),
        fraudScore: fraudResult.fraudScore,
        fraudReport: JSON.stringify(fraudResult),
        status: initialStatus,
      },
    });

    // Update Task status & assigned freelancer
    await prisma.microTask.update({
      where: { id: taskId },
      data: {
        status: 'IN_REVIEW',
        assignedToId: user.id,
      },
    });

    // Notify Company
    await prisma.notification.create({
      data: {
        userId: task.project.companyId,
        title: `Work Submitted for "${task.title}" 🚀`,
        message: `${user.name} submitted work. AI Quality Score: ${verificationResult.qualityScore}/100. Ready for approval!`,
        type: 'ACTION',
      },
    });

    return NextResponse.json({
      submission,
      verificationResult,
      fraudResult,
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Failed to submit work deliverable' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('taskId');
    const freelancerId = searchParams.get('freelancerId');

    const where: any = {};
    if (taskId) where.taskId = taskId;
    if (freelancerId) where.freelancerId = freelancerId;

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        task: {
          include: {
            project: { select: { title: true, companyId: true } },
          },
        },
        freelancer: { select: { name: true, avatar: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
