import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const disputes = await prisma.dispute.findMany({
      include: {
        task: {
          include: {
            project: { select: { title: true, totalBudget: true } },
            assignedTo: { select: { name: true, email: true, stripeAccountId: true } },
          },
        },
        raisedBy: { select: { name: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(disputes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch disputes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { taskId, reason } = await req.json();

    if (!taskId || !reason) {
      return NextResponse.json({ error: 'Task ID and dispute reason are required' }, { status: 400 });
    }

    const dispute = await prisma.dispute.create({
      data: {
        taskId,
        raisedById: user.id,
        reason,
        status: 'OPEN',
      },
    });

    await prisma.microTask.update({
      where: { id: taskId },
      data: { status: 'DISPUTED' },
    });

    return NextResponse.json(dispute, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create dispute' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser('ADMIN');
    const { disputeId, action, adminNotes } = await req.json();

    if (!disputeId || !action) {
      return NextResponse.json({ error: 'Dispute ID and action are required' }, { status: 400 });
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { task: true },
    });

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    const status = action === 'PAYOUT_FREELANCER' ? 'RESOLVED_PAYOUT' : 'RESOLVED_REFUND';

    const updatedDispute = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status,
        adminNotes: adminNotes || null,
        resolvedAt: new Date(),
      },
    });

    await prisma.microTask.update({
      where: { id: dispute.taskId },
      data: {
        status: action === 'PAYOUT_FREELANCER' ? 'COMPLETED' : 'OPEN',
      },
    });

    return NextResponse.json(updatedDispute);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to resolve dispute' }, { status: 500 });
  }
}
