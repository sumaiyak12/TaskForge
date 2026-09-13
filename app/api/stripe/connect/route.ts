import { NextRequest, NextResponse } from 'next/server';
import { stripe, assertStripeConfigured } from '@/lib/stripe/client';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser('FREELANCER');
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let accountId = user.stripeConnected ? user.stripeAccountId : null;

    assertStripeConfigured();
    if (accountId) {
      try {
        await stripe.accounts.retrieve(accountId);
      } catch (error: any) {
        if (error?.code !== 'resource_missing') {
          throw error;
        }
        accountId = null;
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeAccountId: null, stripeConnected: false },
        });
      }
    }

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'IN',
        email: user.email,
        capabilities: { transfers: { requested: true } },
        business_type: 'individual',
      });
      accountId = account.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeAccountId: accountId },
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${baseUrl}/dashboard/freelancer?stripe_reauth=true`,
      return_url: `${baseUrl}/dashboard/freelancer?stripe_connected=true`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect error:', error);
    if ((error as any)?.code === 'platform_account_required') {
      return NextResponse.json(
        { error: 'Stripe Connect is not enabled for this account. Activate Connect in Stripe Dashboard first.' },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: 'Failed to generate Stripe Connect link' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser('FREELANCER');

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        stripeAccountId: true,
        stripeConnected: true,
        payouts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    let stripeConnected = dbUser?.stripeConnected || false;
    if (dbUser?.stripeAccountId) {
      assertStripeConfigured();
      try {
        const account = await stripe.accounts.retrieve(dbUser.stripeAccountId);
        stripeConnected = Boolean(account.details_submitted && account.payouts_enabled);
        if (stripeConnected !== dbUser.stripeConnected) {
          await prisma.user.update({ where: { id: user.id }, data: { stripeConnected } });
        }
      } catch (error: any) {
        if (error?.code !== 'resource_missing') {
          throw error;
        }
        stripeConnected = false;
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeAccountId: null, stripeConnected: false },
        });
      }
    }

    return NextResponse.json({
      stripeConnected,
      stripeAccountId: dbUser?.stripeAccountId || null,
      payouts: dbUser?.payouts || [],
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Stripe status' }, { status: 500 });
  }
}
