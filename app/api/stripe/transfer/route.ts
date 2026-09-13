import { NextRequest, NextResponse } from 'next/server';
import { stripe, assertStripeConfigured } from '@/lib/stripe/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser('COMPANY');
    const { submissionId } = await req.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        task: {
          include: {
            project: true,
          },
        },
        freelancer: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.task.project.companyId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized to approve this submission' }, { status: 403 });
    }

    if (submission.status === 'APPROVED') {
      const existingPayout = await prisma.payout.findFirst({
        where: { taskId: submission.taskId, freelancerId: submission.freelancerId },
      });
      return NextResponse.json({ success: true, message: 'Submission was already approved', payout: existingPayout });
    }

    if (submission.task.project.status !== 'FUNDED') {
      return NextResponse.json({ error: 'Project escrow is not funded' }, { status: 409 });
    }

    if (submission.qualityScore < 80) {
      return NextResponse.json({ error: 'Submission must pass AI verification before payout' }, { status: 409 });
    }

    const transferAmount = submission.task.budget;
    const currency = submission.task.currency || 'INR';
    const freelancerStripeAcc = submission.freelancer.stripeAccountId;

    if (!freelancerStripeAcc) {
      return NextResponse.json({ error: 'Freelancer has not connected a Stripe account' }, { status: 409 });
    }

    assertStripeConfigured();
    const account = await stripe.accounts.retrieve(freelancerStripeAcc);
    if (!account.details_submitted || !account.payouts_enabled) {
      return NextResponse.json({ error: 'Freelancer Stripe account onboarding is incomplete' }, { status: 409 });
    }

    const transfer = await stripe.transfers.create(
      {
        amount: Math.round(transferAmount * 100),
        currency: currency.toLowerCase(),
        destination: freelancerStripeAcc,
        description: `TaskForge payout for task: ${submission.task.title}`,
        metadata: {
          taskId: submission.taskId,
          submissionId: submission.id,
          freelancerId: submission.freelancerId,
        },
      },
      { idempotencyKey: `taskforge-payout-${submission.id}` },
    );

    // Update Submission status to APPROVED
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'APPROVED' },
    });

    // Update MicroTask status to COMPLETED
    await prisma.microTask.update({
      where: { id: submission.taskId },
      data: { status: 'COMPLETED' },
    });

    // Create Payout Record
    const payout = await prisma.payout.create({
      data: {
        taskId: submission.taskId,
        freelancerId: submission.freelancerId,
        amount: transferAmount,
        currency,
        status: 'PAID',
        stripeTransferId: transfer.id,
      },
    });

    // Notify Freelancer
    await prisma.notification.create({
      data: {
        userId: submission.freelancerId,
        title: 'Task Approved & Payout Transferred! 🎉',
        message: `₹${transferAmount.toLocaleString()} has been transferred for "${submission.task.title}".`,
        type: 'SUCCESS',
      },
    });

    // Check if all tasks in project are completed
    const remainingOpenTasks = await prisma.microTask.count({
      where: {
        projectId: submission.task.projectId,
        status: { not: 'COMPLETED' },
      },
    });

    if (remainingOpenTasks === 0) {
      await prisma.project.update({
        where: { id: submission.task.projectId },
        data: { status: 'COMPLETED' },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Submission approved and transfer executed successfully',
      payout,
    });
  } catch (error) {
    console.error('Stripe Transfer error:', error);
    return NextResponse.json({ error: 'Transfer failed' }, { status: 500 });
  }
}
