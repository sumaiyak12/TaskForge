import { NextRequest, NextResponse } from 'next/server';
import { stripe, assertStripeConfigured } from '@/lib/stripe/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser('COMPANY');
    const body = await req.json();
    const { type, projectId, amount, currency = 'INR' } = body;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (type === 'FUND_PROJECT' && projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      if (project.companyId !== user.id) {
        return NextResponse.json({ error: 'You do not own this project' }, { status: 403 });
      }

      if (project.status !== 'DRAFT') {
        return NextResponse.json({ error: 'Only draft projects can be funded' }, { status: 409 });
      }

      const fundAmount = amount || project.totalBudget;

      if (!Number.isFinite(fundAmount) || fundAmount <= 0 || fundAmount !== project.totalBudget) {
        return NextResponse.json({ error: 'A valid project budget is required' }, { status: 400 });
      }

      assertStripeConfigured();

      const existingPayment = await prisma.payment.findFirst({
        where: { projectId, status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
      });
      if (existingPayment?.stripeSessionId) {
        const existingSession = await stripe.checkout.sessions.retrieve(existingPayment.stripeSessionId);
        if (existingSession.status === 'open' && existingSession.url) {
          return NextResponse.json({ url: existingSession.url });
        }
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: `Fund Project Escrow: ${project.title}`,
                description: 'Escrow deposit for project micro-tasks.',
              },
              unit_amount: Math.round(fundAmount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/dashboard/company?funded=true&project_id=${projectId}`,
        cancel_url: `${baseUrl}/dashboard/company?canceled=true`,
        metadata: {
          type: 'FUND_PROJECT',
          projectId: project.id,
          userId: user.id,
        },
      });

      await prisma.payment.create({
        data: {
          projectId: project.id,
          amount: fundAmount,
          currency,
          status: 'PENDING',
          stripeSessionId: session.id,
        },
      });

      await prisma.project.update({
        where: { id: projectId },
        data: { stripeCheckoutSession: session.id },
      });

      return NextResponse.json({ url: session.url });
    }

    if (type === 'PRO_SUBSCRIPTION') {
      assertStripeConfigured();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'inr',
              product_data: {
                name: 'TaskForge AI Pro Plan',
                description: 'Unlimited AI project breakdowns and priority matching.',
              },
              unit_amount: 49900,
              recurring: { interval: 'month' },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/dashboard/company?subscription=pro`,
        cancel_url: `${baseUrl}/dashboard/company`,
        metadata: { type: 'PRO_SUBSCRIPTION', userId: user.id },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Invalid checkout request type' }, { status: 400 });
  } catch (error) {
    console.error('Stripe checkout API error:', error);
    return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 });
  }
}
